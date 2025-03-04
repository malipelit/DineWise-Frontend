import React from "react";

function ReservationsCalendar({ reservations, weekStart, onDeleteReservation }) {
    const days = [];
    for (let i = 0; i < 7; i++) {
        let day = new Date(weekStart);
        day.setDate(day.getDate() + i);
        days.push(day);
    }
    const timeslots = [];
    const openHour = 10;
    const closeHour = 22;
    for (let hour = openHour; hour < closeHour; hour++) {
        timeslots.push({ hour, minute: 0 });
        timeslots.push({ hour, minute: 30 });
    }
    const formatTimeslotLabel = (slot) => {
        const hourStr = slot.hour.toString().padStart(2, '0');
        const minuteStr = slot.minute.toString().padStart(2, '0');
        return `${hourStr}:${minuteStr}`;
    };
    const getReservationsForSlot = (day, slot) => {
        const slotDate = new Date(day);
        slotDate.setHours(slot.hour, slot.minute, 0, 0);
        return reservations.filter((res) => {
            const resDate = new Date(res.reservation_time);
            return (
                resDate.getFullYear() === slotDate.getFullYear() &&
                resDate.getMonth() === slotDate.getMonth() &&
                resDate.getDate() === slotDate.getDate() &&
                resDate.getHours() === slotDate.getHours() &&
                resDate.getMinutes() === slotDate.getMinutes()
            );
        });
    };

    return (
        <table className="table table-bordered">
            <thead className="table-warning">
            <tr>
                <th>Time Slot</th>
                {days.map((day, idx) => (
                    <th key={idx}>
                        {day.toLocaleDateString(undefined, {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </th>
                ))}
            </tr>
            </thead>
            <tbody>
            {timeslots.map((slot, idx) => (
                <tr key={idx}>
                    <td style={{ fontWeight: 'bold' }}>{formatTimeslotLabel(slot)}</td>
                    {days.map((day, dIdx) => {
                        const slotReservations = getReservationsForSlot(day, slot);
                        return (
                            <td key={dIdx} style={{ verticalAlign: 'top', minWidth: '100px' }}>
                                {slotReservations.length > 0 ? (
                                    <ul className="list-unstyled mb-0">
                                        {slotReservations.map((res) => (
                                            <li key={res.id} className="d-flex justify-content-between align-items-center">
                                                <small>
                                                    {res.customer_name} ({res.phone_number})
                                                </small>
                                                <button
                                                    className="btn btn-sm btn-danger ms-2"
                                                    onClick={() => onDeleteReservation(res.id)}
                                                >
                                                    X
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <span className="text-muted">-</span>
                                )}
                            </td>
                        );
                    })}
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default ReservationsCalendar;