import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { jwtAuthGuard } from 'src/jwt/jwt.strategies';
import { AppointmentService } from './appointment.service';
import {
  AppointmentFilterDto,
  CancelAppointmentDto,
  CheckSlotDto,
  CreateAppointmentDto,
  RescheduleAppointmentDto,
  UpdateAppointmentStatusDto,
} from './appointment.dto';
import { Request } from 'express';
import { UserRole } from 'src/db/entity/user.entity';

type AuthenticatedRequest = Request & {
  user?: {
    userId?: string;
    email?: string;
    role?: UserRole;
  };
};

@Controller('appointments')
@UseGuards(jwtAuthGuard)
@Throttle({
  perDay: { ttl: 1000 * 60 * 60 * 24, limit: 300 },
  perHour: { ttl: 1000 * 60 * 60, limit: 80 },
  perMinute: { ttl: 1000 * 60, limit: 15 },
})
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() body: CreateAppointmentDto) {
    return this.appointmentService.createAppointment(
      req.user!.userId!,
      body,
    );
  }

  @Get()
  getAll(
    @Req() req: AuthenticatedRequest,
    @Query() query: AppointmentFilterDto,
  ) {
    return this.appointmentService.getAppointments(req.user!, query);
  }

  @Get('check-slot')
  checkSlot(@Query() query: CheckSlotDto) {
    return this.appointmentService.checkSlotAvailability(query);
  }

  @Get('my-appointments')
  getMyAppointments(@Req() req: AuthenticatedRequest) {
    return this.appointmentService.getMyAppointments(req.user!);
  }

  @Get(':id')
  getById(
    @Req() req: AuthenticatedRequest,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.appointmentService.getAppointmentById(req.user!, id);
  }


  @Patch(':id/status')
  updateStatus(
    @Req() req: AuthenticatedRequest,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateAppointmentStatusDto,
  ) {
    return this.appointmentService.updateAppointmentStatus(req.user!, id, body);
  }

  @Patch(':id/reschedule')
  reschedule(
    @Req() req: AuthenticatedRequest,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: RescheduleAppointmentDto,
  ) {
    return this.appointmentService.rescheduleAppointment(req.user!, id, body);
  }

  @Patch(':id/cancel')
  cancel(
    @Req() req: AuthenticatedRequest,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: CancelAppointmentDto,
  ) {
    return this.appointmentService.cancelAppointment(req.user!, id, body);
  }
}
