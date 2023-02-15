const { request, response } = require("express")
const modelUser = require("../models/index").user
const Op = require('sequelize').Op
const path = require("path")
const upload = require(`./upload_foto`).single(`foto`)
const fs = require(`fs`)
const md5 = require(`md5`)
const jsonwebtoken = require("jsonwebtoken")
const SECRET_KEY = "secretcode"

exports.login = async (req, res) => {
    try{
        const params = {
            email : req.body.email,
            password: md5(req.body.password),
        };

        const findUser = await modelUser.findOne({ where : params });

        if (findUser == null){
            return res.status(404).json({
                message: "email or password doesnt`t match",
            });
        }

        console.log(findUser)
        //generate jwb token
        let tokenPayload ={
            id: findUser.id,
            email: findUser.email,
            role: findUser.role,
        };

        tokenPayload = JSON.stringify(tokenPayload);
        let token =  jsonwebtoken.sign(tokenPayload, SECRET_KEY);

        return res.status(200).json({
            message: "Success Login",
            data: {
                token: token,
                id: findUser.id,
                email: findUser.email,
                role: findUser.role,
            },
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal error",
            err: err,
        })
    }
}

exports.getAllUser = async (request, response) => {
    let users = await modelUser.findAll()
    return response.json({
        success: true,
        data: users,
        message: `ini adalah semua data user`
    })
}

exports.findUser = async (request, response) => {
    let nama_user = request.body.nama_user
    let email = request.body.email
    let role = request.body.role

    let users = await modelUser.findAll({
        where: {
            [Op.and]: [
                { nama_user: { [Op.substring]: nama_user } },
                { email: { [Op.substring]: email } },
                { role: { [Op.substring]: role } }
            ]
        }
    })
    return response.json({
        success: true,
        data: users,
        message: `berikut data yang anda minta yang mulia`
    })
}

exports.addUser = (request, response) => {
    upload(request, response, async error => {
        if (error) {
            return response.json({ message: error })
        }

        if (!request.file) {
            return response.json({
                message: `Nothing to Upload`
            })
        }

        let newUser = {
            nama_user: request.body.nama_user,
            foto: request.file.filename,
            email: request.body.email,
            password: md5(request.body.password),
            role: request.body.role,
        }

        modelUser.create(newUser).then(result => {
            return response.json({
                success: true,
                data: result,
                message: `User telah ditambahkan`
            })
        })

            .catch(error => {
                return response.json({
                    success: false,
                    message: error.message
                })
            })
    })
}

exports.deleteUser = (request, response) => {
    let idUser = request.params.id
    modelUser.destroy({ where: { id: idUser } })
        .then(result => {
            return response.json({
                success: true,
                message: `Data user has been deleted`
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}


exports.updateUser = async (request, response) => {
    upload(request, response, async error => {
        if (error) {
            return response.json({ message: error })
        }
        let id = request.params.id
        let user = {
            nama_user: request.body.nama_user,
            foto: request.file.filename,
            email: request.body.email,
            password: md5(request.body.password),
            role: request.body.role,
        }

        if (request.file) {
            const selectedUser = await modelUser.findOne({
                where: { id: id }
            })

            const oldFotoUser = selectedUser.foto
            const pathFoto = path.join(__dirname, `../foto`, oldFotoUser)

            if (fs.existsSync(pathFoto)) {
                fs.unlink(pathFoto, error =>
                    console.log(error))
            }
            user.foto = request.file.filename
        }

        modelUser.update(user, { where: { id: id } })
            .then(result => {
                return response.json({
                    success: true,
                    message: `Data terupdate`
                })
            })
            .catch(error => {
                return response.json({

                })
            })
    })
}