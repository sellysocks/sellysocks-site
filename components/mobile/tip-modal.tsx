"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X, Heart } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface TipModalProps {
  isOpen: boolean
  onClose: () => void
  recipientName: string
  onSendTip: (amount: number, message?: string) => Promise<void>
}

function TipPaymentForm({
  amount,
  message,
  recipientName,
  onSuccess,
  onError,
}: {
  amount: number
  message: string
  recipientName: string
  onSuccess: () => void
  onError: (error: string) => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/messages`,
        },
        redirect: "if_required",
      })

      if (error) {
        onError(error.message || "Payment failed")
      } else {
        onSuccess()
      }
    } catch (err) {
      onError("Payment failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-background rounded-lg p-4">
        <PaymentElement
          options={{
            layout: "tabs",
            paymentMethodOrder: ["apple_pay", "card"],
          }}
        />
      </div>

      <Button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-pink hover:bg-pink/90 text-white font-medium h-12"
      >
        {isLoading ? (
          "Processing..."
        ) : (
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Send £{amount.toFixed(2)} Tip
          </div>
        )}
      </Button>
    </form>
  )
}

export function TipModal({ isOpen, onClose, recipientName, onSendTip }: TipModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [message, setMessage] = useState("")
  const [showPayment, setShowPayment] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const presetAmounts = [1, 2, 5, 10, 20]

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount("")
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    setSelectedAmount(null)
  }

  const getFinalAmount = () => {
    return selectedAmount || Number.parseFloat(customAmount) || 0
  }

  const getPlatformFee = (amount: number) => {
    return Math.round(amount * 0.05 * 100) / 100 // 5% platform fee
  }

  const handleContinueToPayment = async () => {
    const amount = getFinalAmount()
    if (amount < 1) return

    try {
      const response = await fetch("/api/tips/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          recipientName,
          message: message || undefined,
        }),
      })

      const data = await response.json()

      if (data.clientSecret) {
        setClientSecret(data.clientSecret)
        setShowPayment(true)
        setError(null)
      } else {
        setError("Failed to initialize payment")
      }
    } catch (err) {
      setError("Failed to initialize payment")
    }
  }

  const handlePaymentSuccess = () => {
    onClose()
    setSelectedAmount(null)
    setCustomAmount("")
    setMessage("")
    setShowPayment(false)
    setClientSecret(null)
  }

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage)
  }

  const finalAmount = getFinalAmount()
  const platformFee = getPlatformFee(finalAmount)
  const recipientAmount = finalAmount - platformFee

  useEffect(() => {
    if (!isOpen) {
      setShowPayment(false)
      setClientSecret(null)
      setError(null)
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-sm mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between sticky top-0 bg-card z-10 pb-4">
          <DialogTitle className="text-lg font-semibold text-white">
            {showPayment ? "Complete Payment" : `Send Tip to ${recipientName}`}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {!showPayment ? (
          <div className="space-y-6 pb-4">
            {/* Preset Amounts */}
            <div>
              <label className="text-sm font-medium text-white mb-3 block">Choose Amount</label>
              <div className="grid grid-cols-5 gap-2">
                {presetAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant={selectedAmount === amount ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleAmountSelect(amount)}
                    className={`h-10 ${
                      selectedAmount === amount
                        ? "bg-pink text-white"
                        : "border-border text-muted-foreground hover:text-white hover:border-pink"
                    }`}
                  >
                    £{amount}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Or Enter Custom Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  className="pl-8 bg-background border-border text-white placeholder:text-muted-foreground"
                  min="1"
                  step="0.01"
                />
              </div>
            </div>

            {/* Optional Message */}
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Add a Message (Optional)</label>
              <Textarea
                placeholder="Say something nice..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-background border-border text-white placeholder:text-muted-foreground resize-none"
                rows={3}
                maxLength={200}
              />
              <div className="text-xs text-muted-foreground mt-1 text-right">{message.length}/200</div>
            </div>

            {/* Fee Breakdown */}
            {finalAmount > 0 && (
              <div className="bg-background rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tip Amount</span>
                  <span className="text-white">£{finalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform Fee (5%)</span>
                  <span className="text-white">£{platformFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-white">{recipientName} Receives</span>
                    <span className="text-pink">£{recipientAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Continue Button */}
            <Button
              onClick={handleContinueToPayment}
              disabled={finalAmount < 1}
              className="w-full bg-pink hover:bg-pink/90 text-white font-medium h-12 sticky bottom-0 bg-card"
            >
              Continue to Payment
            </Button>
          </div>
        ) : (
          clientSecret && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "night",
                  variables: {
                    colorPrimary: "#FF4D8D",
                  },
                },
              }}
            >
              <div className="space-y-4 pb-4">
                {/* Payment Summary */}
                <div className="bg-background rounded-lg p-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tip to {recipientName}</span>
                    <span className="text-white">£{finalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Platform Fee (5%)</span>
                    <span className="text-white">£{platformFee.toFixed(2)}</span>
                  </div>
                  {message && (
                    <div className="pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground">Message: "{message}"</p>
                    </div>
                  )}
                </div>

                <TipPaymentForm
                  amount={finalAmount}
                  message={message}
                  recipientName={recipientName}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </div>
            </Elements>
          )
        )}
      </DialogContent>
    </Dialog>
  )
}
