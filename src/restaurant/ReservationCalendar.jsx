import React, { useMemo } from "react";

function ReservationsCalendar({ reservations, weekStart, openingHours, onDeleteReservation }) {
    const days = [];
    for (let i = 0; i < 7; i++) {
        let day = new Date(weekStart);
        day.setDate(day.getDate() + i);
        days.push(day);
    }
    
    const calcTimeslots = (openingHours) => {
        let globalOpen = 24 * 60, globalClose = 0;
        if (openingHours && openingHours.length > 0) {
            openingHours.forEach(entry => {
                const [openH, openM] = entry.open_time.split(":").map(Number);
                const [closeH, closeM] = entry.close_time.split(":").map(Number);
                const openMinutes = openH * 60 + openM;
                const closeMinutes = closeH * 60 + closeM;
                if (openMinutes < globalOpen) globalOpen = openMinutes;
                if (closeMinutes > globalClose) globalClose = closeMinutes;
            });
        }
        if (globalOpen === 24 * 60) {
            globalOpen = 9 * 60;
        }
        if (globalClose === 0) {
            globalClose = 17 * 60;
        }
        const slots = [];
        for (let current = globalOpen; current < globalClose; current += 30) {
            const hour = Math.floor(current / 60);
            const minute = current % 60;
            slots.push({ hour, minute });
        }
        return slots;
    };

    const timeslots = useMemo(() => calcTimeslots(openingHours), [openingHours]);
    
    const formatTimeslotLabel = (slot) => {
        const hourStr = slot.hour.toString().padStart(2, '0');
        const minuteStr = slot.minute.toString().padStart(2, '0');
        return `${hourStr}:${minuteStr}`;
    };
    
    const isSlotOpen = (day, slot) => {
        const dayOfWeek = day.getDay();
        const entry = openingHours.find(item => Number(item.day_of_week) === dayOfWeek);
        if (!entry) {
            return false;
        }
        const [openH, openM] = entry.open_time.split(":").map(Number);
        const [closeH, closeM] = entry.close_time.split(":").map(Number);
        const openMinutes = openH * 60 + openM;
        const closeMinutes = closeH * 60 + closeM;
        const slotMinutes = slot.hour * 60 + slot.minute;
        const result = slotMinutes >= openMinutes && slotMinutes < closeMinutes;
        return result;
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
                        <td style={{ fontWeight: 'bold' }}>
                            {formatTimeslotLabel(slot)}
                        </td>
                        {days.map((day, dIdx) => {
                            const slotReservations = getReservationsForSlot(day, slot);
                            const open = isSlotOpen(day, slot);
                            return (
                                <td key={dIdx} style={{
                                    verticalAlign: 'top',
                                    minWidth: '100px',
                                    backgroundColor: open ? "inherit" : "#e0e0e0"
                                }}>
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