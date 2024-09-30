// Dashboard.js
import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
// import BookClass from './BookClass'; // Create this component
// import ViewBookedClasses from './ViewBookedClasses'; // Create this component
import DashboardCalendar from './DashboardCalendar'; // Create this component


const Dashboard = () => {
  return (
    <div className="container body">
        <div className="row">
          {/* Left Sidebar */}
          <nav id="sidebarMenu" className="p-3 col-md-3 col-lg-2 d-md-block bg-light sidebar vh-100">
            <div className="position-sticky">
              <ul className="nav flex-column">
                <li className="nav-item">
                  <Link className="nav-link active" to="/dashboard/book-class">
                    Reservar Aulas
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard/view-booked-classes">
                    Ver Aulas Reservadas
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          {/* Main Content */}
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="content">
            <Routes>
              <Route path="/dashboard/book-class" element={<DashboardCalendar />} />
      
              <Route path="/dashboard/view-booked-classes">
                {/* You can add your ViewBookedClasses component here */}
              </Route>
              <Route path="/">
              </Route>
            </Routes>
            </div>
          </main>
        </div>
      </div>
  );
};

export default Dashboard;
