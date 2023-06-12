import nodemailer from "nodemailer";

export const emailAdapters = {
  async sendEmail(email: string) {
    const transport = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    await transport.sendMail({
      from: "Video Blogs <teset@gmail.com>",
      to: email,
      subject: "test",
      html: `<h1>Thank for your registration</h1>
      <p>To finish registration please follow the link below:
          <a href='https://somesite.com/confirm-email?code=your_confirmation_code'>complete registration</a>
      </p>`,
    });
  },
};
