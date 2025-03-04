import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

import ReservationsCalendar from "./ReservationCalendar";

function ReservationTab() {
    const [reservations, setReservations] = useState([]);
    const [currentWeekStart, setCurrentWeekStart] = useState(() => {
        const now = new Date();
        const day = now.getDay();
        const sunday = new Date(now);
        sunday.setDate(now.getDate() - day);
        sunday.setHours(0, 0, 0, 0);
        return sunday;
    });
    const [restaurant, setRestaurant] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem('restaurant');
        if (!stored) {
            navigate('/restaurant-login');
        } else {
            const r = JSON.parse(stored);
            setRestaurant(r);
            fetchReservations(r.id);
        }
    }, [navigate]);

    const fetchReservations = (restaurantId) => {
        axios
            .get(`/reservations?restaurant_id=${restaurantId}`)
            .then((response) => setReservations(response.data.reservations))
            .catch((error) =>
                console.error('Error fetching reservations:', error)
            );
    };

    const goToPreviousWeek = () => {
        setCurrentWeekStart((prev) => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() - 7);
            return newDate;
        });
    };

    const goToNextWeek = () => {
        setCurrentWeekStart((prev) => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() + 7);
            return newDate;
        });
    };

    const handleDeleteReservation = (reservationId) => {
        if (!window.confirm('Are you sure you want to delete this reservation?'))
            return;
        axios
            .delete(`/reservations/${reservationId}`)
            .then(() => {
                setReservations((prev) =>
                    prev.filter((r) => r.id !== reservationId)
                );
            })
            .catch((error) => {
                console.error('Error deleting reservation:', error);
                alert('Failed to delete reservation');
            });
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <button className="btn btn-outline-secondary" onClick={goToPreviousWeek}>
                    Previous Week
                </button>
                <h4>Week of {currentWeekStart.toLocaleDateString()}</h4>
                <button className="btn btn-outline-secondary" onClick={goToNextWeek}>
                    Next Week
                </button>
            </div>
            <ReservationsCalendar
                reservations={reservations}
                weekStart={currentWeekStart}
                onDeleteReservation={handleDeleteReservation}
            />
        </div>
    );
}

export default ReservationTab;