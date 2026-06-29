"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Download, Share2, Home, Receipt, Clock } from "lucide-react"
import Link from "next/link"

interface PaymentSuccessProps {
  transactionId: string
  amount: number
  currency: string
  gateway: string
  customerInfo: {
    name: string
    email: string
    phone: string
  }
  orderItems: Array<{
    name: string
    quantity: number
    price: number
  }>
}

export function PaymentSuccess({
  transactionId,
  amount,
  currency,
  gateway,
  customerInfo,
  orderItems,
}: PaymentSuccessProps) {
  const orderDate = new Date().toLocaleDateString("ar-OM", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  const downloadReceipt = () => {
    if (typeof window === "undefined") return

    // Generate and download receipt
    const receiptData = {
      transactionId,
      amount,
      currency,
      gateway,
      customerInfo,
      orderItems,
      date: orderDate,
    }

    const dataStr = JSON.stringify(receiptData, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `receipt_${transactionId}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const shareReceipt = async () => {
    if (typeof window !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "إيصال الدفع - مياه عمان",
          text: `تم الدفع بنجاح. رقم المعاملة: ${transactionId}`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Header */}
      <Card className="shadow-xl border-0 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">تم الدفع بنجاح!</h1>
          <p className="text-green-700 text-lg">شكراً لك على ثقتك في مياه عمان الفاخرة</p>
          <Badge className="mt-4 bg-green-100 text-green-800 px-4 py-2">رقم المعاملة: {transactionId}</Badge>
        </CardContent>
      </Card>

      {/* Payment Details */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardTitle className="flex items-center text-xl">
            <Receipt className="w-6 h-6 ml-3 text-blue-600" />
            تفاصيل الدفع
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">المبلغ المدفوع:</span>
                <span className="font-bold text-lg">
                  {amount.toFixed(3)} {currency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">بوابة الدفع:</span>
                <span className="font-medium">{gateway}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">تاريخ المعاملة:</span>
                <span className="font-medium">{orderDate}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">اسم العميل:</span>
                <span className="font-medium">{customerInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">البريد الإلكتروني:</span>
                <span className="font-medium">{customerInfo.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">رقم الهاتف:</span>
                <span className="font-medium">{customerInfo.phone}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div>
            <h3 className="font-semibold text-lg mb-3">المنتجات المطلوبة:</h3>
            <div className="space-y-2">
              {orderItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-600 mr-2">× {item.quantity}</span>
                  </div>
                  <span className="font-bold">{(item.price * item.quantity).toFixed(3)} ر.ع</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardTitle className="flex items-center text-xl">
            <Clock className="w-6 h-6 ml-3 text-yellow-600" />
            الخطوات التالية
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3 space-x-reverse">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-sm">1</span>
              </div>
              <div>
                <p className="font-medium">تأكيد الطلب</p>
                <p className="text-gray-600 text-sm">
                  سيتم إرسال رسالة تأكيد عبر البريد الإلكتروني والواتساب خلال 5 دقائق
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 space-x-reverse">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold text-sm">2</span>
              </div>
              <div>
                <p className="font-medium">تحضير الطلب</p>
                <p className="text-gray-600 text-sm">سيتم تحضير طلبك وتجهيزه للتوصيل خلال 2-4 ساعات</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 space-x-reverse">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold text-sm">3</span>
              </div>
              <div>
                <p className="font-medium">التوصيل</p>
                <p className="text-gray-600 text-sm">سيتم توصيل طلبك خلال 24 ساعة مع إمكانية التتبع المباشر</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={downloadReceipt}
          variant="outline"
          className="flex-1 border-2 border-blue-200 hover:border-blue-400 bg-transparent"
        >
          <Download className="w-5 h-5 ml-2" />
          تحميل الإيصال
        </Button>

        <Button
          onClick={shareReceipt}
          variant="outline"
          className="flex-1 border-2 border-green-200 hover:border-green-400 bg-transparent"
        >
          <Share2 className="w-5 h-5 ml-2" />
          مشاركة الإيصال
        </Button>

        <Link href="/" className="flex-1">
          <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
            <Home className="w-5 h-5 ml-2" />
            العودة للمتجر
          </Button>
        </Link>
      </div>

      {/* Support Contact */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-gray-50 to-blue-50">
        <CardContent className="p-6 text-center">
          <p className="text-gray-700 mb-4">هل تحتاج مساعدة؟ فريق خدمة العملاء جاهز لمساعدتك</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="outline" size="sm">
              📞 +968 2444 5555
            </Button>
            <Button variant="outline" size="sm">
              📧 support@omanwaters.om
            </Button>
            <Button variant="outline" size="sm">
              💬 واتساب: +968 9999 9999
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
