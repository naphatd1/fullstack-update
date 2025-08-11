import { authStorage } from '@/lib/auth-storage';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface HouseSaleData {
  id?: string;
  // สถานะการโพสต์
  status?: string; // "saved" หรือ "published"
  publishedAt?: string;
  // ข้อมูลพื้นฐาน
  title: string;
  description?: string;
  price: string;
  negotiable?: boolean;
  downPayment?: string;
  installmentAvailable?: boolean;
  
  // ที่อยู่และทำเล
  location: string;
  province?: string;
  district?: string;
  subDistrict?: string;
  postalCode?: string;
  
  // รายละเอียดบ้าน
  houseType: string;
  bedrooms: number;
  bathrooms: number;
  floors?: number;
  usableArea?: string;
  landArea?: string;
  
  // เอกสารกฎหมาย
  titleDeed?: boolean;
  titleDeedNumber?: string;
  ownership?: string;
  legalIssues?: boolean;
  legalIssuesDetail?: string;
  
  // สิ่งอำนวยความสะดวก
  parkingSpaces?: number;
  hasSwimmingPool?: boolean;
  hasGarden?: boolean;
  hasSecurity?: boolean;
  hasElevator?: boolean;
  hasAirConditioner?: boolean;
  hasBuiltInFurniture?: boolean;
  
  // ข้อมูลผู้ขาย
  sellerName: string;
  sellerPhone: string;
  sellerEmail?: string;
  sellerType?: string;
  
  // เหตุผลในการขาย
  saleReason?: string;
  urgentSale?: boolean;
  
  // รูปภาพและป้ายกำกับ
  images?: string[];
  badges?: string[];
  
  // สถิติ
  views?: number;
  contacts?: number;
  
  // ข้อมูลเพิ่มเติม
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: string;
    name?: string;
    email: string;
  };
}

export interface HouseSaleFilters {
  page?: number;
  limit?: number;
  province?: string;
  houseType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
}

export interface HouseSaleResponse {
  success: boolean;
  data: HouseSaleData[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

export interface SingleHouseSaleResponse {
  success: boolean;
  data: HouseSaleData;
  message?: string;
}

class HouseSalesAPI {
  private getAuthHeaders() {
    const token = authStorage.getAccessToken();
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  async createHouseSale(data: HouseSaleData): Promise<SingleHouseSaleResponse> {
    try {
      const token = authStorage.getAccessToken();
      
      if (!token) {
        throw new Error('ไม่พบ access token กรุณาเข้าสู่ระบบใหม่');
      }

      const response = await fetch(`${API_BASE_URL}/house-sales`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token หมดอายุ ลบ token และแจ้งให้ login ใหม่
          authStorage.clearTokens();
          throw new Error('เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่');
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating house sale:', error);
      throw error;
    }
  }

  async getHouseSales(filters?: HouseSaleFilters): Promise<HouseSaleResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const url = `${API_BASE_URL}/house-sales${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching house sales:', error);
      throw error;
    }
  }

  async getMyHouseSales(): Promise<HouseSaleResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/house-sales/my-listings`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching my house sales:', error);
      throw error;
    }
  }

  async getHouseSale(id: string): Promise<SingleHouseSaleResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/house-sales/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching house sale:', error);
      throw error;
    }
  }

  async updateHouseSale(id: string, data: Partial<HouseSaleData>): Promise<SingleHouseSaleResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/house-sales/${id}`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating house sale:', error);
      throw error;
    }
  }

  async deleteHouseSale(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/house-sales/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting house sale:', error);
      throw error;
    }
  }

  async contactSeller(id: string, contactData: {
    name: string;
    phone: string;
    email?: string;
    message?: string;
  }): Promise<{ success: boolean; message: string; sellerContact: { phone: string; email?: string } }> {
    try {
      const response = await fetch(`${API_BASE_URL}/house-sales/${id}/contact`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(contactData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error contacting seller:', error);
      throw error;
    }
  }

  async toggleFavorite(id: string): Promise<{ success: boolean; favorited: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/house-sales/${id}/favorite`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }

  async getSimilarHouseSales(id: string): Promise<HouseSaleResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/house-sales/${id}/similar`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching similar house sales:', error);
      throw error;
    }
  }

  async getMySavedHouseSales(): Promise<HouseSaleResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/house-sales/my-saved`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching saved house sales:', error);
      throw error;
    }
  }

  async publishHouseSale(id: string): Promise<SingleHouseSaleResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/house-sales/${id}/publish`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error publishing house sale:', error);
      throw error;
    }
  }

  // Fallback data for when backend is not available
  async getFallbackHouseSales(): Promise<HouseSaleResponse> {
    return {
      success: true,
      data: [
        {
          id: 'fallback-1',
          title: 'บ้านเดี่ยว 2 ชั้น ทำเลดี',
          description: 'บ้านสวยพร้อมอยู่ ใกล้ห้างสรรพสินค้า โรงเรียน',
          price: '4,500,000',
          location: 'บางนา-ตราด กม.15',
          province: 'กรุงเทพมหานคร',
          houseType: 'บ้านเดี่ยว',
          bedrooms: 3,
          bathrooms: 2,
          parkingSpaces: 2,
          sellerName: 'คุณสมชาย',
          sellerPhone: '081-234-5678',
          images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'],
          badges: ['พร้อมอยู่', 'ทำเลดี'],
          views: 150,
          contacts: 5,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'fallback-2',
          title: 'ทาวน์โฮม 3 ชั้น โครงการใหม่',
          description: 'ทาวน์โฮมใหม่ ตกแต่งครบ พร้อมเข้าอยู่',
          price: '2,800,000',
          location: 'ลำลูกกา ปทุมธานี',
          province: 'ปทุมธานี',
          houseType: 'ทาวน์โฮม',
          bedrooms: 3,
          bathrooms: 2,
          parkingSpaces: 1,
          sellerName: 'คุณสมหญิง',
          sellerPhone: '082-345-6789',
          images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop'],
          badges: ['ใหม่', 'ราคาดี'],
          views: 89,
          contacts: 3,
          createdAt: new Date().toISOString(),
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      },
    };
  }
}

export const houseSalesAPI = new HouseSalesAPI();