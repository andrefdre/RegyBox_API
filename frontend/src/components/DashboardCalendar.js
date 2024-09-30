import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import styles for the calendar

const classesData = {
  '2024-09-29': ['Yoga Class', 'Pilates Class'],
  '2024-09-30': ['Crossfit Class', 'HIIT Class'],
  '2024-10-01': ['Zumba Class'],
};

const DashboardCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [classes, setClasses] = useState([]);

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    const formattedDate = selectedDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    setClasses(classesData[formattedDate] || []); // Set classes for the selected date
  };

  return (
    <div>
      <h2>Select a Date to View Classes</h2>
      <Calendar onChange={handleDateChange} value={date} />
      <div className="classes-list">
        <h3>Classes for {date.toDateString()}:</h3>
        {classes.length > 0 ? (
          <ul>
            {classes.map((classItem, index) => (
              <li key={index}>{classItem}</li>
            ))}
          </ul>
        ) : (
          <p>No classes available for this date.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardCalendar;
