const { request, response } = require("express");
const modelCustomer = require("../models/index").customer;
const Op = require("sequelize").Op;
const fs = require(`fs`);
const md5 = require(`md5`);

const jsonwebtoken = require("jsonwebtoken")
const SECRET_KEY = "secretcode"

exports.loginCust = async (request, response) => {
    try{
        const params = {
            email: request.body.email,
            password: md5(request.body.password),
        };

        const findCust = await modelCustomer.findOne({where:params});
        if (findCust == null){
            return response.status(404).json({
                message: "email or password doesn't match",
                err: error,
            });
        }
        console.log(findCust)
        let tokenPayload = {
            id: findCust.id,
            email: findCust.email,
            role: findCust.role,
        };
        tokenPayload = JSON.stringify(tokenPayload);
        let token =  jsonwebtoken.sign(tokenPayload, SECRET_KEY);
        
        return response.status(200).json({
            message: "success login",
            data: {
                token: token,
                id: findCust.id,
                email: findCust.email,
                role: findCust.role,
            },
        });
    }
    catch(error){
        return response.status(500).json({
            message: "internal error",
            err: error,
        });
    }
};

function validatePhoneNumber(phoneNumber) {
    // Buat regular expression yang sesuai dengan format nomor HP yang diinginkan.
    // Contoh: Nomor HP Indonesia dengan awalan 08 atau +628
    const phoneRegex = /^(?:\+62|0)[2-9][0-9]{8,12}$/;
  
    // Lakukan validasi dengan regex
    return phoneRegex.test(phoneNumber);
  }

exports.getAllCustomer = async (request, response) => {
  let customers = await modelCustomer.findAll();
  if (customers.length === 0) {
    return response.json({
      success: true,
      data: [],
      message: `Data tidak ditemukan`,
    });
  }
  return response.json({
    success: true,
    data: customers,
    message: `ini adalah semua data Customernya kanjeng ratu`,
  });
};

exports.findCustomer = async (request, response) => {
  let nama = request.body.nama;
  let email = request.body.email;

  if (!nama && !email) {
    return response.status(400).json({
      success: false,
      message: "Minimal satu parameter pencarian harus diisi",
    });
  }

  let customers = await modelCustomer.findAll({
    where: {
      [Op.and]: [
        { nama: { [Op.substring]: nama } },
        { email: { [Op.substring]: email } },
      ],
    },
  });

  if (customers.length === 0) {
    return response.status(404).json({
      success: false,
      message: "Data tidak ditemukan",
    });
  }

  return response.json({
    success: true,
    data: customers,
    message: `berikut data yang anda minta yang mulia`,
  });
};

exports.addCustomer = (request, response) => {
  let newCustomer = {
    nama: request.body.nama,
    nik: request.body.nik,
    email: request.body.email,
    password: md5(request.body.password),
    no_hp: request.body.no_hp,
  };
  if (
    newCustomer.nama === "" ||newCustomer.nik === "" || newCustomer.no_hp === "" || newCustomer.email === "" || newCustomer.password === ""
  ) {
    return response.json({
      success: false,
      message: "Semua data harus diisi",
    });
  }

  modelCustomer
    .create(newCustomer)
    .then((result) => {
      return response.json({
        success: true,
        email: result.email,
        role: result.role,
        message: `Customer telah ditambahkan`,
      });
    })

    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};

exports.updateCustomer = (request, response) => {
  let idCustomer = request.params.id;

  let dataCustomer = {
    nama: request.body.nama,
    nik: request.body.nik,
    no_hp: request.body.no_hp,
    email: request.body.email,
    password: md5(request.body.password),
  };

  modelCustomer
    .update(dataCustomer, { where: { id: idCustomer } })
    .then((result) => {
      return response.json({
        success: true,
        message: `Data Customer has been update`,
      });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};

exports.deleteCustomer = async (request, response) => {
  const id = request.params.id;
  const Customer = await modelCustomer.findOne({ where: { id: id } });
  if (!Customer) {
    return response.json({
      success: false,
      message: `Customer with id ${id} not found`,
    });
  }

  modelCustomer
    .destroy({ where: { id: id } })
    .then((result) => {
      return response.json({
        success: true,
        message: `Data Customer has been deleted`,
      });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};
