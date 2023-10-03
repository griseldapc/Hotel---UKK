const express = require(`express`)
const app = express()
const PORT = 8080
const cors = require(`cors`)
app.use(cors())
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static("foto"))

const userRoute = require(`./routes/user_route`)
const tipeKamarRoute = require(`./routes/tipe_kamar_route`)
const kamarRoute = require(`./routes/kamar_route`)
const pemesananRoute = require(`./routes/pemesanan_route`)
const customerRoute = require(`./routes/customer_route`)

app.use(`/user`, userRoute)
app.use(`/tipe_kamar`, tipeKamarRoute)
app.use(`/kamar`, kamarRoute)
app.use(`/pemesanan`, pemesananRoute)
app.use(`/customer`, customerRoute)

app.listen(PORT, () => {
    console.log(`Server of Hotel runs on port
    ${PORT}`)
    })
    