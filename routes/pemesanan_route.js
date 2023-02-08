const express = require(`express`)
const app = express()
app.use(express.json())
const pemesananController = require(`../controllers/pemesanan_controller`)
 

app.get("/getAllPemesanan", pemesananController.getAllPemesanan)
app.post("/findPemesanan", pemesananController.find)
app.post("/addPemesanan", pemesananController.addPemesanan)
app.put("/updatePemesanan/:id", pemesananController.updatePemesanan)
app.delete("/deletePemesanan/:id", pemesananController.deletePemesanan)

module.exports = app