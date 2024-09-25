import React, { useEffect, useState } from 'react';
import { Search, Bell, Calendar, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const WelcomingAppointment = () => {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const date = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    setCurrentDate(date.toLocaleDateString(undefined, options));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const storedUser = sessionStorage.getItem('user');
  const userObject = JSON.parse(storedUser);
  const doctorId = userObject.id;
  const DoctorName = userObject.name;




  return (
    <motion.div 
      className="p-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-lg"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-5xl mx-auto">
        <motion.header className="flex flex-col md:flex-row justify-between items-center mb-8" variants={itemVariants}>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Hello, {DoctorName}!</h1>
            <p className="text-sm text-gray-600">{currentDate}</p>
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            <div className="relative mr-4">
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <motion.button 
              className="p-2 bg-white rounded-full text-gray-600 hover:bg-gray-100 transition duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell size={20} />
            </motion.button>
          </div>
        </motion.header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            className="bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl p-6 text-white flex items-center shadow-lg"
            variants={itemVariants}
          >
            <div>
              <h2 className="text-2xl font-semibold mb-3">Welcome back, Dr. Ashley!</h2>
              <p className="mb-4 text-teal-100">I hope you're having a great day. Here's your schedule at a glance:</p>
              <motion.button 
                className="px-4 py-2 bg-white text-teal-600 rounded-full font-medium hover:bg-teal-100 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Calendar size={16} className="inline mr-2" />
                View Schedule
              </motion.button>
            </div>
            <img src="https://i.pinimg.com/originals/14/0e/93/140e932f29b7d85d56971d2ce1a13732.gif" alt="Doctor illustration" className="ml-auto h-32 rounded-full shadow-md" />
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 text-white shadow-lg"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Activity size={24} className="mr-2" />
              Latest Patient Results
            </h2>
            <div className="space-y-4">
              {[
                { name: 'Glucose', value: '90.6 mg/dL', normal: true },
                { name: 'Urea', value: '20.1 mg/dL', normal: true },
                { name: 'Creatinine', value: '0.7 mg/dL', normal: true }
              ].map((result, index) => (
                <motion.div 
                  key={index}
                  className="flex justify-between items-center bg-blue-500 p-3 rounded-lg"
                  whileHover={{ scale: 1.03 }}
                >
                  <span className="font-medium">{result.name}</span>
                  <span className={`px-2 py-1 rounded ${result.normal ? 'bg-green-400' : 'bg-red-400'}`}>
                    {result.value}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomingAppointment;