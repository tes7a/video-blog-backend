import { SentMessageInfo } from "nodemailer";
import { emailAdapters } from "../adapters/email-adapters";

export const emailsManager = {
  async sendEmailConfirmationMessage(
    email: string,
    confirmationCode: string
  ): Promise<SentMessageInfo> {
    const templateEmailSend = `<h1>Thank for your registration</h1>
    <p>To finish registration please follow the link below:
        <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
    </p>`;
    return emailAdapters.sendEmail(email, templateEmailSend);
  },
};
