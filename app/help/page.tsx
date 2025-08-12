import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Mail, Phone } from "lucide-react"
import Link from "next/link"

export default function HelpCenter() {
  const faqs = [
    {
      question: "How do I list an item for sale?",
      answer:
        "Go to the 'Sell' page, upload photos of your item, fill out the details including the 'Used For' story, set your price, and submit for review.",
    },
    {
      question: "When do I get paid?",
      answer:
        "Payments are released 7 days after the buyer confirms receipt of the item, or automatically after 14 days if no issues are reported.",
    },
    {
      question: "What's the platform fee?",
      answer: "We charge a 10% fee on successful sales, which is automatically deducted from your payout.",
    },
    {
      question: "How do I contact a seller?",
      answer:
        "Click the 'Message Seller' button on any item page to start a conversation. All communication happens through our secure messaging system.",
    },
    {
      question: "What if I have an issue with my order?",
      answer:
        "Contact the seller first through messages. If you can't resolve it, use the 'Report Issue' button or contact our support team.",
    },
    {
      question: "How do I verify my seller account?",
      answer:
        "Complete your profile with a clear photo and bio. Our team will review and verify active sellers to build trust in the community.",
    },
  ]

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-serif font-bold text-brown-900 mb-2">Help Center</h1>
          <p className="text-brown-600">Find answers to common questions or get in touch</p>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/contact">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <MessageSquare className="h-8 w-8 text-brown-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Contact Form</CardTitle>
                <CardDescription>Send us a message and we'll get back to you</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Card>
            <CardHeader className="text-center">
              <Mail className="h-8 w-8 text-brown-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Email Support</CardTitle>
              <CardDescription>
                <a href="mailto:support@sellysocks.com" className="text-brown-900 hover:underline">
                  support@sellysocks.com
                </a>
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Phone className="h-8 w-8 text-brown-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Phone Support</CardTitle>
              <CardDescription>
                <a href="tel:+1-555-SELLY-1" className="text-brown-900 hover:underline">
                  +1 (555) SELLY-1
                </a>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Quick answers to common questions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-brown-100 pb-4 last:border-b-0">
                  <h3 className="font-medium text-brown-900 mb-2">{faq.question}</h3>
                  <p className="text-brown-700 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <div className="mt-8 text-center">
          <h2 className="text-xl font-serif font-bold text-brown-900 mb-4">Need More Help?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/privacy">
              <Button variant="outline" className="bg-transparent">
                Privacy Policy
              </Button>
            </Link>
            <Link href="/terms">
              <Button variant="outline" className="bg-transparent">
                Terms of Service
              </Button>
            </Link>
            <Link href="/contact">
              <Button>Contact Support</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
