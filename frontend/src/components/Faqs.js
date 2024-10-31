import React from 'react';

const FAQPage = () => {
  const faqs = [
    {
      question: "What is Regybox Scheduler?",
      answer: "Regybox Scheduler is an app that automates the registration process for CrossFit classes. Once set up, it will register you for your selected classes, saving you time and ensuring you don’t miss out due to full bookings."
    },
    {
      question: "Can I register for any CrossFit box?",
      answer: "Currently, Regybox Scheduler can only register classes for a specific CrossFit box, 'CrossfitFeira.' We're working to expand support to more locations in the future."
    },
    {
        question: "Do I need to create a new account?",
        answer: "No need! Simply use your existing Regybox account credentials to log in. There’s no extra account creation needed, making it easy to get started right away."
    },
    {
      question: "How does the automatic scheduling work?",
      answer: "Regybox Scheduler lets you choose your preferred class days and times. It then automatically registers you based on availability, so you don’t have to worry about setting reminders or rushing to book."
    },
    {
      question: "Can I cancel or reschedule classes?",
      answer: "Yes, you can easily manage or cancel your booked classes through the app. Just go to your scheduled classes and select the cancel option if needed."
    },
    {
      question: "Is my information secure?",
      answer: "Absolutely. We take data privacy seriously and use secure encryption methods to protect your information, including your account and class preferences."
    },
  ];

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f8f9fa" }}>
      <h1 style={{ fontSize: "2.5rem", textAlign: "center", marginBottom: "1.5rem", color: "#343a40" }}>Frequently Asked Questions</h1>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {faqs.map((faq, index) => (
          <div
            key={index}
            style={{
              marginBottom: "1.5rem",
              padding: "1.5rem",
              borderRadius: "8px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              backgroundColor: "white",
              transition: "transform 0.2s",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#343a40", marginBottom: "0.5rem" }}>
              {faq.question}
            </h3>
            <p style={{ fontSize: "1.1rem", lineHeight: "1.6", color: "#495057" }}>
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;
