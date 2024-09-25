import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTooth, FaNewspaper, FaArrowRight, FaSmile, FaTeeth, FaCalendarAlt, FaUserMd, FaQuoteRight, FaChartLine, FaMicroscope, FaHeartbeat } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Footer from "./components/Footer";
import Header from "./components/Header";
import { Link, useNavigate } from 'react-router-dom';

// Assume these imports work for your project structure
import heroVideo from "./assets/herovid.mp4";
import img2 from "./assets/ms.jpg";

const testimonials = [
  { name: "Mohammed S.", text: "Excellent service and a very friendly staff!" },
  { name: "Layla A.", text: "The doctors are highly knowledgeable and caring." },
  { name: "Ahmed R.", text: "I always feel well cared for here." },
];

const news = [
  { title: "New Techniques in Dental Implants", date: "May 15, 2024" },
  { title: "The Importance of Regular Dental Check-ups", date: "May 10, 2024" },
  { title: "Tips for Maintaining Oral Health", date: "May 5, 2024" },
];



const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsVisible(true);

    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:4025/api/doctors');
        setDoctors(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('An error occurred while fetching doctors');
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleDoctorClick = (doctorId) => {
    navigate(`/doctor/${doctorId}`);
  };

  return (
    <div>

 <Header />
   
    <div
      className="font-sans text-sm"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
     

      {/* Hero Section with Video Background */}
      <section className="relative h-screen overflow-hidden">
        <video
          autoPlay
          loop
          muted
          className="absolute w-full h-full object-cover"
        >
          <source src={heroVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(52,165,177,0.7)] to-[rgba(52,165,177,0.7)]"></div>

        <div className="absolute inset-0">
          <svg
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 1440 800"
          >
            <path
              fill="rgba(255,255,255,0.1)"
              d="M1440 0v800L720 400 0 800V0l720 400L1440 0z"
            />
          </svg>
        </div>
        <div className="relative z-10 flex items-center justify-center h-full text-white">
          <div className="text-center">
            <motion.h1
              className="text-5xl font-bold mb-3 tracking-tight"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Bright Smile Dental Clinic
            </motion.h1>
            <motion.p
              className="mb-6 text-lg font-light"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Experience world-class dental care with our expert team
            </motion.p>
            <Link to="/DoctorsPage">
              <motion.button
                className="bg-white text-[#34a5b1] px-8 py-3 rounded-full font-bold text-sm hover:bg-blue-100 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Book Your Appointment Now
              </motion.button>
            </Link>
           
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white my-20">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-16 text-[#34a5b1] mt-10">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "General Dentistry",
                icon: FaTooth,
                description: "Comprehensive care for your overall oral health",
              },
              {
                name: "Cosmetic Dentistry",
                icon: FaSmile,
                description: "Enhance your smile with our aesthetic treatments",
              },
              {
                name: "Orthodontics",
                icon: FaTeeth,
                description: "Achieve a perfectly aligned and beautiful smile",
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="bg-blue-100 rounded-full p-6 inline-block mb-6">
                  <service.icon size={48} className="text-[#34a5b1]" />
                </div>
                <h3 className="text-2xl font-semibold text-[#34a5b1] mb-4">
                  {service.name}
                </h3>
                <p className="text-[#34a5b1]text-center">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Technology Section */}
      {/* <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Advanced Dental Technology
          </h2>
          <div className="grid grid-cols-3 gap-8">
            {[
              {
                name: "3D Imaging",
                icon: FaChartLine,
                description: "High-precision 3D scans for accurate diagnoses",
              },
              {
                name: "Laser Dentistry",
                icon: FaMicroscope,
                description:
                  "Minimally invasive procedures with faster healing",
              },
              {
                name: "Digital Impressions",
                icon: FaHeartbeat,
                description:
                  "Comfortable and precise digital mouth impressions",
              },
            ].map((tech, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.03 }}
              >
                <div className="bg-blue-100 rounded-full p-3 inline-block mb-4">
                  <tech.icon size={24} className="text-[#34a5b1]" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  {tech.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{tech.description}</p>
                <a
                  href="https://www.google.com/search?q=advanced+dental+technology"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[#34a5b1] text-sm font-semibold hover:text-blue-800 transition duration-300"
                >
                  Read More <FaArrowRight className="ml-2" size={12} />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}


        

      {/* About Us Section */}
      <section className="py-16 bg-white my-10">
        <div className="container mx-auto px-4 flex items-center">
          <motion.div
            className="w-1/2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={img2}
              alt="Dental Team"
              className="rounded-lg shadow-xl"
            />
          </motion.div>
          <div className="w-1/2 pl-12">
            <h2 className="text-4xl font-bold mb-6 text-[#34a5b1]">About Us</h2>
            <p className="mb-6 text-gray-600 leading-relaxed">
              We are a team of specialized dentists committed to providing the
              highest level of care for our patients' oral health. With years of
              experience and cutting-edge technology, we ensure that every visit
              is comfortable and effective.
            </p>

            <Link to='/about'>
            <motion.button
              className="bg-[#34a5b1] text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-[#34a5b1] transition duration-300 ease-in-out transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
            </Link>
          </div>
        </div>
      </section>

    {/* Our Medical Team Section */}
    <section className="py-20  ">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-28 text-[#34a5b1]">
            Our Medical Team
          </h2>
          {loading ? (
            <p className="text-center text-gray-600">Loading doctors...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {doctors.map((doctor) => (
                <motion.div
                  key={doctor.id}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center"
                  whileHover={{ y: -5 }}
                  onClick={() => handleDoctorClick(doctor.id)} // Add your onClick event here
                >
                  <div className="w-32 h-32 bg-blue-100 rounded-full mb-6 flex items-center justify-center overflow-hidden">
                    {doctor.image ? (
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUserMd size={48} className="text-[#34a5b1]" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-[#34a5b1] mb-2">
                    {doctor.name}
                  </h3>
                  <p className="text-[#34a5b1] text-sm mb-2">{doctor.email}</p>
                  <p className="text-[#34a5b1] text-sm mb-2">
                    {doctor.hospital_name}
                  </p>
                  <p className="text-[#34a5b1] text-sm mb-2">
                    {doctor.phone_number}
                  </p>
                  <p className="text-[#34a5b1] text-sm text-center">
                    {doctor.address}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>



      <motion.button
        className="fixed bottom-8 right-8 bg-[#34a5b1] text-white p-3 rounded-full shadow-lg hover:bg-[#34a5b1] transition duration-300 ease-in-out"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </motion.button>
      <section className="bg-[#34a5b1] py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Schedule Your Visit?
          </h2>
          <p className="mb-8 text-lg">
            Book your appointment today and take the first step towards a
            healthier smile!
          </p>
          <motion.button
            className="bg-white text-[#34a5b1] px-8 py-3 rounded-full font-bold text-sm hover:bg-blue-100 transition duration-300 ease-in-out transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Book Appointment
          </motion.button>
        </div>
      </section>


      {/* Testimonials Section */}
      <section className=" pb-24 pt-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-28 text-[#34a5b1]">
            What Our Patients Say
          </h2>
          <div className="grid grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg relative shadow-md h-40 pt-10"
                whileHover={{ scale: 1.03 }}
              >
                <FaQuoteRight className="text-[#34a5b1] text-3xl absolute top-3 right-3" />
                <p className="mb-4 text-sm leading-relaxed text-gray-600">
                  {testimonial.text}
                </p>
                <p className="font-semibold text-sm text-[#34a5b1]">
                  - {testimonial.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="pt-16 bg-white pb-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-[#34a5b1]">
            Latest News
          </h2>
          <div className="grid grid-cols-3 gap-8">
            {news.map((item, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="h-40 bg-blue-100 flex items-center justify-center">
                  <FaNewspaper size={40} className="text-[#34a5b1]" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-500">
                    {item.title}
                  </h3>
                  <p className="text-[#34a5b1] flex items-center text-sm">
                    <FaCalendarAlt className="mr-2" size={12} /> {item.date}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Appointments Section */}

      {/* Contact Us Section */}
      {/* <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Contact Us
          </h2>
          <div className="max-w-2xl mx-auto bg-gray-50 rounded-lg shadow-md p-8">
            <form>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              <div className="mt-6">
                <motion.button
                  type="submit"
                  className="w-full bg-[#34a5b1] text-white py-3 rounded-full font-bold text-sm hover:bg-[#34a5b1] transition duration-300 ease-in-out transform hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Send Message
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </section> */}

      {/* Footer */}
     

      {/* Scroll to Top Button */}
   
      <Footer />
    </div>
    </div>
  );
};

export default Home;