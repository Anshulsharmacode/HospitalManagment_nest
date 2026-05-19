import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from 'src/db/entity/user.entity';
import { apiSuccess } from 'src/constant/Api.dto';
import { Not, Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from 'src/db/entity/appointment.entity';
import {
  AppointmentFilterDto,
  CancelAppointmentDto,
  CheckSlotDto,
  CreateAppointmentDto,
  RescheduleAppointmentDto,
  UpdateAppointmentStatusDto,
} from './appointment.dto';

interface TokenUser {
  userId?: string;
  email?: string;
  role?: UserRole;
}

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async isSlotAvailable(
    doctorId: string,
    date: string,
    timeSlot: string,
    excludeAppointmentId?: string,
  ): Promise<boolean> {
    const existing = await this.appointmentRepository.findOne({
      where: {
        doctor: { id: doctorId },
        date,
        timeSlot,
        status: Not(AppointmentStatus.CANCELLED),
      },
      relations: { doctor: true },
    });

    if (!existing) {
      return true;
    }

    if (excludeAppointmentId && existing.id === excludeAppointmentId) {
      return true;
    }

    return false;
  }

  async checkSlotAvailability(slotDto: CheckSlotDto) {
    const doctor = await this.userRepository.findOne({
      where: { id: slotDto.doctorId, role: UserRole.DOCTOR },
    });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const available = await this.isSlotAvailable(
      slotDto.doctorId,
      slotDto.date,
      slotDto.timeSlot,
    );

    return apiSuccess('Slot availability fetched successfully', { available });
  }

  async createAppointment(
    patientUserId: string,
    appointmentDto: CreateAppointmentDto,
  ) {
    const available = await this.isSlotAvailable(
      appointmentDto.doctorId,
      appointmentDto.date,
      appointmentDto.timeSlot,
    );
    if (!available) {
      throw new BadRequestException('Selected slot is not available');
    }

    // Verify the user is a patient
    const patient = await this.userRepository.findOne({
      where: { id: patientUserId, role: UserRole.PATIENT },
    });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const doctor = await this.userRepository.findOne({
      where: { id: appointmentDto.doctorId, role: UserRole.DOCTOR },
    });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const appointment = this.appointmentRepository.create({
      patient: { id: patient.id } as User,
      doctor: { id: appointmentDto.doctorId } as User,
      date: appointmentDto.date,
      timeSlot: appointmentDto.timeSlot,
      status: appointmentDto.status ?? AppointmentStatus.SCHEDULED,
      consultationFee: appointmentDto.consultationFee.toFixed(2),
    });

    const savedAppointment = await this.appointmentRepository.save(appointment);
    return apiSuccess('Appointment created successfully', {
      appointmentId: savedAppointment.id,
    });
  }

  async getAppointments(user: TokenUser, filterDto: AppointmentFilterDto) {
    const qb = this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('appointment.doctor', 'doctor')
      .orderBy('appointment.date', 'ASC')
      .addOrderBy('appointment.timeSlot', 'ASC');

    // Role-based filtering
    if (user.role === UserRole.PATIENT) {
      // Patients can only see their own appointments
      qb.andWhere('patient.id = :patientId', { patientId: user.userId });
    } else if (user.role === UserRole.DOCTOR) {
      // Doctors can only see their own appointments
      qb.andWhere('doctor.id = :doctorId', { doctorId: user.userId });
    } else if (user.role === UserRole.ADMIN || user.role === UserRole.RECEPTION) {
      // Admin/Reception can filter by patient or doctor if provided
      if (filterDto.patientId) {
        qb.andWhere('patient.id = :patientId', {
          patientId: filterDto.patientId,
        });
      }
      if (filterDto.doctorId) {
        qb.andWhere('doctor.id = :doctorId', { doctorId: filterDto.doctorId });
      }
    }

    if (filterDto.date) {
      qb.andWhere('appointment.date = :date', { date: filterDto.date });
    }

    if (filterDto.status) {
      qb.andWhere('appointment.status = :status', { status: filterDto.status });
    }

    const appointments = await qb.getMany();
    
    const sanitizedAppointments = appointments.map((apt) => this.sanitizeAppointment(apt));
    
    return apiSuccess('Appointments fetched successfully', sanitizedAppointments);
  }

  private sanitizeAppointment(apt: any) {
    return {
      id: apt.id,
      date: apt.date,
      timeSlot: apt.timeSlot,
      status: apt.status,
      consultationFee: apt.consultationFee,
      createdAt: apt.createdAt,
      updatedAt: apt.updatedAt,
      patient: {
        id: apt.patient.id,
        name: apt.patient.name,
        email: apt.patient.email,
        phoneNumber: apt.patient.phoneNumber,
      },
      doctor: {
        id: apt.doctor.id,
        name: apt.doctor.name,
        email: apt.doctor.email,
        phoneNumber: apt.doctor.phoneNumber,
      },
    };
  }

  async getMyAppointments(user: TokenUser) {
    const qb = this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('appointment.doctor', 'doctor')
      .orderBy('appointment.date', 'ASC')
      .addOrderBy('appointment.timeSlot', 'ASC');

    if (user.role === UserRole.PATIENT) {
      qb.andWhere('patient.id = :patientId', { patientId: user.userId });
    } else if (user.role === UserRole.DOCTOR) {
      qb.andWhere('doctor.id = :doctorId', { doctorId: user.userId });
    } else {
      throw new BadRequestException(
        'This endpoint is only for patients and doctors',
      );
    }

    const appointments = await qb.getMany();
    
    const sanitizedAppointments = appointments.map((apt) => this.sanitizeAppointment(apt));
    
    return apiSuccess('My appointments fetched successfully', sanitizedAppointments);
  }

  async getAppointmentById(user: TokenUser, id: string) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: { patient: true, doctor: true },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    // Check if user has permission to view this appointment
    if (user.role === UserRole.PATIENT) {
      if (appointment.patient.id !== user.userId) {
        throw new BadRequestException('You can only view your own appointments');
      }
    } else if (user.role === UserRole.DOCTOR) {
      if (appointment.doctor.id !== user.userId) {
        throw new BadRequestException('You can only view your own appointments');
      }
    }
    // Admin/Reception can view all appointments

    return apiSuccess('Appointment fetched successfully', this.sanitizeAppointment(appointment));
  }

  async updateAppointmentStatus(
    user: TokenUser,
    id: string,
    body: UpdateAppointmentStatusDto,
  ) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: { doctor: true },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    // Doctors can only update their own appointments
    if (
      user.role === UserRole.DOCTOR &&
      appointment.doctor.id !== user.userId
    ) {
      throw new BadRequestException(
        'You can only update your own appointments',
      );
    }

    // Patients cannot update status
    if (user.role === UserRole.PATIENT) {
      throw new BadRequestException('Patients cannot update appointment status');
    }

    appointment.status = body.status;
    await this.appointmentRepository.save(appointment);

    return apiSuccess('Appointment status updated successfully');
  }

  async rescheduleAppointment(
    user: TokenUser,
    id: string,
    body: RescheduleAppointmentDto,
  ) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: { doctor: true, patient: true },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    // Check permissions
    if (user.role === UserRole.DOCTOR && appointment.doctor.id !== user.userId) {
      throw new BadRequestException(
        'You can only reschedule your own appointments',
      );
    }

    if (user.role === UserRole.PATIENT && appointment.patient.id !== user.userId) {
      throw new BadRequestException(
        'You can only reschedule your own appointments',
      );
    }

    const available = await this.isSlotAvailable(
      appointment.doctor.id,
      body.date,
      body.timeSlot,
      appointment.id,
    );
    if (!available) {
      throw new BadRequestException('Selected slot is not available');
    }

    appointment.date = body.date;
    appointment.timeSlot = body.timeSlot;
    appointment.status = AppointmentStatus.SCHEDULED;
    await this.appointmentRepository.save(appointment);

    return apiSuccess('Appointment rescheduled successfully');
  }

  async cancelAppointment(
    user: TokenUser,
    id: string,
    _body: CancelAppointmentDto,
  ) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: { doctor: true, patient: true },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    // Check permissions
    if (user.role === UserRole.DOCTOR && appointment.doctor.id !== user.userId) {
      throw new BadRequestException(
        'You can only cancel your own appointments',
      );
    }

    if (user.role === UserRole.PATIENT && appointment.patient.id !== user.userId) {
      throw new BadRequestException(
        'You can only cancel your own appointments',
      );
    }

    appointment.status = AppointmentStatus.CANCELLED;
    await this.appointmentRepository.save(appointment);

    return apiSuccess('Appointment cancelled successfully');
  }
}
