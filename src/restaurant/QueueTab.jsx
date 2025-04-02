import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

function QueueTab() {
    const [restaurant, setRestaurant] = useState(null);
    const [queue, setQueue] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem('restaurantId');
        if (!stored) {
            navigate('/restaurant-login');
        } else {
            axios.get(`/api/restaurants/${stored}`)
                .then((response) => {
                    setRestaurant(response.data.restaurant);
                })
                .catch((error) => {
                    console.error('Error fetching restaurant:', error);
                    alert('Failed to fetch restaurant data.');
                });
            fetchQueue(stored);
        }
    }, [navigate]);

    const fetchQueue = (restaurantId) => {
        axios
            .get(`/queue?restaurant_id=${restaurantId}`)
            .then((response) => setQueue(response.data.queue))
            .catch((error) => console.error('Error fetching queue:', error));
    };

    const handleRemove = (id) => {
        if (!window.confirm('Remove this customer from the queue?')) return;
        axios
            .delete(`/queue/${id}`)
            .then(() => {
                setQueue((prev) => prev.filter((entry) => entry.id !== id));
            })
            .catch((error) => {
                console.error('Error removing from queue:', error);
                alert('Failed to remove entry from queue.');
            });
    };

    return (
        <div>
            <h2>Current Queue for {restaurant ? restaurant.name : ''}</h2>
            {queue.length === 0 ? (
                <p>No one is in the queue.</p>
            ) : (
                <table className="table table-bordered">
                    <thead className="table-warning">
                    <tr>
                        <th>ID</th>
                        <th>Customer Name</th>
                        <th>Phone Number</th>
                        <th>Joined At</th>
                        <th>Remove</th>
                    </tr>
                    </thead>
                    <tbody>
                    {queue.map((entry) => (
                        <tr key={entry.id}>
                            <td>{entry.id}</td>
                            <td>{entry.customer_name}</td>
                            <td>{entry.phone_number}</td>
                            <td>{new Date(entry.join_time).toLocaleString()}</td>
                            <td>
                                <button className="btn btn-sm btn-danger" onClick={() => handleRemove(entry.id)}>
                                    Kick
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default QueueTab;