import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function RestaurantLoginPage() {
    const [userid, setUserid] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/restaurants/login", { userid, password });
            localStorage.setItem("restaurantId", response.data.restaurantId);
            navigate("/restaurant-dashboard/reservations");
        } catch (err) {
            setError(err.response?.data?.error || "Login failed. Please check your credentials.");
        }
    };

    return (
        <div className="container my-4">
            <header className="py-3 mb-4" style={{ backgroundColor: "#ffc107" }}>
                <h1 className="text-center text-dark">Restaurant Login</h1>
            </header>
            <section>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">User ID</label>
                        <input type="text" className="form-control" value={userid} onChange={(e) => setUserid(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="d-flex justify-content-between">
                        <button type="submit" className="btn btn-primary">Login</button>
                        <Link to="/restaurant-signup" className="btn btn-primary">Sign Up</Link>
                    </div>
                </form>
            </section>
        </div>
    );
}

export default RestaurantLoginPage;