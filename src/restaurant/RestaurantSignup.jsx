import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import TextField from '@mui/material/TextField';

const days = [
  { day: 0, label: "Sunday" },
  { day: 1, label: "Monday" },
  { day: 2, label: "Tuesday" },
  { day: 3, label: "Wednesday" },
  { day: 4, label: "Thursday" },
  { day: 5, label: "Friday" },
  { day: 6, label: "Saturday" }
];

const timeStringToDate = (timeStr) => {
  if (!timeStr) return null;
  return new Date(`1970-01-01T${timeStr}:00`);
};
const dateToTimeString = (dateObj) => {
  if (!dateObj) return "";
  return dateObj.toTimeString().slice(0, 5);
};

function RestaurantSignup() {
  const [form, setForm] = useState({
    name: "",
    location: "",
    cuisine: "",
    userid: "",
    password: ""
  });
  const [openingHours, setOpeningHours] = useState(
    days.map(d => ({
      day_of_week: d.day,
      open_time: d.day === 0 || d.day === 6 ? "10:00" : "09:00",
      close_time: d.day === 0 || d.day === 6 ? "16:00" : "17:00"
    }))
  );
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleHoursChange = (day, field, value) => {
    setOpeningHours(openingHours.map(item =>
      item.day_of_week === day ? { ...item, [field]: value } : item
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/restaurants/signup", {
        ...form,
        opening_hours: openingHours
      });
      setMsg("Sign up successful. Please login.");
      setTimeout(() => {
        navigate("/restaurant-login");
      }, 1500);
    } catch (err) {
      setMsg(err.response?.data?.error || "Sign up failed.");
    }
  };

  return (
    <div className="container my-4">
      <header className="py-3 mb-4" style={{ backgroundColor: "#ffc107" }}>
        <h1 className="text-center text-dark">Restaurant Sign Up</h1>
      </header>
      {msg && <div className="alert alert-info">{msg}</div>}
      <form onSubmit={handleSubmit} className="border p-4 rounded">
        <div className="mb-3">
          <label className="form-label">Restaurant Name</label>
          <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Location</label>
          <input type="text" name="location" className="form-control" value={form.location} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Cuisine</label>
          <input type="text" name="cuisine" className="form-control" value={form.cuisine} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">User ID</label>
          <input type="text" name="userid" className="form-control" value={form.userid} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} required />
        </div>
        <h4 className="mt-4">Set Opening Hours</h4>
        {days.map(d => {
          const dayData = openingHours.find(item => item.day_of_week === d.day);
          return (
            <div key={d.day} className="d-flex align-items-center mb-3">
              <div style={{ width: "100px" }}>{d.label}:</div>
              <div className="me-2">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimePicker
                      label="Open"
                      value={timeStringToDate(dayData.open_time)}
                      onChange={(newValue) => handleHoursChange(d.day, "open_time", dateToTimeString(newValue))}
                      renderInput={(params) => <TextField {...params} />}
                      ampm={false}
                      minutesStep={30}
                    />
                </LocalizationProvider>
              </div>
              <span className="me-2"> - </span>
              <div>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimePicker
                      label="Close"
                      value={timeStringToDate(dayData.close_time)}
                      onChange={(newValue) => handleHoursChange(d.day, "close_time", dateToTimeString(newValue))}
                      renderInput={(params) => <TextField {...params} />}
                      ampm={false}
                      minutesStep={30}
                    />
                </LocalizationProvider>
              </div>
            </div>
          );
        })}
        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-primary">Sign Up</button>
          <Link to="/restaurant-login" className="btn btn-primary">Already have an account? Login</Link>
        </div>
      </form>
    </div>
  );
}

export default RestaurantSignup;