class Student {
    constructor(name, code, phone, address, password,hashedPassword){
        this.name = name
        this.code = code
        this.phone = phone
        this.address = address
        this.password = password
        this.hashedPassword = hashedPassword
    }
}


module.exports = Student