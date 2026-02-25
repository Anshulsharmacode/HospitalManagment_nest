import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admission } from './db/entity/admission.entity';
import { Appointment } from './db/entity/appointment.entity';
import { Attendance } from './db/entity/attendance.entity';
import { AuditLog } from './db/entity/audit-log.entity';
import { Bed } from './db/entity/bed.entity';
import { BillingItem } from './db/entity/billing-item.entity';
import { ChargeCategory } from './db/entity/charge-category.entity';
import { ChargeItem } from './db/entity/charge-item.entity';
import { ChatMessage } from './db/entity/chat-message.entity';
import { ChatThread } from './db/entity/chat-thread.entity';
import { Department } from './db/entity/department.entity';
import { Invoice } from './db/entity/invoice.entity';
import { LabTest } from './db/entity/lab-test.entity';
import { LeaveRequest } from './db/entity/leave-request.entity';
import { MachineMaintenance } from './db/entity/machine-maintenance.entity';
import { Machine } from './db/entity/machine.entity';
import { Notification } from './db/entity/notification.entity';
import { Otp } from './db/entity/otp.entity';
import { Patient } from './db/entity/patient.entity';
import { Prescription } from './db/entity/prescription.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataBaseModule } from './db/db';
import { User } from './db/entity/user.entity';
import { Ward } from './db/entity/ward.entity';
import { JwtStrategy } from './jwt/strategies/auth.strategies';
import { UserController } from './restapi/user/user.controller';
import { UserService } from './restapi/user/user.service';

@Module({
  imports: [
    DataBaseModule,
    TypeOrmModule.forFeature([
      User,
      Otp,
      Department,
      Patient,
      Appointment,
      Ward,
      Bed,
      Admission,
      ChargeCategory,
      ChargeItem,
      BillingItem,
      Invoice,
      Prescription,
      LabTest,
      Machine,
      MachineMaintenance,
      LeaveRequest,
      Attendance,
      ChatThread,
      ChatMessage,
      Notification,
      AuditLog,
    ]),
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService, JwtStrategy],
})
export class AppModule {}
