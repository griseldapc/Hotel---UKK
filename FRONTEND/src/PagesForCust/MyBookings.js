import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import axios from 'axios'
import Navbar from "../Components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faSearch } from "@fortawesome/free-solid-svg-icons";
import $ from "jquery";
import moment from 'moment';
import '@progress/kendo-theme-material/dist/all.css';
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";

//ini untuk print
const PrintElement = (props) => {
    const { item } = props;

    return (
        <div className="mt-4">
            <div className="hotel-invoice">
                <h1 className="font-bold">Invoice Booking Room</h1>

                <div className="invoice-details">
                    <div>
                        <p><span className="font-semibold">Hotel Name:</span> Slippy</p>
                        <p><span className="font-semibold mt-2">Address:</span> Malang</p>
                        <p><span className="font-semibold mt-2">Phone:</span> 0331-1234</p>
                    </div>
                    <div>
                        <p><span className="font-semibold">Date: </span> {moment(Date.now()).format('DD-MM-YYYY')}</p>
                        <p><span className="font-semibold">Invoice:</span> </p>
                        <span className="mt-1 px-3 py-2 inline-flex text-xl leading-5 font-semibold rounded bg-blue-100 text-blue-800">
                            BOOK - {item.booking_number}
                        </span>
                    </div>
                </div>

                <table className="invoice-items">
                    <thead>
                        <tr>
                            <th className="p-4 text-left">Type Room</th>
                            <th className="p-4 text-center">Total-Day</th>
                            <th className="p-4 text-center">Check In</th>
                            <th className="p-4 text-center">Check Out</th>
                            <th className="p-4 text-center">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="p-4 text-left">{item.room_type.name_room_type}</td>
                            <td className="p-4 text-center">{item.total_room}</td>
                            <td className="p-4 text-left">{moment(item.check_in_date).format('DD-MM-YYYY')}</td>
                            <td className="p-4 text-left">{moment(item.check_out_date).format('DD-MM-YYYY')}</td>
                            <td className="p-4 text-left">{item.room_type.price}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default class MyBookings extends React.Component {
    constructor() {
        super()
        this.state = {
            booking: [],
            id_booking: "",
            id_user: "",
            id_customer: "",
            id_room_type: "",
            booking_number: "",
            name_customer: "",
            email: "",
            booking_date: "",
            check_in_date: "",
            check_out_date: "",
            guest_name: "",
            total_room: "",
            booking_status: "",
            role: "",
            token: "",
            action: "",
            keyword: "",
            dataPrint: {},
            container: React.createRef(null),
            pdfExportComponent: React.createRef(null),
            isPrint: false
        }

        this.state.id_customer = localStorage.getItem("id")
        if (localStorage.getItem("token")) {
            if (
                localStorage.getItem("role") === "customer"
            ) {
                this.state.token = localStorage.getItem("token");
                this.state.role = localStorage.getItem("role");
            } else {
                window.alert("You must register or login as customer !");
                window.location = "/logincust";
            }
        }
    }

    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    getBookingByCust = () => {
        let url = "http://localhost:8080/booking/customer/" + this.state.id_customer
        axios.get(url, this.headerConfig())
            .then(response => {
                this.setState({
                    booking: response.data.data
                })
                console.log(response.data.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    _handleFilter = () => {
        let data = {
            keyword: this.state.keyword,
        }
        let url = "http://localhost:8080/booking/find/filter/" + this.state.id_customer
        axios.post(url, data)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        booking: response.data.data
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

    checkRole = () => {
        if (this.state.role !== "customer") {
            localStorage.clear()
            window.alert("You must register or login as customer !")
            window.location = '/logincust'
        }
    }

    handlePrint = (item) => {
        let element = this.state.container.current;

        this.setState({
            dataPrint: item,
            isPrint: true
        })

        setTimeout(() => {
            savePDF(element, {
                fileName: `invoice-${item.booking_number}`
            })
            this.setState({
                isPrint: false
            })
        }, 500)
    }

    componentDidMount() {
        this.getBookingByCust()
        this.checkRole()
    }

    render() {
        return (
            <div>
                <Navbar />

                <div className="m-6 pl-6">
                    <p className="text-xl font-semibold text-blue-600">History </p>
                    <p className="text-5xl font-bold mt-2">Transaction List</p>
                    <div className="flex mt-6">
                        <div className="flex rounded w-1/2">
                            <input
                                type="text"
                                className="w-5/6 block w-full px-4 py-2 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                placeholder="Search..."
                                name="keyword"
                                value={this.state.keyword}
                                onChange={this.handleChange}
                            />
                            <button className="w-1/6 ml-2 px-4 text-white bg-blue-600 rounded hover:bg-blue-700" onClick={this._handleFilter}>
                                <FontAwesomeIcon icon={faSearch} size="" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col mt-2 ml-12 mr-8">
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Booking Number
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Guest
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Tipe Room
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Total Room
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Booking
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Check In
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Check Out
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Status
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Print
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {this.state.booking.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {item.booking_number}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {item.guest_name}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                            {item.room_type.name_room_type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {item.total_room}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {moment(item.booking_date).format('DD-MM-YYYY')}

                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {moment(item.check_in_date).format('DD-MM-YYYY')}

                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {moment(item.check_out_date).format('DD-MM-YYYY')}

                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {item.booking_status === "baru" &&
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                                                                {item.booking_status}
                                                            </span>
                                                        }
                                                        {item.booking_status === "check_in" &&
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                                {item.booking_status}
                                                            </span>
                                                        }
                                                        {item.booking_status === "check_out" &&
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                                {item.booking_status}
                                                            </span>
                                                        }
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <button class="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded" onClick={() => this.handlePrint(item)}>
                                                            <FontAwesomeIcon icon={faPrint} size="lg" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="hidden-on-narrow"
                >
                    <PDFExport ref={this.state.pdfExportComponent}>
                        <div ref={this.state.container}>
                            {this.state.isPrint ? <PrintElement item={this.state.dataPrint}/> : null}
                        </div>
                    </PDFExport>
                </div>

            </div >
        )
    }

}