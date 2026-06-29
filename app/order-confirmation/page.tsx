"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, Truck, Clock } from "lucide-react"
import Link from "next/link"
import { addData, getVisitorId } from "@/lib/firebase"
import { setupOnlineStatus } from "@/lib/utils"

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const [orderId, setOrderId] = useState("")

  useEffect(() => {
    const visitorId = getVisitorId()
    if (visitorId) {
      setupOnlineStatus(visitorId)
      void addData({ visitorId, currentPage: "تأكيد الطلب" })
    }

    const orderIdParam = searchParams.get("orderId")
    if (orderIdParam) {
      setOrderId(orderIdParam)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <Card className="mb-8 text-center">
            <CardContent className="p-8">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">تم تأكيد طلبك بنجاح!</h1>
              <p className="text-gray-600 mb-4">شكراً لك على ثقتك بنا. سيتم تحضير طلبك والتواصل معك قريباً</p>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-700 font-semibold">رقم الطلب: {orderId}</p>
              </div>
            </CardContent>
          </Card>

          {/* Order Status */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>حالة الطلب</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">تم تأكيد الطلب</p>
                    <p className="text-sm text-gray-600">تم استلام طلبك وتأكيد الدفع</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">جاري التحضير</p>
                    <p className="text-sm text-gray-600">يتم تحضير طلبك الآن</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-500">في الطريق</p>
                    <p className="text-sm text-gray-600">سيتم شحن طلبك قريباً</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Info */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>معلومات التوصيل</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3 space-x-reverse">
                <Clock className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold">وقت التوصيل المتوقع</p>
                  <p className="text-gray-600">خلال 2-4 ساعات</p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-700 text-sm">💡 سيتم التواصل معك قبل التوصيل بـ 30 دقيقة</p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/products" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                متابعة التسوق
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button className="w-full">العودة للرئيسية</Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
