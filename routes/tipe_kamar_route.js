const express = require(`express`)
const app = express()
app.use(express.json())
const tipe_kamarController = require(`../controllers/tipe_kamar_controller`)

app.get("/getAllTipe_kamar", tipe_kamarController.getAllTipe_kamar)
app.post("/findTipe_kamar", tipe_kamarController.findTipe_kamar)
app.post("/addTipe_kamar", tipe_kamarController.addTipe_kamar)
app.put("/updateTipe_kamar/:id", tipe_kamarController.updateTipe_kamar)
app.delete("/deleteTipe_kamar/:id", tipe_kamarController.deleteTipe_kamar)

module.exports = app