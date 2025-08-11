import { storageService } from "./supabase-storage";

/**
 * ฟังก์ชันสำหรับ setup Supabase Storage ครั้งแรก
 * ควรเรียกใช้ครั้งเดียวเมื่อ deploy หรือ setup โปรเจค
 */
export async function setupSupabaseStorage() {
  try {
    console.log("Setting up Supabase Storage...");

    // สร้าง bucket สำหรับเก็บรูปภาพบ้าน
    const bucketCreated = await storageService.createBucketIfNotExists();

    if (bucketCreated) {
      console.log("✅ Supabase Storage setup completed successfully");
      return true;
    } else {
      console.error("❌ Failed to setup Supabase Storage");
      return false;
    }
  } catch (error) {
    console.error("❌ Error setting up Supabase Storage:", error);
    return false;
  }
}

/**
 * ตรวจสอบว่า Supabase Storage พร้อมใช้งานหรือไม่
 */
export async function checkSupabaseConnection() {
  try {
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn("Supabase not configured");
      return false;
    }

    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // ทดสอบการเชื่อมต่อโดยการ list buckets
    const { data, error } = await supabase.storage.listBuckets();

    if (error) {
      console.error("Supabase connection error:", error);
      return false;
    }

    console.log("✅ Supabase connection successful");
    return true;
  } catch (error) {
    console.error("❌ Supabase connection failed:", error);
    return false;
  }
}
