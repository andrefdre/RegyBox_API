import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import for URL navigation and reading the location
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import styles for the calendar
import Cookies from 'js-cookie';
import axiosInstance from '../interceptors/axios';  // Import Axios instance

const DashboardCalendar = () => {
  const navigate = useNavigate(); // Used to navigate programmatically
  const location = useLocation(); // Used to access the current URL

  const [date, setDate] = useState();
  const [classes, setClasses] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]); // For error messages

  // Function to update URL and fetch data when the date changes
  const handleDateChange = (selectedDate) => {
    const offset = selectedDate.getTimezoneOffset();
    const localDate = new Date(selectedDate.getTime() - (offset * 60 * 1000));
    const formattedDate = localDate.toISOString().split('T')[0];
    setDate(formattedDate);
    navigate(`/dashboard/book-class?date=${formattedDate}`); // Update the URL with the selected date
  };

  // Fetch classes whenever the date changes (based on URL)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const dateFromURL = params.get('date');
    
    if (dateFromURL) {
      const selectedDate = new Date(dateFromURL);
      const offset = selectedDate.getTimezoneOffset();
      const localDate = new Date(selectedDate.getTime() - (offset * 60 * 1000));
      const formattedDate = localDate.toISOString().split('T')[0];
      setDate(formattedDate); // Set date based on the URL param
      fetchClasses(selectedDate); // Fetch the classes for this date
    } else {
      const selectedDate = new Date();
      const offset = selectedDate.getTimezoneOffset();
      const localDate = new Date(selectedDate.getTime() - (offset * 60 * 1000));
      const formattedDate = localDate.toISOString().split('T')[0];
      setDate(formattedDate); // Set date based on the URL param
      fetchClasses(localDate); // If no date in URL, fetch today's classes
    }
  }, [location.search]); // Dependency array triggers useEffect when the URL changes

  // Fetch classes based on selected date
  const fetchClasses = async (selectedDate) => {
    // Adjust date for timezone offset
    const formattedDate = selectedDate.toISOString().split('T')[0];

    try {
      const requestData = { date: formattedDate, regybox_token: Cookies.get('regybox_token') };
      const response = await axiosInstance.get(`/get-classes`, { params: requestData });

      if (response.data.success === false) {
        setErrorMessages([response.data.message]);
        return;
      }

      setErrorMessages([]);
      setClasses(response.data);
    } catch (error) {
      if (error.response.data.message[0] === undefined) {
        setErrorMessages(['An error occurred. Please try again later.']);
      } else {
        setErrorMessages(error.response.data.message[0]);
      }
    }
  };

  // Function to join a class
  const joinClass = async (classe_date, classe_hour) => {
    try {
      const formData = {
        date: classe_date,
        time: classe_hour,
      };
      const response = await axiosInstance.post(`/add-class`, formData);

      if (response.data.success === true) {
        window.location.reload(); // Reload the page to update the state
      }
    } catch (error) {
      console.error('Error joining class:', error);
    }
  };

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

  return (
    <div className='container align-self-center'>
      <h2 className='text-center'>Escolha uma data para visualizar aulas disponíveis</h2>
      <Calendar className='w-100 d-inline-block' onChange={handleDateChange} value={date} />

      <div className="classes-list mt-4">
        <h3>Aulas do dia {date}:</h3>

        {errorMessages.length > 0 ? (
          <p className="text-danger">{errorMessages}</p>
        ) : classes.length > 0 ? (
          <ul className="list-group">
            {classes.map((classItem, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <p><strong>Time:</strong> {classItem.time}</p>
                  <p><strong>Inscritos:</strong> {classItem.students_in_class}/{classItem.total_students}</p>
                </div>
                {classItem['enrolled'] ? (
                  <button 
                    className="btn btn-warning"
                    onClick={() => removeClass(classItem['date'], classItem['time'])}>
                    Já inscrito
                  </button>
                ) : classItem['enrolled_for_the_day'] ? (
                  <button className="btn btn-danger">
                    Já inscrito para o dia
                  </button>
                ) : (
                  <button
                    className="btn btn-success"
                    onClick={() => joinClass(classItem['date'], classItem['time'])}>
                    Adicionar ao Scheduler
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>Sem aulas disponíveis para este dia</p>
        )}
      </div>
    </div>
  );
};

export default DashboardCalendar;
