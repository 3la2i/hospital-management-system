import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Phone, Calendar, Mail, MapPin } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from "./components/Footer";
import Header from "./components/Header";

const DoctorCard = ({ doctor, onClick }) => (
  <motion.div
    layout
    whileHover={{ scale: 1.05 }}
    transition={{ type: 'spring', stiffness: 300 }}
    className="bg-white rounded-xl shadow-md p-4 cursor-pointer"
    onClick={onClick}
  >
    <div className="flex items-center space-x-4">
      <img src={doctor.image || '/api/placeholder/80/80'} alt={doctor.name} className="w-16 h-16 rounded-full object-cover" />
      <div>
        <h3 className="font-semibold text-lg">{doctor.name}</h3>
        <p className="text-sm text-gray-500">{doctor.hospital_name || 'Hospital not specified'}</p>
        <div className="flex items-center mt-1">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="ml-1 text-sm text-gray-600">
            {doctor.averageRating ? doctor.averageRating.toFixed(1) : 'No ratings'}
          </span>
        </div>
      </div>
    </div>
    <div className="mt-4 space-y-2">
      <div className="flex items-center text-sm text-gray-600">
        <Phone className="w-4 h-4 mr-2 text-blue-500" />
        {doctor.phone_number || 'Phone number not available'}
      </div>
      <div className="flex items-center text-sm text-gray-600">
        <Mail className="w-4 h-4 mr-2 text-blue-500" />
        {doctor.email}
      </div>
      <div className="flex items-center text-sm text-gray-600">
        <MapPin className="w-4 h-4 mr-2 text-blue-500" />
        {doctor.address || 'Address not available'}
      </div>
    </div>
  </motion.div>
);

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorsAndReviews = async () => {
      try {
        const doctorsResponse = await axios.get('http://localhost:4025/api/doctors');
        const doctorsData = doctorsResponse.data;

        // Fetch reviews for each doctor
        const doctorsWithReviews = await Promise.all(
          doctorsData.map(async (doctor) => {
            const reviewsResponse = await axios.get(`http://localhost:4025/api/doctors/${doctor.id}/reviews`);
            const reviews = reviewsResponse.data;
            const averageRating = reviews.length > 0
              ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
              : null;
            return { ...doctor, averageRating };
          })
        );

        setDoctors(doctorsWithReviews);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch doctors and reviews');
        setLoading(false);
      }
    };

    fetchDoctorsAndReviews();
  }, []);

  const tabs = ['All', ...new Set(doctors.map(doctor => doctor.hospital_name).filter(Boolean))];

  const handleDoctorClick = (doctorId) => {
    navigate(`/doctor/${doctorId}`);
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="bg-gray-100 min-h-screen p-8 font-sans">
      <Header />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Our Doctors</h1>
        </div>

        <div className="mb-6 flex space-x-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                activeTab === tab ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors
            .filter((doctor) => activeTab === 'All' || doctor.hospital_name === activeTab)
            .map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onClick={() => handleDoctorClick(doctor.id)}
              />
            ))}
        </motion.div>
      </div>
      <Footer/>
    </div>
  );
};

export default DoctorsList;