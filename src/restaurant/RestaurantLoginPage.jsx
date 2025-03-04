import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

function RestaurantLoginPage() {
    const [restaurants, setRestaurants] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get('/restaurants')
            .then((response) => setRestaurants(response.data.restaurants))
            .catch((error) => console.error('Error fetching restaurants:', error));
    }, []);

    const handleLogin = (restaurant) => {
        localStorage.setItem('restaurant', JSON.stringify(restaurant));
        navigate('/restaurant-dashboard/reservations');
    };

    return (
        <div className="container my-4">
            <header className="py-3 mb-4" style={{ backgroundColor: '#ffc107' }}>
                <h1 className="text-center text-dark">Restaurant Login</h1>
            </header>
            <section>
                <h2 className="mb-3">Select Your Restaurant</h2>
                <div className="list-group">
                    {restaurants.map((r) => (
                        <button
                            key={r.id}
                            className="list-group-item list-group-item-action"
                            onClick={() => handleLogin(r)}
                        >
                            <h5>{r.name}</h5>
                            <p className="mb-1">{r.location}</p>
                            <small>{r.cuisine}</small>
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default RestaurantLoginPage;