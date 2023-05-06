import request from "supertest";
import { app } from "..";
import { PostType } from "../db/posts.db";

describe("/posts", () => {
  let newPost: PostType | null = null;

  beforeAll(async () => {
    await request(app).delete("/testing/all-data").expect(204);
  });

  it("GET blogs = []", async () => {
    await request(app).get("/posts/").expect([]);
  });

  it("there should be an authorization sent before the post", async function () {
    await request(app).post("/posts/").auth("admin", "qwerty").expect(400);
  });

  it("- POST does not create the post with incorrect data (no title, no shortDescription, no content, no blogId)", async function () {
    await request(app)
      .post("/posts/")
      .auth("admin", "qwerty")
      .send({ title: "", shortDescription: "", content: "", blogId: "" })
      .expect(400, {
        errorsMessages: [
          { message: "Should not be empty", field: "title" },
          { message: "Should not be empty", field: "shortDescription" },
          { message: "Should not be empty", field: "content" },
          { message: "Should not be empty", field: "blogId" },
        ],
      });

    const res = await request(app).get("/posts/");
    expect(res.body).toEqual([]);
  });

  it("POST new object in DB", async () => {
    const postRes = await request(app)
      .post("/posts/")
      .auth("admin", "qwerty")
      .send({
        title: "Start",
        shortDescription: "Costas",
        content: "Costas",
        blogId: "1",
      })
      .expect(201);
    newPost = postRes.body;

    const res = await request(app).get("/posts/");
    expect(res.body[0]).toEqual(postRes.body);
  });

  it("- GET post by ID with incorrect id", async () => {
    await request(app).get("/posts/helloWorld").expect(404);
  });
  it("+ GET post by ID with correct id", async () => {
    await request(app)
      .get("/posts/" + newPost!.id)
      .expect(200, newPost);
  });

  it("- PUT post by ID with incorrect data", async () => {
    await request(app)
      .put("/posts/" + newPost!.id)
      .auth("admin", "qwerty")
      .send({
        title: "Start",
        shortDescription: "Costas",
        content: "Costas",
        blogId: 123,
      })
      .expect(400, {
        errorsMessages: [{ message: "Should be a string", field: "blogId" }],
      });

    const res = await request(app).get("/posts/");
    expect(res.body[0]).toEqual(newPost);
  });

  it("+ PUT post by ID with correct data", async () => {
    await request(app)
      .put("/posts/" + newPost!.id)
      .auth("admin", "qwerty")
      .send({
        title: "Start",
        shortDescription: "Costas",
        content: "Costas",
        blogId: "123",
      })
      .expect(204);

    const res = await request(app).get("/posts/");
    expect(res.body[0]).toEqual({
      ...newPost,
      title: "Start",
      shortDescription: "Costas",
      content: "Costas",
      blogId: "123",
    });
    newPost = res.body[0];
  });

  it("- DELETE post by incorrect ID", async () => {
    await request(app)
      .delete("/posts/876328")
      .expect(404)
      .auth("admin", "qwerty");

    const res = await request(app).get("/posts/");
    expect(res.body[0]).toEqual(newPost);
  });

  it("+ DELETE post by correct ID, auth", async () => {
    await request(app)
      .delete("/posts/" + newPost!.id)
      .set("authorization", "Basic YWRtaW46cXdlcnR5")
      .expect(204);

    const res = await request(app).get("/posts/");
    expect(res.body.length).toBe(0);
  });
});
