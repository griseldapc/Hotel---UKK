const express = require(`express`)
const app = express()
app.use(express.json())

const customerController = require(`../controllers/customer_controller`)
const auth = require(`../auth/auth`)

app.post("/loginCust", customerController.loginCust)
app.get("/getAllCustomer", customerController.getAllCustomer)
app.post("/findCustomer", customerController.findCustomer)
app.post("/addCustomer", customerController.addCustomer)
app.put("/updateCustomer/:id", customerController.updateCustomer)
app.delete("/deleteCustomer/:id", customerController.deleteCustomer);

module.exports = app