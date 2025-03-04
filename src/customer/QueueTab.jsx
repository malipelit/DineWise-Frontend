import React, {useState} from "react";
import axios from "axios";

function QueueTab({ restaurantId }) {
    const [customerName, setCustomerName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [queueResponse, setQueueResponse] = useState(null);

    const handleJoinQueue = (e) => {
        e.preventDefault();
        if (!customerName || !phoneNumber) {
            alert("Please fill in all fields to join the queue.");
            return;
        }

        axios.get(`/queue/status?customer_name=${customerName}&phone_number=${phoneNumber}&restaurant_id=${restaurantId}&`)
            .then(response => {
                if (response.data) {
                    setQueueResponse(`You have already joined the queue! Your current position: ${response.data.position}.`);
                } else {
                    axios.post('/queue', {
                        restaurant_id: restaurantId,
                        customer_name: customerName,
                        phone_number: phoneNumber
                    })
                        .then(response => {
                            setQueueResponse(`Joined queue! Your current position: ${response.data.position}.`);
                        })
                        .catch(error => {
                            console.error("Error joining queue:", error);
                            setQueueResponse(error.response?.data?.error || "Error joining queue");
                        });
                }
            })
            .catch(error => {
                console.error("Error joining queue:", error);
                setQueueResponse(error.response?.data?.error || "Error joining queue");
            });
    };

    return (
        <div>
            <form onSubmit={handleJoinQueue} className="border p-4 rounded">
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
                <button type="submit" className="btn btn-warning">Join Queue</button>
            </form>
            {queueResponse && <div className="alert alert-info mt-3">{queueResponse}</div>}
        </div>
    );
}

export default QueueTab;