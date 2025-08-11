import { Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private supabase: SupabaseClient;
  private bucketName: string;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    this.bucketName = process.env.SUPABASE_BUCKET_NAME || 'images';

    if (!supabaseUrl || !supabaseKey) {
      this.logger.warn('Supabase configuration not found. File uploads will use local storage.');
      return;
    }

    this.supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    this.logger.log(`Supabase initialized with bucket: ${this.bucketName}`);
  }

  async uploadFile(
    file: Express.Multer.File,
    fileName: string,
    folder?: string
  ): Promise<{ url: string; path: string }> {
    if (!this.supabase) {
      throw new Error('Supabase not configured');
    }

    try {
      const filePath = folder ? `${folder}/${fileName}` : fileName;
      
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: true
        });

      if (error) {
        this.logger.error('Supabase upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = this.supabase.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);

      this.logger.log(`File uploaded successfully: ${filePath}`);

      return {
        url: urlData.publicUrl,
        path: filePath
      };
    } catch (error) {
      this.logger.error('Upload error:', error);
      throw error;
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    if (!this.supabase) {
      throw new Error('Supabase not configured');
    }

    try {
      const { error } = await this.supabase.storage
        .from(this.bucketName)
        .remove([filePath]);

      if (error) {
        this.logger.error('Supabase delete error:', error);
        throw new Error(`Delete failed: ${error.message}`);
      }

      this.logger.log(`File deleted successfully: ${filePath}`);
    } catch (error) {
      this.logger.error('Delete error:', error);
      throw error;
    }
  }

  async getPublicUrl(filePath: string): Promise<string> {
    if (!this.supabase) {
      throw new Error('Supabase not configured');
    }

    const { data } = this.supabase.storage
      .from(this.bucketName)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async listFiles(folder?: string): Promise<any[]> {
    if (!this.supabase) {
      throw new Error('Supabase not configured');
    }

    try {
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .list(folder || '', {
          limit: 100,
          offset: 0
        });

      if (error) {
        this.logger.error('Supabase list error:', error);
        throw new Error(`List failed: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      this.logger.error('List error:', error);
      throw error;
    }
  }

  isConfigured(): boolean {
    return !!this.supabase;
  }

  getBucketName(): string {
    return this.bucketName;
  }
}