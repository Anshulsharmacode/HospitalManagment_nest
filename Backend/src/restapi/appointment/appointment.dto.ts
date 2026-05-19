import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Min,
} from 'class-validator';
import { AppointmentStatus } from 'src/db/entity/appointment.entity';

export class CreateAppointmentDto {
  @ApiProperty({
    example: '5a8dc803-6f4b-4ab0-a4f7-8f53a0ce8ba7',
    description: 'Doctor ID (FK)',
  })
  @IsUUID()
  @IsNotEmpty()
  doctorId: string;

  @ApiProperty({
    example: '2026-03-04',
    description: 'Appointment date (YYYY-MM-DD)',
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    example: '10:30:00',
    description: 'Appointment time slot (HH:mm:ss)',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'timeSlot must be in HH:mm:ss format',
  })
  @IsNotEmpty()
  timeSlot: string;

  @ApiPropertyOptional({
    enum: AppointmentStatus,
    default: AppointmentStatus.SCHEDULED,
    description: 'Appointment status',
  })
  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;

  @ApiProperty({
    example: 500,
    description: 'Consultation fee',
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  consultationFee: number;
}

export class UpdateAppointmentStatusDto {
  @ApiProperty({
    enum: AppointmentStatus,
    example: AppointmentStatus.COMPLETED,
  })
  @IsEnum(AppointmentStatus)
  @IsNotEmpty()
  status: AppointmentStatus;
}

export class RescheduleAppointmentDto {
  @ApiProperty({
    example: '2026-03-05',
    description: 'Rescheduled date (YYYY-MM-DD)',
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    example: '14:00:00',
    description: 'Rescheduled time slot (HH:mm:ss)',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'timeSlot must be in HH:mm:ss format',
  })
  @IsNotEmpty()
  timeSlot: string;
}

export class CancelAppointmentDto {
  @ApiPropertyOptional({
    example: 'Patient requested cancellation',
    description: 'Optional reason for cancellation tracking',
  })
  @IsString()
  @IsOptional()
  reason?: string;
}

export class AppointmentFilterDto {
  @ApiPropertyOptional({
    example: '4de8a7e2-24d2-4746-a4ea-f897fa9f20f0',
    description: 'Filter by patient ID',
  })
  @IsUUID()
  @IsOptional()
  patientId?: string;

  @ApiPropertyOptional({
    example: '5a8dc803-6f4b-4ab0-a4f7-8f53a0ce8ba7',
    description: 'Filter by doctor ID',
  })
  @IsUUID()
  @IsOptional()
  doctorId?: string;

  @ApiPropertyOptional({
    example: '2026-03-04',
    description: 'Filter by appointment date',
  })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiPropertyOptional({
    enum: AppointmentStatus,
    description: 'Filter by appointment status',
  })
  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;
}

export class CheckSlotDto {
  @ApiProperty({
    example: '5a8dc803-6f4b-4ab0-a4f7-8f53a0ce8ba7',
    description: 'Doctor ID (FK)',
  })
  @IsUUID()
  @IsNotEmpty()
  doctorId: string;

  @ApiProperty({
    example: '2026-03-04',
    description: 'Appointment date (YYYY-MM-DD)',
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    example: '10:30:00',
    description: 'Appointment time slot (HH:mm:ss)',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'timeSlot must be in HH:mm:ss format',
  })
  @IsNotEmpty()
  timeSlot: string;
}
