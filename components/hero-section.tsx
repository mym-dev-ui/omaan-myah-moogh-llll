"use client"

import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  searchTerm: string
  onSearchChange: (term: string) => void
}

export function HeroSection({ searchTerm, onSearchChange }: HeroSectionProps) {
  return (
    <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white py-20 mb-12 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            أجود أنواع اللحوم الطازجة
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-red-100 leading-relaxed">
            اكتشف مجموعتنا المتميزة من اللحوم الطازجة عالية الجودة
          </p>
          
          {/* Search bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="ابحث عن المنتجات..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-4 pr-12 py-4 text-lg rounded-full border-0 bg-white/95 backdrop-blur-sm shadow-xl focus:ring-4 focus:ring-white/30 text-gray-900 placeholder:text-gray-500"
              />
              <Button 
                size="icon"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 rounded-full bg-red-600 hover:bg-red-700 h-10 w-10"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
