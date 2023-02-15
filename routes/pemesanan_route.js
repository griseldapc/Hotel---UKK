const express = require(`express`)
const app = express()
app.use(express.json())
var bodyParser = require("body-parser")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const pemesananController = require(`../controllers/pemesanan_controller`)
const auth = require("../auth/auth")

app.get("/getAllPemesanan", pemesananController.getAllPemesanan)
app.post("/findPemesanan", pemesananController.findPemesanan)
app.post("/addPemesanan", auth.authVerify, pemesananController.addPemesanan)
app.put("/updatePemesanan/:id", auth.authVerify, pemesananController.updatePemesanan)
app.delete("/deletePemesanan/:id", auth.authVerify, pemesananController.deletePemesanan)

module.exports = app