"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Package, Percent } from "lucide-react"
import Link from "next/link"

interface BundleDealsModalProps {
  isOpen: boolean
  onClose: () => void
  currentItem: {
    id: string
    title: string
    price: number
    image: string
  }
  sellerItems?: Array<{
    id: string
    title: string
    price: number
    image: string
  }>
}

const bundleDiscounts = [
  { items: 2, discount: 10, label: "Buy 2, Save 10%" },
  { items: 3, discount: 15, label: "Buy 3, Save 15%" },
  { items: 4, discount: 20, label: "Buy 4+, Save 20%" },
]

export function BundleDealsModal({ isOpen, onClose, currentItem, sellerItems = [] }: BundleDealsModalProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([currentItem.id])

  if (!isOpen) return null

  const toggleItem = (itemId: string) => {
    if (itemId === currentItem.id) return // Can't deselect current item

    setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const selectedItemsData = [currentItem, ...sellerItems.filter((item) => selectedItems.includes(item.id))]
  const totalItems = selectedItems.length
  const subtotal = selectedItemsData.reduce((sum, item) => sum + item.price, 0)

  const applicableDiscount = bundleDiscounts
    .filter((discount) => totalItems >= discount.items)
    .sort((a, b) => b.discount - a.discount)[0]

  const discountAmount = applicableDiscount ? (subtotal * applicableDiscount.discount) / 100 : 0
  const total = subtotal - discountAmount

  const mockSellerItems = [
    {
      id: "2",
      title: "Silk Stockings",
      price: 45,
      image: "/silk-stockings.png",
    },
    {
      id: "3",
      title: "Athletic Ankle Socks",
      price: 18,
      image: "/placeholder-niqvm.png",
    },
    {
      id: "4",
      title: "Lace Thigh Highs",
      price: 35,
      image: "/placeholder-niqvm.png",
    },
  ]

  const availableItems = sellerItems.length > 0 ? sellerItems : mockSellerItems

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="bg-gray-900 border-gray-800 w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-[#FF4D8D]" />
            <h2 className="text-lg font-semibold text-white">Bundle Deals</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Discount Tiers */}
          <div className="mb-6">
            <h3 className="font-medium text-white mb-3 flex items-center gap-2">
              <Percent className="h-4 w-4 text-[#FF4D8D]" />
              Available Discounts
            </h3>
            <div className="grid gap-2">
              {bundleDiscounts.map((discount, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    totalItems >= discount.items ? "border-[#FF4D8D] bg-[#FF4D8D]/10" : "border-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">{discount.label}</span>
                    {totalItems >= discount.items && <Badge className="bg-[#FF4D8D] text-white text-xs">Active</Badge>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Item */}
          <div className="mb-4">
            <h3 className="font-medium text-white mb-3">Current Item</h3>
            <div className="p-3 rounded-lg border border-[#FF4D8D] bg-[#FF4D8D]/10">
              <div className="flex items-center gap-3">
                <img
                  src={currentItem.image || "/placeholder.svg"}
                  alt={currentItem.title}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="text-white text-sm font-medium">{currentItem.title}</h4>
                  <p className="text-[#FF4D8D] font-semibold">£{currentItem.price}</p>
                </div>
                <Badge className="bg-[#FF4D8D] text-white text-xs">Selected</Badge>
              </div>
            </div>
          </div>

          {/* Additional Items */}
          <div className="mb-6">
            <h3 className="font-medium text-white mb-3">Add More Items</h3>
            <div className="space-y-2">
              {availableItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedItems.includes(item.id)
                      ? "border-[#FF4D8D] bg-[#FF4D8D]/10"
                      : "border-gray-700 hover:border-gray-600"
                  }`}
                  onClick={() => toggleItem(item.id)}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleItem(item.id)}
                      className="border-gray-600"
                    />
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="text-white text-sm font-medium">{item.title}</h4>
                      <p className="text-gray-400 font-semibold">£{item.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-gray-800 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Subtotal ({totalItems} items)</span>
              <span className="text-white">£{subtotal.toFixed(2)}</span>
            </div>
            {applicableDiscount && (
              <div className="flex justify-between text-sm">
                <span className="text-[#FF4D8D]">Bundle Discount ({applicableDiscount.discount}%)</span>
                <span className="text-[#FF4D8D]">-£{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-gray-700 pt-2">
              <div className="flex justify-between font-semibold">
                <span className="text-white">Total</span>
                <span className="text-[#FF4D8D] text-lg">£{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-800 space-y-2">
          <Button className="w-full bg-[#FF4D8D] hover:bg-[#FF4D8D]/90 text-white" asChild disabled={totalItems < 2}>
            <Link href={`/checkout/bundle-${selectedItems.join("-")}`}>Buy Bundle ({totalItems} items)</Link>
          </Button>
          <p className="text-xs text-gray-400 text-center">
            {totalItems < 2
              ? "Select at least 2 items for bundle pricing"
              : `Save £${discountAmount.toFixed(2)} with this bundle!`}
          </p>
        </div>
      </Card>
    </div>
  )
}
