import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto, SignUpDto } from './uset.dto';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  signUp(@Body() signupDto: SignUpDto) {
    return this.userService.signUp(signupDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
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
