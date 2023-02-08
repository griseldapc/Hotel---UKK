const express = require(`express`)
const app = express()
app.use(express.json())
const kamarController = require(`../controllers/kamar_controller`)
 

app.get("/getAllKamar", kamarController.getAllKamar)
app.post("/findKamar", kamarController.findKamar)
app.post("/addKamar", kamarController.addKamar)
app.put("/updateKamar/:id", kamarController.updateKamar)
app.delete("/deleteKamar/:id", kamarController.deleteKamar)

module.exports = app