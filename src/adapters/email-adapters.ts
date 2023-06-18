import nodemailer from "nodemailer";

export const emailAdapters = {
  async sendEmail(email: string, template: string) {
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
      html: template,
    });
  },
};
