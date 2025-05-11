import nodemailer from "nodemailer";
import  getLoginCredentialsTemplate  from "./templates/loginCredentials.js  ";

const sendEmail = async (email, password) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
      },
    });

    const mailOptions = {
      from: `"FundFlow" <${process.env.USER_EMAIL}>`,
      to: email,
      subject: "Welcome to FundFlow - Your Login Credentials",
      html: getLoginCredentialsTemplate(email, password),
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Failed to send email");
  }
};

export default sendEmail;
