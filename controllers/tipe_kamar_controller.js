const { request, response } = require("express")
const Tipe_kamarModel = require("../models/index").tipe_kamar
const Op = require('sequelize').Op
const path = require("path")
const upload = require(`./upload_foto`).single(`foto`)
const fs = require(`fs`)
const md5 = require(`md5`)


exports.getAllTipe_kamar = async (request, response) => {
    let tipe_kamars = await Tipe_kamarModel.findAll()
    return response.json({
        success: true,
        data: tipe_kamars,
        message: `ini adalah semua data tipe kamar`
    })
}

exports.findTipe_kamar = async (request, response) => {
    let nama_tipe_kamar = request.body.nama_tipe_kamar
    let harga = request.body.harga

    let tipe_kamars = await Tipe_kamarModel.findAll({
        where: {
            [Op.and]: [
                { nama_tipe_kamar: { [Op.substring]: nama_tipe_kamar } },
                { harga: { [Op.substring]: harga } },
            ]
        }
    })
    return response.json({
        success: true,
        data: tipe_kamars,
        message: `berikut data yang anda minta yang mulia`
    })
}

exports.addTipe_kamar = (request, response) => {
    upload(request, response, async (error) => {
        if (error) {
            return response.json({ message: error })
        }

        if (!request.file) {
            return response.json({
                message: `Nothing to Upload`
            })
        }

        let newTipe_kamar = {
            nama_tipe_kamar: request.body.nama_tipe_kamar,
            // foto: request.file.filename,
            harga: request.body.harga,
            deskripsi: request.body.deskripsi
        }
        if(request.file && request.file.filename) {
            newTipe_kamar.foto = request.file.filename
        }

        Tipe_kamarModel.create(newTipe_kamar).then(result => {
            return response.json({
                success: true,
                data: result,
                message: `Tipe kamar telah ditambahkan`
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

exports.deleteTipe_kamar = (request, response) => {
    let idTipe_kamar = request.params.id
    Tipe_kamarModel.destroy({ where: { id: idTipe_kamar } })
        .then(result => {
            return response.json({
                success: true,
                message: `Data tipe kamar has been deleted`
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}


//  

exports.updateTipe_kamar = async (request, response) => {
    upload(request, response, async error => {
        if (error) {
            return response.json({ message: error })
        }
        let idTipe_kamar = request.params.id
        let tipe_kamar = {
            nama_tipe_kamar: request.body.nama_tipe_kamar,
            // foto: request.file.filename,
            harga: request.body.harga,
            deskripsi: request.body.deskripsi,
        }

        if(request.file && request.file.filename) {
            tipe_kamar.foto = request.file.filename
        }

        if (request.file) {
            const selectedTipe_kamar = await Tipe_kamarModel.findOne({
                where: { id: idTipe_kamar }
            })

            const oldFotoTipe_kamar = selectedTipe_kamar.foto
            const pathFoto = path.join(__dirname, `./foto`, oldFotoTipe_kamar)

            if (fs.existsSync(pathFoto)) {
                fs.unlink(pathFoto, error =>
                    console.log(error))
            }
            tipe_kamar.foto = request.file.filename
        }

        Tipe_kamarModel.update(Tipe_kamarModel, { where: { id: idTipe_kamar } })
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