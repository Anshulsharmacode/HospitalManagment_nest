/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Matches,
  IsNumber,
} from 'class-validator';

export class SignUpDto {
  @ApiProperty({ example: 'john_doe' })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'strongpassword123' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '7839485733' })
  @IsNumber()
  @IsNotEmpty()
  phoneNumber: number;
}

export class LoginDto {
  @ApiProperty({
    required: true,
    example: 'abc@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    required: true,
    example: 'password123',
  })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}

export class SuccessResponseDto {
  @ApiResponseProperty()
  success: boolean;
  @ApiResponseProperty()
  message?: string;
  @ApiResponseProperty()
  token?: string;
}


export class VerifyOtpDto {

  @ApiProperty({
 
    description: 'User phone number in E.164 format'
  })

  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    example: '123456',
    description: '6-digit one time password'
  })
  @IsString()
  @Matches(/^\d{6}$/, { message: 'OTP must be a 6-digit number' })
  @IsNotEmpty()
  otp: string;
}