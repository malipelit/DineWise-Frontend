import React, {useState} from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import {setHours, setMinutes} from "date-fns";

function ReservationTab({ restaurantId }) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [customerName, setCustomerName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [responseMsg, setResponseMsg] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!customerName || !phoneNumber) {
            alert("Please fill in all fields.");
            return;
        }
        const reservation_time = selectedDate.toISOString();
        axios.post('/reservations', {
            restaurant_id: restaurantId,
            reservation_time,
            customer_name: customerName,
            phone_number: phoneNumber
        })
            .then(response => {
                setResponseMsg(`Reservation created (ID: ${response.data.reservation_id}) at ${new Date(response.data.timeslot).toLocaleString()}`);
            })
            .catch(error => {
                console.error("Error creating reservation:", error);
                setResponseMsg(error.response?.data?.error || "Error creating reservation");
            });
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="border p-4 rounded">
                <div className="mb-3">
                    <label className="form-label">Reservation Time</label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        showTimeSelect
                        minTime={setHours(setMinutes(new Date(), 59), 9)}
                        maxTime={setHours(setMinutes(new Date(), 30), 21)}
                        timeFormat="HH:mm"
                        timeIntervals={30}
                        dateFormat="MMMM d, yyyy h:mm aa"
                        className="form-control"
                    />
                    <small className="text-muted">
                        Times will be rounded to the nearest 30 minutes.
                    </small>
                </div>
                <div className="mb-3">
                    <label className="form-label">Your Name</label>
                    <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-warning">Reserve</button>
            </form>
            {responseMsg && <div className="alert alert-info mt-3">{responseMsg}</div>}
        </div>
    );
}

export default ReservationTab;