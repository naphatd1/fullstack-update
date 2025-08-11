/**
 * ไฟล์สำหรับตรวจสอบ bucket ที่มีอยู่
 */

export async function checkBucketExists() {
  try {
    console.log('🔍 Checking if house-images bucket exists...');
    
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
      console.error('❌ Failed to list buckets:', listError);
      return false;
    }
    
    console.log('📦 Available buckets:', buckets?.map(b => b.name) || []);
    
    // ตรวจสอบว่ามี house-images bucket หรือไม่
    const houseImagesBucket = buckets?.find(b => b.name === 'house-images');
    
    if (houseImagesBucket) {
      console.log('✅ house-images bucket exists!');
      console.log('📋 Bucket info:', {
        name: houseImagesBucket.name,
        public: houseImagesBucket.public,
        created_at: houseImagesBucket.created_at
      });
      return true;
    } else {
      console.log('❌ house-images bucket not found');
      console.log('📝 Please create it manually in Supabase Dashboard:');
      console.log('   1. Go to Storage');
      console.log('   2. Click "Create a new bucket"');
      console.log('   3. Name: house-images');
      console.log('   4. Check "Public bucket"');
      console.log('   5. Click "Save"');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Check failed:', error);
    return false;
  }
}

export async function testUploadPermission() {
  try {
    console.log('🧪 Testing upload permission...');
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not found');
    }
    
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // สร้างไฟล์ทดสอบ (1x1 pixel PNG)
    const testData = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77zgAAAABJRU5ErkJggg==';
    const testFile = new Uint8Array(atob(testData).split('').map(c => c.charCodeAt(0)));
    
    const testPath = `test/test-${Date.now()}.png`;
    
    // ทดสอบอัพโหลด
    const { data, error } = await supabase.storage
      .from('house-images')
      .upload(testPath, testFile, {
        contentType: 'image/png'
      });
    
    if (error) {
      console.error('❌ Upload test failed:', error);
      console.log('💡 Possible solutions:');
      console.log('   1. Check if bucket exists');
      console.log('   2. Check RLS policies');
      console.log('   3. Make sure bucket is public');
      return false;
    }
    
    console.log('✅ Upload test successful!');
    console.log('📁 File uploaded to:', data.path);
    
    // ลบไฟล์ทดสอบ
    const { error: deleteError } = await supabase.storage
      .from('house-images')
      .remove([testPath]);
    
    if (deleteError) {
      console.warn('⚠️ Failed to delete test file:', deleteError);
    } else {
      console.log('🗑️ Test file cleaned up');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Upload test failed:', error);
    return false;
  }
}

export async function runBucketCheck() {
  console.log('🚀 Running bucket check...');
  console.log('================================');
  
  const bucketExists = await checkBucketExists();
  
  if (bucketExists) {
    await testUploadPermission();
  }
  
  console.log('================================');
  console.log('✅ Check completed!');
  
  return bucketExists;
}