"use client";

import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  User,
  Send,
  CheckCircle,
  Star,
  Award,
  Home,
  Calendar,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";

// หน้า Contact ที่ไม่ต้องการ authentication

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    propertyType: "",
    budget: "",
    message: "",
    contactMethod: "phone",
    lineId: "",
    preferredPhone: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.phone) {
      alert("กรุณากรอกชื่อและเบอร์โทรศัพท์");
      return;
    }

    // Save to localStorage
    const contactData = {
      id: Date.now().toString(),
      ...formData,
      timestamp: new Date().toISOString(),
      status: "new", // new, contacted, closed
    };

    const existingContacts = JSON.parse(
      localStorage.getItem("customerContacts") || "[]"
    );
    const updatedContacts = [contactData, ...existingContacts];
    localStorage.setItem("customerContacts", JSON.stringify(updatedContacts));

    // Trigger event for dashboard to update
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("customerContactAdded"));
    }

    // Show success message
    setIsSubmitted(true);

    // Scroll to top to show success dialog
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Reset form
    setFormData({
      name: "",
      phone: "",
      email: "",
      propertyType: "",
      budget: "",
      message: "",
      contactMethod: "phone",
      lineId: "",
      preferredPhone: "",
    });

    setTimeout(() => setIsSubmitted(false), 40000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ส่งข้อความสำเร็จ!
          </h2>
          <p className="text-gray-600 mb-6">จะตอบกลับโดยเร็วที่สุด</p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            ตกลง
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="mb-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              นายหน้าอสังหาริมทรัพย์มืออาชีพ
            </h1>
            <p className="text-xl text-green-100 mb-2">คุณสมชาย ใจดี</p>
            <p className="text-lg text-blue-100">
              ประสบการณ์ 15+ ปี | ขายสำเร็จ 500+ หลัง
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Award className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">15+</div>
              <div className="text-sm">ปีประสบการณ์</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Home className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm">หลังที่ขายสำเร็จ</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Star className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">4.9</div>
              <div className="text-sm">คะแนนรีวิว</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <MessageCircle className="w-6 h-6 mr-2 text-green-600" />
              ติดต่อเราได้เลย
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ชื่อ-นามสกุล *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="เช่น นายสมศักดิ์ ดีใจ"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    เบอร์โทรศัพท์ *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="081-234-5678"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  อีเมล
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="example@email.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ประเภทที่สนใจ
                  </label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">เลือกประเภท</option>
                    <option value="บ้านเดี่ยว">บ้านเดี่ยว</option>
                    <option value="ทาวน์โฮม">ทาวน์โฮม</option>
                    <option value="คอนโด">คอนโด</option>
                    <option value="ที่ดิน">ที่ดิน</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    งบประมาณ
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">เลือกงบประมาณ</option>
                    <option value="ต่ำกว่า 2 ล้าน">ต่ำกว่า 2 ล้าน</option>
                    <option value="2-5 ล้าน">2-5 ล้าน</option>
                    <option value="5-10 ล้าน">5-10 ล้าน</option>
                    <option value="มากกว่า 10 ล้าน">มากกว่า 10 ล้าน</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ข้อความ
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="บอกเราเกี่ยวกับความต้องการของคุณ..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  ช่องทางติดต่อที่สะดวก
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="contactMethod"
                      value="phone"
                      checked={formData.contactMethod === "phone"}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">โทรศัพท์</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="contactMethod"
                      value="line"
                      checked={formData.contactMethod === "line"}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Line</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="contactMethod"
                      value="email"
                      checked={formData.contactMethod === "email"}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">อีเมล</span>
                  </label>
                </div>
              </div>

              {/* Additional Contact Info Based on Selected Method */}
              {formData.contactMethod === "phone" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    เบอร์โทรศัพท์ที่สะดวกรับสาย
                  </label>
                  <input
                    type="tel"
                    name="preferredPhone"
                    value={formData.preferredPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="เช่น 081-234-5678 (ถ้าต่างจากเบอร์ด้านบน)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    หากต่างจากเบอร์โทรด้านบน กรุณาระบุเบอร์ที่สะดวกรับสาย
                  </p>
                </div>
              )}

              {formData.contactMethod === "line" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Line ID *
                  </label>
                  <input
                    type="text"
                    name="lineId"
                    value={formData.lineId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="เช่น @bestdutsanee หรือ line123456"
                    required={formData.contactMethod === "line"}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    กรุณาใส่ Line ID ที่ถูกต้อง เพื่อให้เราติดต่อกลับได้
                  </p>
                </div>
              )}

              {formData.contactMethod === "email" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-blue-800 mb-2">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm font-medium">ติดต่อผ่านอีเมล</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    เราจะตอบกลับไปที่อีเมล:{" "}
                    <span className="font-medium">
                      {formData.email || "กรุณากรอกอีเมลด้านบน"}
                    </span>
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    โดยปกติจะตอบกลับภายใน 2 ชั่วโมง
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-6 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <Send className="w-5 h-5" />
                <span>ส่งข้อความ</span>
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            {/* Direct Contact */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                ติดต่อโดยตรง
              </h3>

              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">โทรศัพท์</div>
                    <div className="text-green-600 font-semibold">
                      082-954-4509
                    </div>
                    <div className="text-sm text-gray-500">
                      24/7 พร้อมให้คำปรึกษา
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Line ID</div>
                    <div className="text-blue-600 font-semibold">
                      @bestdutsanee
                    </div>
                    <div className="text-sm text-gray-500">
                      ตอบกลับเร็ว ภายใน 5 นาที
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">อีเมล</div>
                    <div className="text-purple-600 font-semibold">
                      best@realestate.com
                    </div>
                    <div className="text-sm text-gray-500">
                      ตอบกลับภายใน 2 ชั่วโมง
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Office Hours */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                เวลาทำการ
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">จันทร์ - ศุกร์</span>
                  <span className="font-medium text-gray-900">
                    08:00 - 20:00
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">เสาร์ - อาทิตย์</span>
                  <span className="font-medium text-gray-900">
                    09:00 - 18:00
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">วันหยุดนักขัตฤกษ์</span>
                  <span className="font-medium text-red-600">ปิด</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-2 text-yellow-800">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">นัดหมายล่วงหน้า</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  สำหรับการดูบ้านนอกเวลาทำการ กรุณานัดหมายล่วงหน้า 1 วัน
                </p>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                ติดตามเรา
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <a
                  href="#"
                  className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Facebook className="w-8 h-8 text-blue-600 mb-2" />
                  <span className="text-sm text-gray-700">Facebook</span>
                </a>
                <a
                  href="#"
                  className="flex flex-col items-center p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
                >
                  <Instagram className="w-8 h-8 text-pink-600 mb-2" />
                  <span className="text-sm text-gray-700">Instagram</span>
                </a>
                <a
                  href="#"
                  className="flex flex-col items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Youtube className="w-8 h-8 text-red-600 mb-2" />
                  <span className="text-sm text-gray-700">YouTube</span>
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-red-600" />
                ที่ตั้งสำนักงาน
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="font-medium text-gray-900">สำนักงานใหญ่</div>
                  <div className="text-gray-600">
                    123/45 ถนนสุขุมวิท แขวงคลองตัน เขตคลองเตย กรุงเทพฯ 10110
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">การเดินทาง</div>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• BTS อโศก ทางออก 3 (เดิน 5 นาที)</li>
                    <li>• MRT สุขุมวิท ทางออก 1 (เดิน 7 นาที)</li>
                    <li>• มีที่จอดรถฟรี 2 ชั่วโมงแรก</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
