import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa'; // Importing search icon
import { useNavigate } from 'react-router-dom';

function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');
  const [hospitals, setHospitals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:4025/api/doctors');
        setDoctors(response.data);
        setHospitals([...new Set(response.data.map((doc) => doc.hospital_name))]);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('An error occurred while fetching doctors');
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const doctorName = doctor.name ? doctor.name.toLowerCase() : '';
    const doctorAddress = doctor.address ? doctor.address.toLowerCase() : '';
    const matchesHospital = selectedHospital ? doctor.hospital_name === selectedHospital : true;

    return (
      matchesHospital &&
      (doctorName.includes(searchTerm.toLowerCase()) || doctorAddress.includes(searchTerm.toLowerCase()))
    );
  });

  const handleDoctorClick = (doctorId) => {
    navigate(`/doctor/${doctorId}`);
  };

  return (
    <div>
      <Header />

      {/* Background Hero Section with Overlay */}
      <div className="relative h-80 bg-[url('https://www.shutterstock.com/image-photo/young-man-dentist-dental-care-260nw-1487158082.jpg')] bg-cover bg-center flex items-center justify-center">
        {/* Overlay for dark background effect */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Search Section in the Hero Image */}
        <div className="relative z-10 text-center text-white">
          {/* Title */}
          <h1 className="text-4xl font-bold mb-5">Find Your Doctor</h1>

          {/* Search Section */}
          <div className="flex justify-center items-center gap-3 mt-5">
            {/* Search Bar */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or address"
                className="p-2 pl-10 border border-gray-300 rounded-lg w-80 text-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Hospital Dropdown */}
            <select
              className="p-2 border border-gray-300 rounded-lg text-black"
              value={selectedHospital}
              onChange={(e) => setSelectedHospital(e.target.value)}
            >
              <option value="">All Hospitals</option>
              {hospitals.map((hospital, index) => (
                <option key={index} value={hospital}>
                  {hospital}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Doctor List */}
      <div className="h-screen flex justify-center items-center mt-5">
        {loading ? (
          <p className="text-center text-gray-600">Loading doctors...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mx-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredDoctors.map((doctor, index) => (
              <motion.div
                key={doctor.id}
                className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                whileHover={{ scale: 1.05, boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)' }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, type: 'spring', stiffness: 100 }}
                onClick={() => handleDoctorClick(doctor.id)}
              >
                <a href="#">
                  <img className="rounded-t-lg" src={doctor.image} alt={doctor.name} />
                </a>
                <div className="p-5">
                  <a href="#">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-[#34a5b1] dark:text-white">
                      {doctor.name}
                    </h5>
                  </a>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    {doctor.hospital_name}
                  </p>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{doctor.address}</p>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    {doctor.phone_number}
                  </p>
                  <a
                    href="#"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-[#34a5b1] rounded-lg hover:bg-bg-blue-50 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Read more
                    <svg
                      className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default DoctorsPage;
