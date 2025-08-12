import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, category, message } = await request.json()

    // In a real app, you would:
    // 1. Save to Firestore for tracking
    // 2. Send email notification to support team
    // 3. Send confirmation email to user

    // For now, we'll just log the contact form submission
    const contactLog = {
      name,
      email,
      subject,
      category,
      message,
      timestamp: new Date().toISOString(),
      status: "new",
    }

    console.log("Contact form submission:", contactLog)

    // Here you would save to Firestore:
    // const contactRef = collection(db, 'contacts')
    // await addDoc(contactRef, contactLog)

    return NextResponse.json({ success: true, message: "Contact form submitted successfully" })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Failed to submit contact form" }, { status: 500 })
  }
}
