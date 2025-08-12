"use client";

import React, { useState, useMemo } from "react";
import {
  Home,
  MapPin,
  Bath,
  Car,
  Upload,
  X,
  Plus,
  Save,
  Eye,
  DollarSign,
  FileText,
  Phone,
  Mail,
  User,
  Shield,
  TreePine,
  Waves,
  Camera,
  Send,
} from "lucide-react";
// import ImageUploader from "./ImageUploader"; // ใช้ inline upload แทน

import { HouseSaleData } from "@/lib/api/house-sales";
import { provinces } from "@/data/provinces";

type HouseSaleFormData = HouseSaleData;

interface HouseSaleFormProps {
  onSubmit: (data: HouseSaleData, action: 'save' | 'publish') => void;
  onClose?: () => void;
}

const HouseSaleForm: React.FC<HouseSaleFormProps> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState<HouseSaleData>({
    // ข้อมูลพื้นฐาน
    title: "",
    description: "",
    price: "",
    negotiable: false,
    downPayment: "",
    installmentAvailable: false,
    
    // ที่อยู่และทำเล
    location: "",
    province: "",
    district: "",
    subDistrict: "",
    postalCode: "",
    
    // รายละเอียดบ้าน
    houseType: "บ้านเดี่ยว",
    bedrooms: 3,
    bathrooms: 2,
    floors: 2,
    usableArea: "",
    landArea: "",
    
    // เอกสารกฎหมาย
    titleDeed: true,
    titleDeedNumber: "",
    ownership: "เจ้าของเดียว",
    legalIssues: false,
    legalIssuesDetail: "",
    
    // สิ่งอำนวยความสะดวก
    parkingSpaces: 2,
    hasSwimmingPool: false,
    hasGarden: false,
    hasSecurity: false,
    hasElevator: false,
    hasAirConditioner: false,
    hasBuiltInFurniture: false,
    
    // ข้อมูลผู้ขาย
    sellerName: "",
    sellerPhone: "",
    sellerEmail: "",
    sellerType: "นายหน้า",
    
    // เหตุผลในการขาย
    saleReason: "",
    urgentSale: false,
    
    // รูปภาพ
    images: [],
    badges: [],
    selectedBadges: [],
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const houseTypes = [
    "บ้านเดี่ยว",
    "ทาวน์โฮม",
    "ทาวน์เฮ้าส์",
    "บ้านแฝด",
    "วิลล่า",
    "บ้านสวน",
    "บ้านไร่",
    "เพนท์เฮ้าส์",
  ];

  // Get districts for selected province
  const availableDistricts = useMemo(() => {
    if (!formData.province) return [];
    const selectedProvince = provinces.find(p => p.name === formData.province);
    return selectedProvince ? selectedProvince.districts : [];
  }, [formData.province]);

  const ownershipTypes = [
    "เจ้าของเดียว",
    "เจ้าของร่วม",
    "นิติบุคคล",
    "มรดก",
  ];

  const sellerTypes = [
    "นายหน้า",
    "เจ้าของ",
    "นิติบุคคล",
    "ตัวแทน",
  ];

  const saleReasons = [
    "ย้ายที่ทำงาน",
    "ต้องการเงินด่วน",
    "อพยพไปต่างประเทศ",
    "ซื้อบ้านใหม่",
    "เปลี่ยนแปลงครอบครัว",
    "เกษียณอายุ",
    "อื่นๆ",
  ];

  const availableBadges = [
    { id: "new", label: "รีโนเวทใหม่", color: "bg-green-500" },
    { id: "ready", label: "พร้อมอยู่", color: "bg-blue-500" },
    { id: "urgent", label: "ขายด่วน", color: "bg-red-500" },
    { id: "negotiable", label: "ราคาต่อรองได้", color: "bg-yellow-500" },
    { id: "furnished", label: "เฟอร์นิเจอร์ครบ", color: "bg-purple-500" },
    { id: "pool", label: "มีสระว่ายน้ำ", color: "bg-cyan-500" },
    { id: "security", label: "รักษาความปลอดภัย", color: "bg-orange-500" },
    { id: "parking", label: "ที่จอดรถเยอะ", color: "bg-gray-500" },
    { id: "garden", label: "มีสวน", color: "bg-emerald-500" },
    { id: "modern", label: "สไตล์โมเดิร์น", color: "bg-indigo-500" },
    { id: "quiet", label: "ย่านเงียบสงบ", color: "bg-teal-500" },
    { id: "convenient", label: "ทำเลสะดวก", color: "bg-pink-500" },
    { id: "investment", label: "เหมาะลงทุน", color: "bg-amber-500" },
    { id: "family", label: "เหมาะครอบครัว", color: "bg-lime-500" },
    { id: "luxury", label: "หรูหรา", color: "bg-rose-500" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        // Reset district when province changes
        ...(name === "province" ? { district: "" } : {}),
      }));
    }
  };

  // Handle price input with comma formatting
  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: 'price' | 'downPayment'
  ) => {
    const value = e.target.value;
    
    // Remove all non-digit characters
    const numericValue = value.replace(/[^\d]/g, '');
    
    // Format with commas
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    setFormData((prev) => ({
      ...prev,
      [fieldName]: formattedValue,
    }));
  };

  // Convert number to Thai text
  const numberToThaiText = (numStr: string): string => {
    if (!numStr || numStr === '0') return '';
    
    const num = parseInt(numStr.replace(/,/g, ''));
    if (isNaN(num) || num === 0) return '';
    
    if (num >= 1000000) {
      const millions = Math.floor(num / 1000000);
      const remainder = num % 1000000;
      if (remainder === 0) {
        return `${millions} ล้านบาท`;
      } else if (remainder >= 100000) {
        const hundredThousands = Math.floor(remainder / 100000);
        return `${millions} ล้าน ${hundredThousands} แสนบาท`;
      } else if (remainder >= 10000) {
        const tenThousands = Math.floor(remainder / 10000);
        return `${millions} ล้าน ${tenThousands} หมื่นบาท`;
      } else if (remainder >= 1000) {
        const thousands = Math.floor(remainder / 1000);
        return `${millions} ล้าน ${thousands} พันบาท`;
      } else {
        return `${millions} ล้าน ${remainder} บาท`;
      }
    } else if (num >= 100000) {
      const hundredThousands = Math.floor(num / 100000);
      const remainder = num % 100000;
      if (remainder === 0) {
        return `${hundredThousands} แสนบาท`;
      } else if (remainder >= 10000) {
        const tenThousands = Math.floor(remainder / 10000);
        return `${hundredThousands} แสน ${tenThousands} หมื่นบาท`;
      } else if (remainder >= 1000) {
        const thousands = Math.floor(remainder / 1000);
        return `${hundredThousands} แสน ${thousands} พันบาท`;
      } else {
        return `${hundredThousands} แสน ${remainder} บาท`;
      }
    } else if (num >= 10000) {
      const tenThousands = Math.floor(num / 10000);
      const remainder = num % 10000;
      if (remainder === 0) {
        return `${tenThousands} หมื่นบาท`;
      } else if (remainder >= 1000) {
        const thousands = Math.floor(remainder / 1000);
        return `${tenThousands} หมื่น ${thousands} พันบาท`;
      } else {
        return `${tenThousands} หมื่น ${remainder} บาท`;
      }
    } else if (num >= 1000) {
      const thousands = Math.floor(num / 1000);
      const remainder = num % 1000;
      if (remainder === 0) {
        return `${thousands} พันบาท`;
      } else {
        return `${thousands} พัน ${remainder} บาท`;
      }
    } else {
      return `${num} บาท`;
    }
  };

  const handleNumberChange = (field: keyof HouseSaleData, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: Math.max(0, value),
    }));
  };

  const handleBadgeToggle = (badgeId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedBadges: prev.selectedBadges.includes(badgeId)
        ? prev.selectedBadges.filter(id => id !== badgeId)
        : [...prev.selectedBadges, badgeId],
    }));
  };

  // Generate folder name automatically
  const generateFolderName = () => {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const houseType = formData.houseType.toLowerCase();
    const location = formData.province || 'bangkok';
    
    // Create a clean folder name
    const folderName = `house_${houseType}_${location}_${timestamp}_${randomId}`
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '_')
      .replace(/_{2,}/g, '_')
      .toLowerCase();
    
    return folderName;
  };





  const handleSubmit = (e: React.FormEvent, action: 'save' | 'publish' = 'save') => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.price || !formData.location || !formData.sellerPhone) {
      alert("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      return;
    }

    // Combine selected badges with auto-generated badges
    const autoBadges = [];
    if (formData.urgentSale) autoBadges.push("ขายด่วน");
    if (formData.negotiable) autoBadges.push("ราคาต่อรองได้");
    if (formData.hasSwimmingPool) autoBadges.push("มีสระว่ายน้ำ");
    if (formData.hasSecurity) autoBadges.push("รักษาความปลอดภัย");
    if (formData.titleDeed) autoBadges.push("มีโฉนด");
    if (formData.installmentAvailable) autoBadges.push("ผ่อนได้");

    // Get selected badge labels
    const selectedBadgeLabels = formData.selectedBadges.map(badgeId => 
      availableBadges.find(badge => badge.id === badgeId)?.label
    ).filter(Boolean);

    // Combine and remove duplicates
    const allBadges = [...new Set([...selectedBadgeLabels, ...autoBadges])];

    // Remove selectedBadges from data before sending to API
    const { selectedBadges, ...dataWithoutSelectedBadges } = formData;

    const finalData = {
      ...dataWithoutSelectedBadges,
      badges: allBadges,
      images: formData.images.length > 0 ? formData.images : [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"
      ],
      status: action === 'publish' ? 'published' : 'saved',
    };

    onSubmit(finalData, action);
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      // เลื่อนขึ้นบนสุดของฟอร์ม
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // เลื่อนขึ้นบนสุดของฟอร์ม
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step <= currentStep
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {step}
          </div>
          {step < 4 && (
            <div
              className={`w-16 h-1 mx-2 ${
                step < currentStep ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">ข้อมูลพื้นฐาน</h3>
      
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ชื่อประกาศ *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="เช่น ขายบ้านเดี่ยว 2 ชั้น ทำเลดี พร้อมอยู่"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      {/* Price and Payment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ราคาขาย (บาท) *
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={(e) => handlePriceChange(e, 'price')}
              placeholder="เช่น 4,500,000"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            {formData.price && (
              <p className="text-sm text-blue-600 mt-1 font-medium">
                {numberToThaiText(formData.price)}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            เงินดาวน์ (บาท)
          </label>
          <input
            type="text"
            name="downPayment"
            value={formData.downPayment}
            onChange={(e) => handlePriceChange(e, 'downPayment')}
            placeholder="เช่น 500,000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {formData.downPayment && (
            <p className="text-sm text-green-600 mt-1 font-medium">
              {numberToThaiText(formData.downPayment)}
            </p>
          )}
        </div>
      </div>

      {/* Checkboxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            name="negotiable"
            checked={formData.negotiable}
            onChange={handleInputChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 text-sm text-gray-700">ราคาต่อรองได้</label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="installmentAvailable"
            checked={formData.installmentAvailable}
            onChange={handleInputChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 text-sm text-gray-700">สามารถผ่อนชำระได้</label>
        </div>
      </div>

      {/* House Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ประเภทบ้าน
        </label>
        <select
          name="houseType"
          value={formData.houseType}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {houseTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Badge Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          เลือก Badge ที่ต้องการแสดง (เลือกได้สูงสุด 3 อัน)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {availableBadges.map((badge) => (
            <button
              key={badge.id}
              type="button"
              onClick={() => handleBadgeToggle(badge.id)}
              disabled={!formData.selectedBadges.includes(badge.id) && formData.selectedBadges.length >= 3}
              className={`
                relative p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium
                ${formData.selectedBadges.includes(badge.id)
                  ? `${badge.color} text-white border-transparent shadow-lg transform scale-105`
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md'
                }
                ${!formData.selectedBadges.includes(badge.id) && formData.selectedBadges.length >= 3
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer'
                }
              `}
            >
              {badge.label}
              {formData.selectedBadges.includes(badge.id) && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-white text-green-600 rounded-full flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
              )}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          เลือกแล้ว: {formData.selectedBadges.length}/3 • Badge จะช่วยให้ประกาศของคุณโดดเด่นและดึงดูดผู้ซื้อมากขึ้น
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          คำอธิบาย
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          placeholder="อธิบายรายละเอียดของบ้าน เช่น สภาพบ้าน สิ่งอำนวยความสะดวก ทำเล ฯลฯ"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">ที่อยู่และรายละเอียดบ้าน</h3>
      
      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ที่อยู่ *
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="เช่น 123/45 หมู่บ้านสวยงาม ซอยสุขุมวิท 101"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      {/* Province, District, Sub-district */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            จังหวัด
          </label>
          <select
            name="province"
            value={formData.province}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">เลือกจังหวัด</option>
            {provinces.map((province) => (
              <option key={province.id} value={province.name}>
                {province.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            เขต/อำเภอ
          </label>
          <select
            name="district"
            value={formData.district}
            onChange={handleInputChange}
            disabled={!formData.province}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">
              {formData.province ? "เลือกเขต/อำเภอ" : "เลือกจังหวัดก่อน"}
            </option>
            {availableDistricts.map((district) => (
              <option key={district.id} value={district.name}>
                {district.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            แขวง/ตำบล
          </label>
          <input
            type="text"
            name="subDistrict"
            value={formData.subDistrict}
            onChange={handleInputChange}
            placeholder="เช่น บางนาใต้"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Postal Code */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            รหัสไปรษณีย์
          </label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange}
            placeholder="เช่น 10260"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* House Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ห้องนอน
          </label>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => handleNumberChange("bedrooms", formData.bedrooms - 1)}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center"
            >
              -
            </button>
            <div className="flex items-center space-x-1 px-3 py-2 bg-gray-50 rounded-lg">
              <Home className="w-4 h-4 text-gray-500" />
              <span className="font-medium">{formData.bedrooms}</span>
            </div>
            <button
              type="button"
              onClick={() => handleNumberChange("bedrooms", formData.bedrooms + 1)}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ห้องน้ำ
          </label>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => handleNumberChange("bathrooms", formData.bathrooms - 1)}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center"
            >
              -
            </button>
            <div className="flex items-center space-x-1 px-3 py-2 bg-gray-50 rounded-lg">
              <Bath className="w-4 h-4 text-gray-500" />
              <span className="font-medium">{formData.bathrooms}</span>
            </div>
            <button
              type="button"
              onClick={() => handleNumberChange("bathrooms", formData.bathrooms + 1)}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            จำนวนชั้น
          </label>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => handleNumberChange("floors", formData.floors - 1)}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center"
            >
              -
            </button>
            <div className="flex items-center space-x-1 px-3 py-2 bg-gray-50 rounded-lg">
              <span className="font-medium">{formData.floors}</span>
            </div>
            <button
              type="button"
              onClick={() => handleNumberChange("floors", formData.floors + 1)}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ที่จอดรถ
          </label>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => handleNumberChange("parkingSpaces", formData.parkingSpaces - 1)}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center"
            >
              -
            </button>
            <div className="flex items-center space-x-1 px-3 py-2 bg-gray-50 rounded-lg">
              <Car className="w-4 h-4 text-gray-500" />
              <span className="font-medium">{formData.parkingSpaces}</span>
            </div>
            <button
              type="button"
              onClick={() => handleNumberChange("parkingSpaces", formData.parkingSpaces + 1)}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            พื้นที่ใช้สอย (ตร.ม.)
          </label>
          <input
            type="text"
            name="usableArea"
            value={formData.usableArea}
            onChange={handleInputChange}
            placeholder="เช่น 180"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ขนาดที่ดิน (ตร.ว.)
          </label>
          <input
            type="text"
            name="landArea"
            value={formData.landArea}
            onChange={handleInputChange}
            placeholder="เช่น 50"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Amenities */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          สิ่งอำนวยความสะดวก
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="hasSwimmingPool"
              checked={formData.hasSwimmingPool}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <Waves className="w-4 h-4 ml-2 mr-1 text-blue-500" />
            <label className="text-sm text-gray-700">สระว่ายน้ำ</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="hasGarden"
              checked={formData.hasGarden}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <TreePine className="w-4 h-4 ml-2 mr-1 text-green-500" />
            <label className="text-sm text-gray-700">สวน</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="hasSecurity"
              checked={formData.hasSecurity}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <Shield className="w-4 h-4 ml-2 mr-1 text-red-500" />
            <label className="text-sm text-gray-700">รักษาความปลอดภัย</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="hasElevator"
              checked={formData.hasElevator}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-700">ลิฟต์</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="hasAirConditioner"
              checked={formData.hasAirConditioner}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-700">เครื่องปรับอากาศ</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="hasBuiltInFurniture"
              checked={formData.hasBuiltInFurniture}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-700">เฟอร์นิเจอร์บิวท์อิน</label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">เอกสารกฎหมายและข้อมูลผู้ขาย</h3>
      
      {/* Legal Documents */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-blue-600" />
          เอกสารกฎหมาย
        </h4>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="titleDeed"
              checked={formData.titleDeed}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-700">มีโฉนดที่ดิน</label>
          </div>

          {formData.titleDeed && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                เลขที่โฉนด
              </label>
              <input
                type="text"
                name="titleDeedNumber"
                value={formData.titleDeedNumber}
                onChange={handleInputChange}
                placeholder="เช่น 12345"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ลักษณะกรรมสิทธิ์
            </label>
            <select
              name="ownership"
              value={formData.ownership}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {ownershipTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="legalIssues"
              checked={formData.legalIssues}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-700">มีภาระผูกพันทางกฎหมาย</label>
          </div>

          {formData.legalIssues && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                รายละเอียดภาระผูกพัน
              </label>
              <textarea
                name="legalIssuesDetail"
                value={formData.legalIssuesDetail}
                onChange={handleInputChange}
                rows={3}
                placeholder="อธิบายรายละเอียดภาระผูกพัน"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* Seller Information */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          <User className="w-5 h-5 mr-2 text-blue-600" />
          ข้อมูลผู้ขาย
        </h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ชื่อผู้ขาย *
            </label>
            <input
              type="text"
              name="sellerName"
              value={formData.sellerName}
              onChange={handleInputChange}
              placeholder="เช่น นายสมชาย ใจดี"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                เบอร์โทรศัพท์ *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="sellerPhone"
                  value={formData.sellerPhone}
                  onChange={handleInputChange}
                  placeholder="เช่น 081-234-5678"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                อีเมล
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="sellerEmail"
                  value={formData.sellerEmail}
                  onChange={handleInputChange}
                  placeholder="เช่น somchai@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ประเภทผู้ขาย
            </label>
            <select
              name="sellerType"
              value={formData.sellerType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {sellerTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Sale Reason */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          เหตุผลในการขาย
        </label>
        <select
          name="saleReason"
          value={formData.saleReason}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">เลือกเหตุผล</option>
          {saleReasons.map((reason) => (
            <option key={reason} value={reason}>
              {reason}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="urgentSale"
          checked={formData.urgentSale}
          onChange={handleInputChange}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label className="ml-2 text-sm text-gray-700">ต้องการขายด่วน</label>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">รูปภาพ</h3>
      
      {/* Supabase Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          รูปภาพบ้าน (สูงสุด 20 รูป)
        </label>
        
        {/* แสดงชื่อ folder ที่จะใช้ */}
        <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            📁 รูปภาพจะถูกจัดเก็บในโฟลเดอร์: <span className="font-medium">{generateFolderName()}</span>
          </p>
          <p className="text-xs text-blue-600 mt-1">
            💡 ชื่อโฟลเดอร์จะถูกสร้างอัตโนมัติเพื่อให้เข้ากันได้กับ Supabase Storage
          </p>
        </div>

        {/* Progress Bar */}
        {isUploading && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-700">กำลังอัพโหลดรูปภาพ...</span>
              <span className="text-sm text-green-600">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* คำแนะนำ */}
        <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-700">
            💡 <strong>คำแนะนำ:</strong> ระบบจะสร้างชื่อโฟลเดอร์อัตโนมัติตามประเภทบ้าน จังหวัด และเวลาที่อัพโหลด
          </p>
        </div>

        {/* Image Upload with Error Boundary */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={async (e) => {
              const files = e.target.files;
              if (!files || isUploading) return;

              // ตรวจสอบว่ากรอกชื่อประกาศแล้วหรือยัง
              if (!formData.title.trim()) {
                alert('กรุณากรอกชื่อประกาศก่อนอัพโหลดรูปภาพ เพื่อให้ระบบสร้างโฟลเดอร์ที่เหมาะสม');
                e.target.value = ''; // รีเซ็ต input
                return;
              }

              const fileArray = Array.from(files);
              const currentImages = formData.images || [];
              const remainingSlots = 20 - currentImages.length;
              const filesToProcess = fileArray.slice(0, remainingSlots);

              if (fileArray.length > remainingSlots) {
                alert(`สามารถอัพโหลดได้สูงสุด 20 รูป (เหลือที่ว่าง ${remainingSlots} รูป)`);
              }

              // เริ่มการ upload
              setIsUploading(true);
              setUploadProgress(0);

              // Try Supabase upload first, fallback to base64
              const newImages: string[] = [];
              
              for (let i = 0; i < filesToProcess.length; i++) {
                const file = filesToProcess[i];
                
                // อัพเดท progress
                const progressPercent = Math.round(((i + 1) / filesToProcess.length) * 100);
                setUploadProgress(progressPercent);
                try {
                  // ตรวจสอบประเภทไฟล์
                  if (!file.type.startsWith('image/')) {
                    alert(`ไฟล์ ${file.name} ไม่ใช่รูปภาพ`);
                    continue;
                  }

                  // ตรวจสอบขนาดไฟล์ (5MB)
                  if (file.size > 5 * 1024 * 1024) {
                    alert(`ไฟล์ ${file.name} มีขนาดใหญ่เกิน 5MB`);
                    continue;
                  }

                  // Try Supabase upload
                  try {
                    const { storageService } = await import('@/lib/supabase-storage');
                    // ใช้ชื่อ folder ที่ generate อัตโนมัติ
                    const folderName = generateFolderName();
                    const result = await storageService.uploadHouseImage(
                      file, 
                      folderName, 
                      currentImages.length + newImages.length + 1
                    );
                    
                    if (result.success && result.url) {
                      newImages.push(result.url);
                      console.log('✅ Uploaded to Supabase:', result.url);
                    } else {
                      throw new Error('Supabase upload failed');
                    }
                  } catch (supabaseError) {
                    console.warn('Supabase upload failed, using base64:', supabaseError);
                    
                    // Fallback to base64
                    const base64 = await new Promise<string>((resolve, reject) => {
                      const reader = new FileReader();
                      reader.onload = () => resolve(reader.result as string);
                      reader.onerror = reject;
                      reader.readAsDataURL(file);
                    });
                    
                    newImages.push(base64);
                    console.log('✅ Converted to base64');
                  }
                } catch (error) {
                  console.error('Error processing file:', file.name, error);
                  alert(`เกิดข้อผิดพลาดกับไฟล์ ${file.name}`);
                }
              }

              if (newImages.length > 0) {
                setFormData(prev => ({
                  ...prev,
                  images: [...currentImages, ...newImages],
                }));
              }

              // เสร็จสิ้นการ upload
              setIsUploading(false);
              setUploadProgress(0);

              // Reset input
              e.target.value = '';
            }}
            className="hidden"
            id="file-upload-step4"
            disabled={isUploading}
          />
          <label htmlFor="file-upload-step4" className={`cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <Camera className={`w-12 h-12 mx-auto mb-4 ${isUploading ? 'text-gray-300' : 'text-gray-400'}`} />
            <p className="text-lg font-medium text-gray-900 mb-2">
              {isUploading ? 'กำลังอัพโหลดรูปภาพ...' : 'อัพโหลดรูปภาพบ้าน'}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              {isUploading ? `กำลังประมวลผล ${uploadProgress}%` : 'คลิกเพื่อเลือกไฟล์รูปภาพ'}
            </p>
            <p className="text-xs text-gray-400">
              รองรับ JPG, PNG, WebP (สูงสุด 5MB ต่อไฟล์)
            </p>
            <p className="text-xs text-gray-400 mt-1">
              สูงสุด 20 รูป (เหลือ {20 - (formData.images?.length || 0)} รูป)
            </p>
          </label>
        </div>

        {/* Image Preview */}
        {formData.images && formData.images.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              รูปภาพที่อัพโหลดแล้ว ({formData.images.length}/20)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`รูปที่ ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&h=150&fit=crop";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = formData.images?.filter((_, i) => i !== index) || [];
                      setFormData(prev => ({ ...prev, images: newImages }));
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      รูปหลัก
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {(!formData.images || formData.images.length === 0) && (
          <div className="mt-4 text-center py-4">
            <Camera className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">ยังไม่มีรูปภาพ</p>
            <p className="text-xs text-gray-400">เพิ่มรูปภาพเพื่อให้ประกาศน่าสนใจมากขึ้น</p>
          </div>
        )}
        
        {/* Production Info */}
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <div className="flex-shrink-0">
              <svg className="w-4 h-4 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-sm text-green-800">
              <p className="font-medium">ระบบอัพโหลดพร้อมใช้งาน</p>
              <p className="mt-1">รูปภาพจะถูกอัพโหลดไปยัง Supabase Storage และสร้าง public URL อัตโนมัติ แต่ละบ้านจะมีโฟลเดอร์แยกต่างหาก</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Home className="w-6 h-6 mr-2 text-blue-600" />
          ฟอร์มขายบ้าน
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Step Indicator */}
      {renderStepIndicator()}

      <form onSubmit={handleSubmit}>
        {/* Step Content */}
        <div className="min-h-[500px]">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t mt-8">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              currentStep === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            ย้อนกลับ
          </button>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <Eye className="w-4 h-4 mr-2" />
              ดูตัวอย่าง
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                ถัดไป
              </button>
            ) : (
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, 'save')}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>บันทึก</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, 'publish')}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>โพสต์เลย</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </form>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">ตัวอย่างประกาศ</h3>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Preview Card */}
            <div className="bg-white border rounded-xl overflow-hidden shadow-lg">
              <div className="relative h-32">
                <img
                  src={formData.images[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop"}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                  ฿{formData.price || "0"}
                </div>
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  {formData.urgentSale && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                      ขายด่วน
                    </span>
                  )}
                  {formData.negotiable && (
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                      ต่อรองได้
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">
                  {formData.title || "ชื่อประกาศ"}
                </h4>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {formData.description || "คำอธิบาย"}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-2">
                  <div>📍 {formData.location || "ที่อยู่"}</div>
                  <div>🏠 {formData.bedrooms} ห้องนอน</div>
                  <div>🚿 {formData.bathrooms} ห้องน้ำ</div>
                  <div>🚗 {formData.parkingSpaces} ที่จอดรถ</div>
                </div>
                <div className="text-xs text-gray-500">
                  <div>📐 พื้นที่ใช้สอย: {formData.usableArea || "ไม่ระบุ"} ตร.ม.</div>
                  <div>🏞️ ขนาดที่ดิน: {formData.landArea || "ไม่ระบุ"} ตร.ว.</div>
                  <div>📞 ติดต่อ: {formData.sellerPhone || "ไม่ระบุ"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HouseSaleForm;