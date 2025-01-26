import { Resend } from "resend";

const resend = new Resend("re_VaEghSJT_8MtJSYcurPXvxWohsmvV1UFY"); // Replace with your API key

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, name, password } = req.body;

    try {
      // Send an email using Resend
      const response = await resend.emails.send({
        from: "Loan Application <your-email@yourdomain.com>", // Replace with your verified sender
        to: email,
        subject: "Your Loan Application Credentials",
        html: `
          <p>Hi ${name},</p>
          <p>Thank you for submitting your loan application. Below are your login credentials:</p>
          <ul>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Password:</strong> ${password}</li>
          </ul>
          <p>Please use these credentials to log in and track your application status.</p>
          <p>Best Regards,<br>Loan Application Team</p>
        `,
      });

      res.status(200).json({ message: "Email sent successfully!", data: response });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ message: "Failed to send email", error });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
