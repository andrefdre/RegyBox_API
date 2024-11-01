import { useEffect } from "react";
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import DashboardCalendar from './DashboardCalendar';
import DashboardInformation from "./DashboardInformation";

const Dashboard = (props) => {
    const { isLoggedIn } = props;
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    return (
        <div className="container-fluid body">
            <div className="row min-vh-100">
                {/* Left Sidebar */}
                <nav id="sidebarMenu" className="p-3 col-md-3 col-lg-2 bg-dark sidebar text-white">
                    <div className="position-sticky">
                        <h5 className="text-center text-uppercase py-2 border-bottom">Dashboard</h5>
                        <ul className="nav flex-column mt-4">
                            <li className="nav-item mb-2">
                                <Link className="nav-link text-white rounded px-3 py-2" to="book-class">
                                    📅 Book Classes
                                </Link>
                            </li>
                            <li className="nav-item mb-2">
                                <Link className="nav-link text-white rounded px-3 py-2" to="view-booked-classes">
                                    📖 View Booked Classes
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="col-md-9 ms-sm-auto col-lg-10 p-md-4">
                    <div className="content bg-light p-4 rounded shadow-sm">
                        <Routes>
                            <Route path="book-class" element={<DashboardCalendar />} />
                            <Route path="view-booked-classes" element={<DashboardInformation />} />
                        </Routes>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
