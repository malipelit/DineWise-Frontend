import React, { useState, useEffect } from "react";
import axios from "axios";
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

function RestaurantProfile({ restaurantId, onUpdate }) {
    const [profile, setProfile] = useState({
        name: '',
        location: '',
        cuisine: '',
        userid: '',
        password: ''
    });
    const [profileMsg, setProfileMsg] = useState("");
    const [hours, setHours] = useState([]);
    const [hoursMsg, setHoursMsg] = useState("");

    useEffect(() => {
        axios.get(`/api/restaurants/${restaurantId}`)
            .then(response => {
                const rest = response.data.restaurant;
                setProfile({
                    name: rest.name,
                    location: rest.location || '',
                    cuisine: rest.cuisine || '',
                    userid: rest.userid,
                    password: rest.password
                });
            })
            .catch(error => {
                console.error("Error fetching profile:", error);
            });
        axios.get(`/api/opening_hours/${restaurantId}`)
            .then(response => {
                if(response.data.opening_hours.length === 0){
                    const defaults = days.map(d => ({
                        day_of_week: d.day,
                        open_time: d.day === 0 || d.day === 6 ? "10:00" : "09:00",
                        close_time: d.day === 0 || d.day === 6 ? "16:00" : "17:00"
                    }));
                    setHours(defaults);
                } else {
                    setHours(response.data.opening_hours);
                }
            })
            .catch(err => {
                console.error("Error fetching opening hours:", err);
            });
    }, [restaurantId]);

    const handleProfileChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/restaurants/${restaurantId}`, profile);
            setProfileMsg("Information updated successfully.");
            if (onUpdate) onUpdate(profile);
        } catch (err) {
            setProfileMsg(err.response?.data?.error || "Update failed.");
        }
    };

    const roundTime = (value) => {
        if (!value) return "00:00";
        let [hour, minute] = value.split(":").map(Number);
        let rounded = Math.round(minute / 30) * 30;
        if (rounded === 60) {
            hour += 1;
            rounded = 0;
        }
        return `${hour.toString().padStart(2,'0')}:${rounded.toString().padStart(2,'0')}`;
    };

    const handleHoursChange = (day, field, value) => {
        const newTime = roundTime(value || "00:00");
        setHours(hours.map(item => (
          item.day_of_week === day ? { ...item, [field]: newTime } : item
        )));
    };

    const handleHoursSubmit = (e) => {
        e.preventDefault();
        axios.put(`/api/opening_hours/${restaurantId}`, { opening_hours: hours })
            .then(response => {
                setHoursMsg("Opening hours updated successfully.");
            })
            .catch(err => setHoursMsg(err.response?.data?.error || "Update failed."));
    };

    const timeStringToDate = (timeStr) => {
        if (!timeStr) return null;
        return new Date(`1970-01-01T${timeStr}:00`);
    };

    const dateToTimeString = (dateObj) => {
        if (!dateObj) return "";
        return dateObj.toTimeString().slice(0, 5);
    };

    return (
        <div>
            <h3>Edit Your Information</h3>
            {profileMsg && <div className="alert alert-info">{profileMsg}</div>}
            <form onSubmit={handleProfileSubmit}>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        name="name"
                        value={profile.name}
                        onChange={handleProfileChange}
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input 
                        type="text" 
                        className="form-control"
                        name="location"
                        value={profile.location}
                        onChange={handleProfileChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Cuisine</label>
                    <input 
                        type="text" 
                        className="form-control"
                        name="cuisine"
                        value={profile.cuisine}
                        onChange={handleProfileChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">User ID</label>
                    <input 
                        type="text" 
                        className="form-control"
                        name="userid"
                        value={profile.userid}
                        onChange={handleProfileChange}
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input 
                        type="password" 
                        className="form-control"
                        name="password"
                        value={profile.password}
                        onChange={handleProfileChange}
                        required 
                    />
                </div>
                <button type="submit" className="btn btn-primary">Update Information</button>
            </form>
            <hr />
            <h3 className="mt-4">Opening Hours</h3>
            {hoursMsg && <div className="alert alert-info">{hoursMsg}</div>}
            <form onSubmit={handleHoursSubmit} className="border p-4 rounded">
                {days.map(d => {
                    const dayData = hours.find(item => item.day_of_week === d.day) || { open_time: "", close_time: "" };
                    return (
                        <div key={d.day} className="d-flex align-items-center mb-3">
                            <div style={{ width: "100px" }}>{d.label}:</div>
                            <div className="me-2">
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <TimePicker
                                      label="Open"
                                      value={timeStringToDate(dayData.open_time)}
                                      onChange={(newValue) => {
                                          const newTime = dateToTimeString(newValue);
                                          handleHoursChange(d.day, "open_time", newTime);
                                      }}
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
                                      onChange={(newValue) => {
                                          const newTime = dateToTimeString(newValue);
                                          handleHoursChange(d.day, "close_time", newTime);
                                      }}
                                      renderInput={(params) => <TextField {...params} />}
                                      ampm={false}
                                      minutesStep={30}
                                    />
                                </LocalizationProvider>
                            </div>
                        </div>
                    );
                })}
                <button type="submit" className="btn btn-primary">Update Opening Hours</button>
            </form>
        </div>
    );
}

export default RestaurantProfile;
