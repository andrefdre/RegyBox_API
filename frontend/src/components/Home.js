import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS


const Home = () => {
    return (
            <div className="container body">
                <div className="px-4 pt-5 my-5 text-center border-bottom">
                    <h1 className="display-4 fw-bold">Regybox Scheduler</h1>
                    <div className="col-lg-6 mx-auto">
                        <p className="lead mb-4">
                            Regybox Scheduler was created to solve the hassle of constantly scheduling Crossfit classes and the frustration of missing out when classes are full due to forgetting to book on time. Our app automatically registers you for classes, so you never have to worry about losing your spot again—focus on your training, and let us handle the rest.
                        </p>
                        <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mb-5">
                            <button type="button" className="btn btn-primary btn-lg px-4 me-sm-3">
                                Go to app
                            </button>
                            <button type="button" onClick={() => window.location.href = 'https://github.com/andrefdre/RegyBox_API'} className="btn btn-outline-secondary btn-lg px-4">
                                Source Code
                            </button>
                        </div>
                    </div>
                    <div className="overflow-hidden" style={{ maxHeight: '30vh' }}>
                        <div className="container px-5">
                            <img src={`${process.env.PUBLIC_URL}/images/demonstration.png`} className="img-fluid border rounded-3 shadow-lg mb-4" alt="Example" width="700" height="500" loading="lazy" />
                        </div>
                    </div>
                </div>

                <div className="container px-4 py-5" id="custom-cards">
                    <h2 className="pb-2">Features</h2>
                    <p>Discover the core features that make Regybox Scheduler the ultimate tool for managing your Crossfit classes. From seamless scheduling to flexible options and keeping you on track, we've designed our app to simplify your fitness routine so you can focus on what matters most — your training.</p>
                    
                    <div className="row row-cols-1 row-cols-lg-3 align-items-stretch g-4 py-5">
                        {/* Easy Scheduling Card */}
                        <div className="col img__wrap">
                            <div className="card card-cover h-100 overflow-hidden text-white bg-dark rounded-5 shadow-lg" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/unsplash-photo-1.jpg)` }}>
                                <div className="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
                                    <h2 className="pt-5 mt-5 mb-4 display-6 lh-1 fw-bold">Easy Scheduling</h2>
                                    <ul className="d-flex list-unstyled mt-auto">
                                        <li className="me-auto">
                                            <img src={`${process.env.PUBLIC_URL}/images/logo.svg`} alt="Logo" width="32" height="32" className="rounded-circle border border-white" />
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <p className="img__description rounded-5">Automate your Crossfit class bookings with just a few clicks. No more last-minute rush or missing out on full classes.</p>
                        </div>

                        {/* Flexible Options Card */}
                        <div className="col img__wrap">
                            <div className="card card-cover h-100 overflow-hidden text-white bg-dark rounded-5 shadow-lg" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/unsplash-photo-2.jpg)` }}>
                                <div className="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
                                    <h2 className="pt-5 mt-5 mb-4 display-6 lh-1 fw-bold">Flexible Options</h2>
                                    <ul className="d-flex list-unstyled mt-auto">
                                        <li className="me-auto">
                                            <img src={`${process.env.PUBLIC_URL}/images/logo.svg`} alt="Logo" width="32" height="32" className="rounded-circle border border-white" />
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <p className="img__description rounded-5">Choose the classes that best fit your schedule, whether it’s early morning, afternoon, or evening sessions. You decide when to train.</p>
                        </div>

                        {/* Stay on Track Card */}
                        <div className="col img__wrap">
                            <div className="card card-cover h-100 overflow-hidden text-white bg-dark rounded-5 shadow-lg" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/unsplash-photo-3.jpg)` }}>
                                <div className="d-flex flex-column h-100 p-5 pb-3 text-shadow-1">
                                    <h2 className="pt-5 mt-5 mb-4 display-6 lh-1 fw-bold">Stay on Track</h2>
                                    <ul className="d-flex list-unstyled mt-auto">
                                        <li className="me-auto">
                                            <img src={`${process.env.PUBLIC_URL}/images/logo.svg`} alt="Logo" width="32" height="32" className="rounded-circle border border-white" />
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <p className="img__description rounded-5">Our app keeps you updated with reminders and notifications, ensuring you never miss a workout again.</p>
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default Home;
