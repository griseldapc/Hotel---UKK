const express = require(`express`)
const app = express()
app.use(express.json())
const tipe_kamarController = require(`../controllers/tipe_kamar_controller`)
const auth = require("../auth/auth")

app.get("/getAllTipe_kamar", tipe_kamarController.getAllTipe_kamar)
app.post("/findTipe_kamar", tipe_kamarController.findTipe_kamar)
app.post("/addTipe_kamar", auth.authVerify, tipe_kamarController.addTipe_kamar)
app.put("/updateTipe_kamar/:id", auth.authVerify, tipe_kamarController.updateTipe_kamar)
app.delete("/deleteTipe_kamar/:id", auth.authVerify, tipe_kamarController.deleteTipe_kamar)

module.exports = app