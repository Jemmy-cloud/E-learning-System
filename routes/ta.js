const taRouter = require("express").Router()
const taController = require("../controllers/ta")


taRouter.get("/", taController.selectTAs)


taRouter.post("/", taController.addTA)
taRouter.post("/login", taController.login)



module.exports = taRouter