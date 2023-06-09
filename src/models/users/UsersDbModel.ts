export type UsersDbModel = {
  id: string;
  token: string;
  accountData: {
    login: string;
    passwordHash: string;
    passwordSalt: string;
    email: string;
    createdAt: string;
  };
  emailConfirmation?: {
    confirmationCode?: string;
    expirationDate?: Date;
    isConfirmed?: boolean;
  };
};
