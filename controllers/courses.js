const Course = require("../models/courses")
const joi = require("joi")
exports.selectCourses = (request, response) => {
    const knex = request.app.locals.knex

    knex("courses")
        .select(['id', 'name', 'syllabus'])
        .then(courses => {
            response.status(200).json(courses)
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({
                status: "error",
                msg: "500 internal server error"
            })
        })


}
exports.addCourse = (request, response) => {
    const knex = request.app.locals.knex

    const name = request.body.name
    const syllabus = request.body.syllabus

    if (!name || !syllabus) {
        return response.status(400).json({
            status: "error",
            msg: "400 Bad Request"
        })
    }
    const course = new Course(name, '0', syllabus)

    const courseSchema = joi.object({
        id: joi.number().min(0).max(50).required(),
        name: joi.string().not().empty().normalize().min(3).max(20).pattern(/[a-z A-Z]{3,20}/).required(),
        syllabus: joi.string().not().empty().normalize().min(3).max(100).pattern(/[a-z A-Z]{3,100}/).required(),

    })

    const joiErrors = courseSchema.validate(course)

    if (joiErrors.error) {
        console.log(joiErrors.error.details);
        return response.status(400).json({
            status: "error",
            msg: "400 Bad Request"
        })
    }

    knex("courses")
        .insert({
            name: course.name,
            syllabus: course.syllabus,
        })
        .then(data => {
            return response.status(201).json({
                status: "ok",
                msg: "created"
            })

        })
        .catch(error => {
            console.log(error);
            return response.status(400).json({
                status: "error",
                msg: "500 internal server error"
            })
        })
}


exports.updateCourse = (request, response) => {
    const knex = request.app.locals.knex

}
exports.deleteCourse = (request, response) => {
    const knex = request.app.locals.knex

}
exports.restoreCourse = (request, response) => {
    const knex = request.app.locals.knex

}






