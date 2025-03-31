import { Button } from "@/component/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios"; // or use fetch API

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8081/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to send message');
      }
      
      const result = await response.text();
      alert(result); // Shows "Email sent successfully"
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        message: ''
      });
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Failed to send message');
    }
};

  return (
    <div className="mt-10 min-h-screen bg-gray-100 flex flex-col items-center px-6 md:px-16 py-10">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        className="max-w-3xl text-center mb-10"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Get in Touch</h1>
        <p className="mt-4 text-lg text-gray-600">
          Have any questions or feedback? I'd love to hear from you!
        </p>
      </motion.div>

      {/* Contact Form */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        className="w-full max-w-lg bg-white p-8 shadow-lg rounded-2xl"
      >
        {submitStatus && (
          <div className={`mb-4 p-3 rounded-lg ${submitStatus.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {submitStatus.message}
          </div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-gray-700 font-semibold">Name</label>
            <input 
              type="text" 
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" 
              placeholder="Your Name" 
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 font-semibold">Email</label>
            <input 
              type="email" 
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" 
              placeholder="Your Email" 
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-gray-700 font-semibold">Message</label>
            <textarea 
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" 
              rows="4" 
              placeholder="Your Message"
              required
            ></textarea>
          </div>
          <Button 
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg shadow-md hover:shadow-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </motion.div>

      {/* Contact Details */}
      <div className="mt-12 text-center text-gray-700">
        <p>Email: <span className="font-semibold">harshitmishra905872@gmail.com</span></p>
        <p>Phone: <span className="font-semibold">+91 9193121455</span></p>
        <p>Address: <span className="font-semibold">Raipur, Chhattisgarh, India</span></p>
      </div>
    </div>
  );
}