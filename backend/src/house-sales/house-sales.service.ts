import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHouseSaleDto } from './dto/create-house-sale.dto';
import { UpdateHouseSaleDto } from './dto/update-house-sale.dto';

@Injectable()
export class HouseSalesService {
  constructor(private prisma: PrismaService) {}

  async create(createHouseSaleDto: CreateHouseSaleDto, userId: string) {
    const status = createHouseSaleDto.status || 'saved';
    const publishedAt = status === 'published' ? new Date() : null;
    
    const houseSale = await this.prisma.houseSale.create({
      data: {
        ...createHouseSaleDto,
        status,
        publishedAt,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    const message = status === 'published' 
      ? 'House sale listing created and published successfully'
      : 'House sale listing saved successfully';

    return {
      success: true,
      data: houseSale,
      message,
    };
  }

  async publish(id: string, userId: string) {
    const houseSale = await this.prisma.houseSale.findUnique({
      where: { id },
    });

    if (!houseSale) {
      throw new NotFoundException('House sale listing not found');
    }

    if (houseSale.userId !== userId) {
      throw new ForbiddenException('You can only publish your own listings');
    }

    if (houseSale.status === 'published') {
      return {
        success: true,
        data: houseSale,
        message: 'House sale listing is already published',
      };
    }

    const publishedHouseSale = await this.prisma.houseSale.update({
      where: { id },
      data: {
        status: 'published',
        publishedAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    return {
      success: true,
      data: publishedHouseSale,
      message: 'House sale listing published successfully',
    };
  }

  async findAll(filters: {
    page?: number;
    limit?: number;
    province?: string;
    houseType?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {
      status: 'published', // แสดงเฉพาะโพสต์ที่ published
    };

    if (filters.province) {
      where.province = {
        contains: filters.province,
        mode: 'insensitive',
      };
    }

    if (filters.houseType) {
      where.houseType = {
        contains: filters.houseType,
        mode: 'insensitive',
      };
    }

    if (filters.minPrice || filters.maxPrice) {
      where.priceNumeric = {};
      if (filters.minPrice) {
        where.priceNumeric.gte = filters.minPrice;
      }
      if (filters.maxPrice) {
        where.priceNumeric.lte = filters.maxPrice;
      }
    }

    if (filters.bedrooms) {
      where.bedrooms = filters.bedrooms;
    }

    if (filters.bathrooms) {
      where.bathrooms = filters.bathrooms;
    }

    const [houseSales, total] = await Promise.all([
      this.prisma.houseSale.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      }),
      this.prisma.houseSale.count({ where }),
    ]);

    return {
      success: true,
      data: houseSales,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByUserId(userId: string) {
    const houseSales = await this.prisma.houseSale.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    return {
      success: true,
      data: houseSales,
    };
  }

  async findSavedByUserId(userId: string) {
    const houseSales = await this.prisma.houseSale.findMany({
      where: { 
        userId,
        status: 'saved'
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    return {
      success: true,
      data: houseSales,
    };
  }

  async findOne(id: string) {
    const houseSale = await this.prisma.houseSale.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!houseSale) {
      throw new NotFoundException('House sale listing not found');
    }

    // Increment view count
    await this.prisma.houseSale.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return {
      success: true,
      data: houseSale,
    };
  }

  async update(id: string, updateHouseSaleDto: UpdateHouseSaleDto, userId: string) {
    const houseSale = await this.prisma.houseSale.findUnique({
      where: { id },
    });

    if (!houseSale) {
      throw new NotFoundException('House sale listing not found');
    }

    if (houseSale.userId !== userId) {
      throw new ForbiddenException('You can only update your own listings');
    }

    const updatedHouseSale = await this.prisma.houseSale.update({
      where: { id },
      data: {
        ...updateHouseSaleDto,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    return {
      success: true,
      data: updatedHouseSale,
      message: 'House sale listing updated successfully',
    };
  }

  async remove(id: string, userId: string) {
    const houseSale = await this.prisma.houseSale.findUnique({
      where: { id },
    });

    if (!houseSale) {
      throw new NotFoundException('House sale listing not found');
    }

    if (houseSale.userId !== userId) {
      throw new ForbiddenException('You can only delete your own listings');
    }

    await this.prisma.houseSale.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'House sale listing deleted successfully',
    };
  }

  async contactSeller(id: string, contactData: { name: string; phone: string; email?: string; message?: string }) {
    const houseSale = await this.prisma.houseSale.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!houseSale) {
      throw new NotFoundException('House sale listing not found');
    }

    // Here you would typically send an email or SMS to the seller
    // For now, we'll just log the contact attempt
    console.log('Contact attempt:', {
      listingId: id,
      sellerPhone: houseSale.sellerPhone,
      sellerEmail: houseSale.sellerEmail,
      contactData,
    });

    // Increment contact count
    await this.prisma.houseSale.update({
      where: { id },
      data: {
        contacts: {
          increment: 1,
        },
      },
    });

    return {
      success: true,
      message: 'Contact request sent successfully',
      sellerContact: {
        phone: houseSale.sellerPhone,
        email: houseSale.sellerEmail,
      },
    };
  }

  async toggleFavorite(id: string, userId: string) {
    const houseSale = await this.prisma.houseSale.findUnique({
      where: { id },
    });

    if (!houseSale) {
      throw new NotFoundException('House sale listing not found');
    }

    // Check if already favorited
    const existingFavorite = await this.prisma.favorite.findUnique({
      where: {
        userId_houseSaleId: {
          userId,
          houseSaleId: id,
        },
      },
    });

    if (existingFavorite) {
      // Remove from favorites
      await this.prisma.favorite.delete({
        where: {
          userId_houseSaleId: {
            userId,
            houseSaleId: id,
          },
        },
      });

      return {
        success: true,
        favorited: false,
        message: 'Removed from favorites',
      };
    } else {
      // Add to favorites
      await this.prisma.favorite.create({
        data: {
          userId,
          houseSaleId: id,
        },
      });

      return {
        success: true,
        favorited: true,
        message: 'Added to favorites',
      };
    }
  }

  async findSimilar(id: string) {
    const houseSale = await this.prisma.houseSale.findUnique({
      where: { id },
    });

    if (!houseSale) {
      throw new NotFoundException('House sale listing not found');
    }

    // Find similar listings based on location, house type, and price range
    const priceNumeric = parseFloat(houseSale.price.replace(/,/g, ''));
    const priceRange = priceNumeric * 0.3; // 30% price range

    const similarListings = await this.prisma.houseSale.findMany({
      where: {
        id: {
          not: id,
        },
        OR: [
          {
            province: houseSale.province,
          },
          {
            houseType: houseSale.houseType,
          },
          {
            AND: [
              {
                priceNumeric: {
                  gte: priceNumeric - priceRange,
                },
              },
              {
                priceNumeric: {
                  lte: priceNumeric + priceRange,
                },
              },
            ],
          },
        ],
      },
      take: 6,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    return {
      success: true,
      data: similarListings,
    };
  }
}