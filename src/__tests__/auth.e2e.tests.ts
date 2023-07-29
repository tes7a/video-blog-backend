import request from "supertest";
import { app } from "../app";
import { UserModelClass } from "../db/db";
import { randomUUID } from "crypto";

describe("auth tests", () => {
  it("wipe all data", async () => {
    const res = await request(app).delete("/testing/all-data");
    expect(res.status).toBe(204);
    const users = await UserModelClass.countDocuments();
    expect(users).toBe(0);
  });

  it("register user", async () => {
    const inputData = {
      login: "login12",
      email: "ttes7a@gmail.com",
      password: "password",
    };

    const res = await request(app).post("/auth/registration").send(inputData);
    expect(res.status).toBe(204);
    const user = await UserModelClass.findOne();
    expect(user).toBeDefined();
    expect.setState({ user });
  });

  it("resend email", async () => {
    const { user } = expect.getState();

    const inputData = {
      email: user.accountData.email,
    };

    const badRes = await request(app)
      .post("/auth/registration-email-resending")
      .send({
        email: "123@gmail.com",
      });
    expect(badRes.status).toBe(400);

    const res = await request(app)
      .post("/auth/registration-email-resending")
      .send(inputData);
    expect(res.status).toBe(204);

    const updatedUser = await UserModelClass.findOne({});
    expect(user.emailConfirmation.confirmationCode).not.toEqual(
      updatedUser!.emailConfirmation!.confirmationCode
    );

    expect.setState({ user: updatedUser });
  });

  it("confirm email", async () => {
    const { user } = expect.getState();

    const inputData = {
      code: user.emailConfirmation.confirmationCode,
    };

    const badRes = await request(app)
      .post("/auth/registration-confirmation")
      .send({
        code: randomUUID(),
      });
    expect(badRes.status).toBe(400);

    const res = await request(app)
      .post("/auth/registration-confirmation")
      .send(inputData);
    expect(res.status).toBe(204);

    const updatedUser = await UserModelClass.findOne({});
    expect(updatedUser!.emailConfirmation!.isConfirmed).toBeTruthy();

    const res2 = await request(app)
      .post("/auth/registration-email-resending")
      .send({ email: user.accountData.email });
    expect(res2.status).toBe(400);
  });
});
