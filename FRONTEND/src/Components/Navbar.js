import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";

export default class Navbar extends Component {
    constructor() {
        super()
        this.state = {
            role: "",
            token: "",
            isLogin: false
        }

        this.state.role = localStorage.getItem("role")
        this.state.token = localStorage.getItem("token")
    }

    logout = () => {
        if (window.confirm("Are you sure to logout?")) {
            localStorage.clear()
            localStorage.removeItem("id")
            localStorage.removeItem("token")
            localStorage.removeItem("role")
            localStorage.removeItem("email")
            this.setState({
                isLogin: false
            })
        }
    }

    componentDidMount() {
        if (this.state.token) {
            this.setState({
                isLogin: true
            })
        }
    }

    render() {
        return (
            <nav class="bg-gray-50 px-5 sm:px-8 w-full z-20 top-0 left-0 drop-shadow-md md:drop-shadow-xl">
                <div class="container flex flex-wrap items-center justify-between mx-auto">
                    <NavLink to="/home" className="hidden lg:block h-10 ml-3 w-10 mr-0 ">
                        <img src="/assets/logo.png" alt="icon" />
                    </NavLink>
                    <div class="flex md:order-2">
                        {this.state.isLogin ? (
                            <>
                                {/* <NavLink to="/home" className="no-underline text-gray-800 hover:text-blue-800 px-3 py-2 rounded-md text-2xl font-medium" aria-current="page" id="profile"><FontAwesomeIcon icon={faUser} /></NavLink> */}
                                <button onClick={() => this.logout()} className="no-underline text-gray-800 px-3 py-2 hover:text-blue-800 rounded-md text-2xl font-medium" aria-current="page" ><FontAwesomeIcon icon={faSignOut} /></button>

                            </>
                        ) : (
                            <>
                                <NavLink to="/logincust" className="bg-transparent hover:bg-blue-600 text-blue-600 font-semibold hover:text-white py-2 px-3 border border-blue-500 hover:border-transparent rounded-md mr-4" aria-current="page" id="profile" variant="outlined">Login</NavLink>
                                <NavLink to="/registercust" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold hover:text-white py-2 px-3 border border-blue-500 hover:border-transparent rounded-md " aria-current="page" id="profile">Register</NavLink>

                            </>
                        )
                        }
                    </div>
                    <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                        <ul class="flex flex-col p-4 mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white">
                            {this.state.isLogin ? (
                                <>
                                    <NavLink to="/home" className="no-underline text-gray-800 hover:bg-blue-500 hover:text-white px-3 py-3 rounded-md text-sm font-medium" aria-current="page">Home</NavLink>
                                    <NavLink to="/services" className="no-underline text-gray-800 hover:bg-blue-500 hover:text-white px-3 py-3 rounded-md text-sm font-medium " aria-current="page">Services</NavLink>
                                    <NavLink to="/rooms" className="no-underline text-gray-800 hover:bg-blue-500 hover:text-white px-3 py-3 rounded-md text-sm font-medium " aria-current="page">Rooms</NavLink>
                                    <NavLink to="/mybookings" className="no-underline text-gray-800 hover:bg-blue-500 hover:text-white px-3 py-3 rounded-md text-sm font-medium " aria-current="page">My Bookings</NavLink>
                                </>
                            ) : (
                                <>

                                    <NavLink to="/home" className="no-underline text-gray-800 hover:bg-blue-600 hover:text-white px-3 py-3 rounded-md text-sm font-medium" aria-current="page">Home</NavLink>
                                    <NavLink to="/services" className="no-underline text-gray-800 hover:bg-blue-600 hover:text-white px-3 py-3 rounded-md text-sm font-medium " aria-current="page">Services</NavLink>
                                    <NavLink to="/rooms" className="no-underline text-gray-800 hover:bg-blue-600 hover:text-white px-3 py-3 rounded-md text-sm font-medium " aria-current="page">Rooms</NavLink>
                                </>
                            )
                            }
                        </ul>
                    </div>
                </div>
            </nav>

        )
    }
}