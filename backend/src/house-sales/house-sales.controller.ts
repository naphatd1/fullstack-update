import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { HouseSalesService } from './house-sales.service';
import { CreateHouseSaleDto } from './dto/create-house-sale.dto';
import { UpdateHouseSaleDto } from './dto/update-house-sale.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('house-sales')
@Controller('house-sales')
export class HouseSalesController {
  constructor(private readonly houseSalesService: HouseSalesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new house sale listing' })
  @ApiResponse({ status: 201, description: 'House sale listing created successfully' })
  create(@Body() createHouseSaleDto: CreateHouseSaleDto, @Request() req) {
    return this.houseSalesService.create(createHouseSaleDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all house sale listings' })
  @ApiResponse({ status: 200, description: 'List of house sale listings' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('province') province?: string,
    @Query('houseType') houseType?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('bedrooms') bedrooms?: number,
    @Query('bathrooms') bathrooms?: number,
  ) {
    return this.houseSalesService.findAll({
      page,
      limit,
      province,
      houseType,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
    });
  }

  @Get('my-listings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user house sale listings' })
  @ApiResponse({ status: 200, description: 'User house sale listings' })
  findMyListings(@Request() req) {
    return this.houseSalesService.findByUserId(req.user.id);
  }

  @Get('my-saved')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user saved (unpublished) house sale listings' })
  @ApiResponse({ status: 200, description: 'User saved house sale listings' })
  findMySavedListings(@Request() req) {
    return this.houseSalesService.findSavedByUserId(req.user.id);
  }

  @Post(':id/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish a saved house sale listing' })
  @ApiResponse({ status: 200, description: 'House sale listing published successfully' })
  publishListing(@Param('id') id: string, @Request() req) {
    return this.houseSalesService.publish(id, req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get house sale listing by ID' })
  @ApiResponse({ status: 200, description: 'House sale listing details' })
  findOne(@Param('id') id: string) {
    return this.houseSalesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update house sale listing' })
  @ApiResponse({ status: 200, description: 'House sale listing updated successfully' })
  update(
    @Param('id') id: string,
    @Body() updateHouseSaleDto: UpdateHouseSaleDto,
    @Request() req,
  ) {
    return this.houseSalesService.update(id, updateHouseSaleDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete house sale listing' })
  @ApiResponse({ status: 200, description: 'House sale listing deleted successfully' })
  remove(@Param('id') id: string, @Request() req) {
    return this.houseSalesService.remove(id, req.user.id);
  }

  @Post(':id/contact')
  @ApiOperation({ summary: 'Contact seller for house sale listing' })
  @ApiResponse({ status: 200, description: 'Contact request sent successfully' })
  contactSeller(
    @Param('id') id: string,
    @Body() contactData: { name: string; phone: string; email?: string; message?: string },
  ) {
    return this.houseSalesService.contactSeller(id, contactData);
  }

  @Post(':id/favorite')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add/remove house sale listing to/from favorites' })
  @ApiResponse({ status: 200, description: 'Favorite status updated' })
  toggleFavorite(@Param('id') id: string, @Request() req) {
    return this.houseSalesService.toggleFavorite(id, req.user.id);
  }

  @Get(':id/similar')
  @ApiOperation({ summary: 'Get similar house sale listings' })
  @ApiResponse({ status: 200, description: 'Similar house sale listings' })
  findSimilar(@Param('id') id: string) {
    return this.houseSalesService.findSimilar(id);
  }
}