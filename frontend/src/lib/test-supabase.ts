/**
 * ไฟล์สำหรับทดสอบการเชื่อมต่อ Supabase
 * รันใน browser console หรือใน component
 */

export async function testSupabaseConnection() {
  try {
    console.log('🧪 Testing Supabase connection...');
    
    // ตรวจสอบ environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('📋 Environment check:');
    console.log('- SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
    console.log('- SUPABASE_KEY:', supabaseKey ? '✅ Set' : '❌ Missing');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Supabase credentials not configured');
      return false;
    }
    
    // ทดสอบการเชื่อมต่อ
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('🔌 Testing connection...');
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('❌ Connection failed:', error);
      return false;
    }
    
    console.log('✅ Connection successful!');
    console.log('📦 Available buckets:', buckets?.map(b => b.name));
    
    // ตรวจสอบ house-images bucket
    const houseImagesBucket = buckets?.find(b => b.name === 'house-images');
    if (houseImagesBucket) {
      console.log('✅ house-images bucket found');
    } else {
      console.warn('⚠️ house-images bucket not found - please create it');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

export async function testImageUpload() {
  try {
    console.log('🧪 Testing image upload...');
    
    // สร้างไฟล์ทดสอบ (1x1 pixel PNG)
    const testImageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77zgAAAABJRU5ErkJggg==';
    
    // แปลง data URL เป็น File
    const response = await fetch(testImageData);
    const blob = await response.blob();
    const file = new File([blob], 'test.png', { type: 'image/png' });
    
    // ทดสอบอัพโหลด
    const { storageService } = await import('./supabase-storage');
    const result = await storageService.uploadHouseImage(file, 'test-house', 1);
    
    if (result.success) {
      console.log('✅ Upload test successful!');
      console.log('🔗 Image URL:', result.url);
      
      // ทดสอบลบไฟล์
      if (result.url) {
        const deleteResult = await storageService.deleteHouseImage(result.url);
        console.log('🗑️ Delete test:', deleteResult ? '✅ Success' : '❌ Failed');
      }
      
      return true;
    } else {
      console.error('❌ Upload test failed:', result.error);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Upload test failed:', error);
    return false;
  }
}

// ฟังก์ชันสำหรับรันทดสอบทั้งหมด
export async function runAllTests() {
  console.log('🚀 Running Supabase tests...');
  console.log('================================');
  
  const connectionTest = await testSupabaseConnection();
  
  if (connectionTest) {
    await testImageUpload();
  }
  
  console.log('================================');
  console.log('✅ Tests completed!');
}

// สำหรับใช้ใน browser console
if (typeof window !== 'undefined') {
  (window as any).testSupabase = {
    connection: testSupabaseConnection,
    upload: testImageUpload,
    all: runAllTests
  };
  
  console.log('🧪 Supabase test functions available:');
  console.log('- testSupabase.connection()');
  console.log('- testSupabase.upload()');
  console.log('- testSupabase.all()');
}