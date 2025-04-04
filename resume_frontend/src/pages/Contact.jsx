import { Button } from "@/component/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL;
const CONTACT_PHONE = import.meta.env.VITE_CONTACT_PHONE;
const CONTACT_ADDRESS = import.meta.env.VITE_CONTACT_ADDRESS;

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${API_URL}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(await response.text());

      alert("Email sent successfully!");
      setFormData({ name: '', email: '', message: '' }); // Reset form
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-10 min-h-screen bg-gray-100 flex flex-col items-center px-6 md:px-16 py-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Get in Touch</h1>
        <p className="mt-4 text-lg text-gray-600">Have any questions or feedback? I'd love to hear from you!</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-lg bg-white p-8 shadow-lg rounded-2xl">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" required className="w-full p-3 border border-gray-300 rounded-lg" />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" required className="w-full p-3 border border-gray-300 rounded-lg" />
          <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Your Message" required className="w-full p-3 border border-gray-300 rounded-lg" rows="4"></textarea>
          <Button type="submit" className="w-full bg-primary text-white py-3 rounded-lg shadow-md hover:shadow-lg" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </motion.div>

      <div className="mt-12 text-center text-gray-700">
        <p>Email: <span className="font-semibold">{CONTACT_EMAIL}</span></p>
        <p>Phone: <span className="font-semibold">{CONTACT_PHONE}</span></p>
        <p>Address: <span className="font-semibold">{CONTACT_ADDRESS}</span></p>
      </div>
    </div>
  );
}
