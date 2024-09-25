import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Calendar, Book, Clipboard, Star, Clock, Smile, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import axios from 'axios';
import io from 'socket.io-client';
import Footer from "./components/Footer";
import Header from "./components/Header";
import Appointmentforusertestfile from '../src/pages/Appointmentforusertestfile'

const CombinedDentalAppointment = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Book Appointment');
  const [currentUser, setCurrentUser] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef();
  const chatBoxRef = useRef(null);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      fetchCurrentUser(userId);
    }

    const fetchDoctorDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4025/api/doctors/${id}`);
        setDoctor(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch doctor details');
        setLoading(false);
      }
    };

    fetchDoctorDetails();

    // Initialize Socket.IO connection
    socketRef.current = io('http://localhost:4025');

    // Clean up on component unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, [id]);

  useEffect(() => {
    if (currentUser && doctor) {
      // Join the room
      socketRef.current.emit('joinRoom', { userId: currentUser.id, doctorId: doctor.user_id });

      // Fetch previous messages
      fetchMessages();

      // Listen for incoming messages
      socketRef.current.on('message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }
  }, [currentUser, doctor]);

  useEffect(() => {
    // Scroll to bottom of chat box when new messages arrive
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchCurrentUser = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:4025/api/users/${userId}`);
      setCurrentUser(response.data);
    } catch (err) {
      console.error('Failed to fetch current user:', err);
    }
  };

  const fetchMessages = async () => {
    if (currentUser && doctor) {
      try {
        const response = await axios.get(`http://localhost:4025/api/chat/${currentUser.id}/${doctor.user_id}`);
        setMessages(response.data);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      }
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && currentUser && doctor) {
      const messageData = {
        sender_id: currentUser.id,
        receiver_id: doctor.user_id,
        message: newMessage,
      };
      socketRef.current.emit('sendMessage', messageData);
      setNewMessage('');
    }
  };

  const tabs = [
    { name: 'Book Appointment', icon: Book },
    { name: 'Services', icon: Clipboard },
    { name: 'Reviews', icon: Star },
  ];

  const services = [
    { name: 'Dental Checkup', price: '$50', icon: '🦷' },
    { name: 'Teeth Cleaning', price: '$80', icon: '🧼' },
    { name: 'Tooth Filling', price: '$100', icon: '🔧' },
    { name: 'Root Canal', price: '$300', icon: '🦠' },
    { name: 'Tooth Extraction', price: '$150', icon: '🔨' },
    { name: 'Dental Crown', price: '$800', icon: '👑' },
  ];

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto shadow-lg overflow-hidden font-sans bg-gray-50">
        <div className="bg-[#34a5b1] p-6 text-white">
          <Link to="/ourdoctors" className="text-white flex items-center mb-4 hover:text-blue-200 transition-colors">
            <ChevronLeft className="mr-2" />
            Back to Doctors List
          </Link>
          <h1 className="text-4xl font-bold">Doctor Appointment</h1>
          <p className="mt-2 text-lg">Schedule your next visit with ease</p>
        </div>
        
        <div className="flex p-4 bg-white border-b">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors mr-2 text-lg font-semibold ${
                activeTab === tab.name ? 'bg-blue-50 text-[#34a5b1]' : 'hover:bg-gray-100 text-gray-600'
              }`}
              onClick={() => setActiveTab(tab.name)}
            >
              <tab.icon className="mr-2" size={20} />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Doctor Profile Section */}
          <div className="flex flex-col md:flex-row justify-between mb-8 bg-white p-6 rounded-lg shadow-md">
            <div className="w-full md:w-2/3 pr-0 md:pr-8 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{doctor.name}</h2>
              <p className="text-xl text-[#34a5b1] mb-4">{doctor.hospital_name}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center">
                  <Mail className="text-[#34a5b1] mr-3" size={20} />
                  <p className="text-gray-600">{doctor.email}</p>
                </div>
                <div className="flex items-center">
                  <Phone className="text-[#34a5b1] mr-3" size={20} />
                  <p className="text-gray-600">{doctor.phone_number}</p>
                </div>
                <div className="flex items-center">
                  <MapPin className="text-[#34a5b1] mr-3" size={20} />
                  <p className="text-gray-600">{doctor.address}</p>
                </div>
                <div className="flex items-center">
                  <Clock className="text-[#34a5b1] mr-3" size={20} />
                  <p className="text-gray-600">Mon-Fri, 9AM-5PM</p>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => setShowChat(!showChat)}
                  className="bg-[#34a5b1] hover:bg-blue-50 hover:text-[#34a5b1] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors flex items-center"
                >
                  <MessageCircle className="mr-2" size={20} />
                  {showChat ? 'Hide Chat' : 'Chat with Doctor'}
                </button>
              </div>
            </div>
            <div className="w-full md:w-1/3 flex justify-center items-start">
              <img src={doctor.image || '/api/placeholder/200/200'} alt={doctor.name} className="w-48 h-48 object-cover rounded-full shadow-lg" />
            </div>
          </div>

          {showChat && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="font-semibold text-2xl flex items-center text-[#34a5b1] mb-4">
                <MessageCircle className="mr-2 text-[#34a5b1]" size={24} />
                Chat with {doctor.name}
              </h2>
              <div ref={chatBoxRef} className="h-64 overflow-y-auto mb-4 p-4 border rounded">
                {messages.map((msg, index) => (
                  <div key={index} className={`mb-2 ${msg.sender_id === currentUser.id ? 'text-right' : 'text-left'}`}>
                    <span className={`inline-block p-2 rounded ${msg.sender_id === currentUser.id ? 'bg-blue-50' : 'bg-gray-100'}`}>
                      {msg.message}
                    </span>
                  </div>
                ))}
              </div>
              <form onSubmit={sendMessage} className="flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-grow mr-2 p-2 border rounded"
                  placeholder="Type your message..."
                />
                <button
                  type="submit"
                  className="bg-[#34a5b1] hover:bg-blue-50 hover:text-[#34a5b1] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                >
                  Send
                </button>
              </form>
            </div>
          )}

          {activeTab === 'Book Appointment' && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="font-semibold text-2xl flex items-center text-[#34a5b1] mb-4">
                <Smile className="mr-2 text-[#34a5b1]" size={24} />
                Book an Appointment with {doctor.name}
              </h2>
              <Appointmentforusertestfile doctorId={doctor.id} />
            </div>
          )}

          {activeTab === 'Services' && (
            <div className="mt-8">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Our Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-center mb-3">
                      <span className="text-3xl mr-3">{service.icon}</span>
                      <h4 className="font-semibold text-lg text-gray-800">{service.name}</h4>
                    </div>
                    <p className="text-blue-600 font-bold">{service.price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Reviews' && <ReviewsSection doctorId={id} currentUserId={currentUser?.id} />}
        </div>
      </div>
      <Footer/>
    </>
  );
};

const ReviewsSection = ({ doctorId, currentUserId }) => {
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 0, review: '' });
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchReviews();
    if (currentUserId) {
      fetchUserReview();
    }
  }, [doctorId, currentUserId]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:4025/api/doctors/${doctorId}/reviews`);
      setReviews(response.data);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    }
  };

  const fetchUserReview = async () => {
    try {
      const response = await axios.get(`http://localhost:4025/api/doctors/${doctorId}/reviews/user/${currentUserId}`);
      setUserReview(response.data);
      setNewReview({ rating: response.data.rating, review: response.data.review });
    } catch (err) {
      if (err.response && err.response.status !== 404) {
        console.error('Failed to fetch user review:', err);
      }
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    if (newReview.rating === 0) {
      setSubmitError("Please select a rating before submitting.");
      setIsSubmitting(false);
      return;
    }

    if (newReview.review.trim() === '') {
      setSubmitError("Please enter a review before submitting.");
      setIsSubmitting(false);
      return;
    }

    try {
      let response;
      if (userReview) {
        response = await axios.put(`http://localhost:4025/api/doctors/${doctorId}/reviews/${userReview.id}`, {
          rating: newReview.rating,
          review: newReview.review,
          user_id: currentUserId
        });
      } else {
        response = await axios.post(`http://localhost:4025/api/doctors/${doctorId}/reviews`, {
          user_id: currentUserId,
          doctor_id: doctorId,
          rating: newReview.rating,
          review: newReview.review
        });
      }
      
      setUserReview(response.data);
      await fetchReviews();
      setIsEditing(false);
      setSubmitError(null);
    } catch (err) {
      console.error('Failed to submit review:', err);
      setSubmitError(err.response?.data?.error || "An error occurred while submitting the review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarRating = (rating, setRating = null) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={24}
            className={`cursor-pointer ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            } ${setRating ? 'hover:text-yellow-400' : ''}`}
            onClick={() => setRating && setRating(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold mb-4">Patient Reviews</h3>
      {currentUserId ? (
        userReview && !isEditing ? (
          <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold mb-2">Your Review</h4>
            {renderStarRating(userReview.rating)}
            <p className="mt-2">{userReview.review}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 bg-[#34a5b1] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
            >
              Edit Review
            </button>
          </div>
        ) : (
          <form onSubmit={handleReviewSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rating">
                Your Rating
              </label>
              {renderStarRating(newReview.rating, (rating) => setNewReview({ ...newReview, rating }))}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="review">
                Your Review
              </label>
              <textarea
                id="review"
                value={newReview.review}
                onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="4"
              ></textarea>
            </div>
            {submitError && <p className="text-red-500 mb-4">{submitError}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-[#34a5b1] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Submitting...' : (userReview ? 'Update Review' : 'Submit Review')}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setNewReview({ rating: userReview.rating, review: userReview.review });
                }}
                className="ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
              >
                Cancel
              </button>
            )}
          </form>
        )
      ) : (
        <p className="mb-4 text-gray-600">Please log in to leave a review.</p>
      )}
      <h4 className="text-xl font-semibold mb-2">All Reviews</h4>
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-4 mb-4">
          <div className="flex items-center mb-2">
            {renderStarRating(review.rating)}
          </div>
          <p className="text-gray-700 mb-2">{review.review}</p>
          <p className="text-sm text-gray-500">By {review.user_name || 'Anonymous'} on {new Date(review.created_at).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default CombinedDentalAppointment;