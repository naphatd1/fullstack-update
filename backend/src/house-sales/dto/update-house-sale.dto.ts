import { PartialType } from '@nestjs/swagger';
import { CreateHouseSaleDto } from './create-house-sale.dto';

export class UpdateHouseSaleDto extends PartialType(CreateHouseSaleDto) {}