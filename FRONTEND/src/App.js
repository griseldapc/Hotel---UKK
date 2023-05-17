import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from './PagesDashboard/Login'
import Dashboard from './PagesDashboard/Dashboard'
import TypeRoom from "./PagesDashboard/TypeRoom";
import Room from "./PagesDashboard/Room";
import User from "./PagesDashboard/User";
import Customer from "./PagesDashboard/Customer";
import HistoryTransaksi from "./PagesDashboard/HistoryTransaksi";

import LoginCust from "./PagesForCust/Login";
import RegisterCust from "./PagesForCust/Register";
import Home from "./PagesForCust/Home";
import Services from "./PagesForCust/Services";
import Rooms from "./PagesForCust/Rooms";
import MyBookings from "./PagesForCust/MyBookings";
import StrukBooking from "./PagesForCust/StrukBooking";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} exact></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/typeroom" element={<TypeRoom />}></Route>
        <Route path="/room" element={<Room />}></Route>
        <Route path="/user" element={<User />}></Route>
        <Route path="/customer" element={<Customer />}></Route>
        <Route path="/historytransaksi" element={<HistoryTransaksi />}></Route>

        <Route path="/logincust" element={<LoginCust />}></Route>
        <Route path="/registercust" element={<RegisterCust />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/services" element={<Services />}></Route>
        <Route path="/rooms" element={<Rooms />}></Route>
        <Route path="/mybookings" element={<MyBookings />}></Route>
        <Route path="/struck" element={<StrukBooking />}></Route>

      </Routes>
    </BrowserRouter>

  );
}

export default App;
