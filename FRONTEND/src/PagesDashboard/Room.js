// import React from "react";
// import Sidebar from "../Components/Sidebar";
// import Header from "../Components/Header";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faPlus,
//   faTrash,
//   faPencilSquare,
//   faSearch,
// } from "@fortawesome/free-solid-svg-icons";
// import axios from "axios";
// import $ from "jquery";

// export default class Room extends React.Component {
//   constructor() {
//     super();
//     this.state = {
//       room: [],
//       typeroom: [],
//       id: "",
//       nomor_kamar: "",
//       tipeKamarId: "",
//       nama_tipe_kamar: "",
//       harga: "",
//       deskripsi: "",
//       foto: "",
//       role: "",
//       token: "",
//       action: "",
//       keyword: "",
//     };
    

//     if (localStorage.getItem("token")) {
//       if (
//         localStorage.getItem("role") === "admin" ||
//         localStorage.getItem("role") === "resepsionis"
//       ) {
//         this.state.token = localStorage.getItem("token");
//         this.state.role = localStorage.getItem("role");
//       } else {
//         window.alert("You're not admin or resepsionis!");
//         window.location = "/";
//       }
//     }
//   }

//   headerConfig = () => {
//     let header = {
//       headers: { Authorization: `Bearer ${this.state.token}` },
//     };
//     return header;
//   };

//   handleChange = (e) => {
//     this.setState({
//       [e.target.name]: e.target.value,
//     });
//   };

//   handleClose = () => {
//     $("#modal_room").hide();
//   };

//   _handleFilter = () => {
//     let data = {
//       keyword: this.state.keyword,
//     };
//     let url = "http://localhost:8080/kamar/findAllKamar/";
//     axios
//       .post(url, data)
//       .then((response) => {
//         if (response.status === 200) {
//           this.setState({
//             room: response.data.data,
//           });
//         } else {
//           alert(response.data.message);
//           this.setState({ message: response.data.message });
//         }
//       })
//       .catch((error) => {
//         console.log("error", error.response.status);
//       });
//   };

//   handleAdd = () => {
//     $("#modal_room").show();
//     this.setState({
//       id: "",
//       nomor_kamar: "",
//       tipeKamarId: "",
//       action: "insert",
//     });
//   };

//   handleEdit = (item) => {
//     $("#modal_room").show();
//     this.setState({
//       id: item.id,
//       nomor_kamar: item.nomor_kamar,
//       tipeKamarId: item.tipeKamarId,
//       action: "update",
//     });
//   };

//   handleSave = (e) => {
//     e.preventDefault();

//     let form = {
//       id: this.state.id,
//       nomor_kamar: this.state.nomor_kamar,
//       tipeKamarId: this.state.tipeKamarId,
//     };

//     if (this.state.action === "insert") {
//       let url = "http://localhost:8080/kamar/addKamar";
//       axios
//         .post(url, form, this.headerConfig())
//         .then((response) => {
//           this.getRoom();
//           this.handleClose();
//         })
//         .catch((error) => {
//           console.log("error add data", error.response.status);
//           if (error.response.status === 500) {
//             window.alert("Failed to add data");
//           }
//         });
//     } else {
//       let url = "http://localhost:8080/kamar/updateKamar/" + this.state.id;
//       axios
//         .put(url, form, this.headerConfig())
//         .then((response) => {
//           this.getRoom();
//           this.handleClose();
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     }
//   };

//   handleDrop = (id) => {
//     let url = "http://localhost:8080/kamar/deleteKamar/" + id;
//     if (window.confirm("Are you sure to delete this room")) {
//       axios
//         .delete(url, this.headerConfig())
//         .then((response) => {
//           console.log(response.data.message);
//           this.getRoom();
//         })
//         .catch((error) => {
//           if (error.response.status === 500) {
//             window.alert("You can't delete this data");
//           }
//         });
//     }
//   };

//   getRoom = () => {
//     let url = "http://localhost:8080/kamar/getAllKamar/";
//     axios
//       .get(url, this.headerConfig())
//       .then((response) => {
//         this.setState({
//           room: response.data.data,
//         });
//         console.log(response.data.data);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };

//   getTypeRoom = () => {
//     let url = "http://localhost:8080/tipe_kamar/getAllTipe_kamar";
//     axios
//       .get(url, this.headerConfig())
//       .then((response) => {
//         this.setState({
//           typeroom: response.data.data,
//         });
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };

//   checkRole = () => {
//     if (this.state.role !== "admin" && this.state.role !== "resepsionis") {
//       localStorage.clear();
//       window.alert("You're not admin or resepsionis!");
//       window.location = "/";
//     }
//   };

//   componentDidMount() {
//     this.getRoom();
//     this.getTypeRoom();
//     this.checkRole();
//     console.log('item', this.item)
//   }

//   render() {
//     return (
//       <div className="flex flex-row min-h-screen bg-gray-100 text-gray-800">
//         <Sidebar />
//         <main className="main flex flex-col flex-grow -ml-64 md:ml-0 transition-all duration-150 ease-in">
//           <Header />
//           <div className="main-content flex flex-col flex-grow p-4 pl-20 ml-20">
//             <h1 className="font-bold text-xl text-black-700 ml-52">Daftar Room</h1>
//             <p className="text-gray-700 ml-52">For Room in Hotel Slippy</p>

//             <div className="flex mt-2 flex-row-reverse mr-4">
//               <div className="flex rounded w-1/2">
//                 <input
//                   type="text"
//                   className="w-2/3 block w-full px-4 py-2 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
//                   placeholder="Cari disini"
//                   name="keyword"
//                   value={this.state.keyword}
//                   onChange={this.handleChange}
//                 />
//                 <button
//                   className="w-1/8 ml-2 px-4 text-white bg-blue-100 border border-1 border-blue-600 rounded hover:bg-blue-200"
//                   onClick={this._handleFilter}
//                 >
//                   <FontAwesomeIcon icon={faSearch} color="blue" />
//                 </button>
//                 {this.state.role === "admin" && (
//                   <button
//                     className="w-1/3 ml-2 px-4 text-white bg-blue-600 rounded hover:bg-blue-700"
//                     onClick={() => this.handleAdd()}
//                   >
//                     <FontAwesomeIcon icon={faPlus} size="" /> Add
//                   </button>
//                 )}
//               </div>
//             </div>

//             <div className="flex flex-col mt-2 mr-4">
//               <div className="-my-2 mx-6 overflow-x-auto sm:-mx-6 lg:-mx-8">
//                 <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
//                   <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th
//                             scope="col"
//                             className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                           >
//                             No
//                           </th>
//                           <th
//                             scope="col"
//                             className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                           >
//                             Room Number
//                           </th>
//                           <th
//                             scope="col"
//                             className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                           >
//                             Room Type
//                           </th>
//                           {this.state.role === "admin" && (
//                             <th
//                               scope="col"
//                               className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                             >
//                               Aksi
//                             </th>
//                           )}
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {this.state.room.map((item, index) => 
//                       {  
//                         return(
                          
//                           <tr key={index}>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <div className="text-sm text-gray-900">
//                                 {index + 1}
//                               </div>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <div className="text-sm font-medium text-gray-900">
//                                 Room-{item.nomor_kamar}
//                               </div>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                                 <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
//                                 {item.tipe_kamar?.nama_tipe_kamar}
//                                   </span>
//                             </td>
//                             {this.state.role === "admin" && (
//                               <td className="px-6 py-4 whitespace-nowrap">
//                                 <button
//                                   className="bg-green-600 hover:bg-green-700 text-white py-1 px-2 rounded mr-2"
//                                   onClick={() => this.handleEdit(item)}
//                                 >
//                                   <FontAwesomeIcon
//                                     icon={faPencilSquare}
//                                     size="lg"
//                                   />
//                                 </button>
//                                 <button
//                                   className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded"
//                                   onClick={() => this.handleDrop(item.id)}
//                                 >
//                                   <FontAwesomeIcon icon={faTrash} size="lg" />
//                                 </button>
//                               </td>
//                             )}
//                           </tr>
//                         )})}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <footer className="footer px-4 py-2">
//             <div className="footer-content">
//               <p className="text-sm text-gray-600 text-center">
//                 © Brandname 2023. All rights reserved.
//               </p>
//             </div>
//           </footer>
//         </main>

//         {/* Modal Form */}
//         <div
//           id="modal_room"
//           tabindex="-1"
//           aria-hidden="true"
//           className="overflow-x-auto fixed top-0 left-0 right-0 z-50 hidden w-full p-4 md:inset-0 h-modal md:h-full bg-tranparent bg-black bg-opacity-50"
//         >
//           <div className="flex lg:h-auto w-auto justify-center ">
//             <div className="relative bg-white rounded-lg shadow dark:bg-white w-1/3">
//               <button
//                 type="button"
//                 className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
//                 onClick={() => this.handleClose()}
//               >
//                 <svg
//                   aria-hidden="true"
//                   className="w-5 h-5"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     fill-rule="evenodd"
//                     d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//                     clip-rule="evenodd"
//                   ></path>
//                 </svg>
//                 <span className="sr-only">Tutup modal</span>
//               </button>
//               <div className="px-6 py-6 lg:px-8">
//                 <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-black">
//                   Edit Room
//                 </h3>
//                 <form
//                   className="space-y-6"
//                   onSubmit={(event) => this.handleSave(event)}
//                 >
//                   <div>
//                     <label
//                       for="nomor_kamar"
//                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800"
//                     >
//                       Room Number
//                     </label>
//                     <input
//                       type="text"
//                       name="nomor_kamar"
//                       id="nomor_kamar"
//                       value={this.state.nomor_kamar}
//                       onChange={this.handleChange}
//                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800"
//                       placeholder="Masukkan number of room"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label
//                       for="tipeKamarId"
//                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800"
//                     >
//                       Room Types
//                     </label>
//                     <select
//                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
//                       placeholder="Jenis Room Type"
//                       name="tipeKamarId"
//                       value={this.state.tipeKamarId}
//                       onChange={this.handleChange}
//                       required
//                     >
//                       <option value="">Pilih Room Type</option>
//                       {this.state.typeroom.map((item) => (
//                         <option value={item.id}>
//                           {item.nama_tipe_kamar}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <button
//                     type="submit"
//                     className="w-full text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
//                   >
//                     Simpan
//                   </button>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }


import React from "react";
import Sidebar from "../Components/Sidebar";
// import Header from "../Components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faPencilSquare,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import $ from "jquery";

export default class Room extends React.Component {
  constructor() {
    super();
    this.state = {
      room: [],
      typeroom: [],
      id: "",
      nomor_kamar: "",
      tipeKamarId: "",
      nama_tipe_kamar: "",
      harga: "",
      deskripsi: "",
      foto: "",
      role: "",
      token: "",
      action: "",
      keyword: "",
    };
    this._handleKeyPress = this._handleKeyPress.bind(this);

    if (localStorage.getItem("token")) {
      if (
        localStorage.getItem("role") === "admin" ||
        localStorage.getItem("role") === "resepsionis"
      ) {
        this.state.token = localStorage.getItem("token");
        this.state.role = localStorage.getItem("role");
      } else {
        window.alert("You're not admin or resepsionis!");
        window.location = "/";
      }
    }
  }

  _handleKeyPress = (event) => {
    if (event.keyword === "Enter") {
      event.preventDefault();
      this._handleFilter();
    }
  };
  // headerConfig = () => {
  //   let header = {
  //     headers: { Authorization: Bearer ${this.state.token} },
  //   };
  //   return header;
  // };

  headerConfig = () => {
        let header = {
          headers: { Authorization: `Bearer ${this.state.token}` },
        };
        return header;
      };
    
    //   handleChange = (e) => {
    //     this.setState({
    //       [e.target.name]: e.target.value,
    //     });
    //   };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleClose = () => {
    $("#modal_room").hide();
  };

  _handleFilter = () => {
    let data = {
      keyword: this.state.keyword,
    };
    let url = "http://localhost:8080/kamar/findKamar";
    axios
      .post(url, data, this.headerConfig())
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            room: response.data.data,
          });
        } else {
          alert(response.data.message);
          this.setState({ message: response.data.message });
        }
      })
      .catch((error) => {
        console.log("error", error.response.status);
      });
  };


  handleAdd = () => {
    $("#modal_room").show();
    this.setState({
      id: "",
      nomor_kamar: "",
      tipeKamarId: "",
      action: "insert",
    });
  };

  handleEdit = (item) => {
    $("#modal_room").show();
    this.setState({
      id: item.id,
      nomor_kamar: item.nomor_kamar,
      tipeKamarId: item.tipeKamarId,
      action: "update",
    });
  };

  handleSave = (e) => {
    e.preventDefault();

    let form = {
      id: this.state.id,
      nomor_kamar: +this.state.nomor_kamar,
      tipeKamarId: +this.state.tipeKamarId,
    };

    if (this.state.action === "insert") {
      console.log("hit")
      let url = "http://localhost:8080/kamar/addKamar";
      axios
        .post(url, form, this.headerConfig())
        .then((response) => {
          this.getRoom();
          this.handleClose();
        })
        .catch((error) => {
          console.log("error add data", error.response.status);
          if (error.response === "Nomor kamar sudah digunakan") {
            window.alert("The room number already exists");
          }else{
            window.alert("Failed to add data");
          }
        });
    } else {
      let url = "http://localhost:8080/kamar/updateKamar/" + this.state.id;
      axios
        .put(url, form, this.headerConfig())
        .then((response) => {
          this.getRoom();
          this.handleClose();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  handleDrop = (id) => {
    let url = "http://localhost:8080/kamar/deleteKamar/" + id;
    if (window.confirm("Are tou sure to delete this type room ? ")) {
      axios
        .delete(url, this.headerConfig())
        .then((response) => {
          console.log(response.data.message);
          this.getTypeRoom();
        })
        .catch((error) => {
          if (error.response.status === 500) {
            window.alert("You can't delete this data");
          }
        });
    }
  };

  getRoom = () => {
    let url = "http://localhost:8080/kamar/getAllKamar/";
    axios
      .get(url, this.headerConfig())
      .then((response) => {
        this.setState({
          room: response.data.data,
        });
        console.log(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getTypeRoom = () => {
    let url = "http://localhost:8080/tipekamar/getAllTipeKamar";
    axios
      .get(url, this.headerConfig())
      .then((response) => {
        this.setState({
          typeroom: response.data.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  checkRole = () => {
    if (this.state.role !== "admin" && this.state.role !== "resepsionis") {
      localStorage.clear();
      window.alert("You're not admin or resepsionis!");
      window.location = "/";
    }
  };

  componentDidMount() {
    this.getRoom();
    this.getTypeRoom();
    this.checkRole();
  }

  render() {
    return (
      <div className="flex flex-row min-h-screen bg-gray-100 text-gray-800">
        <Sidebar />
        <main className="main flex flex-col flex-grow -ml-9 md:ml-0 transition-all duration-150 ease-in">
          {/* <Header /> */}
          <div className="main-content flex flex-col flex-grow p-4 z-0 pl-56">
            <h1 className="font-bold text-2xl text-black-700 ml-12 mb-4">Daftar Room</h1>

            <div className=" mt-2 mr-4">
            <div className="flex rounded-full w-1/2 ml-12 mb-4">
                  <input
                    type="text"
                    className="w-3/6 block px-12 py-2 bg-white border focus:border-white focus:ring-white focus:outline-none focus:ring focus:ring-opacity-40 relative"
                    placeholder="Search..."
                    name="keyword"
                    value={this.state.keyword}
                    onChange={this.handleChange}
                    onKeyUp={this._handleFilter}
                  />
                  <button
                    className="w-1/8 ml-4 py-2 text-black absolute"
                    onClick={this._handleFilter}
                  >
                    <FontAwesomeIcon icon={faSearch} color="black" />
                  </button>
                  {this.state.role === "admin" && (
                    <button
                      className="w-1/5 ml-2 px-4 text-white bg-[#212A3E] rounded hover:bg-[#9BA4B5]"
                      onClick={() => this.handleAdd()}
                    >
                      <FontAwesomeIcon icon={faPlus} /> Add
                    </button>
                  )}
              </div>
            </div>

            <div className="flex flex-col mt-2 mr-12 ml-12 ">
              <div className="-my-2 mx-6 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            No
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Room Number
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Room Type
                          </th>
                          {this.state.role === "admin" && (
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Aksi
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {this.state.room.map((item, index) => 
                      {  
                        return(
                          
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {index + 1}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                Room-{item.nomor_kamar}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                                {item.tipe_kamar?.nama_tipe_kamar}
                                  </span>
                            </td>
                            {this.state.role === "admin" && (
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                  className="bg-green-600 hover:bg-green-700 text-white py-1 px-2 rounded mr-2"
                                  onClick={() => this.handleEdit(item)}
                                >
                                  <FontAwesomeIcon
                                    icon={faPencilSquare}
                                    size="lg"
                                  />
                                </button>
                                <button
                                  className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded"
                                  onClick={() => this.handleDrop(item.id)}
                                >
                                  <FontAwesomeIcon icon={faTrash} size="lg" />
                                </button>
                              </td>
                            )}
                          </tr>
                        )})}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <footer className="footer px-4 py-2">
            <div className="footer-content">
              <p className="text-sm text-gray-600 text-center">
                © Brandname 2023. All rights reserved.
              </p>
            </div>
          </footer>
        </main>

        {/* Modal Form */}
        <div
          id="modal_room"
          tabindex="-1"
          aria-hidden="true"
          className="overflow-x-auto fixed top-0 left-0 right-0 z-50 hidden w-full p-4 md:inset-0 h-modal md:h-full bg-tranparent bg-black bg-opacity-50"
        >
          <div className="flex lg:h-auto w-auto justify-center ">
            <div className="relative bg-white rounded-lg shadow dark:bg-white w-1/3">
              <button
                type="button"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                onClick={() => this.handleClose()}
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Tutup modal</span>
              </button>
              <div className="px-6 py-6 lg:px-8">
                <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-black">
                  Edit Room
                </h3>
                <form
                  className="space-y-6"
                  onSubmit={(event) => this.handleSave(event)}
                >
                  <div>
                    <label
                      for="nomor_kamar"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800"
                    >
                      Room Number
                    </label>
                    <input
                      type="text"
                      name="nomor_kamar"
                      value={this.state.nomor_kamar}
                      onChange={this.handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800"
                      placeholder="Masukkan number of room"
                      required
                    />
                  </div>
                  <div>
                    <label
                      for="tipeKamarId"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800"
                    >
                      Room Types
                    </label>
                    <select
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                      placeholder="Jenis Room Type"
                      name="tipeKamarId"
                      value={this.state.tipeKamarId}
                      onChange={this.handleChange}
                      required
                    >
                      <option value="">Pilih Room Type</option>
                      {this.state.typeroom.map((item) => (
                        <option value={item.id}>
                          {item.nama_tipe_kamar}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                  >
                    Simpan
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}