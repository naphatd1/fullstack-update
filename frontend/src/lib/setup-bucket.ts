/**
 * ไฟล์สำหรับตั้งค่า Supabase Storage bucket
 */

export async function setupHouseImagesBucket() {
  try {
    console.log('🔧 Setting up house-images bucket...');
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not found');
    }
    
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // ตรวจสอบ buckets ที่มีอยู่
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      throw new Error(`Failed to list buckets: ${listError.message}`);
    }
    
    console.log('📦 Available buckets:', buckets?.map(b => b.name));
    
    // ตรวจสอบว่ามี house-images bucket หรือไม่
    const houseImagesBucket = buckets?.find(b => b.name === 'house-images');
    
    if (houseImagesBucket) {
      console.log('✅ house-images bucket already exists');
      return true;
    }
    
    // สร้าง bucket ใหม่
    console.log('🆕 Creating house-images bucket...');
    const { error: createError } = await supabase.storage.createBucket('house-images', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      fileSizeLimit: 5242880 // 5MB
    });
    
    if (createError) {
      throw new Error(`Failed to create bucket: ${createError.message}`);
    }
    
    console.log('✅ house-images bucket created successfully');
    return true;
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    return false;
  }
}

export async function testBucketAccess() {
  try {
    console.log('🧪 Testing bucket access...');
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not found');
    }
    
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // ทดสอบการ list files ใน bucket
    const { data: files, error } = await supabase.storage
      .from('house-images')
      .list('houses', {
        limit: 1
      });
    
    if (error) {
      console.warn('⚠️ Bucket access test failed:', error.message);
      return false;
    }
    
    console.log('✅ Bucket access test successful');
    console.log('📁 Files in houses folder:', files?.length || 0);
    return true;
    
  } catch (error) {
    console.error('❌ Bucket access test failed:', error);
    return false;
  }
}

// ฟังก์ชันสำหรับรันการตั้งค่าทั้งหมด
export async function runFullSetup() {
  console.log('🚀 Running full Supabase setup...');
  console.log('================================');
  
  const bucketSetup = await setupHouseImagesBucket();
  
  if (bucketSetup) {
    await testBucketAccess();
  }
  
  console.log('================================');
  console.log('✅ Setup completed!');
  
  return bucketSetup;
}