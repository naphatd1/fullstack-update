// Dynamic import to avoid build errors when Supabase is not configured
let supabase: any = null;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize Supabase only if credentials are provided
const initSupabase = async () => {
  if (!supabase && supabaseUrl && supabaseAnonKey) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      supabase = createClient(supabaseUrl, supabaseAnonKey);
    } catch (error) {
      console.warn('Supabase not available:', error);
    }
  }
  return supabase;
};

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export class SupabaseStorageService {
  private bucketName = 'house-images';

  /**
   * อัพโหลดรูปภาพไปยัง Supabase Storage
   * @param file - ไฟล์รูปภาพ
   * @param folderName - ชื่อ folder (ชื่อประกาศ)
   * @param imageIndex - ลำดับรูปภาพ
   */
  async uploadHouseImage(
    file: File, 
    folderName: string, 
    imageIndex: number
  ): Promise<UploadResult> {
    try {
      // ตรวจสอบประเภทไฟล์
      if (!file.type.startsWith('image/')) {
        return {
          success: false,
          error: 'กรุณาเลือกไฟล์รูปภาพเท่านั้น'
        };
      }

      // ตรวจสอบขนาดไฟล์ (สูงสุด 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return {
          success: false,
          error: 'ขนาดไฟล์ต้องไม่เกิน 5MB'
        };
      }

      // ตรวจสอบว่า Supabase config มีหรือไม่
      if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Supabase not configured, using fallback');
        return this.uploadImageFallback(file, houseId, imageIndex);
      }

      // Initialize Supabase client
      const supabaseClient = await initSupabase();
      if (!supabaseClient) {
        console.warn('Supabase client not available, using fallback');
        return this.uploadImageFallback(file, houseId, imageIndex);
      }

      // สร้างชื่อไฟล์ที่ไม่ซ้ำ
      const fileExtension = file.name.split('.').pop();
      const fileName = `${Date.now()}_${imageIndex}.${fileExtension}`;
      // ทำความสะอาดชื่อ folder (ลบอักขระพิเศษ และภาษาไทย เพื่อความปลอดภัย)
      const cleanFolderName = folderName
        .replace(/[^\w\s-]/g, '') // ลบอักขระพิเศษทั้งหมด เก็บเฉพาะตัวอักษร ตัวเลข ช่องว่าง และ dash
        .replace(/\s+/g, '_') // แปลงช่องว่างเป็น underscore
        .replace(/_{2,}/g, '_') // ลบ underscore ซ้ำ
        .replace(/^_|_$/g, '') // ลบ underscore ที่ต้นและท้าย
        .toLowerCase(); // แปลงเป็นตัวเล็ก
      const filePath = `houses/${cleanFolderName}/${fileName}`;

      // อัพโหลดไฟล์
      const { data, error } = await supabaseClient.storage
        .from(this.bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Supabase upload error:', error);
        // ใช้ fallback ถ้า Supabase ล้มเหลว
        return this.uploadImageFallback(file, folderName, imageIndex);
      }

      // ดึง public URL
      const { data: urlData } = supabaseClient.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);

      return {
        success: true,
        url: urlData.publicUrl
      };

    } catch (error) {
      console.error('Upload error:', error);
      // ใช้ fallback ถ้าเกิด error
      return this.uploadImageFallback(file, folderName, imageIndex);
    }
  }

  /**
   * Fallback method สำหรับกรณีที่ Supabase ไม่พร้อม
   * จะแปลงรูปเป็น base64 data URL
   */
  private async uploadImageFallback(
    file: File, 
    folderName: string, 
    imageIndex: number
  ): Promise<UploadResult> {
    try {
      return new Promise((resolve) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          const result = e.target?.result as string;
          resolve({
            success: true,
            url: result // base64 data URL
          });
        };
        
        reader.onerror = () => {
          resolve({
            success: false,
            error: 'ไม่สามารถอ่านไฟล์ได้'
          });
        };
        
        reader.readAsDataURL(file);
      });
    } catch (error) {
      return {
        success: false,
        error: 'เกิดข้อผิดพลาดในการประมวลผลไฟล์'
      };
    }
  }

  /**
   * อัพโหลดรูปภาพหลายไฟล์พร้อมกัน
   * @param files - รายการไฟล์รูปภาพ
   * @param folderName - ชื่อ folder (ชื่อประกาศ)
   */
  async uploadMultipleHouseImages(
    files: File[], 
    folderName: string,
    onProgress?: (progress: number) => void
  ): Promise<{ success: boolean; urls: string[]; errors: string[] }> {
    const results = {
      success: true,
      urls: [] as string[],
      errors: [] as string[]
    };

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const result = await this.uploadHouseImage(file, folderName, i + 1);

      if (result.success && result.url) {
        results.urls.push(result.url);
      } else {
        results.success = false;
        results.errors.push(result.error || `เกิดข้อผิดพลาดกับไฟล์ ${file.name}`);
      }

      // อัพเดท progress
      if (onProgress) {
        onProgress(((i + 1) / files.length) * 100);
      }
    }

    return results;
  }

  /**
   * ลบรูปภาพจาก Supabase Storage
   * @param imageUrl - URL ของรูปภาพ
   */
  async deleteHouseImage(imageUrl: string): Promise<boolean> {
    try {
      // ถ้าเป็น base64 data URL ไม่ต้องลบ
      if (imageUrl.startsWith('data:')) {
        return true;
      }

      const supabaseClient = await initSupabase();
      if (!supabaseClient) {
        return true; // ถือว่าลบสำเร็จถ้าไม่มี Supabase
      }

      // แยก path จาก URL
      const urlParts = imageUrl.split('/');
      const bucketIndex = urlParts.findIndex(part => part === this.bucketName);
      
      if (bucketIndex === -1) {
        return false;
      }

      const filePath = urlParts.slice(bucketIndex + 1).join('/');

      const { error } = await supabaseClient.storage
        .from(this.bucketName)
        .remove([filePath]);

      if (error) {
        console.error('Delete error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Delete error:', error);
      return false;
    }
  }

  /**
   * ลบโฟลเดอร์ของบ้านทั้งหมด
   * @param folderName - ชื่อ folder (ชื่อประกาศ)
   */
  async deleteHouseFolder(folderName: string): Promise<boolean> {
    try {
      const supabaseClient = await initSupabase();
      if (!supabaseClient) {
        return true; // ถือว่าลบสำเร็จถ้าไม่มี Supabase
      }

      const cleanFolderName = folderName
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '_')
        .replace(/_{2,}/g, '_')
        .replace(/^_|_$/g, '')
        .toLowerCase();
      const { data: files, error: listError } = await supabaseClient.storage
        .from(this.bucketName)
        .list(`houses/${cleanFolderName}`);

      if (listError || !files) {
        console.error('List files error:', listError);
        return false;
      }

      if (files.length === 0) {
        return true; // ไม่มีไฟล์ให้ลบ
      }

      const filePaths = files.map(file => `houses/${cleanFolderName}/${file.name}`);

      const { error: deleteError } = await supabaseClient.storage
        .from(this.bucketName)
        .remove(filePaths);

      if (deleteError) {
        console.error('Delete folder error:', deleteError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Delete folder error:', error);
      return false;
    }
  }

  /**
   * สร้าง bucket ถ้ายังไม่มี (สำหรับ setup ครั้งแรก)
   */
  async createBucketIfNotExists(): Promise<boolean> {
    try {
      const supabaseClient = await initSupabase();
      if (!supabaseClient) {
        console.warn('Supabase not available for bucket creation');
        return false;
      }

      const { data: buckets, error: listError } = await supabaseClient.storage.listBuckets();

      if (listError) {
        console.error('List buckets error:', listError);
        return false;
      }

      const bucketExists = buckets?.some(bucket => bucket.name === this.bucketName);

      if (!bucketExists) {
        const { error: createError } = await supabaseClient.storage.createBucket(this.bucketName, {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
          fileSizeLimit: 5242880 // 5MB
        });

        if (createError) {
          console.error('Create bucket error:', createError);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Create bucket error:', error);
      return false;
    }
  }
}

export const storageService = new SupabaseStorageService();