"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Ruler, Info } from "lucide-react"

interface SizeGuideModalProps {
  isOpen: boolean
  onClose: () => void
  itemType?: string
}

const sizeGuides = {
  socks: {
    title: "Sock Size Guide",
    description: "Find your perfect fit with our comprehensive sizing guide",
    measurements: [
      { size: "XS", ukSize: "2-3", usSize: "4-5", euSize: "35-36", footLength: "21-22cm" },
      { size: "S", ukSize: "4-5", usSize: "6-7", euSize: "37-38", footLength: "23-24cm" },
      { size: "M", ukSize: "6-7", usSize: "8-9", euSize: "39-40", footLength: "25-26cm" },
      { size: "L", ukSize: "8-9", usSize: "10-11", euSize: "41-42", footLength: "27-28cm" },
      { size: "XL", ukSize: "10-11", usSize: "12-13", euSize: "43-44", footLength: "29-30cm" },
    ],
    tips: [
      "Measure your foot length from heel to longest toe",
      "Measure both feet and use the larger measurement",
      "For between sizes, size up for comfort",
      "Consider sock thickness when choosing size",
    ],
  },
  stockings: {
    title: "Stockings Size Guide",
    description: "Ensure the perfect fit for your stockings",
    measurements: [
      { size: "XS", height: "5'0\"-5'3\"", weight: "90-110 lbs", hipSize: '32-34"' },
      { size: "S", height: "5'2\"-5'5\"", weight: "105-125 lbs", hipSize: '34-36"' },
      { size: "M", height: "5'4\"-5'7\"", weight: "120-140 lbs", hipSize: '36-38"' },
      { size: "L", height: "5'6\"-5'9\"", weight: "135-155 lbs", hipSize: '38-40"' },
      { size: "XL", height: "5'8\"-6'0\"", weight: "150-170 lbs", hipSize: '40-42"' },
    ],
    tips: [
      "Measure your height without shoes",
      "Measure hips at the widest point",
      "Consider your body proportions",
      "Check the stretch and material type",
    ],
  },
}

export function SizeGuideModal({ isOpen, onClose, itemType = "socks" }: SizeGuideModalProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  if (!isOpen) return null

  const guide = sizeGuides[itemType as keyof typeof sizeGuides] || sizeGuides.socks

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="bg-gray-900 border-gray-800 w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Ruler className="h-5 w-5 text-[#FF4D8D]" />
            <h2 className="text-lg font-semibold text-white">{guide.title}</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          <p className="text-gray-400 text-sm mb-4">{guide.description}</p>

          {/* Size Chart */}
          <div className="space-y-2 mb-6">
            <h3 className="font-medium text-white mb-3">Size Chart</h3>
            {guide.measurements.map((measurement, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedSize === measurement.size
                    ? "border-[#FF4D8D] bg-[#FF4D8D]/10"
                    : "border-gray-700 hover:border-gray-600"
                }`}
                onClick={() => setSelectedSize(measurement.size)}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="bg-gray-800 text-white">
                    {measurement.size}
                  </Badge>
                  {selectedSize === measurement.size && (
                    <Badge className="bg-[#FF4D8D] text-white text-xs">Selected</Badge>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                  {itemType === "socks" ? (
                    <>
                      <div>UK: {(measurement as any).ukSize}</div>
                      <div>US: {(measurement as any).usSize}</div>
                      <div>EU: {(measurement as any).euSize}</div>
                      <div>Length: {(measurement as any).footLength}</div>
                    </>
                  ) : (
                    <>
                      <div>Height: {(measurement as any).height}</div>
                      <div>Weight: {(measurement as any).weight}</div>
                      <div colSpan={2}>Hips: {(measurement as any).hipSize}</div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Sizing Tips */}
          <div className="space-y-3">
            <h3 className="font-medium text-white flex items-center gap-2">
              <Info className="h-4 w-4 text-[#FF4D8D]" />
              Sizing Tips
            </h3>
            <ul className="space-y-2">
              {guide.tips.map((tip, index) => (
                <li key={index} className="text-sm text-gray-400 flex items-start gap-2">
                  <span className="text-[#FF4D8D] mt-1">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="p-4 border-t border-gray-800">
          <Button onClick={onClose} className="w-full bg-[#FF4D8D] hover:bg-[#FF4D8D]/90 text-white">
            Got it, thanks!
          </Button>
        </div>
      </Card>
    </div>
  )
}
