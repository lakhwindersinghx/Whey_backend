import { createTransport } from "nodemailer"

const transporter = createTransport({
  host: "smtp.zohocloud.ca",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export async function sendEmail(email: string, subject: string, htmlContent: string) {
  try {
    console.log(`Sending email to: ${email}`)

    const info = await transporter.sendMail({
      from: `"WheyBetter Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: htmlContent,
    })

    console.log("Email sent successfully: ", info.messageId)
  } catch (error) {
    console.error("Error sending email: ", error)
    throw new Error("Email sending failed")
  }
}

export async function sendVerificationEmail(email: string, token: string) {
  const confirmationLink = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`

  const htmlContent = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #000; font-size: 24px; margin-bottom: 20px;">Verify your email address</h1>
      <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
        Click the button below to verify your email address:
      </p>
      <a
        href="${confirmationLink}"
        style="background-color: #0070f3; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;"
      >
        Verify Email
      </a>
    </div>
  `

  return sendEmail(email, "Verify your email address", htmlContent)
}
