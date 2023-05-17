import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import axios from 'axios'

export default class Login extends React.Component {
    constructor() {
        super()
        this.state = {
            email_customer: "",
            password_customer: "",
            isModalOpen: false,
            logged: false,
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleLogin = (e) => {
        e.preventDefault()
        let data = {
            email: this.state.email_customer,
            password: this.state.password_customer
        }
        let url = "http://localhost:8080/customer/login"
        axios.post(url, data)
            .then(response => {
                this.setState({ logged: response.data.data.logged })
                if (response.status === 200) {
                    let id = response.data.data.id_customer
                    let token = response.data.data.token
                    let role = response.data.data.role
                    let email = response.data.data.email
                    localStorage.setItem("id", id)
                    localStorage.setItem("token", token)
                    localStorage.setItem("role", role)
                    localStorage.setItem("email", email)
                    alert("Success Login")
                    window.location.href = "/home"
                } else {
                    alert(response.data.message)
                    this.setState({ message: response.data.message })

                }
            })
            .catch(error => {
                console.log("error", error.response.status)
                if (error.response.status === 500 || error.response.status === 404) {
                    window.alert("Failed to login Slippy");
                }
            })
    }

    render() {
        return (
            <div className="dashboard1">
                <div class="flex">
                    <div class="w-1/2 bg-gray-200 text-left">
                        <form class="bg-gray-100 shadow-md rounded px-8 pt-6 p-8 m-24 mt-30" onSubmit={(e) => this.handleLogin(e)}>
                            <p class="text-gray-700 text-2xl font-bold mb-4 text-center">Login to Slippy</p>
                            <p class="text-gray-700 text-sm font-normal mb-6 text-center">Silahkan login untuk memesan kamar di Hotel Slippy</p>
                            <div class="mb-2">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
                                    Email
                                </label>
                                <input class="shadow appearance-none border border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="email_customer" name="email_customer" placeholder="Email" value={this.state.email_customer} onChange={this.handleChange} required />
                            </div>
                            <div class="mb-6">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                                    Password
                                </label>
                                <input class="shadow appearance-none border border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password_customer" name="password_customer" type="password" placeholder="Password" value={this.state.password_customer} onChange={this.handleChange} required />
                            </div>
                            <div class="flex items-center justify-between">
                                <button class="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 w-full rounded focus:outline-none focus:shadow-outline" type="submit">
                                    Login
                                </button>
                            </div>
                            <p class="text-sm font-normal text-gray-700 text-center mt-3 ">
                                Don’t have an account yet? <a href="registercust" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Register</a>
                            </p>

                        </form>
                    </div>
                    <div class="w-1/2 bg-gray-500 text-center">
                        <img src="/assets/PhotoInLogin.png" className="w-screen h-screen" alt="" />
                    </div>
                </div>
            </div>
        );
    }
}
