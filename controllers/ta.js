const bcrypt = require("bcrypt")
const TA = require("../models/ta")
const jwt = require('jsonwebtoken');
const joi = require("joi")

exports.selectTAs = (request, response) => {
    const knex = request.app.locals.knex
    knex("tas")
        .select("id", "code", "name", "phone", "email")
        .then(tas => {
            response.status(200).json(tas)
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({
                status: "error",
                msg: "500 Internal Server Error"
            })
        })
}

exports.addTA = (request, response) => {
    const knex = request.app.locals.knex



    const name = request.body.name
    const code = request.body.code
    const phone = request.body.phone
    const email = request.body.email
    const password = request.body.password

    if (!name || !code || !phone || !email || !password) {
        return response.status(400).json({
            status: "error",
            msg: "400 Bad Request"
        })
    }


    const ta = new TA('1', code, phone, name, email, password, 'has')

    const taSchema = joi.object({
        id: joi.string().not().empty().min(1).max(50).pattern(/[0-9]+/).required(),
        code: joi.string().not().empty().min(2).max(5).required(),
        phone: joi.string().required().pattern(/[0-9]{11}/),
        name: joi.string().not().min(3).max(50).pattern(/[a-z A-Z]{3,50}/).required(),
        email: joi.string().email().min(6).max(60).required(),
        password: joi.string().min(6).max(20).required(),
        hashedPassword: joi.string().min(1).max(100).required(),
    })

    const joiError = taSchema.validate(ta)

    if (joiError.error) {
        console.log(joiError.error.details);
        return response.status(400).json({
            status: "error",
            msg: "400 Bad Request"
        }) 
    }

    bcrypt.hash(password, 10, function (err, hash) {
        if (err) {
            console.log(err);
        }
       ta.hashedPassword = hash
        
        knex("tas")
            .insert({
                name: ta.name,
                code: ta.code,
                phone: ta.phone,
                email: ta.email,
                password: ta.hashedPassword,
            })
            .then(data => {
                response.status(201).json({
                    status: "ok",
                    msg: "Created"
                })
            })
            .catch(error => {
                console.log(error);
                response.status(500).json({
                    status: "error",
                    msg: "500 Internal Server Error"
                })
            })



    });


}

exports.login = (request, response) => {

    const knex = request.app.locals.knex

    const email = request.body.email
    const password = request.body.password
    if (!email || !password) {
        return response.status(400).json({
            status: "error",
            msg: "400 Bad Request"
        })
    }

    knex("tas")
        .select('email', 'password')
        .limit(1)
        .where('email', '=', email)
        .then(ta => {
            console.log(ta);
            if (ta[0] != null) {
                bcrypt.compare(password, ta[0].password, (error, result) => {
                    if (error) {
                        console.log(error);
                    }
                    if (result) {

                        const token = jwt.sign({
                            userEmail: ta[0].email,
                            usertype: 'TA'
                        }, "123456", {})

                        response.status(200).json({
                            token: token,
                            status: "ok",
                            msg: "login"
                        })
                    } else {
                        response.status(401).json({
                            status: "error",
                            msg: "invalid password"
                        })
                    }
                })
            } else {
                response.status(401).json({
                    status: "error",
                    msg: "401 not Auth"
                })
            }
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({
                status: "error",
                msg: "500 Internal Server Error"
            })
        })
}