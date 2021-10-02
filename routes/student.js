const studentRouter = require("express").Router()
const studentController = require("../controllers/student")
const middleWares = require("../util/middlewares")

studentRouter.get("", studentController.selectStudens)
studentRouter.post("", middleWares.checkTAAuth, studentController.addStudent)
studentRouter.post("/login", studentController.login)
studentRouter.put("", middleWares.checkTAAuth, )
studentRouter.delete("", )



module.exports = studentRouter