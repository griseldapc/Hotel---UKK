import React, { Component } from "react";
import '../styles/struk.css'

export default class StrukBooking extends React.Component {

    render() {
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
                            <p><span className="font-semibold">Date:</span> 12-03-2023</p>
                            <p><span className="font-semibold">Invoice:</span> </p>
                            <span className="mt-1 px-3 py-2 inline-flex text-xl leading-5 font-semibold rounded bg-blue-100 text-blue-800">
                                BOOK - 63749
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
                                <td className="p-4 text-left">Room 101 - 2 Nights</td>
                                <td className="p-4 text-center">1</td>
                                <td className="p-4 text-left">12-03-2023</td>
                                <td className="p-4 text-left">13-03-2023</td>
                                <td className="p-4 text-left">$100.00</td>
                            </tr>
                            <tr>
                                <td className="p-4 text-left">Room Service - Dinner</td>
                                <td className="p-4 text-center">2</td>
                                <td className="p-4 text-left">12-03-2023</td>
                                <td className="p-4 text-left">13-03-2023</td>
                                <td className="p-4 text-left">$20.00</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
