import connectToDatabase from "../../lib/mongodb";
import User from "../../models/User";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, cnic } = req.body;

    try {
      // Connect to the database
      await connectToDatabase();

      // Generate random password
      const password = Math.random().toString(36).slice(-8);

      // Add user to database
      const user = await User.create({ name, email, cnic, password });

      // Send email with the generated password
      await resend.emails.send({
        from: "Loan Application <your-email@yourdomain.com>",
        to: email,
        subject: "Your Loan Application Credentials",
        html: `
          <p>Hi ${name},</p>
          <p>Thank you for applying for a loan. Below are your login credentials:</p>
          <ul>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Password:</strong> ${password}</li>
          </ul>
          <p>Please keep these details safe.</p>
        `,
      });

      res.status(200).json({ message: "User created and email sent!" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "An error occurred", error });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
