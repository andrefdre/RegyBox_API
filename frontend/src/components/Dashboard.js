// Dashboard.js
import {useEffect} from "react";
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import DashboardCalendar from './DashboardCalendar'; // Create this component
import DashboardInformation from "./DashboardInformation";

const Dashboard = (props) => {
    const { isLoggedIn} = props;
    const navigate = useNavigate();  // useNavigate replaces redirect

    useEffect(() => {
      if (isLoggedIn === false) {
        navigate("/login");  // Redirect to login if not logged in
      }
    }, []);

  return (
    <div className="container-fluid body">
        <div className="row min-vh-100">
          {/* Left Sidebar */}
          <nav id="sidebarMenu" className="p-3 col-md-3 col-lg-2 d-md-block bg-light sidebar">
            <div className="position-sticky">
              <ul className="nav flex-column">
                <li className="nav-item">
                  <Link className="nav-link active" to="book-class">
                    Reservar Aulas
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="view-booked-classes">
                    Ver Aulas Reservadas
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          {/* Main Content */}
          <main className="col-md-9 ms-sm-auto col-lg-10 p-md-4">
            <div className="content">
            <Routes>
              <Route path="book-class" element={<DashboardCalendar />} />
      
              <Route path="view-booked-classes" element={<DashboardInformation/>} />
                {/* You can add your ViewBookedClasses component here */}
            </Routes>
            </div>
          </main>
        </div>
      </div>
  );
};

export default Dashboard;
