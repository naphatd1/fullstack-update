import { Module } from '@nestjs/common';
import { HouseSalesService } from './house-sales.service';
import { HouseSalesController } from './house-sales.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HouseSalesController],
  providers: [HouseSalesService],
  exports: [HouseSalesService],
})
export class HouseSalesModule {}