"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/contexts/cart-context"
import { Star, ShoppingCart, Heart } from "lucide-react"

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

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

const {addItem} =useCart()

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-white border-0 shadow-lg"
    onClick={()=>
      {
        addItem(product as any)
        window.location.href="/cart"}}>
      <div className="relative overflow-hidden">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {product.badge && (
            <Badge className="bg-red-500 hover:bg-red-600 text-white font-medium px-3 py-1">{product.badge}</Badge>
          )}
          {discountPercentage > 0 && (
            <Badge className="bg-green-500 hover:bg-green-600 text-white font-medium px-2 py-1">
              -{discountPercentage}%
            </Badge>
          )}
        </div>

        {/* Wishlist button */}
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 hover:bg-white"
        >
          <Heart className="h-4 w-4" />
        </Button>

        {/* Stock indicator */}
        <div className="absolute bottom-3 left-3">
          <Badge
            variant={product.inStock > 50 ? "default" : product.inStock > 10 ? "secondary" : "destructive"}
            className="text-xs"
          >
            {product.inStock > 50 ? "متوفر" : product.inStock > 10 ? "كمية محدودة" : "آخر القطع"}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Product name and category */}
          <div>
            <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-1 group-hover:text-red-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 font-medium">{product.category}</p>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{product.description}</p>

         
          {/* Weight and features */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
              {product.weight}
            </span>
          </div>

          {/* Pricing */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-green-600">{product.price.toFixed(2)}</span>
              <span className="text-sm text-gray-500">ر.ع</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">{product.originalPrice.toFixed(2)} ر.ع</span>
              )}
            </div>
          </div>

          {/* Add to cart button */}
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 transition-all duration-300 group-hover:shadow-lg"
            disabled={product.inStock === 0}
         
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.inStock === 0 ? "غير متوفر" : "أضف للسلة"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
