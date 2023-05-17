import React from 'react'
import LinesEllipsis from 'react-lines-ellipsis';
import Sidebar from '../Components/Sidebar'
import Header from '../Components/Header';
import '../styles/room.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilSquare, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import axios from "axios"
import $ from "jquery";

export default class TypeRoom extends React.Component {
    constructor() {
        super()
        this.state = {
            typeroom: [],
            id: "",
            nama_tipe_kamar: "",
            harga: "",
            deskripsi: "",
            foto: "",
            // role: "",
            // token: "",
            // action: "",
            // keyword: ""
        }

        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") === "admin" ||
                localStorage.getItem("role") === "resepsionis") {
                this.state.token = localStorage.getItem("token")
                this.state.role = localStorage.getItem("role")
            } else {
                window.alert("You're not admin or resepsionis!")
                window.location = "/"
            }
        }
    }

    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header;
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleFile = (e) => {
        this.setState({
            foto: e.target.files[0]
        })
    }

    handleCloseDetail = () => {
        $("#modal_detail").hide()
    }

    handleDetail = (item) => {
        $("#modal_detail").show()
        this.setState({
            id: item.id,
            nama_tipe_kamar: item.nama_tipe_kamar,
            harga: item.harga,
            deskripsi: item.deskripsi,
            foto: item.foto

        })

    }

    handleClose = () => {
        $("#modal_typeroom").hide()
    }

    handleAdd = () => {
        $("#modal_typeroom").show()
        this.setState({
            id_room_type: "",
            nama_tipe_kamar: "",
            harga: "",
            deskripsi: "",
            foto: "",
            action: "insert"
        })
    }

    handleEdit = (item) => {
        $("#modal_typeroom").show()
        this.setState({
            id_room_type: item.id_room_type,
            nama_tipe_kamar: item.nama_tipe_kamar,
            harga: item.harga,
            deskripsi: item.deskripsi,
            foto: item.foto,
            action: "update"
        })
    }

    handleSave = (e) => {
        e.preventDefault()

        let form = new FormData()
        form.append("id_room_type", this.state.id_room_type)
        form.append("nama_tipe_kamar", this.state.nama_tipe_kamar)
        form.append("harga", this.state.harga)
        form.append("deskripsi", this.state.deskripsi)
        form.append("foto", this.state.foto)

        if (this.state.action === "insert") {
            let url = "http://localhost:8080/tipe_kamar/addTipe_kamar"
            axios.post(url, form, this.headerConfig())
                .then(response => {
                    this.getTypeRoom()
                    this.handleClose()
                })
                .catch(error => {
                    console.log("error add data", error.response.status)
                    if (error.response.status === 500) {
                        window.alert("Failed to add data");
                    }
                })
        } else {
            let url = "http://localhost:8080/room-type/update/" + this.state.id_room_type
            axios.put(url, form, this.headerConfig())
                .then(response => {
                    this.getTypeRoom()
                    this.handleClose()
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }

    handleDrop = (id) => {
        let url = "http://localhost:8080/tipe_kamar/deleteTipe_kamar/" + id;
        if (window.confirm("Are tou sure to delete this type room ? ")) {
            axios.delete(url, this.headerConfig())
                .then(response => {
                    console.log(response.data.message)
                    this.getTypeRoom()
                })
                .catch(error => {
                    if (error.response.status === 500) {
                        window.alert("You can't delete this data");
                    }
                })
        }
    }

    _handleFilter = () => {
        let data = {
            keyword: this.state.keyword,
        }
        let url = "http://localhost:8080/room-type/find/filter"
        axios.post(url, data)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        typeroom: response.data.data
                    })
                } else {
                    alert(response.data.message)
                    this.setState({ message: response.data.message })

                }
            })
            .catch(error => {
                console.log("error", error.response.status)
            })
    }

    getTypeRoom = () => {
        let url = "http://localhost:8080/tipe_kamar/getAllTipe_kamar"
        axios.get(url)
            .then(response => {
                this.setState({
                    typeroom: response.data.data
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    checkRole = () => {
        if (this.state.role !== "admin" && this.state.role !== "resepsionis") {
            localStorage.clear()
            window.alert("You're not admin or resepsionis!")
            window.location = '/'
        }
    }

    componentDidMount() {
        this.getTypeRoom()
        this.checkRole()
    }

    render() {
        return (
            <div class="flex flex-row min-h-screen bg-gray-100 text-gray-800">
                <Sidebar />
                <main class="main flex flex-col flex-grow -ml-64 md:ml-0 transition-all duration-150 ease-in">
                    <Header />
                    <div class="main-content flex flex-col flex-grow p-4">
                        <div class="mb-4">
                            <div className="flex items-center">
                                <div className="flex rounded w-1/2 mx-auto">
                                    <input
                                        type="text"
                                        className="w-4/6 block w-full px-4 py-2 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 "
                                        placeholder="Cari disini"
                                        name="keyword"
                                        value={this.state.keyword}
                                        onChange={this.handleChange}
                                    />
                                    <button className="w-1/8 ml-2 px-4 text-white bg-blue-100 border border-1 border-blue-600 rounded hover:bg-blue-200" onClick={this._handleFilter}>
                                        <FontAwesomeIcon icon={faSearch} color="blue" />
                                    </button>
                                    {this.state.role === "admin" &&
                                        <button className="w-1/5 ml-2 px-4 text-white bg-blue-600 rounded hover:bg-blue-700" onClick={() => this.handleAdd()}>
                                            <FontAwesomeIcon icon={faPlus} /> Add
                                        </button>
                                    }
                                </div>
                            </div>
                        </div>
                        <div class="grid grid-cols-3 gap-4">
                            {this.state.typeroom.map((item, index) => {
                                return (
                                    <div class="col-span-1">
                                        {/* Card untuk type room */}
                                        <div class="CardEvent" key={index}>
                                            <div class="max-w-sm rounded overflow-hidden shadow-lg border-2 border-gray-200 bg-gray-100">
                                                <div className='container'>
                                                    <img class="w-full h-48" src={"http://localhost:8080/" + item.foto} />
                                                    {this.state.role === "admin" &&
                                                        <>
                                                            <button class='btn' onClick={() => this.handleDrop(item.id_room_type)}><FontAwesomeIcon icon={faTrash} size="lg" color="red" /></button>
                                                            <button class='btn1' onClick={() => this.handleEdit(item)}><FontAwesomeIcon icon={faPencilSquare} size="xl" color="orange" /></button>
                                                        </>
                                                    }

                                                </div>
                                                <div class="px-6 py-4">
                                                    <div class="font-bold text-2xl mb-2">{item.nama_tipe_kamar}</div>
                                                    <div class="font-bold text-xl mb-2 text-blue-600">{item.harga}/night</div>
                                                    <p class="text-gray-700 text-base">
                                                        <LinesEllipsis
                                                            text={item.deskripsi}
                                                            maxLine="3"
                                                            ellipsis="..." />
                                                    </p>
                                                </div>
                                                <div class="px-6 pt-4 pb-2">
                                                    <button class="mb-2 ml-48 bg-blue-600 hover:bg-blue-700 text-white font-bold p-2 w-1/3 rounded focus:outline-none focus:shadow-outline" type="button" onClick={() => this.handleDetail(item)}>
                                                        Detail
                                                    </button>

                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <footer class="footer px-4 py-2">
                        <div class="footer-content">
                            <p class="text-sm text-gray-600 text-center">© Brandname 2023. All rights reserved. <a href="https://twitter.com/iaminos"></a></p>
                        </div>
                    </footer>
                </main >

                {/* Modal Form */}
                <div id="modal_typeroom" tabindex="-1" aria-hidden="true" class="overflow-x-auto fixed top-0 left-0 right-0 z-50 hidden w-full p-4 md:inset-0 h-modal md:h-full bg-tranparent bg-black bg-opacity-50">
                    <div class="flex lg:h-auto w-auto justify-center ">
                        <div class="relative bg-white rounded-lg shadow dark:bg-white w-1/3">
                            <button type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" onClick={() => this.handleClose()}>
                                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                <span class="sr-only">Tutup modal</span>
                            </button>
                            <div class="px-6 py-6 lg:px-8">
                                <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-black">Edit Type Room</h3>
                                <form class="space-y-6" onSubmit={(event) => this.handleSave(event)}>
                                    <div>
                                        <label for="nama_tipe_kamar" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">Name Room Type</label>
                                        <input type="text" name="nama_tipe_kamar" id="nama_tipe_kamar" value={this.state.nama_tipe_kamar} onChange={this.handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" placeholder="Masukkan name room type" required />
                                    </div>
                                    <div>
                                        <label for="harga" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">harga Room Type</label>
                                        <input type="number" name="harga" id="harga" value={this.state.harga} onChange={this.handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" placeholder="Masukkan harga room type" required />
                                    </div>
                                    <div>
                                        <label for="deskripsi" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">deskripsi Room Type</label>
                                        <textarea rows="3" type="text" name="deskripsi" id="deskripsi" value={this.state.deskripsi} onChange={this.handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" placeholder="Masukkan deskripsi room type" />
                                    </div>
                                    <div>
                                        <label for="foto" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">foto Room Type</label>
                                        <input type="file" name="foto" id="foto" placeholder="Pilih foto user" onChange={this.handleFile} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-800 focus:border-gray-800 block w-full px-2 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" required={this.state.action === "update" ? false : true} />
                                    </div>

                                    <button type="submit" class="w-full text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Simpan</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* modal detail */}
                <div id="modal_detail" tabindex="-1" class="overflow-x-auto fixed top-0 left-0 right-0 z-50 hidden w-full pt-10 pb-10 pl-96 md:inset-0 h-modal md:h-full bg-tranparent bg-black bg-opacity-50" >
                    <div class="relative w-full h-full max-w-lg md:h-auto border-2 border-gray-500 rounded-lg shadow shadow-2xl items-center">
                        <div class="relative bg-white rounded-lg">
                            <div class="flex items-center justify-between p-5 border-b rounded-t border-gray-500">
                                <h3 class="p-2 text-xl font-medium text-gray-900 ">
                                    {this.state.name_room_type} Room
                                </h3>
                                <button type="button" class="text-gray-400 bg-transparent hover:bg-red-500 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-600 hover:text-white" data-modal-hide="medium-modal" onClick={() => this.handleCloseDetail()}>
                                    <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                    <span class="sr-only">Close modal</span>
                                </button>
                            </div>
                            <div class="p-6">
                                <div className='container'>
                                    <img class="rounded-md w-200 h-100" src={"http://localhost:8080/" + this.state.foto} />
                                </div>
                                <div class="px-2 py-4">
                                    <div class="font-bold text-2xl mb-2">{this.state.name_room_type}</div>
                                    <div class="font-bold text-xl mb-2 text-blue-600">{this.state.harga}/night</div>
                                    <p class="text-black-700 text-base">
                                        {this.state.deskripsi}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}