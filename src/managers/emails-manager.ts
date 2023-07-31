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

  async passwordRecovery(
    email: string,
    recoveryPassword: string
  ): Promise<SentMessageInfo> {
    const template = `<h1>Password recovery</h1>
    <p>To finish password recovery please follow the link below:
       <a href='https://somesite.com/password-recovery?recoveryCode=${recoveryPassword}'>recovery password</a>
   </p>`;

    return emailAdapters.passwordRecover(email, template);
  },
};
