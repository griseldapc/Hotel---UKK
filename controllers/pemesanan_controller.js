const { request, response } = require("express")
const detailOfPemesananModel = require(`../models/index`).detail_pemesanan
const pemesananModel = require(`../models/index`).pemesanan
const modelUser = require(`../models/index`).user
const modelCustomer = require(`../models/index`).customer
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
  let nama_user = request.body.nama_user;
  let custId = await modelCustomer.findOne({
    where: {
      [Op.and]: [{ nama: nama_user }],
    },
  });
  if (custId === null) {
    return response.status(400).json({
      success: false,
      message: 'User yang anda inputkan tidak ada',
    });
  } else {
    //tanggal pemesanan sesuai tanggal hari ini + random string
    let date = moment();
    let tgl_pemesanan = date.format("YYYY-MM-DD");

    // Generate a random string (7 characters in this case)
    const random = randomstring.generate(7);

    // Combine timestamp and random string to create nomorPem
    let nomorPem = '${Date.now()}_${random}';

    let check_in = request.body.tgl_check_in;
    let check_out = request.body.tgl_check_out;
    const date1 = moment(check_in);
    const date2 = moment(check_out);

    if (date2.isBefore(date1)) {
      return response.status(400).json({
        success: false,
        message: "masukkan tanggal yang benar",
      });
    }
    let tipe_kamar = request.body.tipe_kamar;

    let tipeRoomCheck = await modelTipekamar.findOne({
      where: {
        [Op.and]: [{ nama_tipe_kamar: tipe_kamar }],
      },
      attributes: [
        "id",
        "nama_tipe_kamar",
        "harga",
        "deskripsi",
        "foto",
        "createdAt",
        "updatedAt",
      ],
    });
    console.log(tipeRoomCheck);
    if (tipeRoomCheck === null) {
      return response.status(400).json({
        success: false,
        message: 'Tidak ada tipe kamar dengan nama itu',
      });
    }
    //mendapatkan kamar yang available di antara tanggal check in dan check out sesuai dengan tipe yang diinput user
    const result = await sequelize.query(
      `SELECT tipe_kamars.nama_tipe_kamar, kamars.nomor_kamar FROM kamars LEFT JOIN tipe_kamars ON kamars.tipeKamarId = tipe_kamars.id LEFT JOIN detail_pemesanans ON detail_pemesanans.kamarId = kamars.id WHERE kamars.id NOT IN (SELECT kamarId from detail_pemesanans WHERE tgl_akses BETWEEN '${check_in}' AND '${check_out}') AND tipe_kamars.nama_tipe_kamar ='${tipe_kamar}' GROUP BY kamars.nomor_kamar`
    );
    //cek apakah ada
    if (result[0].length === 0) {
      return response.status(400).json({
        success: false,
        message: 'Kamar dengan tipe itu dan di tanggal itu sudah terbooking',
      });
    }

    //masukkan nomor kamar ke dalam array
    const array = [];
    for (let index = 0; index < result[0].length; index++) {
      array.push(result[0][index].nomor_kamar);
    }

    //validasi agar input jumlah kamar tidak lebih dari kamar yang tersedia
    if (result[0].length < request.body.jumlah_kamar) {
      return response.status(400).json({
        success: false,
        message: `hanya ada ${result[0].length} kamar tersedia`,
      });
    }

    //mencari random index dengan jumlah sesuai input jumlah kamar
    let randomIndex = [];
    for (let index = 0; index < request.body.jumlah_kamar; index++) {
      randomIndex.push(Math.floor(Math.random() * array.length));
    }

    //isi data random elemnt dengan isi dari array dengan index random dari random index
    let randomElement = [];
    for (let index = 0; index < randomIndex.length; index++) {
      randomElement.push(Number(array[index]));
    }

    console.log("random index", randomIndex);
    console.log("random", randomElement);

    //isi roomId dengan data kamar hasil randoman
    let roomId = [];
    for (let index = 0; index < randomElement.length; index++) {
      roomId.push(
        await kamarModel.findOne({
          where: {
            [Op.and]: [{ nomor_kamar: randomElement[index] }],
          },
          attributes: [
            "id",
            "nomor_kamar",
            "tipeKamarId",
            "createdAt",
            "updatedAt",
          ],
        })
      );
    }

    console.log("roomid", roomId);

    //dapatkan harga dari id_tipe_kamar dikali dengan inputan jumlah kamar
    let roomPrice = 0;
    let cariTipe = await modelTipekamar.findOne({
      where: {
        [Op.and]: [{ id: roomId[0].tipeKamarId }],
      },
      attributes: [
        "id",
        "nama_tipe_kamar",
        "harga",
        "deskripsi",
        "foto",
        "createdAt",
        "updatedAt",
      ],
    });
    roomPrice = cariTipe.harga * request.body.jumlah_kamar;

    let newData = {
      nomor_pemesanan: nomorPem,
      nama_pemesan: request.body.nama_pemesan,
      email_pemesan: request.body.email_pemesan,
      tgl_pemesanan: tgl_pemesanan,
      tgl_check_in: check_in,
      tgl_check_out: check_out,
      nama_tamu: request.body.nama_tamu,
      jumlah_kamar: request.body.jumlah_kamar,
      tipeKamarId: cariTipe.id,
      status_pemesanan: "baru",
      userId: custId.id,
    };

    //menetukan harga dengan cara mengali selisih tanggal check in dan check out dengan harga tipe kamar
    const startDate = moment(newData.tgl_check_in);
    const endDate = moment(newData.tgl_check_out);
    const duration = moment.duration(endDate.diff(startDate));
    const nights = duration.asDays();
    const harga = nights * roomPrice;

    //cek jika ada inputan kosong
    for (const [key, value] of Object.entries(newData)) {
      if (!value || value === "") {
        console.log(`Error: ${key} is empty`);
        return response
          .status(400)
          .json({ error: `${key} kosong mohon di isi` });
      }
    }

    pemesananModel
      .create(newData)
      .then((result) => {
        let pemesananID = result.id;

        let tgl1 = new Date(result.tgl_check_in);
        let tgl2 = new Date(result.tgl_check_out);
        let checkIn = moment(tgl1).format("YYYY-MM-DD");
        let checkOut = moment(tgl2).format("YYYY-MM-DD");

        // check if the dates are valid
        let success = true;
        let message = "";

        //looping detail pemesanan anatar tanggal check in sampai 1 hari sebelum check out agara mudah dalam cek available
        for (
          let m = moment(checkIn, "YYYY-MM-DD");
          m.isBefore(checkOut);
          m.add(1, "days")
        ) {
          let date = m.format("YYYY-MM-DD");

          // isi newDetail dengan id kamar hasil randomana lalu insert dengan di loop sesuai array yang berisi randoman kamar
          let newDetail = [];
          for (let index = 0; index < roomId.length; index++) {
            newDetail.push({
              pemesananId: pemesananID,
              kamarId: roomId[index].id,
              tgl_akses: date,
              harga: harga,
            });
            detailOfPemesananModel
              .create(newDetail[index])
              .then(async (results) => {
                let getData = await sequelize.query(
                  `SELECT  pemesanans.id, pemesanans.nomor_pemesanan, pemesanans.nama_pemesan,pemesanans.email_pemesan,pemesanans.tgl_pemesanan,pemesanans.tgl_check_in,pemesanans.tgl_check_out,detail_pemesanans.harga,pemesanans.nama_tamu,pemesanans.jumlah_kamar,pemesanans.status_pemesanan, users.nama_user, tipe_kamars.nama_tipe_kamar,tipe_kamars.harga as harga_tipe_kamar, kamars.nomor_kamar FROM pemesanans JOIN tipe_kamars ON tipe_kamars.id = pemesanans.tipeKamarId JOIN users ON users.id=pemesanans.userId JOIN detail_pemesanans ON detail_pemesanans.pemesananId=pemesanans.id JOIN kamars ON kamars.id=detail_pemesanans.kamarId WHERE pemesanans.id=${pemesananID} GROUP BY kamars.id`
                );
                return response.json({
                  success: true,
                  message: 'New transactions have been inserted',
                  data: getData[0],
                });
              })
              .catch((error) => {
                return response.status(400).json({
                  success: false,
                  message: error.message,
                });
              });
          }
          console.log(m);
        }
      })
      .catch((error) => {
        return response.status(400).json({
          success: false,
          message: error.message,
        });
      });
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