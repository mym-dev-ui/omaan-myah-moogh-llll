"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"

export function CartButton() {
  const { getTotalItems } = useCart()

  return (
    <Link href="/cart">
      <Button
        variant="outline"
        size="sm"
        className="relative border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 px-2 md:px-4 bg-transparent"
      >
        <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 ml-1 md:ml-2" />
        <span className="hidden sm:inline">السلة</span>
        <span className="sm:hidden">({getTotalItems()})</span>
        {getTotalItems() > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 md:h-6 md:w-6 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-orange-500 to-red-500">
            {getTotalItems()}
          </Badge>
        )}
      </Button>
    </Link>
  )
}
