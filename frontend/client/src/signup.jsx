import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../src/redux/slices/authslice';
import { useNavigate, Link } from 'react-router-dom';

const ToothIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse">
    <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z"/>
    <path d="M12 2v5"/>
    <path d="M8 8h8"/>
    <path d="M8 13h8"/>
  </svg>
);

const LockIcon = ({ isUnlocked }) => (
  <svg className={`h-5 w-5 text-[#2c8d98] group-hover:text-[#34a5b1] transition ease-in-out duration-300 ${isUnlocked ? 'transform -rotate-12' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isUnlocked ? "M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" : "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"} />
  </svg>
);

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isFormFilled, setIsFormFilled] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    setIsFormFilled(formData.name !== '' && formData.email !== '' && formData.password !== '');
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(signup({ ...formData, role: 'Patient' }));
    if (!result.error) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-[#e6f7f9] py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg relative overflow-hidden transform hover:scale-105 transition-all duration-300 ease-in-out">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#34a5b1] rounded-full opacity-10 animate-blob"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#34a5b1] rounded-full opacity-10 animate-blob animation-delay-2000"></div>
        <div className="relative">
          <div className="flex flex-col items-center">
            <div className="text-[#34a5b1] transform hover:scale-110 transition-transform duration-300 ease-in-out">
              <ToothIcon />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 animate-fadeIn">Create Your Account</h2>
            <p className="mt-2 text-center text-sm text-gray-600 animate-fadeIn animation-delay-300">Join our dental care family</p>
          </div>
          {error && <p className="mt-2 text-center text-sm text-red-600 animate-shake">{error}</p>}
          <form className="mt-8 space-y-6 animate-slideUp" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="name" className="sr-only">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#34a5b1] focus:border-[#34a5b1] focus:z-10 sm:text-sm transition-all duration-300 ease-in-out hover:bg-gray-50"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#34a5b1] focus:border-[#34a5b1] focus:z-10 sm:text-sm transition-all duration-300 ease-in-out hover:bg-gray-50"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#34a5b1] focus:border-[#34a5b1] focus:z-10 sm:text-sm transition-all duration-300 ease-in-out hover:bg-gray-50"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#34a5b1] hover:bg-[#2c8d98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#34a5b1] transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
                disabled={loading}
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockIcon isUnlocked={isFormFilled} />
                </span>
                {loading ? 'Signing up...' : 'Sign up'}
              </button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <Link to="/login" className="font-medium text-[#34a5b1] hover:text-[#2c8d98] transition-colors duration-300">
              Already have an account? Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
