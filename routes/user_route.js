const express = require(`express`)
const app = express()
app.use(express.json())
const userController = require(`../controllers/user_controller`)
 
const router = new express.Router()
const auth = require("../auth/auth")

app.post("/login", userController.login)
app.get("/getAllUser", auth.authVerify, userController.getAllUser)
app.post("/findUser", auth.authVerify, userController.findUser)
app.post("/addUser", auth.authVerify, userController.addUser)
app.put("/updateUser/:id", auth.authVerify, userController .updateUser)
app.delete("/deleteUser/:id", auth.authVerify, userController.deleteUser)
 
module.exports = app