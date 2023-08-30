export class UserDBModel {
  constructor(
    public id: string,
    public token: string,
    public accountData: {
      login: string;
      passwordHash: string;
      passwordSalt: string;
      recoveryCode?: string;
      email: string;
      createdAt: string;
    },
    public emailConfirmation?: {
      confirmationCode?: string;
      expirationDate?: Date;
      isConfirmed?: boolean;
    }
  ) {}
}

export type UsersDbModel = {
  id: string;
  token: string;
  accountData: {
    login: string;
    passwordHash: string;
    passwordSalt: string;
    recoveryCode?: string;
    email: string;
    createdAt: string;
  };
  emailConfirmation?: {
    confirmationCode?: string;
    expirationDate?: Date;
    isConfirmed?: boolean;
  };
};
