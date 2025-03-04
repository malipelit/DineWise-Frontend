import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  Navigate,
} from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

import 'react-datepicker/dist/react-datepicker.css';

// customer side
import CustomerHomePage from './customer/CustomerHomePage';
import RestaurantDetailPage from "./customer/RestaurantDetailPage";

// restaurant side
import RestaurantLoginPage from "./restaurant/RestaurantLoginPage";
import RestaurantDashboard from "./restaurant/RestaurantDashboard";

function NavigationBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: '#ffc107' }}>
      <div className="container">
        <Link className="navbar-brand" to="/">DineWise</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Customer</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/restaurant-login">Restaurant</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

// =================================================
// Main App with Routing
// =================================================
function App() {
  return (
      <Router>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<CustomerHomePage />} />
          <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />

          <Route path="/restaurant-login" element={<RestaurantLoginPage />} />
          <Route path="/restaurant-dashboard/*" element={<RestaurantDashboard />}>
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>    </Router>
  );
}


export default App;
