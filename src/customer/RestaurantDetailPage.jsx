import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";

import ReservationTab from "./ReservationTab";
import QueueTab from "./QueueTab";
import PositionTab from "./PositionTab";

const days = [
  { day: 0, label: "Sunday" },
  { day: 1, label: "Monday" },
  { day: 2, label: "Tuesday" },
  { day: 3, label: "Wednesday" },
  { day: 4, label: "Thursday" },
  { day: 5, label: "Friday" },
  { day: 6, label: "Saturday" }
];

function RestaurantDetailPage() {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [activeTab, setActiveTab] = useState('reservation');
    const navigate = useNavigate();
    const [openingHours, setOpeningHours] = useState([]);

    const handleBack = (e) => {
        navigate('/');
    }
    const activeTabElement = (e) => {
        if (activeTab === 'reservation') {
            return (<ReservationTab restaurantId={restaurant.id} />);
        } else if (activeTab === 'queue') {
            return (<QueueTab restaurantId={restaurant.id} />);
        } else if (activeTab === 'position') {
            return (<PositionTab restaurantId={restaurant.id} />);
        }
    }

    useEffect(() => {
        axios.get('/restaurants')
            .then(response => {
                const found = response.data.restaurants.find(r => r.id.toString() === id);
                setRestaurant(found);
            })
            .catch(error => console.error("Error fetching restaurant details:", error));
    }, [id]);

    useEffect(() => {
        if (restaurant) {
            axios.get(`/api/opening_hours/${restaurant.id}`)
                .then(response => {
                    setOpeningHours(response.data.opening_hours);
                })
                .catch(err => {
                    console.error("Error fetching opening hours:", err);
                });
        }
    }, [restaurant]);

    if (!restaurant) {
        return <div className="container my-4"><p>Loading restaurant...</p></div>;
    }

    return (
        <div className="container my-4">
            <header className="py-3 mb-4 d-flex justify-content-between align-items-center" style={{ backgroundColor: '#ffc107', padding: '1rem', marginBottom: '1rem' }}>
                <button className="btn btn-sm btn-outline-dark" onClick={handleBack}>
                    Back
                </button>
                <h1 className="text-center text-dark">{restaurant.name}</h1>
                <div style={{ width: "88px" }}> </div>
            </header>
            <div className="mb-4">
                <p><strong>Location:</strong> {restaurant.location}</p>
                <p><strong>Cuisine:</strong> {restaurant.cuisine}</p>
            </div>
            <section className="mt-4">
                <h2>Opening Hours</h2>
                {openingHours.length ? (
                    <ul className="list-group">
                        {days.map(d => {
                            const entry = openingHours.find(item => Number(item.day_of_week) === d.day);
                            return (
                                <li key={d.day} className="list-group-item">
                                    <strong>{d.label}:</strong>{" "}
                                    {entry ? `${entry.open_time} - ${entry.close_time}` : "Closed"}
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p>Loading opening hours...</p>
                )}
            </section>
            <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <button className={`nav-link ${activeTab==='reservation'?'active':''}`}
                            onClick={() => setActiveTab('reservation')}>
                        Make Reservation
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab==='queue'?'active':''}`}
                            onClick={() => setActiveTab('queue')}>
                        Join Queue
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab==='position'?'active':''}`}
                            onClick={() => setActiveTab('position')}>
                        Check Position
                    </button>
                </li>
            </ul>
            {activeTabElement()}
        </div>
    );
}

export default RestaurantDetailPage;