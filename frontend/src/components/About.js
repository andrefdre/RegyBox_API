import React from 'react';
import { Link } from 'react-router-dom'; // Usado para navegação

const About = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Banner Image */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <img
          src={`${process.env.PUBLIC_URL}/images/crossfit-banner.jpg`}
          alt="Fitness Banner"
          style={{ width: '100%', borderRadius: '8px' }}
        />
      </div>
      
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>About Regybox Scheduler</h1>

      <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#555' }}>
        Regybox Scheduler was created with one goal in mind: to make managing Regybox app class bookings
        effortless and stress-free. Inspired by the challenges of juggling busy schedules and the frustration
        of finding classes fully booked, our tool automates the scheduling process, ensuring you never miss out
        on a session again.
      </p>

      <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#555' }}>
        With Regybox Scheduler, you can easily view available classes, schedule sessions ahead of time,
        and receive reminders to keep you on track. Our intuitive design and powerful features make it
        the ultimate companion for fitness enthusiasts who want to focus on training rather than logistics.
      </p>

      <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#555' }}>
        Join us in revolutionizing the way you manage your Crossfit journey. With Regybox Scheduler, 
        you’re not just booking classes — you’re committing to your fitness goals, one class at a time.
      </p>

      {/* Mission Section with Background */}
      <div style={{ backgroundColor: '#f7f7f7', padding: '20px', borderRadius: '8px', marginTop: '40px', textAlign: 'center' }}>
        <h2 style={{ color: '#333' }}>Our Mission</h2>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto', color: '#555' }}>
          To simplify class scheduling for Crossfit enthusiasts, removing the hassle and ensuring that 
          you stay committed to your fitness routine without the stress of manual bookings.
        </p>
      </div>

      {/* Call to Action */}
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
      <Link to="/Login" className='text-decoration-none' 
        style={{
            backgroundColor: '#ffbe33',
            color: '#fff',
            padding: '10px 20px',
            fontSize: '1rem',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '20px'
          }}>Join us</Link>
      </div>
    </div>
  );
};

export default About;
