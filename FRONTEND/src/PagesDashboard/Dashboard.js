import React from 'react'
import Sidebar from '../Components/Sidebar'
import Header from '../Components/Header';
import axios from 'axios'

export default class Dashboard extends React.Component {
    constructor() {
        super()
        this.state = {
            user: [],
            customer: [],
            typeroom: [],
            room: [],
            role: "",
            token: "",
            action: ""

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

    getUser = () => {
        let url = "http://localhost:8080/user";
        axios
            .get(url, this.headerConfig())
            .then((response) => {
                this.setState({
                    user: response.data.count,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    getCustomer = () => {
        let url = "http://localhost:8080/customer/"
        axios.get(url)
            .then((response) => {
                this.setState({
                    customer: response.data.count
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    getRoom = () => {
        let url = "http://localhost:8080/room"
        axios.get(url)
            .then(response => {
                this.setState({
                    room: response.data.count
                })
                console.log(response.data.data)
            })
            .catch(error => {
                console.log(error)
            })
    }

    getTypeRoom = () => {
        let url = "http://localhost:8080/room-type"
        axios.get(url)
            .then(response => {
                this.setState({
                    typeroom: response.data.count
                })
                console.log(response.data.data)
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
        this.getUser();
        this.getCustomer();
        this.getRoom()
        this.getTypeRoom()
        this.checkRole()
    }

    render() {
        return (
            <div class="flex flex-row min-h-screen bg-gray-100 text-gray-800">
                <Sidebar />
                <main class="main flex flex-col flex-grow -ml-64 md:ml-0 transition-all duration-150 ease-in">
                    <Header />
                    <section>
	<div className="dark:bg-violet-400">
		<div className="container flex flex-col items-center px-4 py-16 pb-24 mx-auto text-center lg:pb-56 md:py-32 md:px-10 lg:px-32 dark:text-gray-900">
			<h1 className="text-5xl font-bold leading-none sm:text-6xl xl:max-w-3xl dark:text-gray-900">Selamat datang di website penginapan hotel kami!</h1>
			<p className="mt-6 mb-8 text-lg sm:mb-12 xl:max-w-3xl dark:text-gray-900"> Kami bangga mempersembahkan destinasi yang sempurna bagi Anda untuk menikmati pengalaman menginap yang tak terlupakan. Dalam website kami, Anda akan menemukan informasi lengkap tentang hotel kami, fasilitas yang kami tawarkan, serta berbagai penawaran khusus yang dapat membuat liburan Anda lebih istimewa.</p>
			<div className="flex flex-wrap justify-center">
				{/* <button type="button" className="px-8 py-3 m-2 text-lg font-semibold rounded dark:bg-gray-800 dark:text-gray-50 ">Get started</button> */}
				<a href="/typeroom" type="button" className="px-8 py-3 m-2 text-lg border rounded dark:border-gray-900 dark:text-gray-900 mx-auto">Get started</a>
			</div>
		</div>
	</div>
	<img src="https://images.unsplash.com/photo-1568084680786-a84f91d1153c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80" alt="" className="w-5/6 mx-auto mb-12 -mt-20 rounded-lg shadow-md lg:-mt-40 dark:bg-gray-500" />
</section>

                    <footer class="footer px-4 py-2">
                        <div class="footer-content">
                            <p class="text-sm text-gray-600 text-center">© Brandname 2023. All rights reserved. <a href="https://twitter.com/iaminos"></a></p>
                        </div>
                    </footer>
                </main>
            </div>
        );
    }
}