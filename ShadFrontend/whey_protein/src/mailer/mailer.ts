import nodemailer from 'nodemailer';

interface MailOptions {
  email: string;
  emailType: string;
  userId: string;
}

export const sendMail = async ({ email, emailType, userId }: MailOptions) => {
  try {
    // Configure transporter using ethereal email service
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // True for port 465, false for other ports
      auth: {
        user: "maddison53@ethereal.email", // Replace with real ethereal credentials
        pass: "jn7jnAPss4f63QBp6D",
      },
    });

    // Dynamic subject and body based on `emailType`
    let subject = "";
    let htmlBody = "";

    switch (emailType) {
      case "verification":
        subject = "Verify your email";
        htmlBody = `<p>Please verify your email by clicking <a href="http://localhost:3000/verify?userId=${userId}">here</a>.</p>`;
        break;
      case "passwordReset":
        subject = "Reset your password";
        htmlBody = `<p>Click <a href="http://localhost:3000/reset-password?userId=${userId}">here</a> to reset your password.</p>`;
        break;
      default:
        subject = "General Notification";
        htmlBody = "<p>This is a general email notification.</p>";
        break;
    }

    const mailOptions = {
      from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // Sender address
      to: email, // Receiver's email
      subject: subject, // Subject based on email type
      html: htmlBody, // Dynamic body content
    };

    // Send email
    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
};
