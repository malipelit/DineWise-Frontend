import React, { useState, useEffect } from "react";
import axios from "axios";
import TimePicker from 'react-time-picker';

const days = [
  { day: 0, label: "Sunday" },
  { day: 1, label: "Monday" },
  { day: 2, label: "Tuesday" },
  { day: 3, label: "Wednesday" },
  { day: 4, label: "Thursday" },
  { day: 5, label: "Friday" },
  { day: 6, label: "Saturday" }
];

function RestaurantOpeningHours({ restaurantId }) {
  const [openHours, setOpenHours] = useState([]);
  const [msg, setMsg] = useState("");

  const roundTime = (value) => {
    if (!value) return value;
    let [hour, minute] = value.split(":").map(Number);
    let rounded = Math.round(minute / 30) * 30;
    if (rounded === 60) {
      hour += 1;
      rounded = 0;
    }
    return `${hour.toString().padStart(2,'0')}:${rounded.toString().padStart(2,'0')}`;
  };

  useEffect(() => {
    axios.get(`/api/opening_hours/${restaurantId}`)
      .then(response => {
        if(response.data.opening_hours.length === 0){
          const defaults = days.map(d => ({
            day_of_week: d.day,
            open_time: d.day === 0 || d.day === 6 ? "10:00" : "09:00",
            close_time: d.day === 0 || d.day === 6 ? "16:00" : "17:00"
          }));
          setOpenHours(defaults);
        } else {
          setOpenHours(response.data.opening_hours);
        }
      })
      .catch(err => {
        console.error("Error fetching opening hours:", err);
      });
  }, [restaurantId]);

  const handleChange = (day, field, value) => {
    const newTime = roundTime(value);
    setOpenHours(openHours.map(item => (
      item.day_of_week === day ? { ...item, [field]: newTime } : item
    )));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`/api.opening_hours/${restaurantId}`, { opening_hours: openHours })
      .then(response => {
        setMsg("Opening hours updated successfully.");
      })
      .catch(err => setMsg(err.response?.data?.error || "Update failed."));
  };

  return (
    <div>
      <h3>Set Opening Hours</h3>
      {msg && <div className="alert alert-info">{msg}</div>}
      <form onSubmit={handleSubmit} className="border p-4 rounded">
        {days.map(d => {
          const dayData = openHours.find(item => item.day_of_week === d.day) || { open_time: "", close_time: "" };
          return (
            <div key={d.day} className="d-flex align-items-center mb-3">
              <div style={{ width: "100px" }}>{d.label}:</div>
              <div className="me-2">
                <TimePicker
                  onChange={(val) => handleChange(d.day, "open_time", val)}
                  value={dayData.open_time}
                  format="HH:mm"
                  disableClock={true}
                  clearIcon={null}
                />
              </div>
              <span className="me-2"> - </span>
              <div>
                <TimePicker
                  onChange={(val) => handleChange(d.day, "close_time", val)}
                  value={dayData.close_time}
                  format="HH:mm"
                  disableClock={true}
                  clearIcon={null}
                />
              </div>
            </div>
          );
        })}
        <button type="submit" className="btn btn-primary">Update Opening Hours</button>
      </form>
    </div>
  );
}

export default RestaurantOpeningHours;
