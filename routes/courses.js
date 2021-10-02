const courseRouter = require("express").Router()
const middlewares = require("../util/middlewares")
const courseController = require("../controllers/courses")

courseRouter.get("", courseController.selectCourses)
courseRouter.post("", courseController.addCourse)
courseRouter.put("", middlewares.checkTAAuth)
courseRouter.delete("", middlewares.checkTAAuth)
courseRouter.patch("", middlewares.checkTAAuth)


module.exports = courseRouter