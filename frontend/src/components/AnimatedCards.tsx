"use client";

import React, { useState, useEffect } from "react";
import {
  Star,
  Heart,
  Eye,
  Calendar,
  Tag,
  MapPin,
  Home,
  Bath,
  Car,
  Trash2,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface PostData {
  text: string;
  image_urls: string[];
}

interface CardData {
  id: number;
  title: string;
  description: string;
  image: string;
  badges: string[];
  stats: {
    views: number;
    likes: number;
    rating: number;
  };
  date: string;
  category: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  floors: number;     // จำนวนชั้น
  parkingSpaces: number;
  usableArea: string; // พื้นที่ใช้สอย (ตร.ม.)
  landArea: string;   // ขนาดที่ดิน (ตร.ว.)
  fullText: string;
  imageUrls: string[];
}

interface AnimatedCardsProps {
  newCards?: CardData[];
}

// Function to parse property data from text
const parsePropertyData = (text: string, index: number): CardData => {
  // Extract price
  const priceMatch = text.match(/(\d+\.?\d*)\s*ล[บา]/);
  const price = priceMatch ? priceMatch[1] : "0";

  // Extract bedrooms
  const bedroomMatch = text.match(/(\d+)\s*ห้องนอน/);
  const bedrooms = bedroomMatch ? parseInt(bedroomMatch[1]) : 3;

  // Extract bathrooms
  const bathroomMatch = text.match(/(\d+)\s*ห้องน้ำ/);
  const bathrooms = bathroomMatch ? parseInt(bathroomMatch[1]) : 2;

  // Extract parking spaces
  const parkingMatch = text.match(/(\d+)\s*คัน|(\d+)\s*ที่จอด/);
  const parkingSpaces = parkingMatch ? parseInt(parkingMatch[1] || parkingMatch[2]) : 1;

  // Extract floors
  const floorsMatch = text.match(/(\d+)\s*ชั้น/);
  const floors = floorsMatch ? parseInt(floorsMatch[1]) : 2;

  // Extract usable area (ตร.ม.)
  const usableAreaMatch = text.match(/(\d+\.?\d*)\s*ตร\.?ม/);
  const usableArea = usableAreaMatch ? `${usableAreaMatch[1]} ตร.ม.` : "120 ตร.ม.";

  // Extract land area (ตร.ว.)
  const landAreaMatch = text.match(/(\d+\.?\d*)\s*ตร\.?ว/);
  const landArea = landAreaMatch ? `${landAreaMatch[1]} ตร.ว.` : "35 ตร.ว.";

  // Extract location/project name
  let location = "";
  let title = "";

  if (text.includes("นวลจันทร์")) {
    location = "นวลจันทร์";
    title = "ทาวน์โฮม 2 ชั้น ทำเลนวลจันทร์";
  } else if (text.includes("ปิ่นเกล้า")) {
    location = "ปิ่นเกล้า-จรัญ";
    title = "ทาวน์โฮมหลังริม ปิ่นเกล้า-จรัญ";
  } else if (text.includes("ลำลูกกา")) {
    location = "ลำลูกกา ปทุมธานี";
    title = "ทาวน์เฮ้าส์ พฤกษา 17 ลำลูกกา";
  } else {
    location = "กรุงเทพฯ";
    title = "บ้านคุณภาพ ทำเลดี";
  }

  // Create description
  const description = text.split("\n")[0].substring(0, 150) + "...";

  // Determine badges based on content
  const badges = [];
  if (text.includes("ขายด่วน")) badges.push("ขายด่วน");
  if (text.includes("รีโนเวท")) badges.push("รีโนเวทใหม่");
  if (text.includes("พร้อมอยู่")) badges.push("พร้อมอยู่");
  if (text.includes("ฟรี")) badges.push("โปรโมชั่น");
  if (text.includes("ใกล้รถไฟฟ้า")) badges.push("ใกล้รถไฟฟ้า");
  if (badges.length === 0) badges.push("คุณภาพ");

  // Generate consistent stats based on index
  const views = 500 + ((index * 123) % 3000);
  const likes = 50 + ((index * 67) % 200);
  const rating = (4.0 + ((index * 0.1) % 1.0)).toFixed(1);

  return {
    id: index + 1,
    title,
    description,
    image: "", // Will be set from image_urls
    badges,
    stats: {
      views,
      likes,
      rating: parseFloat(rating),
    },
    date: new Date(Date.now() - index * 2 * 24 * 60 * 60 * 1000).toISOString(),
    category: "ทาวน์โฮม",
    price: price + "00,000",
    location,
    bedrooms,
    bathrooms,
    floors,
    parkingSpaces,
    usableArea,
    landArea,
    fullText: text,
    imageUrls: [],
  };
};

// Load posts data
const loadPostsData = async (): Promise<CardData[]> => {
  try {
    const response = await fetch("/posts.json");
    const posts: PostData[] = await response.json();

    return posts.map((post, index) => {
      const cardData = parsePropertyData(post.text, index);
      return {
        ...cardData,
        image:
          post.image_urls[0] ||
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
        imageUrls: post.image_urls,
      };
    });
  } catch (error) {
    console.error("Error loading posts data:", error);
    return mockCardsData;
  }
};

const mockCardsData: CardData[] = [
  {
    id: 1,
    title: "บ้านเดี่ยวโมเดิร์น 2 ชั้น",
    description:
      "บ้านสไตล์โมเดิร์นมินิมอล ตกแต่งพร้อมอยู่ ใกล้ห้างสรรพสินค้า โรงเรียน และโรงพยาบาล เดินทางสะดวก",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&crop=entropy&auto=format",
    badges: ["ยอดนิยม", "แนะนำ"],
    stats: { views: 2547, likes: 189, rating: 4.8 },
    date: "2024-01-15",
    category: "บ้านเดี่ยว",
    price: "4,500,000",
    location: "บางนา-ตราด กม.15",
    bedrooms: 3,
    bathrooms: 2,
    floors: 2,
    parkingSpaces: 2,
    usableArea: "180 ตร.ม.",
    landArea: "50 ตร.ว.",
    fullText:
      "บ้านเดี่ยวโมเดิร์น 2 ชั้น สไตล์มินิมอล\n\n🏠 รายละเอียดบ้าน\n🌿 3 ห้องนอน 2 ห้องน้ำ\n🌿 พื้นที่ใช้สอย 180 ตร.ม.\n🌿 ที่จอดรถ 2 คัน\n🌿 ตกแต่งพร้อมอยู่\n\n✅ ทำเลดี ใกล้สิ่งอำนวยความสะดวก\n✅ ใกล้ห้างสรรพสินค้า โรงเรียน โรงพยาบาล\n✅ เดินทางสะดวก เข้า-ออกหลายเส้นทาง",
    imageUrls: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&crop=entropy&auto=format",
    ],
  },
  {
    id: 2,
    title: "วิลล่าหรู พร้อมสระว่ายน้ำ",
    description:
      "วิลล่าสุดหรู ดีไซน์ร่วมสมัย พร้อมสระว่ายน้ำส่วนตัว สวนสวย และที่จอดรถ 3 คัน ในย่านเอกมัย",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop&crop=entropy&auto=format",
    badges: ["ใหม่", "หรู"],
    stats: { views: 1832, likes: 145, rating: 4.6 },
    date: "2024-01-12",
    category: "วิลล่า",
    price: "12,800,000",
    location: "เอกมัย-รามอินทรา",
    bedrooms: 4,
    bathrooms: 3,
    floors: 3,
    parkingSpaces: 3,
    usableArea: "350 ตร.ม.",
    landArea: "120 ตร.ว.",
    fullText:
      "🏡 วิลล่าหรู พร้อมสระว่ายน้ำ\n\n💎 คุณสมบัติพิเศษ\n🌿 4 ห้องนอน 3 ห้องน้ำ\n🌿 สระว่ายน้ำส่วนตัว\n🌿 สวนสวยจัดแต่ง\n🌿 ที่จอดรถ 3 คัน\n🌿 พื้นที่ 350 ตร.ม.\n\n✅ ย่านเอกมัย-รามอินทรา\n✅ ดีไซน์ร่วมสมัย\n✅ ความเป็นส่วนตัวสูง",
    imageUrls: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop&crop=entropy&auto=format",
    ],
  },
  {
    id: 3,
    title: "บ้านครอบครัว ย่านเงียบสงบ",
    description:
      "บ้านเดี่ยวในโครงการ ย่านเงียบสงบ เหมาะสำหรับครอบครัว มีสวนหน้าบ้าน ที่จอดรถ 2 คัน",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop&crop=entropy&auto=format",
    badges: ["เงียบสงบ", "ครอบครัว"],
    stats: { views: 3156, likes: 234, rating: 4.9 },
    date: "2024-01-10",
    category: "บ้านเดี่ยว",
    price: "2,900,000",
    location: "ลาดกระบัง",
    bedrooms: 3,
    bathrooms: 2,
    floors: 2,
    parkingSpaces: 2,
    usableArea: "120 ตร.ม.",
    landArea: "35 ตร.ว.",
    fullText:
      "🏠 บ้านครอบครัว ย่านเงียบสงบ\n\n🌿 รายละเอียดบ้าน\n🌿 3 ห้องนอน 2 ห้องน้ำ\n🌿 สวนหน้าบ้าน\n🌿 ที่จอดรถ 2 คัน\n🌿 พื้นที่ 120 ตร.ม.\n\n✅ ย่านเงียบสงบ เหมาะสำหรับครอบครัว\n✅ ใกล้โรงเรียน ตลาด\n✅ ชุมชนน่าอยู่ ปลอดภัย",
    imageUrls: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop&crop=entropy&auto=format",
    ],
  },
];

const AnimatedCards: React.FC<AnimatedCardsProps> = ({ newCards = [] }) => {
  const { isAdmin, user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cards, setCards] = useState<CardData[]>(mockCardsData);
  const [loading, setLoading] = useState(true);
  const [deletingCardId, setDeletingCardId] = useState<string | number | null>(null);

  // Format price function
  const formatPrice = (price: string) => {
    // Remove any existing currency symbols and commas
    const cleanPrice = price.replace(/[฿,]/g, '');
    // Add commas for thousands separator
    const formattedPrice = parseFloat(cleanPrice).toLocaleString();
    return `฿${formattedPrice}`;
  };
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const cardsPerPage = 3;
  const totalPages = Math.ceil(cards.length / cardsPerPage);

  // Load posts data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // โหลดข้อมูลจาก API
        const postsData = await loadPostsData();
        
        // โหลดข้อมูลจาก localStorage (บ้านที่ผู้ใช้เพิ่มเอง)
        const userCards = JSON.parse(localStorage.getItem('userHouseCards') || '[]');
        
        // รวมข้อมูลทั้งหมด (ข้อมูลผู้ใช้ไว้ด้านบน)
        const allCards = [...userCards, ...postsData];
        setCards(allCards);
      } catch (error) {
        console.error("Failed to load data:", error);
        
        // ถ้าโหลด API ไม่ได้ ให้ใช้ข้อมูลผู้ใช้ + mock data
        const userCards = JSON.parse(localStorage.getItem('userHouseCards') || '[]');
        setCards([...userCards, ...mockCardsData]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Update cards when newCards prop changes
  useEffect(() => {
    if (newCards && newCards.length > 0) {
      setCards((prevCards) => [
        ...newCards,
        ...prevCards.filter(
          (card) => !newCards.find((nc) => nc.id === card.id)
        ),
      ]);
    }
  }, [newCards]);

  // ฟังก์ชันสำหรับ refresh cards จาก localStorage
  const refreshCards = async () => {
    try {
      const postsData = await loadPostsData();
      const userCards = JSON.parse(localStorage.getItem('userHouseCards') || '[]');
      const allCards = [...userCards, ...postsData];
      setCards(allCards);
    } catch (error) {
      const userCards = JSON.parse(localStorage.getItem('userHouseCards') || '[]');
      setCards([...userCards, ...mockCardsData]);
    }
  };

  // Listen for storage changes (เมื่อมีการเพิ่มบ้านใหม่)
  useEffect(() => {
    const handleStorageChange = () => {
      refreshCards();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event สำหรับการอัพเดทจากหน้าเดียวกัน
    window.addEventListener('houseSaleAdded', handleStorageChange);
    window.addEventListener('houseSaleDeleted', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('houseSaleAdded', handleStorageChange);
      window.removeEventListener('houseSaleDeleted', handleStorageChange);
    };
  }, []);

  const getCurrentPageCards = (): CardData[] => {
    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    return cards.slice(startIndex, endIndex);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      const element = document.getElementById("cards-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const goToPrevious = () => {
    goToPage(currentPage - 1);
  };

  const goToNext = () => {
    goToPage(currentPage + 1);
  };

  const openModal = (card: CardData) => {
    console.log("openModal called with:", card.title);
    setSelectedCard(card);
    setCurrentImageIndex(0);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";

    if (typeof window !== "undefined") {
      window.history.pushState(
        { modalOpen: true, cardId: card.id },
        "",
        `#card-${card.id}`
      );
    }
  };

  const closeModal = (fromHistory = false) => {
    setIsModalOpen(false);
    setSelectedCard(null);
    setCurrentImageIndex(0);
    document.body.style.overflow = "unset";

    if (
      !fromHistory &&
      typeof window !== "undefined" &&
      window.location.hash.startsWith("#card-")
    ) {
      window.history.back();
    }
  };

  const handleDeleteCard = async (cardId: string | number, event: React.MouseEvent) => {
    event.stopPropagation(); // ป้องกันการเปิด modal
    
    console.log('Delete button clicked, user:', user, 'isAdmin:', isAdmin(), 'role:', user?.role);
    
    // Allow any authenticated user to delete cards for now (temporary fix)
    if (!user) {
      alert('กรุณาเข้าสู่ระบบก่อนลบประกาศ');
      return;
    }

    const confirmDelete = confirm('คุณแน่ใจหรือไม่ที่จะลบประกาศนี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้');
    
    if (!confirmDelete) return;

    setDeletingCardId(cardId);

    try {
      // ลบจาก localStorage ก่อน (สำหรับ user cards)
      const userCards = JSON.parse(localStorage.getItem('userHouseCards') || '[]');
      const updatedUserCards = userCards.filter((card: any) => card.id !== cardId);
      localStorage.setItem('userHouseCards', JSON.stringify(updatedUserCards));

      // ลบจาก state
      setCards(prevCards => prevCards.filter(card => card.id !== cardId));

      // ถ้าเป็น card จาก backend ให้เรียก API ลบ
      if (typeof cardId === 'string' && cardId.length > 10) {
        try {
          const { houseSalesAPI } = await import('@/lib/api/house-sales');
          await houseSalesAPI.deleteHouseSale(cardId);
          console.log('✅ Card deleted from backend successfully');
        } catch (apiError) {
          console.warn('⚠️ Failed to delete from backend (card removed from UI):', apiError);
        }
      }

      // Trigger event เพื่อให้ components อื่นอัพเดท
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('houseSaleDeleted'));
      }

      alert('ลบประกาศสำเร็จ');
    } catch (error) {
      console.error('Error deleting card:', error);
      alert('เกิดข้อผิดพลาดในการลบประกาศ');
    } finally {
      setDeletingCardId(null);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const currentCards = getCurrentPageCards();

  if (loading) {
    return null;
  }

  return (
    <div id="cards-section" className="py-12 sm:py-16 lg:py-24">
      <div
        className="max-w-none mx-auto px-4 sm:px-6 lg:px-8"
        style={{ maxWidth: "1400px" }}
      >
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            บ้านแนะนำ
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            คัดสรรบ้านคุณภาพ ทำเลดี ราคาเหมาะสม รวมถึงประกาศใหม่จากผู้ใช้ พร้อมให้คุณเลือกชม
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <span>
              หน้า {currentPage} จาก {totalPages}
            </span>
            <span>•</span>
            <span>รวม {cards.length} หลัง</span>
            {/* Debug info for admin */}
            {user && (
              <>
                <span>•</span>
                <span>User: {user.name || user.email} ({user.role})</span>
                {(user?.role === 'ADMIN' || isAdmin()) && (
                  <span className="text-red-500">🗑️ Admin Mode</span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Cards Grid - 3 cards per row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {currentCards.map((card, index) => (
            <div
              key={card.id}
              className="group relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 flex flex-col h-full"
            >
              {/* Image Section */}
              <div className="relative h-40 xs:h-44 sm:h-48 md:h-52 lg:h-48 xl:h-52 overflow-hidden">
                <img
                  src={card.imageUrls && card.imageUrls.length > 0 ? card.imageUrls[0] : card.image}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop";
                  }}
                />

                {/* Delete Button - Show for all authenticated users */}
                {user && (
                  <button
                    onClick={(e) => handleDeleteCard(card.id, e)}
                    disabled={deletingCardId === card.id}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed z-10"
                    title="ลบประกาศ"
                  >
                    {deletingCardId === card.id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                )}

                {/* Price Badge */}
                <div className="absolute top-3 left-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-2 py-1 rounded-lg font-bold text-sm shadow-lg">
                  {formatPrice(card.price)}
                </div>

                {/* Badges */}
                <div className="absolute top-3 right-3 flex flex-col gap-1">
                  {card.badges.slice(0, 2).map((badge, badgeIndex) => (
                    <span
                      key={badgeIndex}
                      className="bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white px-2 py-1 rounded-md text-xs font-medium shadow-sm"
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content Section */}
              <div className="p-4 sm:p-5 lg:p-6 flex flex-col flex-grow">
                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {card.description}
                </p>

                {/* Property Details */}
                <div className="space-y-2 mb-4">
                  {/* Location */}
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-red-500" />
                    <span className="truncate">{card.location}</span>
                  </div>
                  
                  {/* Room Details */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Home className="w-4 h-4 mr-2 text-blue-500" />
                      <span>{card.bedrooms} ห้องนอน</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Bath className="w-4 h-4 mr-2 text-cyan-500" />
                      <span>{card.bathrooms} ห้องน้ำ</span>
                    </div>
                  </div>
                  
                  {/* Parking */}
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                    <Car className="w-4 h-4 mr-2 text-green-500" />
                    <span>{card.parkingSpaces || 0} ที่จอดรถ</span>
                  </div>
                  
                  {/* Area Info */}
                  <div className="grid grid-cols-2 gap-3 text-sm pt-2 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <div className="w-4 h-4 mr-2 flex items-center justify-center">
                        <span className="text-purple-500">📐</span>
                      </div>
                      <span className="text-xs">พื้นที่ใช้สอย: {card.usableArea}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <div className="w-4 h-4 mr-2 flex items-center justify-center">
                        <span className="text-indigo-500">🏢</span>
                      </div>
                      <span className="text-xs">จำนวนชั้น: {card.floors || 1} ชั้น</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <div className="w-4 h-4 mr-2 flex items-center justify-center">
                        <span className="text-orange-500">🏞️</span>
                      </div>
                      <span className="text-xs">ที่ดิน: {card.landArea}</span>
                    </div>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center justify-between mb-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{formatDate(card.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <Tag className="w-3 h-3 mr-1" />
                    <span>{card.category}</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="relative z-10 mt-auto">
                  <button
                    onClick={() => {
                      console.log("Button clicked for:", card.title);
                      openModal(card);
                    }}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium cursor-pointer transition-colors duration-300"
                    type="button"
                  >
                    ดูรายละเอียด
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="mt-8 sm:mt-10 lg:mt-12">
          <div className="flex items-center justify-center space-x-2">
            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              disabled={currentPage === 1}
              className={`group relative flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                currentPage === 1
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 hover:text-white shadow-lg hover:shadow-xl hover:scale-105"
              }`}
            >
              <span>‹</span>
              <span className="hidden sm:inline ml-1">ก่อนหน้า</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1 mx-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`relative w-10 h-10 rounded-xl font-medium transition-all duration-300 ${
                      currentPage === page
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg transform scale-110"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105"
                    }`}
                  >
                    {page}
                    {currentPage === page && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/30 to-blue-500/30"></div>
                    )}
                  </button>
                )
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={goToNext}
              disabled={currentPage === totalPages}
              className={`group relative flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                currentPage === totalPages
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 hover:text-white shadow-lg hover:shadow-xl hover:scale-105"
              }`}
            >
              <span className="hidden sm:inline mr-1">ถัดไป</span>
              <span>›</span>
            </button>
          </div>

          {/* Page Info */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              แสดง{" "}
              <span className="font-medium text-cyan-600 dark:text-cyan-400">
                {(currentPage - 1) * cardsPerPage + 1}
              </span>{" "}
              ถึง{" "}
              <span className="font-medium text-cyan-600 dark:text-cyan-400">
                {Math.min(currentPage * cardsPerPage, cards.length)}
              </span>{" "}
              จาก{" "}
              <span className="font-medium text-cyan-600 dark:text-cyan-400">
                {cards.length}
              </span>{" "}
              หลัง
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedCard && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4"
          style={{ zIndex: 9999 }}
          onClick={() => closeModal()}
        >
          <div
            className="bg-white rounded-xl max-w-7xl w-full h-[95vh] sm:h-[90vh] animate-bounce-in overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => closeModal()}
              className="absolute top-4 right-4 z-10 text-white bg-black/50 hover:bg-black/70 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full transition-colors"
            >
              ×
            </button>

            {/* Admin Delete Button in Modal */}
            {user && selectedCard && (
              <button
                onClick={(e) => {
                  closeModal();
                  handleDeleteCard(selectedCard.id, e);
                }}
                disabled={deletingCardId === selectedCard.id}
                className="absolute top-4 right-16 z-10 text-white bg-red-500/80 hover:bg-red-600/90 w-8 h-8 flex items-center justify-center rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="ลบประกาศ"
              >
                {deletingCardId === selectedCard.id ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            )}

            {/* 2 Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full">
              {/* Left Column - Image Gallery */}
              <div className="relative h-[40vh] lg:h-full overflow-hidden">
                {/* Image Slider */}
                <div
                  className="flex transition-transform duration-300 ease-out h-full"
                  style={{
                    transform: `translateX(-${currentImageIndex * 100}%)`,
                  }}
                >
                  {/* Display actual uploaded images */}
                  {(selectedCard.imageUrls && selectedCard.imageUrls.length > 0 
                    ? selectedCard.imageUrls 
                    : [selectedCard.image]
                  ).map((imageUrl, index) => (
                    <div
                      key={index}
                      className="w-full h-full flex-shrink-0 relative"
                    >
                      <img
                        src={imageUrl}
                        alt={`${selectedCard.title} - รูปที่ ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to default image if URL fails
                          e.currentTarget.src = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop";
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Price Overlay */}
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-lg z-10">
                  {formatPrice(selectedCard.price)}
                </div>

                {/* Image Counter */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm z-10">
                  {currentImageIndex + 1} / {selectedCard.imageUrls?.length || 1}
                </div>

                {/* Navigation Arrows - Desktop */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const totalImages = (selectedCard.imageUrls && selectedCard.imageUrls.length > 0) 
                      ? selectedCard.imageUrls.length 
                      : 1;
                    setCurrentImageIndex((prev) =>
                      prev === 0 ? totalImages - 1 : prev - 1
                    );
                  }}
                  className="hidden lg:flex absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-3 transition-all duration-200 hover:scale-110 z-10"
                >
                  <span className="text-xl font-bold">‹</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const totalImages = (selectedCard.imageUrls && selectedCard.imageUrls.length > 0) 
                      ? selectedCard.imageUrls.length 
                      : 1;
                    setCurrentImageIndex((prev) =>
                      prev === totalImages - 1 ? 0 : prev + 1
                    );
                  }}
                  className="hidden lg:flex absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-3 transition-all duration-200 hover:scale-110 z-10"
                >
                  <span className="text-xl font-bold">›</span>
                </button>

                {/* Touch/Swipe Area for Mobile */}
                <div
                  className="absolute inset-0 lg:hidden z-5"
                  onTouchStart={(e) => {
                    const touch = e.touches[0];
                    setTouchStart(touch.clientX);
                  }}
                  onTouchMove={(e) => {
                    if (!touchStart) return;
                    const touch = e.touches[0];
                    setTouchEnd(touch.clientX);
                  }}
                  onTouchEnd={() => {
                    if (!touchStart || !touchEnd) return;
                    const distance = touchStart - touchEnd;
                    const isLeftSwipe = distance > 50;
                    const isRightSwipe = distance < -50;

                    const totalImages = (selectedCard.imageUrls && selectedCard.imageUrls.length > 0) 
                      ? selectedCard.imageUrls.length 
                      : 1;
                    
                    if (isLeftSwipe) {
                      setCurrentImageIndex((prev) =>
                        prev === totalImages - 1 ? 0 : prev + 1
                      );
                    }
                    if (isRightSwipe) {
                      setCurrentImageIndex((prev) =>
                        prev === 0 ? totalImages - 1 : prev - 1
                      );
                    }
                    setTouchStart(null);
                    setTouchEnd(null);
                  }}
                />

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 z-10">
                  <h2 className="text-white text-xl lg:text-2xl font-bold mb-2">
                    {selectedCard.title}
                  </h2>
                  <div className="text-white/90 text-sm lg:text-base">
                    📍 {selectedCard.location}
                  </div>
                </div>

                {/* Dots Indicator */}
                <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black/40 backdrop-blur-sm rounded-full px-4 py-2 z-10 max-w-[90%] overflow-x-auto">
                  {(selectedCard.imageUrls && selectedCard.imageUrls.length > 0 
                    ? selectedCard.imageUrls 
                    : [selectedCard.image]
                  ).map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      className={`w-2 h-2 rounded-full transition-all duration-200 flex-shrink-0 ${
                        index === currentImageIndex
                          ? "bg-white scale-125"
                          : "bg-white/50 hover:bg-white/75"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="p-4 sm:p-6 lg:p-8 flex flex-col justify-between bg-gray-50 overflow-y-auto">
                {/* Property Details Table */}
                <div className="space-y-0 mb-6">
                  <div className="flex justify-between items-center py-3 sm:py-4 border-b border-gray-200">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-3 text-red-500" />
                      <span className="text-gray-600 font-medium text-base sm:text-lg lg:text-xl">
                        ที่อยู่
                      </span>
                    </div>
                    <span className="text-gray-900 font-semibold text-base sm:text-lg lg:text-xl text-right">
                      {selectedCard.location}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 sm:py-4 border-b border-gray-200">
                    <div className="flex items-center">
                      <Home className="w-5 h-5 mr-3 text-blue-500" />
                      <span className="text-gray-600 font-medium text-base sm:text-lg lg:text-xl">
                        ห้องนอน
                      </span>
                    </div>
                    <span className="text-gray-900 font-semibold text-base sm:text-lg lg:text-xl">
                      {selectedCard.bedrooms} ห้อง
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 sm:py-4 border-b border-gray-200">
                    <div className="flex items-center">
                      <Bath className="w-5 h-5 mr-3 text-cyan-500" />
                      <span className="text-gray-600 font-medium text-base sm:text-lg lg:text-xl">
                        ห้องน้ำ
                      </span>
                    </div>
                    <span className="text-gray-900 font-semibold text-base sm:text-lg lg:text-xl">
                      {selectedCard.bathrooms} ห้อง
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 sm:py-4 border-b border-gray-200">
                    <div className="flex items-center">
                      <span className="text-indigo-500 text-xl mr-3">🏢</span>
                      <span className="text-gray-600 font-medium text-base sm:text-lg lg:text-xl">
                        จำนวนชั้น
                      </span>
                    </div>
                    <span className="text-gray-900 font-semibold text-base sm:text-lg lg:text-xl">
                      {selectedCard.floors || 1} ชั้น
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 sm:py-4 border-b border-gray-200">
                    <div className="flex items-center">
                      <Car className="w-5 h-5 mr-3 text-green-500" />
                      <span className="text-gray-600 font-medium text-base sm:text-lg lg:text-xl">
                        ที่จอดรถ
                      </span>
                    </div>
                    <span className="text-gray-900 font-semibold text-base sm:text-lg lg:text-xl">
                      {selectedCard.parkingSpaces || 0} คัน
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 sm:py-4 border-b border-gray-200">
                    <span className="text-gray-600 font-medium text-base sm:text-lg lg:text-xl">
                      พื้นที่
                    </span>
                    <span className="text-gray-900 font-semibold text-base sm:text-lg lg:text-xl">
                      {selectedCard.area}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 sm:py-4 border-b border-gray-200">
                    <div className="flex items-center">
                      <span className="text-purple-500 text-xl mr-3">📐</span>
                      <span className="text-gray-600 font-medium text-base sm:text-lg lg:text-xl">
                        พื้นที่ใช้สอย
                      </span>
                    </div>
                    <span className="text-gray-900 font-semibold text-base sm:text-lg lg:text-xl">
                      {selectedCard.usableArea}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 sm:py-4 border-b border-gray-200">
                    <div className="flex items-center">
                      <span className="text-orange-500 text-xl mr-3">🏞️</span>
                      <span className="text-gray-600 font-medium text-base sm:text-lg lg:text-xl">
                        ขนาดที่ดิน
                      </span>
                    </div>
                    <span className="text-gray-900 font-semibold text-base sm:text-lg lg:text-xl">
                      {selectedCard.landArea}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 sm:py-4">
                    <span className="text-gray-600 font-medium text-base sm:text-lg lg:text-xl">
                      วันที่ลงประกาศ
                    </span>
                    <span className="text-gray-900 font-semibold text-base sm:text-lg lg:text-xl">
                      {formatDate(selectedCard.date)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 sm:py-4 px-6 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base">
                    📞 ติดต่อเจ้าของ
                  </button>
                  <button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-3 sm:py-4 px-6 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base">
                    🏠 นัดชมบ้าน
                  </button>
                  <button className="sm:w-auto w-full p-3 sm:p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-300 flex items-center justify-center">
                    <span className="text-gray-600 text-xl sm:text-2xl">♡</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Animation Keyframes */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }

        .animate-shimmer {
          background: linear-gradient(
            90deg,
            #f0f0f0 25%,
            #e0e0e0 50%,
            #f0f0f0 75%
          );
          background-size: 200px 100%;
          animation: none;
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(-50px);
          }
          50% {
            opacity: 1;
            transform: scale(1.05) translateY(0);
          }
          70% {
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-bounce-in {
          animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          opacity: 1 !important;
          transform: scale(1) !important;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default AnimatedCards;
