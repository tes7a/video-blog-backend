// import request from "supertest";
// import { app } from "..";
// import { BlogType } from "../db/blogs.db";

// describe("/blogs", () => {
//   let newBlog: BlogType | null = null;

//   beforeAll(async () => {
//     await request(app).delete("/testing/all-data").expect(204);
//   });

//   it("GET blogs = []", async () => {
//     await request(app).get("/blogs/").expect([]);
//   });

//   it("there should be an authorization sent before the post", async function () {
//     await request(app).post("/blogs/").auth("admin", "qwerty").expect(400);
//   });

//   it("- POST does not create the blog with incorrect data (no name, no description, no URL)", async function () {
//     await request(app)
//       .post("/blogs/")
//       .auth("admin", "qwerty")
//       .send({ name: "", description: "", websiteUrl: "" })
//       .expect(400, {
//         errorsMessages: [
//           { message: "Should not be empty", field: "name" },
//           { message: "Should not be empty", field: "description" },
//           { message: "Should not be empty", field: "websiteUrl" },
//         ],
//       });

//     const res = await request(app).get("/blogs/");
//     expect(res.body).toEqual([]);
//   });

//   it("POST new object in DB", async () => {
//     const postRes = await request(app)
//       .post("/blogs/")
//       .auth("admin", "qwerty")
//       .send({
//         name: "Start",
//         description: "Costas",
//         websiteUrl: "https://deepl.com/ru/translator",
//       })
//       .expect(201);
//     newBlog = postRes.body;

//     const res = await request(app).get("/blogs/");
//     expect(res.body[0]).toEqual(postRes.body);
//   });

//   it("- GET blog by ID with incorrect id", async () => {
//     await request(app).get("/blogs/helloWorld").expect(404);
//   });
//   it("+ GET product by ID with correct id", async () => {
//     await request(app)
//       .get("/blogs/" + newBlog!.id)
//       .expect(200, newBlog);
//   });

//   it("- PUT blog by ID with incorrect data", async () => {
//     await request(app)
//       .put("/blogs/" + newBlog!.id)
//       .auth("admin", "qwerty")
//       .send({ name: "title", description: "fsdfsdf", websiteUrl: 123123 })
//       .expect(400, {
//         errorsMessages: [
//           { message: "Should be a string", field: "websiteUrl" },
//         ],
//       });

//     const res = await request(app).get("/blogs/");
//     expect(res.body[0]).toEqual(newBlog);
//   });

//   it("+ PUT product by ID with correct data", async () => {
//     await request(app)
//       .put("/blogs/" + newBlog!.id)
//       .auth("admin", "qwerty")
//       .send({
//         name: "hello title",
//         description: "hello author",
//         websiteUrl: "https://deepl.com/ru/translator",
//       })
//       .expect(204);

//     const res = await request(app).get("/blogs/");
//     expect(res.body[0]).toEqual({
//       ...newBlog,
//       name: "hello title",
//       description: "hello author",
//       websiteUrl: "https://deepl.com/ru/translator",
//     });
//     newBlog = res.body[0];
//   });

//   it("- DELETE blog by incorrect ID", async () => {
//     await request(app)
//       .delete("/blogs/876328")
//       .expect(404)
//       .auth("admin", "qwerty");

//     const res = await request(app).get("/blogs/");
//     expect(res.body[0]).toEqual(newBlog);
//   });

//   it("+ DELETE blog by correct ID, auth", async () => {
//     await request(app)
//       .delete("/blogs/" + newBlog!.id)
//       .set("authorization", "Basic YWRtaW46cXdlcnR5")
//       .expect(204);

//     const res = await request(app).get("/blogs/");
//     expect(res.body.length).toBe(0);
//   });
// });
