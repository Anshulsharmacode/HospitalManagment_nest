import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ApiResponse<T = null> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Request successful' })
  message: string;

  @ApiProperty({ required: false })
  data?: T;

  @ApiProperty({ required: false, example: 400 })
  errorCode?: number;
}

export const apiSuccess = <T = null>(
  message: string,
  data?: T,
): ApiResponse<T> => {
  return {
    success: true,
    message,
    ...(data !== undefined && { data }),
  };
};

export const apiError = (
  message: string,
  statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
): never => {
  throw new HttpException(
    {
      success: false,
      message,
      errorCode: statusCode,
    },
    statusCode,
  );
};
