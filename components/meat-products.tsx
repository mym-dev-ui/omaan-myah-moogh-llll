"use client"

import { useState, useMemo } from "react"
import { HeroSection } from "./hero-section"
import { StatsSection } from "./stats-section"
import { CategoryFilter } from "./category-filter"
import { ProductCard } from "./product-card"


interface Product {
  id: number
  name: string
  nameEn: string
  price: number
  originalPrice?: number
  image: string
  description: string
  detailedDescription: string
  rating: number
  reviews: number
  badge?: string
  weight: string
  category: string
  inStock: number
  features: string[]
  nutritionFacts?: {
    protein: string
    fat: string
    calories: string
    cholesterol: string
  }
}

const products: Product[] = [
  {
    id: 4,
    name: "خروف نعيمي ",
    nameEn: "Whole Fresh Chicken 1.5kg",
    price: 8.5,
    originalPrice: 9.5,
    image: "https://media.zid.store/7d318a1a-b078-4c18-82ef-2b9ada64be2f/fad3ff53-ca94-482d-b189-294d4ee7427c.jpeg",
    description: "خروف نعيمي عالي الجودة",
    detailedDescription: "خروف نعيمي من المزارع المحلية، مربى بطريقة طبيعية وصحية.",
    rating: 4.9,
    reviews: 1156,
    badge: "طازج يومياً",
    weight: "14.5 كيلو",
    category: "خروف",
    inStock: 150,
    features: ["طازج يومياً", "مربى طبيعياً", "خالي من الهرمونات", "جودة ممتازة"],
    nutritionFacts: { protein: "31g", fat: "14.6g", calories: "165", cholesterol: "85mg" }
  },
  {
    id: 1,
    name: "عرض خاص - لحم بقري مفروم 5 كيلو + هدية مجانية",
    nameEn: "Special Offer - Ground Beef 5kg + Free Gift",
    price: 45.0,
    originalPrice: 55.0,
    image: "https://cdn.salla.sa/PdwVXO/286c77d2-67f2-439c-9180-0ae70cce3d6c-500x500-cDbCXuMcg2EBf4YfgeXOzhLKqGB3mT8paBQHhCZ8.png",
    description: "عرض خاص - لحم بقري مفروم طازج 5 كيلو مع هدية مجانية",
    detailedDescription: "لحم بقري مفروم طازج عالي الجودة، مثالي لتحضير الكفتة والبرغر والأطباق المختلفة.",
    rating: 4.8,
    reviews: 856,
    badge: "عرض خاص",
    weight: "5 كيلو",
    category: "لحم بقري",
    inStock: 50,
    features: ["طازج يومياً", "خالي من الهرمونات", "معتمد صحياً", "تغليف محكم"],
    nutritionFacts: { protein: "26g", fat: "15g", calories: "250", cholesterol: "78mg" },
  },
  {
    id: 2,
    name: "لحم بقري مفروم طازج 500 جرام",
    nameEn: "Fresh Ground Beef 500g",
    price: 6.5,
    originalPrice: 7.0,
    image: "https://cdn.salla.sa/PdwVXO/286c77d2-67f2-439c-9180-0ae70cce3d6c-500x500-cDbCXuMcg2EBf4YfgeXOzhLKqGB3mT8paBQHhCZ8.png",
    description: "لحم بقري مفروم طازج عالي الجودة",
    detailedDescription: "لحم بقري مفروم طازج من أجود أنواع اللحوم، مثالي لتحضير الوجبات اليومية.",
    rating: 4.9,
    reviews: 1243,
    badge: "الأكثر شعبية",
    weight: "500 جرام",
    category: "لحم بقري",
    inStock: 200,
    features: ["طازج يومياً", "جودة ممتازة", "خالي من المواد الحافظة", "سعر مناسب"],
    nutritionFacts: { protein: "26g", fat: "15g", calories: "250", cholesterol: "78mg" },
  },
  {
    id: 3,
    name: "ستيك لحم بقري 300 جرام",
    nameEn: "Beef Steak 300g",
    price: 12.0,
    originalPrice: 14.0,
    image: "https://www.bidmeshk.com/wp-content/uploads/2021/11/HRE-510x510.jpeg",
    description: "قطع ستيك لحم بقري طرية ولذيذة",
    detailedDescription: "قطع ستيك لحم بقري من أفضل الأجزاء، مقطعة بسماكة مثالية للشوي والقلي.",
    rating: 4.8,
    reviews: 567,
    badge: "فاخر",
    weight: "300 جرام",
    category: "لحم بقري",
    inStock: 80,
    features: ["قطع مختارة", "طرية جداً", "مثالية للشوي", "نكهة غنية"],
    nutritionFacts: { protein: "28g", fat: "12g", calories: "220", cholesterol: "85mg" },
  },
  {
    id: 4,
    name: "خروف نعيمي ",
    nameEn: "Whole Fresh Chicken 1.5kg",
    price: 8.5,
    originalPrice: 9.5,
    image: "/placeholder.svg?height=400&width=400",
    description: "خروف نعيمي عالي الجودة",
    detailedDescription: "خروف نعيمي من المزارع المحلية، مربى بطريقة طبيعية وصحية.",
    rating: 4.9,
    reviews: 1156,
    badge: "طازج يومياً",
    weight: "14.5 كيلو",
    category: "خروف",
    inStock: 150,
    features: ["طازج يومياً", "مربى طبيعياً", "خالي من الهرمونات", "جودة ممتازة"],
    nutritionFacts: { protein: "31g", fat: "14.6g", calories: "165", cholesterol: "85mg" }
  }
  ]

const categories = ["الكل", "لحم بقري", "دجاج", "لحم خروف", "لحوم مصنعة", "عروض خاصة"]

export default function MeatProducts() {
  const [activeCategory, setActiveCategory] = useState("الكل")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = activeCategory === "الكل" || product.category === activeCategory
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchTerm])

  const productCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    categories.forEach((category) => {
      if (category === "الكل") {
        counts[category] = products.length
      } else {
        counts[category] = products.filter((p) => p.category === category).length
      }
    })
    return counts
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection searchTerm={searchTerm} onSearchChange={setSearchTerm} />


      <div className="container mx-auto px-4 pb-16">
   

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد منتجات</h3>
            <p className="text-gray-600">جرب البحث بكلمات مختلفة أو اختر تصنيف آخر</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
      <StatsSection />

    </div>
  )
}
