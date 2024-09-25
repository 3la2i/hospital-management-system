import React, { useState } from 'react';
import axios from 'axios';
import { User, Mail, Calendar, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:4025/api/contact-us/creatcontact', formData);
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus('error');
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

    <Header/>
    <section className="bg-gradient-to-br from-blue-100 to-blue-200 py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <h2 className="text-4xl font-bold text-center mb-10 text-blue-800">Get in Touch</h2>
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 p-8">
              {status === 'success' && (
                <div className="mb-6 flex items-center justify-center text-green-600 bg-green-100 p-4 rounded-lg">
                  <CheckCircle className="mr-2" size={20} />
                  <span>Your message has been sent successfully!</span>
                </div>
              )}
              {status === 'error' && (
                <div className="mb-6 flex items-center justify-center text-red-600 bg-red-100 p-4 rounded-lg">
                  <AlertCircle className="mr-2" size={20} />
                  <span>An error occurred. Please try again.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block mb-2 font-semibold text-gray-700">Name</label>
                    <div className="flex items-center border-2 border-gray-300 rounded-lg px-4 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-300">
                      <User className="mr-2 text-blue-500" size={18} />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full border-none focus:ring-0 bg-transparent"
                        placeholder="Your Name"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-2 font-semibold text-gray-700">Email</label>
                    <div className="flex items-center border-2 border-gray-300 rounded-lg px-4 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-300">
                      <Mail className="mr-2 text-blue-500" size={18} />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full border-none focus:ring-0 bg-transparent"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block mb-2 font-semibold text-gray-700">Subject</label>
                  <div className="flex items-center border-2 border-gray-300 rounded-lg px-4 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-300">
                    <Calendar className="mr-2 text-blue-500" size={18} />
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full border-none focus:ring-0 bg-transparent"
                      placeholder="What's this about?"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block mb-2 font-semibold text-gray-700">Message</label>
                  <div className="flex items-start border-2 border-gray-300 rounded-lg px-4 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-300">
                    <MessageSquare className="mr-2 text-blue-500 mt-1" size={18} />
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full border-none focus:ring-0 bg-transparent"
                      rows="4"
                      placeholder="Your message here..."
                    ></textarea>
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
            <div className="w-full md:w-1/2 bg-blue-500 flex items-center justify-center p-8">
              <div className="relative w-full h-full">
                <img
                  src="https://img.freepik.com/premium-vector/concept-dentist-doctor-nurse-standing-hospital-room-with-dental-tools_36082-676.jpg"
                  alt="Dentist and Patient"
                  className="object-cover rounded-lg shadow-xl"
                />
                <div className="absolute inset-0 bg-blue-800 opacity-20 rounded-lg"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="text-3xl font-bold text-white mb-2">We're Here to Help</h3>
                  <p className="text-white text-lg">Our team of dental professionals is ready to answer your questions and provide the care you need.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <Footer/>
    </div>

  );
};

export default ContactUs;