# 🚀 การตั้งค่า Supabase สำหรับอัพโหลดรูปภาพ

## ขั้นตอนที่ 1: สร้าง Supabase Project

1. ไปที่ [https://supabase.com](https://supabase.com)
2. สร้าง account (ถ้ายังไม่มี)
3. คลิก "New Project"
4. เลือก Organization
5. ตั้งชื่อ Project: `house-sales-app`
6. สร้าง Database Password (จดไว้)
7. เลือก Region: `Southeast Asia (Singapore)`
8. คลิก "Create new project"

## ขั้นตอนที่ 2: ตั้งค่า Storage

1. ใน Supabase Dashboard ไปที่ **Storage**
2. คลิก "Create a new bucket"
3. ตั้งชื่อ bucket: `house-images`
4. เลือก "Public bucket" ✅
5. คลิก "Save"

## ขั้นตอนที่ 3: ตั้งค่า Policies

ใน Storage → house-images → Configuration → Policies:

```sql
-- Policy 1: Allow public uploads
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'house-images');

-- Policy 2: Allow public access
CREATE POLICY "Allow public access" ON storage.objects
FOR SELECT USING (bucket_id = 'house-images');

-- Policy 3: Allow public deletes
CREATE POLICY "Allow public deletes" ON storage.objects
FOR DELETE USING (bucket_id = 'house-images');
```

## ขั้นตอนที่ 4: ดึง API Keys

1. ไปที่ **Settings** → **API**
2. คัดลอก:
   - **Project URL** (https://xxx.supabase.co)
   - **anon public key** (eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)

## ขั้นตอนที่ 5: ตั้งค่า Environment Variables

เพิ่มใน `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## ขั้นตอนที่ 6: ติดตั้ง Dependencies

```bash
npm install @supabase/supabase-js
```

## ขั้นตอนที่ 7: ทดสอบ

1. รีสตาร์ท dev server: `npm run dev`
2. ไปที่หน้าขายบ้าน → ขั้นตอนที่ 4
3. อัพโหลดรูปภาพ
4. ตรวจสอบใน Supabase Storage ว่ามีไฟล์หรือไม่

## 🔧 Troubleshooting

### ปัญหา: CORS Error

**แก้ไข**: ใน Supabase Dashboard → Authentication → Settings → Site URL
เพิ่ม: `http://localhost:3000`

### ปัญหา: Upload Failed

**แก้ไข**: ตรวจสอบ Policies ใน Storage

### ปัญหา: File Too Large

**แก้ไข**: ใน Storage Settings เพิ่ม File size limit เป็น 50MB

## 📁 โครงสร้างไฟล์ที่จะถูกสร้าง

```
house-images/
├── houses/
│   ├── house-1704723600000/
│   │   ├── 1704723600000_1.jpg
│   │   ├── 1704723600000_2.jpg
│   │   └── 1704723600000_3.jpg
│   └── house-1704723700000/
│       ├── 1704723700000_1.jpg
│       └── 1704723700000_2.jpg
```

## ✅ เมื่อตั้งค่าเสร็จ

ระบบจะ:

- อัพโหลดรูปไปยัง Supabase Storage
- แยก folder ตามบ้านแต่ละหลัง
- สร้าง public URL สำหรับแสดงรูป
- ลบรูปได้เมื่อไม่ต้องการ
