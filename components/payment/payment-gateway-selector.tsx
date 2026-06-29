"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, CreditCard, Smartphone, Building2, Zap, Info } from "lucide-react"
import Image from "next/image"
import { omanPaymentGateways, type PaymentGateway } from "@/lib/payment-gateways"

interface PaymentGatewaySelectorProps {
  selectedGateway: string
  onGatewayChange: (gateway: string) => void
  amount: number
}

export function PaymentGatewaySelector({ selectedGateway, onGatewayChange, amount }: PaymentGatewaySelectorProps) {
  const [showFees, setShowFees] = useState(false)

  const calculateFees = (gateway: PaymentGateway) => {
    const percentageFee = (amount * gateway.fees.percentage) / 100
    const totalFees = percentageFee + gateway.fees.fixed
    return totalFees
  }

  const getGatewayIcon = (type: string) => {
    switch (type) {
      case "bank":
        return <Building2 className="w-5 h-5" />
      case "digital_wallet":
        return <Smartphone className="w-5 h-5" />
      case "card_processor":
        return <CreditCard className="w-5 h-5" />
      default:
        return <CreditCard className="w-5 h-5" />
    }
  }

  const getCardLogos = (cards: string[]) => {
    return cards.map((card) => {
      const cardColors = {
        visa: "bg-blue-600",
        mastercard: "bg-red-600",
        amex: "bg-green-600",
        debit: "bg-gray-600",
        digital: "bg-purple-600",
      }

      return (
        <div
          key={card}
          className={`w-8 h-5 ${cardColors[card as keyof typeof cardColors]} rounded text-white text-xs flex items-center justify-center font-bold`}
        >
          {card.slice(0, 4).toUpperCase()}
        </div>
      )
    })
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardTitle className="flex items-center justify-between text-xl">
          <div className="flex items-center">
            <CreditCard className="w-6 h-6 ml-3 text-purple-600" />
            بوابات الدفع العمانية
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowFees(!showFees)} className="text-sm">
            <Info className="w-4 h-4 ml-1" />
            {showFees ? "إخفاء الرسوم" : "عرض الرسوم"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <RadioGroup value={selectedGateway} onValueChange={onGatewayChange} className="space-y-4">
          {omanPaymentGateways
            .filter((gateway) => gateway.isActive)
            .map((gateway) => {
              const fees = calculateFees(gateway)
              const totalWithFees = amount + fees

              return (
                <div
                  key={gateway.id}
                  className={`flex items-center space-x-3 space-x-reverse p-4 border-2 rounded-xl transition-all cursor-pointer hover:border-purple-300 ${
                    selectedGateway === gateway.id ? "border-purple-500 bg-purple-50" : "border-gray-200"
                  }`}
                  onClick={() => onGatewayChange(gateway.id)}
                >
                  <RadioGroupItem value={gateway.id} id={gateway.id} />
                  <Label htmlFor={gateway.id} className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <div className="w-12 h-12 bg-white rounded-lg border flex items-center justify-center shadow-sm">
                            {getGatewayIcon(gateway.type)}
                          </div>
                          <img
                            src={gateway.logo || "/placeholder.svg"}
                            alt={gateway.name}
                            width={80}
                            height={30}
                            className="object-contain"
                          />
                        </div>

                        <div>
                          <div className="flex items-center space-x-2 space-x-reverse mb-1">
                            <p className="font-semibold text-lg">{gateway.nameAr}</p>
                            <p className="text-sm text-gray-500">({gateway.name})</p>
                          </div>

                          <div className="flex items-center space-x-2 space-x-reverse mb-2">
                            {getCardLogos(gateway.supportedCards)}
                          </div>

                          <div className="flex items-center space-x-3 space-x-reverse">
                            <div className="flex items-center space-x-1 space-x-reverse">
                              <Shield className="w-4 h-4 text-green-500" />
                              <span className="text-xs text-green-600">آمن ومشفر</span>
                            </div>

                            {gateway.type === "digital_wallet" && (
                              <div className="flex items-center space-x-1 space-x-reverse">
                                <Zap className="w-4 h-4 text-blue-500" />
                                <span className="text-xs text-blue-600">دفع فوري</span>
                              </div>
                            )}

                            {gateway.testMode && (
                              <Badge variant="outline" className="text-xs">
                                وضع تجريبي
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-left">
                        {showFees && (
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600">رسوم: {fees.toFixed(3)} ر.ع</p>
                            <p className="font-bold text-lg text-purple-600">المجموع: {totalWithFees.toFixed(3)} ر.ع</p>
                          </div>
                        )}

                        {!showFees && (
                          <div className="text-sm text-gray-500">
                            رسوم: {gateway.fees.percentage}% + {gateway.fees.fixed.toFixed(3)} ر.ع
                          </div>
                        )}
                      </div>
                    </div>
                  </Label>
                </div>
              )
            })}
        </RadioGroup>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-3 space-x-reverse">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-2">ضمانات الأمان:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>جميع المعاملات مشفرة بتقنية SSL 256-bit</li>
                <li>متوافقة مع معايير PCI DSS للأمان</li>
                <li>مراقبة مستمرة للمعاملات المشبوهة</li>
                <li>حماية بيانات العملاء وفقاً لقوانين البنك المركزي العماني</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
