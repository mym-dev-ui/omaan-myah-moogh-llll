"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Plus, Minus, CheckCircle, X, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { useEffect } from "react"

export function CartSidebar() {
  const { items, isOpen, updateQuantity, removeItem, getTotalPrice, setCartOpen } = useCart()
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = getTotalPrice()
  const formatItemPrice = (item: (typeof items)[number]) =>
    item.category === "عرض" ? `${item.price * item.quantity} ريال عماني` : `${(item.price * item.quantity).toFixed(3)} ر.ع`

  // Close cart when clicking outside on mobile
  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setCartOpen(false)
        }
      }
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, setCartOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Mobile Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setCartOpen(false)} />

      {/* Cart Sidebar */}
      <div
        className={`
        fixed top-0 right-0 h-full w-full max-w-md z-50 transform transition-transform duration-300 ease-in-out
        lg:relative lg:inset-auto lg:transform-none lg:transition-none lg:z-auto
        ${isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
      `}
      >
        <Card className="h-full shadow-2xl border-0 rounded-none lg:rounded-lg lg:sticky lg:top-24">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 flex-shrink-0">
            <CardTitle className="flex items-center justify-between text-lg md:text-xl">
              <div className="flex items-center">
                <ShoppingCart className="w-5 h-5 ml-2" />
                سلة التسوق ({items.length})
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCartOpen(false)}
                className="lg:hidden hover:bg-red-100"
              >
                <X className="w-5 h-5" />
              </Button>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-4 md:p-6 flex flex-col h-full">
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ShoppingCart className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">السلة فارغة</h3>
                <p className="text-sm text-gray-500 mb-6">أضف بعض المنتجات لتبدأ التسوق</p>
                <Button
                  onClick={() => setCartOpen(false)}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  تصفح المنتجات
                </Button>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
                      <div className="flex items-start space-x-3 space-x-reverse">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={60}
                          height={60}
                          className="rounded-lg shadow-sm flex-shrink-0 object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm leading-tight mb-1">{item.name}</h4>
                              <p className="text-xs text-gray-500">
                                {item.description || item.size}
                              </p>
                              {item.gift && <p className="text-xs font-semibold text-green-600">الهدية: {item.gift}</p>}
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeItem(item.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1 space-x-reverse bg-gray-50 rounded-lg p-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                className="h-8 w-8 p-0 hover:bg-gray-200"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-8 w-8 p-0 hover:bg-gray-200"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-blue-600 text-sm">
                                {formatItemPrice(item)}
                              </p>
                              {item.quantity > 1 && (
                                <p className="text-xs text-gray-500">
                                  {item.category === "عرض" ? `${item.price} ريال عماني للعرض` : `${item.price.toFixed(3)} ر.ع للواحدة`}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Summary */}
                <div className="sticky bottom-0 border-t pt-4 bg-gray-50 -mx-4 md:-mx-6 px-4 md:px-6 pb-4 md:pb-6 flex-shrink-0 shadow-[0_-8px_20px_rgba(0,0,0,0.05)]">
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">عدد المنتجات:</span>
                      <span className="font-medium">{items.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">الكمية:</span>
                      <span className="font-medium">{totalQuantity}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">المجموع الفرعي:</span>
                      <span className="font-medium">{totalPrice.toFixed(3)} ر.ع</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">الإجمالي:</span>
                      <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        {totalPrice.toFixed(3)} ر.ع
                      </span>
                    </div>
                    {totalPrice < 5 && (
                      <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
                        أضف {(5 - totalPrice).toFixed(3)} ر.ع للحصول على توصيل مجاني
                      </div>
                    )}
                  </div>

                  <Link href="/checkout" className="block">
                    <Button
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 rounded-xl shadow-lg text-base"
                      size="lg"
                      onClick={() => setCartOpen(false)}
                    >
                      <CheckCircle className="w-5 h-5 ml-2" />
                      متابعة الطلب
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
