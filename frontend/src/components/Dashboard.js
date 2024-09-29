// Dashboard.js
import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import BookClass from './BookClass'; // Create this component
import ViewBookedClasses from './ViewBookedClasses'; // Create this component


const Dashboard = () => {
  return (
    <div className="container body p-5">
      <div className="container-fluid">
        <div className="row">
          {/* Left Sidebar */}
          <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar">
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
              <Switch>
                <Route path="/dashboard/book-class" component={BookClass} />
                <Route path="/dashboard/view-booked-classes" component={ViewBookedClasses} />
                {/* You can add more routes here */}
              </Switch>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
