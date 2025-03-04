import React, {useState} from "react";
import axios from "axios";

function PositionTab({ restaurantId }) {
    const [customerName, setCustomerName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [queueResponse, setQueueResponse] = useState(null);

    const handleCheckPosition = (e) => {
        e.preventDefault();
        if (!customerName || !phoneNumber) {
            alert("Please fill in all fields to join the queue.");
            return;
        }
        axios.get(`/queue/status?customer_name=${customerName}&phone_number=${phoneNumber}&restaurant_id=${restaurantId}&`)
            .then(response => {
                if (response.data) {
                    setQueueResponse(`Your current position: ${response.data.position}.`);
                } else {
                    setQueueResponse(`You are not in the queue, please register first.`);
                }
            })
            .catch(error => {
                console.error("Error checking position:", error);
                setQueueResponse(<error className="response"></error>?.data?.error || "Error checking position");
            });
    }

    return (
        <div>
            <form onSubmit={handleCheckPosition} className="border p-4 rounded">
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
                <button type="submit" className="btn btn-warning">Check Status</button>
            </form>
            {queueResponse && <div className="alert alert-info mt-3">{queueResponse}</div>}
        </div>
    );
}

export default PositionTab;