import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';

import { User, UserRole } from 'src/db/entity/user.entity';
import { LoginDto, SignUpDto, SuccessResponseDto } from './uset.dto';
import { comparePassword, hashPassword } from 'src/utills/utils';
import { generateOTP, generateToken } from 'src/constant/constant';
import { apiSuccess } from 'src/constant/Api.dto';
import { Otp } from 'src/db/entity/otp.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Otp) private readonly otpRepository: Repository<Otp>,
  ) {}

  async signUp(signup: SignUpDto): Promise<SuccessResponseDto> {
    const email = signup.email.toLowerCase();

    const exists = await this.userRepository.findOne({ where: { email } });
    if (exists) {
      throw new BadRequestException('User already exists');
    }

    const { otp, expiresAt } = generateOTP();

    await this.otpRepository.save(
      this.otpRepository.create({
        phoneNumber: String(signup.phoneNumber),
        otp,
        expiresAt,
      }),
    );

    const passwordHash = await hashPassword(signup.password);

    await this.userRepository.save(
      this.userRepository.create({
        email,
        password: passwordHash,
        phoneNumber: String(signup.phoneNumber),
        role: UserRole.DEALER,
        isActive: true,
        isOtpVerified: false,
      }),
    );

    return apiSuccess('Dealer registered successfully');
  }

  async login(loginDto: LoginDto): Promise<SuccessResponseDto> {
    const email = loginDto.email.toLowerCase();
    const password = loginDto.password;

    if (
      email === process.env.SUPER_ADMIN_EMAIL &&
      password === process.env.SUPER_ADMIN_PASSWORD
    ) {
      const token = generateToken({
        role: UserRole.SUPER_ADMIN,
        email,
      });

      return apiSuccess('Dealer registered successfully', { token });
    }

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !user.isActive) {
      throw new ForbiddenException('Invalid login');
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid credentials');
    }

    if (user.role === UserRole.DEALER) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      user.otp = otp;
      await this.userRepository.save(user);

      console.log(`Dealer OTP for ${email}: ${otp}`);

      return {
        success: true,
        message: 'OTP sent to registered email',
      };
    }

    const token = generateToken({
      userId: user.id,
      role: user.role,
    });

    return {
      success: true,
      message: 'Login successful',
      token,
    };
  }

  async verifyOtp(email: string, otp: string): Promise<SuccessResponseDto> {
    const dealer = await this.userRepository.findOne({
      where: { email: email.toLowerCase(), role: UserRole.DEALER },
    });

    if (!dealer) {
      throw new ForbiddenException('Dealer not found');
    }

    const dbOtp = await this.otpRepository.findOne({
      where: {
        phoneNumber: dealer.phoneNumber,
        otp: otp,
        isUsed: false,
        expiresAt: MoreThan(new Date()),
      },
      order: { createdAt: 'DESC' },
    });

    if (!dbOtp) {
      throw new ForbiddenException('Invalid or expired OTP');
    }

    dealer.isOtpVerified = true;
    dealer.otp = null;
    await this.userRepository.save(dealer);

    dbOtp.isUsed = true;
    await this.otpRepository.save(dbOtp);

    const token = generateToken({
      userId: dealer.id,
      role: dealer.role,
    });

    return {
      success: true,
      message: 'Dealer login successful',
      token,
    };
  }
}
