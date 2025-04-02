import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import 'react-datepicker/dist/react-datepicker.css';

import CustomerHomePage from './customer/CustomerHomePage';
import RestaurantDetailPage from "./customer/RestaurantDetailPage";
import CustomerAccount from "./customer/CustomerAccount";

import RestaurantLoginPage from "./restaurant/RestaurantLoginPage";
import RestaurantDashboard from "./restaurant/RestaurantDashboard";
import RestaurantSignup from "./restaurant/RestaurantSignup";

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
            <li className="nav-item"><Link className="nav-link" to="/">Homepage</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/customer-login">Customer Login</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/restaurant-login">Restaurant</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
      <Router>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<CustomerHomePage />} />
          <Route path="/customer-login" element={<CustomerAccount />} />
          <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
          <Route path="/restaurant-login" element={<RestaurantLoginPage />} />
          <Route path="/restaurant-signup" element={<RestaurantSignup />} />  {/* New route */}
          <Route path="/restaurant-dashboard/*" element={<RestaurantDashboard />}></Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>    
      </Router>
  );
}


export default App;
