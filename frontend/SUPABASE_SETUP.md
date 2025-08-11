# การตั้งค่า Supabase Storage สำหรับระบบอัพโหลดรูปภาพ

## ขั้นตอนการตั้งค่า

### 1. สร้าง Supabase Project
1. ไปที่ [https://supabase.com](https://supabase.com)
2. สร้าง account และ project ใหม่
3. จดบันทึก Project URL และ Anon Key

### 2. ตั้งค่า Environment Variables
สร้างไฟล์ `.env.local` ในโฟลเดอร์ `frontend/`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. ติดตั้ง Dependencies
```bash
cd frontend
npm install @supabase/supabase-js
```

### 4. สร้าง Storage Bucket
ใน Supabase Dashboard:
1. ไปที่ Storage
2. สร้าง bucket ใหม่ชื่อ `house-images`
3. ตั้งค่าเป็น Public
4. กำหนด File size limit เป็น 5MB
5. อนุญาต MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`

### 5. ตั้งค่า RLS (Row Level Security) - ถ้าต้องการ
```sql
-- อนุญาตให้ทุกคนอัพโหลดและดูรูปภาพ (สำหรับ demo)
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'house-images');

CREATE POLICY "Allow public access" ON storage.objects
FOR SELECT USING (bucket_id = 'house-images');

CREATE POLICY "Allow public deletes" ON storage.objects
FOR DELETE USING (bucket_id = 'house-images');
```

## โครงสร้างไฟล์ใน Storage

```
house-images/
├── houses/
│   ├── house-1234567890/
│   │   ├── 1234567890_1.jpg
│   │   ├── 1234567890_2.jpg
│   │   └── ...
│   ├── house-1234567891/
│   │   ├── 1234567891_1.jpg
│   │   └── ...
│   └── ...
```

## การใช้งาน

### อัพโหลดรูปภาพ
```typescript
import { storageService } from '@/lib/supabase-storage';

const result = await storageService.uploadHouseImage(
  file,           // File object
  'house-123',    // House ID
  1              // Image index
);

if (result.success) {
  console.log('Image URL:', result.url);
} else {
  console.error('Error:', result.error);
}
```

### อัพโหลดหลายรูปพร้อมกัน
```typescript
const results = await storageService.uploadMultipleHouseImages(
  files,          // File[]
  'house-123',    // House ID
  (progress) => { // Progress callback
    console.log(`Progress: ${progress}%`);
  }
);
```

### ลบรูปภาพ
```typescript
const success = await storageService.deleteHouseImage(imageUrl);
```

### ลบโฟลเดอร์ทั้งหมด
```typescript
const success = await storageService.deleteHouseFolder('house-123');
```

## Fallback Mode

ถ้า Supabase ไม่พร้อมใช้งาน ระบบจะใช้ fallback mode โดยแปลงรูปเป็น base64 data URL แทน:

- ✅ ยังคงแสดงรูปได้
- ✅ ไม่ต้องพึ่งพา external service
- ❌ ขนาดข้อมูลใหญ่กว่า
- ❌ ไม่เหมาะสำหรับ production

## การทดสอบ

```typescript
import { checkSupabaseConnection, setupSupabaseStorage } from '@/lib/setup-supabase';

// ทดสอบการเชื่อมต่อ
const isConnected = await checkSupabaseConnection();

// Setup bucket (ครั้งแรกเท่านั้น)
const isSetup = await setupSupabaseStorage();
```

## Security Best Practices

1. **ใช้ RLS**: ตั้งค่า Row Level Security เพื่อควบคุมการเข้าถึง
2. **จำกัดขนาดไฟล์**: ไม่เกิน 5MB ต่อไฟล์
3. **จำกัดประเภทไฟล์**: เฉพาะรูปภาพเท่านั้น
4. **ใช้ CDN**: เพื่อเพิ่มความเร็วในการโหลดรูป
5. **Backup**: สำรองข้อมูลสำคัญ

## Troubleshooting

### ปัญหาที่พบบ่อย:

1. **CORS Error**: ตรวจสอบ domain ใน Supabase settings
2. **Upload Failed**: ตรวจสอบ bucket permissions
3. **File Too Large**: ตรวจสอบ file size limit
4. **Invalid File Type**: ตรวจสอบ allowed MIME types

### การแก้ไข:

```typescript
// ตรวจสอบ configuration
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// ทดสอบการเชื่อมต่อ
const { supabase } = await import('@/lib/supabase-storage');
const { data, error } = await supabase.storage.listBuckets();
console.log('Buckets:', data, 'Error:', error);
```