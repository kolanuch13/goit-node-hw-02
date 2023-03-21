const app = require('./app')
const request = require('supertest')

describe('POST /login' , () => {
  describe("given a email and password", () => {
    test("should respond with a 200 status code", async () => {
      const response = await request(app).post("/api/users/login").send({
        password: "52005200a",
        email: "kolanuch13@gmail.com"
      })
      expect(response.statusCode).toBe(200)
    })

    test("should respond token", async () => {
      const response = await request(app).post("/api/users/login").send({
        password: "52005200a",
        email: "kolanuch13@gmail.com"
      })
      expect(response.body.user.token).toBeDefined()
    })

    test("should respond user with email and subscription as String", async () => {
      const response = await request(app).post("/api/users/login").send({
        password: "52005200a",
        email: "kolanuch13@gmail.com"
      })
      expect(typeof(response.body.user.email)).toBe('string')
      expect(typeof(response.body.user.subscription)).toBe('string')
    })
  })

  describe("when the email or password is missing", () => {
    
  })
})