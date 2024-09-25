import { useState, useEffect } from "react";
import axios from "axios"; // to make the API call
import ChatWindow from "./ChatWindow";
import UserListChat from "./UserListChat";
import Sidebar from "./Sidebar";
import Appointment from "../../assets/Appointment.svg";

const DoctorChat = () => {
  const [users, setUsers] = useState([]); // state for storing the list of users
  const [selectedUser, setSelectedUser] = useState(null);
  const doctorId = localStorage.getItem("user_id"); // get doctor_id from localStorage

  // Fetch users associated with the doctor
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:4025/api/chat/${doctorId}`);
        console.log(response.data);
        setUsers(response.data); // update the users state with the response data
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (doctorId) {
      fetchUsers(); // call the function if doctorId exists
    }
  }, [doctorId]); // dependency array will call useEffect when doctorId changes

  const handleUserSelect = (user) => {
    setSelectedUser(user); // set the selected user
  };

  return (
    <div >
      <Sidebar />
      <div className="flex justify-center items-center mt-20">
        <div className="flex h-[40rem] bg-gray-100 w-[60rem]">
          {/* User List */}
          <UserListChat users={users} onSelectUser={handleUserSelect} />

          {/* Chat Window */}
          <div className="flex-1">
            {selectedUser ? (
              <ChatWindow user={selectedUser} doctorId={doctorId}/>
            ) : (
              <div className="relative bg-cover bg-center bg-no-repeat h-[40rem]" style={{ backgroundImage: `url(${Appointment})` }}>
              <div className="text-2xl font-bold mb-4 animate-pulse text-white">
                Select a user to start chatting
              </div>
              <div className="flex justify-center items-center">
                <div className="w-32 h-32 rounded-full border-8 border-white shadow-lg animate-bounce flex items-center justify-center bg-[#34a5b1]">
                  <span className="text-white text-4xl">💬</span>
                </div>
              </div>
              <div className="mt-4 text-lg text-center text-white">
                Choose someone from the list on the left to begin your conversation!
              </div>
              <div className="mt-6 flex justify-center">
                <button className="bg-[#34a5b1] text-white px-4 py-2 rounded-full shadow-md transition duration-300 ">
                Choose someone from the list on the left to begin your conversation!
                </button>
              </div>
            </div>
            
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorChat;
