import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { setHours, setMinutes } from "date-fns";

function CustomerAccount() {
    const [customer, setCustomer] = useState({ name: "", phone: "", loggedIn: false });
    const [customerData, setCustomerData] = useState({ reservations: [], queues: [] });
    const [restaurants, setRestaurants] = useState([]);
    const [reservationEdits, setReservationEdits] = useState({});
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    const refreshData = () => {
        axios.post("/api/customers/login", { name: customer.name, phone: customer.phone })
            .then(response => {
                if (response.data.reservations.length === 0 && response.data.queues.length === 0) {
                    setMsg("No record found. Please login again.");
                    setCustomer({ name: "", phone: "", loggedIn: false });
                    navigate("/customer-login");
                } else {
                    const newData = {
                        reservations: response.data.reservations,
                        queues: response.data.queues
                    };
                    setCustomerData(newData);
                    Promise.all(newData.queues.map(q =>
                        axios.get("/queue/status", {
                            params: { customer_name: customer.name, phone_number: customer.phone, restaurant_id: q.restaurant_id }
                        })
                        .then(res => ({ ...q, position: res.data?.position || "N/A" }))
                        .catch(() => ({ ...q, position: "Error" }))
                    )).then(updatedQueues => {
                        setCustomerData(prev => ({ ...prev, queues: updatedQueues }));
                    });
                }
            })
            .catch(err => {
                if (err.response && err.response.status === 404) {
                    setMsg("No record found. Please login again.");
                    setCustomer({ name: "", phone: "", loggedIn: false });
                    navigate("/customer-login");
                }
            });
    };

    const handleCustomerLogin = async (e) => {
        e.preventDefault();
        if (customer.name.trim() && customer.phone.trim()) {
            try {
                const response = await axios.post("/api/customers/login", {
                    name: customer.name,
                    phone: customer.phone
                });
                const newData = {
                    reservations: response.data.reservations,
                    queues: response.data.queues
                };
                setCustomerData(newData);
                const resList = await axios.get("/restaurants");
                setRestaurants(resList.data.restaurants);
                setCustomer({ ...customer, loggedIn: true });
                Promise.all(newData.queues.map(q =>
                    axios.get("/queue/status", {
                        params: { customer_name: customer.name, phone_number: customer.phone, restaurant_id: q.restaurant_id }
                    })
                    .then(res => ({ ...q, position: res.data?.position || "N/A" }))
                    .catch(() => ({ ...q, position: "Error" }))
                )).then(updatedQueues => {
                    setCustomerData(prev => ({ ...prev, queues: updatedQueues }));
                });
            } catch (err) {
                setMsg(err.response?.data?.error || "Login failed.");
            }
        }
    };

    const restaurantName = (id) => {
        const r = restaurants.find(r => r.id === id);
        return r ? r.name : id;
    };

    const formatTime = (isoTime) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(isoTime).toLocaleString(undefined, options);
    };

    const handleReservationTimeChange = (reservationId, date) => {
        setReservationEdits({ ...reservationEdits, [reservationId]: date });
    };

    const handleUpdateReservation = (reservation) => {
        const newDate = reservationEdits[reservation.id];
        if (!newDate) return;
        axios.put(`/reservations/${reservation.id}`, {
            restaurant_id: reservation.restaurant_id,
            reservation_time: newDate.toISOString(),
            customer_name: reservation.customer_name,
            phone_number: reservation.phone_number
        })
        .then(() => {
            setMsg("Reservation updated successfully.");
            refreshData();
        })
        .catch(err => setMsg(err.response?.data?.error || "Update failed."));
    };

    const handleCancelReservation = (reservationId) => {
        axios.delete(`/reservations/${reservationId}`)
            .then(() => {
                setMsg("Reservation cancelled successfully.");
                refreshData();
            })
            .catch(err => setMsg(err.response?.data?.error || "Cancellation failed."));
    };

    const handleQuitQueue = (queueId) => {
        axios.delete(`/queue/${queueId}`)
            .then(() => {
                setMsg("You have left the queue.");
                refreshData();
            })
            .catch(err => setMsg(err.response?.data?.error || "Failed to quit queue."));
    };

    return (
        <div className="container my-4">
            <header className="py-3 mb-4" style={{ backgroundColor: "#ffc107" }}>
                <h1 className="text-center text-dark">Customer Login</h1>
            </header>
            {!customer.loggedIn ? (
                <div className="mb-4">
                    {msg && <div className="alert alert-danger">{msg}</div>}
                    <form onSubmit={handleCustomerLogin}>
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={customer.name} 
                                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Phone Number</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={customer.phone} 
                                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                                required 
                            />
                        </div>
                        <div className="d-flex justify-content-between">
                            <button type="submit" className="btn btn-primary">Login</button>
                            <Link to="/" className="btn btn-secondary">Back to Homepage</Link>
                        </div>
                    </form>
                </div>
            ) : (
                <>
                <div className="mb-4">
                    <h3>Welcome, {customer.name}</h3>
                </div>
                <div className="mb-4">
                    <h4>My Reservations</h4>
                    {customerData.reservations.length === 0 ? (
                        <p>No reservations found.</p>
                    ) : (
                        <ul className="list-group">
                            {customerData.reservations.map(r => (
                                <li key={r.id} className="list-group-item">
                                    <strong>Restaurant:</strong> {restaurantName(r.restaurant_id)} <br />
                                    <strong>Time:</strong> {formatTime(r.reservation_time)}
                                    <div className="mt-2">
                                        <DatePicker
                                            selected={
                                                reservationEdits[r.id] 
                                                    ? reservationEdits[r.id] 
                                                    : new Date(r.reservation_time)
                                            }
                                            onChange={(date) => handleReservationTimeChange(r.id, date)}
                                            showTimeSelect
                                            minTime={setHours(setMinutes(new Date(), 0), 9)}
                                            maxTime={setHours(setMinutes(new Date(), 30), 21)}
                                            timeFormat="HH:mm"
                                            timeIntervals={30}
                                            dateFormat="MMMM d, yyyy h:mm aa"
                                            className="form-control mb-2"
                                        />
                                        <button 
                                            className="btn btn-sm btn-primary me-2"
                                            onClick={() => { if(window.confirm("Are you sure you want to update the reservation time?")) handleUpdateReservation(r); }}
                                        >
                                            Update
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-danger"
                                            onClick={() => { if(window.confirm("Are you sure you want to cancel this reservation?")) handleCancelReservation(r.id); }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="mb-4">
                    <h4>My Queue Status</h4>
                    {customerData.queues.length === 0 ? (
                        <p>No queue entries found.</p>
                    ) : (
                        <ul className="list-group">
                            {customerData.queues.map(q => (
                                <li key={q.id} className="list-group-item">
                                    <strong>Restaurant:</strong> {restaurantName(q.restaurant_id)} <br />
                                    <strong>Join Time:</strong> {formatTime(q.join_time)} <br />
                                    <strong>Current Position:</strong> {q.position || "N/A"}
                                    <div className="mt-2">
                                        <button 
                                            className="btn btn-sm btn-danger"
                                            onClick={() => { if(window.confirm("Are you sure you want to quit the queue?")) handleQuitQueue(q.id); }}
                                        >
                                            Quit Queue
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                </>
            )}
        </div>
    );
}

export default CustomerAccount;
