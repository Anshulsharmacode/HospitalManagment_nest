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
import { emailNormalize, generateOTP, generateToken } from 'src/constant/constant';
import { apiSuccess } from 'src/constant/Api.dto';
import { Otp } from 'src/db/entity/otp.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Otp) private readonly otpRepository: Repository<Otp>,
  ) {}

  async signUp(signup: SignUpDto): Promise<SuccessResponseDto> {
    const email = emailNormalize(signup.email);

    const exists = await this.userRepository.findOne({ where: { email } });
    if (exists) {
      throw new BadRequestException('User already exists');
    }

    const { otp, expiresAt } = generateOTP();

    await this.otpRepository.save({
      phoneNumber: String(signup.phoneNumber),
      otp,
      expiresAt,
    });

    const passwordHash = await hashPassword(signup.password);

    await this.userRepository.save(
     {
        email,
        password: passwordHash,
        phoneNumber: String(signup.phoneNumber),
        role: UserRole.PATIENT,
        isActive: true,
        isOtpVerified: false,
      },
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
        role: UserRole.ADMIN,
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

  async genrateOtp(phoneNumber){
  const { otp, expiresAt } = generateOTP();

    await this.otpRepository.save(
      this.otpRepository.create({
        phoneNumber: String(phoneNumber),
        otp,
        expiresAt,
      }),
    );
  }


  async verifyOtp(phoneNumber: string, otp: string): Promise<SuccessResponseDto> {
    const Patient = await this.userRepository.findOne({
      where: { phoneNumber: phoneNumber, role: UserRole.PATIENT },
    });

    if (!Patient) {
      throw new ForbiddenException('Dealer not found');
    }

    const dbOtp = await this.otpRepository.findOne({
      where: {
        phoneNumber: Patient.phoneNumber,
        otp: otp,
        isUsed: false,
        expiresAt: MoreThan(new Date()),
      },
      order: { createdAt: 'DESC' },
    });

    if (!dbOtp) {
      throw new ForbiddenException('Invalid or expired OTP');
    }

    Patient.isOtpVerified = true;
    // Patient.otp = null;
    await this.userRepository.save(Patient);

    dbOtp.isUsed = true;
    await this.otpRepository.save(dbOtp);

    // const token = generateToken({
    //   userId: Patient.id,
    //   role: Patient.role,
    // });

    return {
      success: true,
      message: 'Dealer login successful',
      // token,
    };
  }
}
