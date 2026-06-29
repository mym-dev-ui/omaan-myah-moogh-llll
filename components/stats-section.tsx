"use client"

import { TrendingUp, Users, Award, Clock } from "lucide-react"

export function StatsSection() {
  const stats = [
    {
      icon: TrendingUp,
      value: "1000+",
      label: "منتج متوفر",
      color: "text-green-600",
    },
    {
      icon: Users,
      value: "50K+",
      label: "عميل راضي",
      color: "text-blue-600",
    },
    {
      icon: Award,
      value: "15+",
      label: "سنة خبرة",
      color: "text-purple-600",
    },
    {
      icon: Clock,
      value: "24/7",
      label: "خدمة العملاء",
      color: "text-red-600",
    },
  ]

  return (
    <div className="bg-gray-50 py-16 mb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg mb-4 ${stat.color}`}
              >
                <stat.icon className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
