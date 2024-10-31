import React, { useState, useEffect } from 'react';
import axiosInstance from '../interceptors/axios';  // Import Axios instance
import Cookies from 'js-cookie'; // For token if needed

const DashboardInformation = () => {
  const [classes, setClasses] = useState([]); // State to store enrolled classes
  const [classes_to_enroll, setClasses_to_enroll] = useState([]); // State to store enrolled classes
  const [errorMessages, setErrorMessages] = useState([]); // For error messages

  // Fetch enrolled classes on component mount
  useEffect(() => {
    const fetchEnrolledClasses = async () => {
      try {
        const requestData = {regybox_token: Cookies.get('regybox_token') };
        const response = await axiosInstance.get('/get-enrolled-classes', { params: requestData });  // Adjust backend URL as needed

        if (response.data.success) {
          setClasses(response.data.enrolled_classes);  // Set the enrolled classes in state
          setClasses_to_enroll(response.data.classes_list_to_enroll);  // Set the enrolled classes in state
          setErrorMessages([]);  // Clear any error messages
        } else {
          setErrorMessages([response.data.message]);
        }
      } catch (error) {
        setErrorMessages(['Failed to load enrolled classes.']);
      }
    };

    fetchEnrolledClasses(); // Call the function to fetch enrolled classes
  }, []);  // Empty array to ensure it runs only on component mount


   // Function to remove a class
   const removeClass = async (classe_date, classe_hour) => {
    try {
      const formData = {
        date: classe_date,
        time: classe_hour,
      };
      const response = await axiosInstance.post(`/remove-class`, formData);

      if (response.data.success === true) {
        window.location.reload(); // Reload the page to update the state
      }
    } catch (error) {
      console.error('Error removing class:', error);
    }
  };


     // Function to remove a class
     const removeClassFromRegybox = async (classe_date, classe_hour) => {
        try {
          const formData = {
            date: classe_date,
            time: classe_hour,
            regybox_token: Cookies.get('regybox_token')
          };
          const response = await axiosInstance.post(`/remove-class-from-regybox`, formData);
    
          if (response.data.success === true) {
            window.location.reload(); // Reload the page to update the state
          }
        } catch (error) {
          console.error('Error removing class:', error);
        }
      };
    
  

  return (
   <div className="container my-5">
  <h2 className="text-center mb-5">Classes Enrolled in Regybox App</h2>

  <div className="classes-list mb-5">
    {errorMessages.length > 0 ? (
      <p className="text-danger text-center">{errorMessages}</p>
    ) : classes.length > 0 ? (
      <ul className="list-group">
        {classes.map((classItem, index) => (
          <li
            key={index}
            className="list-group-item d-flex justify-content-between align-items-center mb-3"
            style={{
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              backgroundColor: "#f9f9f9",
              padding: "20px",
            }}
          >
            <div>
              <p className="mb-1">
                <strong>📅 Date:</strong> {classItem.date}
              </p>
              <p className="mb-1">
                <strong>⏰ Time:</strong> {classItem.hour}
              </p>
              <p className="mb-1">
                <strong>👥 Enrolled:</strong> {classItem.total_students}
              </p>
            </div>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => removeClassFromRegybox(classItem.date, classItem.hour)}
              style={{
                fontSize: "0.9rem",
                padding: "8px 16px",
                borderRadius: "4px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              🗑 Remove
            </button>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-center">No classes enrolled at the moment</p>
    )}
  </div>

  <h2 className="text-center mb-5">Classes Scheduled in Regybox Scheduler App</h2>

  <div className="classes-list">
    {errorMessages.length > 0 ? (
      <p className="text-danger text-center">{errorMessages}</p>
    ) : classes_to_enroll.length > 0 ? (
      <ul className="list-group">
        {classes_to_enroll.map((classItem, index) => (
          <li
            key={index}
            className="list-group-item d-flex justify-content-between align-items-center mb-3"
            style={{
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              backgroundColor: "#f9f9f9",
              padding: "20px",
            }}
          >
            <div>
              <p className="mb-1">
                <strong>📅 Date:</strong> {classItem.date}
              </p>
              <p className="mb-1">
                <strong>⏰ Time:</strong> {classItem.hour}
              </p>
            </div>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => removeClass(classItem.date, classItem.hour)}
              style={{
                fontSize: "0.9rem",
                padding: "8px 16px",
                borderRadius: "4px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              🗑 Remove
            </button>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-center">No scheduled classes at the moment</p>
    )}
  </div>
</div>

  );
};

export default DashboardInformation;
