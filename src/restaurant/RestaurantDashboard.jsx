import {Link, Outlet, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";

import QueueTab from "./QueueTab";
import ReservationTab from "./ReservationTab";

function RestaurantDashboard() {
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState(null);
    const [activeTab, setActiveTab] = useState('reservation');

    useEffect(() => {
        const stored = localStorage.getItem('restaurant');
        if (!stored) {
            navigate('/restaurant-login');
        } else {
            setRestaurant(JSON.parse(stored));
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('restaurant');
        navigate('/restaurant-login');
    };

    if (!restaurant) return null;

    return (
        <div className="container my-4">
            <header
                style={{ backgroundColor: '#ffc107', padding: '1rem', marginBottom: '1rem' }}
            >
                <div className="d-flex justify-content-between align-items-center">
                    <h1 className="text-dark mb-0">Restaurant Dashboard</h1>
                    <button className="btn btn-sm btn-outline-dark" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </header>
            <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <button className={`nav-link ${activeTab==='reservation'?'active':''}`}
                            onClick={() => setActiveTab('reservation')}>
                        Reservations
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab==='queue'?'active':''}`}
                            onClick={() => setActiveTab('queue')}>
                        Queue
                    </button>
                </li>
            </ul>
            {activeTab === 'reservation' ? (<ReservationTab />) : (<QueueTab />)}
            <Outlet />
        </div>
    );
}

export default RestaurantDashboard;