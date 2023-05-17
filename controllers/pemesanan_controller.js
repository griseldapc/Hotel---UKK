const { request, response } = require("express")
const detailOfPemesananModel = require(`../models/index`).detail_pemesanan
const pemesananModel = require(`../models/index`).pemesanan
const modelUser = require(`../models/index`).user
const kamarModel = require(`../models/index`).kamar
const modelTipekamar = require("../models/index").tipe_kamar

const Op = require(`sequelize`).Op
const Sequelize = require("sequelize");
const sequelize = new Sequelize("hotelnew", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

exports.getAllPemesanan = async (request, response) => {
  const result = await pemesananModel.findAll({
    include: {
      model: modelTipekamar,
      attributes: ['nama_tipe_kamar']
    }
  });
  if (result.length === 0) {
    return response.json({
      success: true,
      data: [],
      message: "Data tidak ditemukan",
    })
  }

  response.json({
    success: true,
    data: result,
    message: `All Transaction have been loaded...`,
  });
};

exports.findPemesanan = async (request, response) => {
    let status_pemesanan = request.body.status_pemesanan;
    let pemesanans = await pemesananModel.findAll({
      where: {
        [Op.or]: [
          { status_pemesanan: { [Op.substring]: status_pemesanan } },
        ],
      },
    });
    return response.json({
      success: true,
      data: pemesanans,
      message: "All kamars have been loaded",
    });
}

exports.addPemesanan = async (request, response) => {
  let nomor_kamar = request.body.nomor_kamar;
  let kamar = await kamarModel.findOne({
      where:{
          [Op.and]: [{nomor_kamar: {[Op.substring]: nomor_kamar}}],
      },
      attributes: [
          "id",
          "nomor_kamar",
          "tipeKamarId",
          "createdAt",
          "updatedAt",
        ],
        include: {
          model : modelTipekamar,
          attributes: ["harga"]
        }
  });

  let nama_user = request.body.nama_user;
  let userId = await modelUser.findOne({
      where: {
        [Op.and]: [{ nama_user: { [Op.substring]: nama_user } }],
      },
    });

    if (kamar === null) {
      return response.json({
        success: false,
        message: `Kamar yang anda inputkan tidak ada`,
      });
    } else if (userId === null) {
      return response.json({
        success: false,
        message: `User yang anda inputkan tidak ada`,
      });
    }else{
      let newPemesanan = {
          nomor_pemesanan: request.body.nomor_pemesanan,
          nama_pemesan: request.body.nama_pemesan,
          email_pemesan: request.body.email_pemesan,
          tgl_pemesanan: Date.now(),
          tgl_check_in: request.body.tgl_check_in,
          tgl_check_out: request.body.tgl_check_out,
          nama_tamu: request.body.nama_tamu,
          jumlah_kamar: request.body.jumlah_kamar,
          tipeKamarId:kamar.tipeKamarId,
          status_pemesanan: request.body.status_pemesanan,
          userId: userId.id,
      };
      if (newPemesanan.nomor_pemesanan === "" ||newPemesanan.nama_pemesan === "" ||newPemesanan.email_pemesan === ""||
      newPemesanan.tgl_pemesanan === ""||newPemesanan.tgl_check_in === ""||newPemesanan.tgl_check_out === ""||newPemesanan.nama_tamu === ""||
      newPemesanan.jumlah_kamar === ""||newPemesanan.tipeKamarId === ""||newPemesanan.status_pemesanan === ""||newPemesanan.userId === "") {
        return response.json({
          success: false,
          message: "Semua data harus diisi",
        });
      }

      let kamarCheck = await sequelize.query(
          `SELECT * FROM detail_pemesanans WHERE kamarId = ${kamar.id} AND tgl_akses >= "${request.body.tgl_check_in}" AND tgl_akses <= "${request.body.tgl_check_out}";`
        );
        if (kamarCheck[0].length === 0) {
          const tgl_check_in = new Date(request.body.tgl_check_in);
          const tgl_check_out = new Date(request.body.tgl_check_out);
          const diffTime = Math.abs(tgl_check_out - tgl_check_in);
          const diffDays = Math.ceil(diffTime/(1000*60*60*24));

          pemesananModel
            .create(newPemesanan)
            .then((result) => {
              let pemesananID = result.id;
              let detailsOfPemesanan = request.body.details_of_pemesanan;
              let detailData = [];

              for (let i = 0; i < diffDays; i++) {
                let newDetail = {
                  pemesananId: pemesananID,
                  kamarId:kamar.id,
                  tgl_akses: new Date(tgl_check_in.getTime() + i*24*60*60*1000),
                  harga: kamar.tipe_kamar.harga,
                }; 
                detailData.push(newDetail); 
                }

                           
        detailOfPemesananModel
        .bulkCreate(detailData)
        .then((result) => {
          return response.json({
            success: true,
            message: `New transaction has been inserted`,
          });
        })
        .catch((error) => {
          return response.json({
            success: false,
            message: error.message,
          });
        });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
} else {
  return response.json({
    success: false,
    message: `Kamar yang anda pesan sudah di booking`,
  });
}
}
};

  
exports.updatePemesanan = async (request, response) => {
  let nomor_kamar = request.body.nomor_kamar;
  let kamar = await kamarModel.findOne({
      where:{
          [Op.and]: [{nomor_kamar: {[Op.substring]: nomor_kamar}}],
      },
      attributes: [
          "id",
          "nomor_kamar",
          "tipeKamarId",
          "createdAt",
          "updatedAt",
        ],
  });

  let nama_user = request.body.nama_user;
  let userId = await modelUser.findOne({
      where: {
        [Op.and]: [{ nama_user: { [Op.substring]: nama_user } }],
      },
    });

    let Pemesanan = {
      nomor_pemesanan: request.body.nomor_pemesanan,
      nama_pemesan: request.body.nama_pemesan,
      email_pemesan: request.body.email_pemesan,
      tgl_pemesanan: Date.now(),
      tgl_check_in: request.body.tgl_check_in,
      tgl_check_out: request.body.tgl_check_out,
      nama_tamu: request.body.nama_tamu,
      jumlah_kamar: request.body.jumlah_kamar,
      tipeKamarId:kamar.tipeKamarId,
      status_pemesanan: request.body.status_pemesanan,
      userId: userId.id,
  };
  
  let pemesananId = request.params.id;

  try{
    const existingPemesanan = await pemesananModel.findByPk(pemesananId);

    if(!existingPemesanan){
      return response.json({
        success:false,
        message: ` Pemesanan dengan Id${pemesananId} tidak ditemukan`,
      })
    }
    await existingPemesanan.update(Pemesanan);
    return response.json({
      success:true,
      message:`pemesanan dengan Id${pemesananId} berhasil diupdate`
    });
  }catch(error){
    return response.json({
      success:false,
      message: error.message,
    });
  }
}


exports.deletePemesanan = async (request, response) => {
  let pemesananId = request.params.id
  detailOfPemesananModel
  .destroy({
    where: {id:pemesananId},
  })
  .then((result) => {
    pemesananModel.destroy({where: {id:pemesananId}})
    .then((result)=> {
      return response.json({
        success: true,
        message: 'transaksi terhapus'
      });
    })
  .catch((error)=>{
    return response.json({
      success:false,
      message:error.message,
    });
  });   
})
.catch((error) => {
return response.json({
  success: false,
  message: error.message,
});
});
};

exports.updateStatusPemesanan = async (req, res) => {
  try {
    const params = { id: req.params.id };

    const result = await pemesananModel.findOne({ where: params });
    if (!result) {
      return res.status(404).json({
        message: "Data not found!",
      });
    }

    const data = {
      status_pemesanan: req.body.status_pemesanan,
    };

    if (data.status_pemesanan === "check_out") {
      await pemesananModel.update(data, { where: params });

      const updateTglAccess = {
        tgl_akses: null,
      };
      await detailOfPemesananModel.update(updateTglAccess, { where: params });
      return res.status(200).json({
        message: "Success update status booking to check out",
        code: 200,
      });
    }

    await pemesananModel.update(data, { where: params });
    return res.status(200).json({
      message: "Success update status booking",
      code: 200,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal error",
      err: err,
    });
  }
};


// const { request, response } = require("express")
// const detailOfPemesananModel = require(`../models/index`).detail_pemesanan
// const pemesananModel = require(`../models/index`).pemesanan
// const modelUser = require(`../models/index`).user
// const kamarModel = require(`../models/index`).kamar

// const Op = require(`sequelize`).Op
// const Sequelize = require("sequelize");
// const sequelize = new Sequelize("hotell", "root", "", {
//   host: "localhost",
//   dialect: "mysql",
// });

// exports.getAllPemesanan = async (request, response) => {
//     try{
//         let pemesanans = await pemesananModel.findAll()
//         return response.json({
//         success: true,
//         data: pemesanans,
//         message: `semua data sukses ditampilkan sesuai yang anda minta tuan`
//     })
    
//     }catch{
//       response.send("err")  
//     } 
// }

// exports.findPemesanan = async (request, response) => {
//     let status = request.body.status;
//     let pemesanans = await pemesananModel.findAll({
//       where: {
//         [Op.or]: [
//           { status: { [Op.substring]: status } },
//         ],
//       },
//     });
//     return response.json({
//       success: true,
//       data: pemesanans,
//       message: "All kamars have been loaded",
//     });
// }

// exports.addPemesanan = async (request, response) => {
//     let nomor_kamar = request.body.nomor_kamar;
//     let kamar = await kamarModel.findOne({
//         where:{
//             [Op.and]: [{nomor_kamar: {[Op.substring]: nomor_kamar}}],
//         },
//         attributes: [
//             "id",
//             "nomor_kamar",
//             "tipeKamarId",
//             "createdAt",
//             "updatedAt",
//           ],
//     });

//     let nama_user = request.body.nama_user;
//     let userId = await modelUser.findOne({
//         where: {
//           [Op.and]: [{ nama_user: { [Op.substring]: nama_user } }],
//         },
//       });

//       if (kamar === null) {
//         return response.json({
//           success: false,
//           message: `Kamar yang anda inputkan tidak ada`,
//         });
//       } else if (userId === null) {
//         return response.json({
//           success: false,
//           message: `User yang anda inputkan tidak ada`,
//         });
//       }else{
//         let newPemesanan = {
//             nomor_pemesanan: request.body.nomor_pemesanan,
//             nama_pemesan: request.body.nama_pemesan,
//             email_pemesan: request.body.email_pemesan,
//             tgl_pemesanan: request.body.tgl_pemesanan,
//             tgl_check_in: request.body.tgl_check_in,
//             tgl_check_out: request.body.tgl_check_out,
//             nama_tamu: request.body.nama_tamu,
//             jumlah_kamar: request.body.jumlah_kamar,
//             tipeKamarId:kamar.tipeKamarId,
//             status_pemesanan: request.body.status_pemesanan,
//             userId: userId.id,
    
//         };

//         let kamarCheck = await sequelize.query(
//             `SELECT * FROM detail_pemesanans WHERE kamarId = ${kamar.id} AND tgl_akses= ${request.body.tgl_check_in}`
//           );
//           if (kamarCheck[0].length === 0) {
//             pemesananModel
//               .create(newPemesanan)
//               .then((result) => {
//                 let pemesananID = result.id;
//                 let detailsOfPemesanan = request.body.details_of_pemesanan;

//                 for (let i = 0; i < detailsOfPemesanan.length; i++) {
//                     detailsOfPemesanan[i].pemesananId = pemesananID;
//                   }

//                   let newDetail = {
//                     pemesananId: pemesananID,
//                     kamarId:kamar.id,
//                     tgl_akses: result.tgl_check_in,
//                     harga: detailsOfPemesanan[0].harga,
//                   };

                  
//           detailOfPemesananModel
//           .create(newDetail)
//           .then((result) => {
//             return response.json({
//               success: true,
//               message: `New transaction has been inserted`,
//             });
//           })
//           .catch((error) => {
//             return response.json({
//               success: false,
//               message: error.message,
//             });
//           });
//       })
//       .catch((error) => {
//         return response.json({
//           success: false,
//           message: error.message,
//         });
//       });
//   } else {
//     return response.json({
//       success: false,
//       message: `Kamar yang anda pesan sudah di booking`,
//     });
//   }
// }
// };

  
// exports.updatePemesanan = async (request, response) => {

//     let id = request.params.id
//     let pemesanan = {
//         nomor_pemesanan: request.body.nomor_pemesanan,
//         nama_pemesan: request.body.nama_pemesan,
//         email_pemesan: request.body.email_pemesan,
//         tgl_pemesanan: request.body.tgl_pemesanan,
//         tgl_check_in: request.body.check_in,
//         tgl_check_out: request.body.tgl_check_out,
//         nama_tamu: request.body.nama_tamu,
//         jumlah_kamar: request.body.jumlah_kamar,
//         tipeKamarId: request.body.tipeKamarId,
//         status_pemesanan: request.body.status_pemesanan,
//         userId: request.body.userId,
//     }
//     pemesananModel.update(pemesanan, { where: { id: id } })
//         .then(result => {
//             return response.json({
//                 success: true,
//                 message: `Data terupdate`
//             })
//         })
//         .catch(error => {
//             return response.json({
//                 success: false,
//                 message: 'gabisa'
//             })
//         })
// }


// exports.deletePemesanan = async (request, response) => {
//     let id = request.params.id

//     pemesananModel.destroy({ where: { id: id } })
//         .then(result => {
//             return response.json({
//                 success: true,
//                 message: `Data tipe pemesanan has been deleted`
//             })
//         })
//         .catch(error => {
//             return response.json({
//                 success: false,
//                 message: error.message
//             })
//         })
// }