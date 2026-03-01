import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto, SignUpDto } from './uset.dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ApiResponse } from '@nestjs/swagger';

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
}
