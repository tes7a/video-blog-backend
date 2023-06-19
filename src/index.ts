import { runDb } from "./db/db";
import { app } from "./app";

const port = process.env.port || 3000;

const starApp = async () => {
  await runDb();
  if (process.env.NODE_ENV !== "test") {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  }
};

starApp();
