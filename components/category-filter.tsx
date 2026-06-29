"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface CategoryFilterProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
  productCounts: Record<string, number>
}

export function CategoryFilter({ categories, activeCategory, onCategoryChange, productCounts }: CategoryFilterProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h3 className="text-lg font-bold text-gray-900 mb-4">التصنيفات</h3>
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            onClick={() => onCategoryChange(category)}
            className={`relative transition-all duration-300 ${
              activeCategory === category
                ? "bg-red-600 hover:bg-red-700 text-white shadow-lg"
                : "hover:bg-red-50 hover:border-red-200 hover:text-red-600"
            }`}
          >
            {category}
            <Badge variant="secondary" className="ml-2 bg-white/20 text-current border-0">
              {productCounts[category] || 0}
            </Badge>
          </Button>
        ))}
      </div>
    </div>
  )
}
