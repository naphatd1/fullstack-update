import { IsString, IsNumber, IsBoolean, IsOptional, IsArray, IsEmail, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHouseSaleDto {
  // ข้อมูลพื้นฐาน
  @ApiProperty({ description: 'Title of the house sale listing' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Description of the house' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Sale price in Thai Baht' })
  @IsString()
  price: string;

  @ApiPropertyOptional({ description: 'Whether price is negotiable' })
  @IsOptional()
  @IsBoolean()
  negotiable?: boolean;

  @ApiPropertyOptional({ description: 'Down payment amount' })
  @IsOptional()
  @IsString()
  downPayment?: string;

  @ApiPropertyOptional({ description: 'Whether installment payment is available' })
  @IsOptional()
  @IsBoolean()
  installmentAvailable?: boolean;

  // ที่อยู่และทำเล
  @ApiProperty({ description: 'Full address of the house' })
  @IsString()
  location: string;

  @ApiPropertyOptional({ description: 'Province' })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional({ description: 'District' })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({ description: 'Sub-district' })
  @IsOptional()
  @IsString()
  subDistrict?: string;

  @ApiPropertyOptional({ description: 'Postal code' })
  @IsOptional()
  @IsString()
  postalCode?: string;

  // รายละเอียดบ้าน
  @ApiProperty({ description: 'Type of house' })
  @IsString()
  houseType: string;

  @ApiProperty({ description: 'Number of bedrooms' })
  @IsNumber()
  @Min(1)
  @Max(20)
  bedrooms: number;

  @ApiProperty({ description: 'Number of bathrooms' })
  @IsNumber()
  @Min(1)
  @Max(20)
  bathrooms: number;

  @ApiPropertyOptional({ description: 'Number of floors' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  floors?: number;

  @ApiPropertyOptional({ description: 'Usable area in square meters' })
  @IsOptional()
  @IsString()
  usableArea?: string;

  @ApiPropertyOptional({ description: 'Land area in square wah' })
  @IsOptional()
  @IsString()
  landArea?: string;

  // เอกสารกฎหมาย
  @ApiPropertyOptional({ description: 'Whether has title deed' })
  @IsOptional()
  @IsBoolean()
  titleDeed?: boolean;

  @ApiPropertyOptional({ description: 'Title deed number' })
  @IsOptional()
  @IsString()
  titleDeedNumber?: string;

  @ApiPropertyOptional({ description: 'Type of ownership' })
  @IsOptional()
  @IsString()
  ownership?: string;

  @ApiPropertyOptional({ description: 'Whether has legal issues' })
  @IsOptional()
  @IsBoolean()
  legalIssues?: boolean;

  @ApiPropertyOptional({ description: 'Legal issues details' })
  @IsOptional()
  @IsString()
  legalIssuesDetail?: string;

  // สิ่งอำนวยความสะดวก
  @ApiPropertyOptional({ description: 'Number of parking spaces' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  parkingSpaces?: number;

  @ApiPropertyOptional({ description: 'Has swimming pool' })
  @IsOptional()
  @IsBoolean()
  hasSwimmingPool?: boolean;

  @ApiPropertyOptional({ description: 'Has garden' })
  @IsOptional()
  @IsBoolean()
  hasGarden?: boolean;

  @ApiPropertyOptional({ description: 'Has security system' })
  @IsOptional()
  @IsBoolean()
  hasSecurity?: boolean;

  @ApiPropertyOptional({ description: 'Has elevator' })
  @IsOptional()
  @IsBoolean()
  hasElevator?: boolean;

  @ApiPropertyOptional({ description: 'Has air conditioner' })
  @IsOptional()
  @IsBoolean()
  hasAirConditioner?: boolean;

  @ApiPropertyOptional({ description: 'Has built-in furniture' })
  @IsOptional()
  @IsBoolean()
  hasBuiltInFurniture?: boolean;

  // ข้อมูลผู้ขาย
  @ApiProperty({ description: 'Seller name' })
  @IsString()
  sellerName: string;

  @ApiProperty({ description: 'Seller phone number' })
  @IsString()
  sellerPhone: string;

  @ApiPropertyOptional({ description: 'Seller email' })
  @IsOptional()
  @IsEmail()
  sellerEmail?: string;

  @ApiPropertyOptional({ description: 'Type of seller' })
  @IsOptional()
  @IsString()
  sellerType?: string;

  // เหตุผลในการขาย
  @ApiPropertyOptional({ description: 'Reason for selling' })
  @IsOptional()
  @IsString()
  saleReason?: string;

  @ApiPropertyOptional({ description: 'Whether urgent sale' })
  @IsOptional()
  @IsBoolean()
  urgentSale?: boolean;

  // รูปภาพและป้ายกำกับ
  @ApiPropertyOptional({ description: 'Array of image URLs' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ description: 'Array of badges/tags' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  badges?: string[];

  // สถานะการโพสต์
  @ApiPropertyOptional({ description: 'Status of the listing: saved or published', default: 'saved' })
  @IsOptional()
  @IsString()
  status?: string;
}