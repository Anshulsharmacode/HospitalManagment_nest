import { Body, Controller, ForbiddenException, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateStaffDto, LoginDto, SignUpDto } from './uset.dto';
import { Throttle } from '@nestjs/throttler';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { jwtAuthGuard } from 'src/jwt/jwt.strategies';
import { UserRole } from 'src/db/entity/user.entity';
import { Request } from 'express';

type AuthenticatedRequest = Request & {
  user?: {
    userId?: string;
    email?: string;
    role?: UserRole;
  };
};

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Throttle({
    perDay: { ttl: 1000 * 60 * 60 * 24, limit: 500 },
    perHour: { ttl: 1000 * 60 * 60, limit: 100 },
    perMinute: { ttl: 1000 * 60, limit: 8 },
  })
  @ApiResponse({
    description:"singup successfully",
    type:SignUpDto
  })
  @Post('signup')
  signUp(@Body() signupDto: SignUpDto) {
    return this.userService.signUp(signupDto);
  }

  @ApiResponse({
    description:"Login successfully",
    type:LoginDto
  })
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }


  @Post('genrate-otp')
  genrateOtp(phoneNumber){
    return this.userService.genrateOtp(phoneNumber)
  }

  @Post('verify-otp')
  verifyOtp(
    @Body()
    body: {
      email: string;
      otp: string;
    },
  ) {
    return this.userService.verifyOtp(body.email, body.otp);
  }

  @UseGuards(jwtAuthGuard)
  @ApiBearerAuth()
  @Post('create-staff')
  createStaff(
    @Req() req: AuthenticatedRequest,
    @Body() staffDto: CreateStaffDto,
  ) {

    console.log('Creating staff user with role:', req.user?.role);
    if (
      req.user?.role !== UserRole.ADMIN &&
      req.user?.role !== UserRole.HR
    ) {
      throw new ForbiddenException('Only ADMIN or HR can create staff users');
    }

    return this.userService.createStaff(req.user!.role!, staffDto);
  }

  @UseGuards(jwtAuthGuard)
  @ApiBearerAuth()
  @Post('update-role')
  updateRole(
    @Req() req: AuthenticatedRequest,
    @Body()
    body: {
      userId: string;
      role: UserRole;
    },
  ) {
    if (
      req.user?.role !== UserRole.ADMIN &&
      req.user?.role !== UserRole.HR
    ) {
      throw new ForbiddenException('Only ADMIN or HR can update user roles');
    }

    return this.userService.updateUserRole(req.user!.role!, body.userId, body.role);
  }
}
