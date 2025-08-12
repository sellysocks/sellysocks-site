import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-brown-900 mb-2">Terms of Service</h1>
          <p className="text-brown-600">Last updated: January 15, 2024</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-brown max-w-none">
              <p>
                By accessing and using Selly Socks, you accept and agree to be bound by the terms and provision of this
                agreement.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Rules</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-brown max-w-none">
              <p>Users must comply with the following rules:</p>
              <ul>
                <li>Only list items you personally own and have the right to sell</li>
                <li>Provide accurate descriptions and photos of items</li>
                <li>Communicate respectfully with other users</li>
                <li>Complete transactions in good faith</li>
                <li>Report any issues or violations promptly</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fees and Payments</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-brown max-w-none">
              <p>
                Selly Socks charges a 10% platform fee on all successful transactions. This fee is automatically
                deducted from the seller's payout.
              </p>
              <p>
                Payments are processed securely through our payment partners. Seller payouts are released after
                successful delivery confirmation.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prohibited Items</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-brown max-w-none">
              <p>The following items are prohibited on our platform:</p>
              <ul>
                <li>Counterfeit or replica items</li>
                <li>Items that violate intellectual property rights</li>
                <li>Inappropriate or offensive content</li>
                <li>Items that violate local laws or regulations</li>
                <li>Damaged items not disclosed in the listing</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-brown max-w-none">
              <p>
                Selly Socks acts as a platform connecting buyers and sellers. We are not responsible for the quality,
                safety, or legality of items listed, the truth or accuracy of listings, or the ability of sellers to
                sell items or buyers to pay for items.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-brown-700">
                For questions about these Terms of Service, contact us at{" "}
                <a href="mailto:legal@sellysocks.com" className="text-brown-900 hover:underline">
                  legal@sellysocks.com
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
