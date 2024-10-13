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
    <div className='container align-self-center'>
      <h2 className='text-center'>Aulas Inscritas na APP Regybox</h2>

      <div className="classes-list mt-4">
        {errorMessages.length > 0 ? (
          <p className="text-danger">{errorMessages}</p>
        ) : classes.length > 0 ? (
          <ul className="list-group">
            {classes.map((classItem, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <p><strong>Data:</strong> {classItem.date}</p>
                  <p><strong>Hora:</strong> {classItem.hour}</p>
                  <p><strong>Inscritos:</strong> {classItem.total_students}</p>
                </div>
                <button 
                  className="btn btn-danger"
                  onClick={() => removeClassFromRegybox(classItem.date, classItem.hour)}
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Sem aulas inscritas no momento</p>
        )}
        </div>


        <h2 className='text-center'>Aulas Inscritas na APP Regybox Scheduler</h2>

        <div className="classes-list mt-4">
        {errorMessages.length > 0 ? (
            <p className="text-danger">{errorMessages}</p>
        ) : classes_to_enroll.length > 0 ? (
            <ul className="list-group">
            {classes_to_enroll.map((classItem, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <p><strong>Data:</strong> {classItem.date}</p>
                    <p><strong>Hora:</strong> {classItem.hour}</p>
                </div>
                <button 
                    className="btn btn-danger"
                    onClick={() => removeClass(classItem.date, classItem.hour)}
                >
                    Remover
                </button>
                </li>
            ))}
            </ul>
        ) : (
            <p>Sem aulas inscritas no momento</p>
        )}
      </div>
    </div>
  );
};

export default DashboardInformation;
