const Student = require("../models/student")
const bcrypt = require("bcrypt")
const joi = require("joi")

exports.selectStudens = (request, response) => {
    const knex = request.app.locals.knex

    knex("students")
        .select('id', 'name', 'code', 'phone', 'address')
        .then(students => {
            response.status(200).json(students)
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({
                status: "error",
                msg: "500 internal server error"
            })
        })
}

exports.addStudent = (request, response) => {

    const knex = request.app.locals.knex

    const name = request.body.name
    const code = request.body.code
    const phone = request.body.phone
    const address = request.body.address
    const password = request.body.password

    if (!name || !code || !phone || !address || !password ) {
        return response.status(400).json({
            status: "error",
            msg: "400 Bad Request"
        })
    }

    const student = new Student(name, code, phone, address, password, "123")

    const stuSchema = joi.object({
        name: joi.string().not().empty().min(3).max(20).pattern(/[a-z A-Z]{3,20}/).required(),
        code: joi.string().not().empty().min(3).max(20).pattern(/[0-9]{3,20}/).required(),
        phone: joi.string().not().empty().min(3).max(20).pattern(/[0-9]{11}/).required(),
        address: joi.string().not().empty().min(10).max(100).pattern(/[a-z A-Z]{10,100}/).required(),
        password: joi.string().not().empty().min(8).max(100).required(),
        hashedPassword: joi.string().not().empty().min(1).max(5).required(),
    })

    const joiErrors = stuSchema.validate(student)
    if (joiErrors.error) {

        console.log(joiErrors.error.details);
        return response.status(400).json({
            status: "error",
            msg: "400 Bad Request"
        })
    }

    bcrypt.hash(password, 10, (error, hash) => {
        if (error) {
            console.log(error);

            return response.status(500).json({
                status: "error",
                msg: "500 internal server error"
            })
        }

        student.hashedPassword = hash
        knex("students")
            .insert({
                name: student.name,
                code: student.code,
                phone: student.phone,
                address: student.address,
                password: student.hashedPassword,
            })
            .then(data => {
                return response.status(201).json({
                    status: "ok",
                    msg: "created"
                })
            })
            .catch(error => {
                return response.status(400).json({
                    status: "error",
                    msg: "500 internal server error"
                })
            })
    })


}

exports.login = (request, response) => {
    const knex = request.app.locals.knex

    const code = request.body.code
    const password = request.body.password

    if (!code || !password) {
        return response.status(400).json({
            status: "error",
            msg: "400 Bad Request"
        })
    }

    knex("students")
        .select("password", 'name', 'code')
        .where("code", '=', code)
        .limit(1)
        .then(student => {
            if (student[0] == null) {
                return response.status(401).json({
                    status: "error",
                    msg: "invalid email"
                })
            } else {
                bcrypt.compare(password, student[0].password, (error, result) => {
                    if (error) {
                        console.log(error);
                    }
                    if (result) {
                        const token = jwt.sign({
                            studentCode: student[0].code,
                            usertype: "student"
                        }, '12345', {})

                        return response.status(200).json({
                            status: "ok",
                            msg: "Login",
                            token
                        })
                    } else {
                        return response.status(401).json({
                            status: "error",
                            msg: "invalid password"
                        })
                    }
                })

            }

        })
        .catch(error => {
            console.log(error);
            return response.status(400).json({
                status: "error",
                msg: "500 Internal Server Error"
            })
        })

}