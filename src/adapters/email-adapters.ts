import nodemailer, { SentMessageInfo } from "nodemailer";

export const emailAdapters = {
  async sendEmail(email: string, template: string): Promise<SentMessageInfo> {
    debugger;
    const ema = process.env.EMAIL;
    const aps = process.env.EMAIL_PASSWORD;
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
