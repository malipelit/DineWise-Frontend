import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import QueueTab from "./QueueTab";
import ReservationTab from "./ReservationTab";
import RestaurantProfile from "./RestaurantProfile";
import { Outlet } from "react-router-dom";

function RestaurantDashboard() {
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState(null);
    const [activeTab, setActiveTab] = useState('reservation');

    useEffect(() => {
        const storedId = localStorage.getItem('restaurantId');
        if (!storedId) {
            navigate('/restaurant-login');
        } else {
            axios.get(`/api/restaurants/${storedId}`)
                .then(response => {
                    setRestaurant(response.data.restaurant);
                })
                .catch(error => {
                    console.error('Error fetching restaurant info:', error);
                    navigate('/restaurant-login');
                });
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('restaurantId');
        navigate('/restaurant-login');
    };

    return (
        <div className="container my-4">
            <header style={{ backgroundColor: '#ffc107', padding: '1rem', marginBottom: '1rem' }}>
                <div className="d-flex justify-content-between align-items-center">
                    <h1 className="text-dark mb-0">Restaurant Dashboard</h1>
                    <button className="btn btn-sm btn-outline-dark" onClick={handleLogout}>Logout</button>
                </div>
            </header>
            <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <button className={`nav-link ${activeTab==='reservation' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reservation')}>
                        Reservations
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab==='queue' ? 'active' : ''}`}
                        onClick={() => setActiveTab('queue')}>
                        Queue
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab==='profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}>
                        Profile
                    </button>
                </li>
            </ul>
            {activeTab === 'reservation' && <ReservationTab restaurantId={restaurant?.id} />}
            {activeTab === 'queue' && <QueueTab />}
            {activeTab === 'profile' && restaurant && (
                <RestaurantProfile 
                    restaurantId={restaurant.id} 
                    onUpdate={(updated) => setRestaurant({ ...restaurant, ...updated })}
                />
            )}
            <Outlet />
        </div>
    );
}

export default RestaurantDashboard;