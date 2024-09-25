import React, { useState, useEffect, useRef } from 'react';
import { Home, Users, Calendar, Star, Menu, Settings, LogOut, List, Folder, MessageSquare } from 'lucide-react';


const Sidebar = ({ setSelectedComponent }) => {

  const [isExpanded, setIsExpanded] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  const menuItems = [

    { name: 'Dashboard', icon: Home, component: 'dashboard' },
    { name: 'Appointments', icon: Calendar, component: 'appointments' }, 
    { name: 'All Appointments', icon: List, component: 'AppointmentsPage'  },
    { name: 'Patient Records', icon: Folder, component: 'PatientRecordsCards'  },
    { name: 'Chat', icon: MessageSquare, component: 'Chat'  },

  ];

  return (
    <nav
      ref={sidebarRef}
      className={`transition-all duration-300 h-screen fixed top-0 left-0 py-4 font-sans ${
        isExpanded ? 'w-64' : 'w-20'
      } bg-[#34a5b1] text-white`}
    >
      <button 
        onClick={toggleSidebar} 
        className="absolute top-4 right-4 text-white hover:text-indigo-200 transition-colors"
      >
        <Menu size={24} />
      </button>

      <div className="px-4 py-2 mb-6">
        <h2 className={`text-xl font-bold ${isExpanded ? 'block' : 'hidden'}`}>Dr. Dashboard</h2>
      </div>

      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.name} className="px-4">

            <button
              onClick={() => setSelectedComponent(item.component)}

              className={`flex items-center py-3 px-2 rounded-lg transition-colors ${
                isExpanded ? 'hover:bg-indigo-600' : 'justify-center hover:bg-indigo-600'
              }`}
            >
              <item.icon size={20} className="flex-shrink-0" />
              <span
                className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 ${
                  isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                }`}
              >
                {item.name}
              </span>

            </button>

          </li>
        ))}
      </ul>

      <div className="absolute bottom-4 left-0 right-0 px-4">


        <button

          className={`flex items-center py-3 px-2 rounded-lg transition-colors ${
            isExpanded ? 'hover:bg-indigo-600' : 'justify-center hover:bg-indigo-600'
          }`}
        >
          <LogOut size={20} className="flex-shrink-0" />
          <span
            className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 ${
              isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
            }`}
          >
            Logout
          </span>

        </button>

      </div>
    </nav>
  );
};


export default Sidebar;






// import { useState, useEffect, useRef } from 'react';
// import { Home, Calendar, Menu, LogOut, List, Folder, MessageSquare   } from 'lucide-react';
// import { useNavigate, useLocation } from 'react-router-dom';

// const Sidebar = () => {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const sidebarRef = useRef(null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const toggleSidebar = () => {
//     setIsExpanded(!isExpanded);
//   };

//   const handleClickOutside = (event) => {
//     if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
//       setIsExpanded(false);
//     }
//   };

//   useEffect(() => {
//     if (isExpanded) {
//       document.addEventListener('mousedown', handleClickOutside);
//     } else {
//       document.removeEventListener('mousedown', handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [isExpanded]);

//   const menuItems = [
//     { name: 'Dashboard', icon: Home, path: '/DoctorDashboardMain' },
//     { name: 'Appointments', icon: Calendar, path: '/AppointmentForDoctor' },
//     { name: 'All Appointments', icon: List, path: '/AppointmentsPage' },
//     { name: 'Patient Records', icon: Folder, path: '/PatientRecordsCards' },
//     { name: 'Chat', icon: MessageSquare  , path: '/DoctorChat' },
//   ];

//   return (
//     <nav
//       ref={sidebarRef}
//       className={`transition-all duration-300 h-screen fixed top-0 left-0 py-4 font-sans ${
//         isExpanded ? 'w-64' : 'w-20'
//       } bg-[#34a5b1] text-white`}
//     >
//       <button 
//         onClick={toggleSidebar} 
//         className="absolute top-4 right-4 text-white hover:text-indigo-200 transition-colors"
//       >
//         <Menu size={24} />
//       </button>

//       <div className="px-4 py-2 mb-6">
//         <h2 className={`text-xl font-bold ${isExpanded ? 'block' : 'hidden'}`}>Dr. Dashboard</h2>
//       </div>

//       <ul className="space-y-2">
//         {menuItems.map((item) => (
//           <li key={item.name} className="px-4">
//             <button
//               onClick={() => {
//                 navigate(item.path);
//                 setIsExpanded(false);
//               }}
//               className={`flex items-center py-3 px-2 rounded-lg transition-colors ${
//                 location.pathname === item.path
//                   ? 'bg-gray-400' // Active button color
//                   : isExpanded
//                   ? 'hover:bg-[#91a5b1]'
//                   : 'justify-center hover:bg-[#91a5b1]'
//               }`}
//             >
//               <item.icon size={20} className="flex-shrink-0" />
//               <span
//                 className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 ${
//                   isExpanded ? 'opacity-100 w-32' : 'opacity-0 w-0'
//                 }`}
//               >
//                 {item.name}
//               </span>
//             </button>
//           </li>
//         ))}
//       </ul>

//       <div className="absolute bottom-4 left-0 right-0 px-4">
//         <button
//           className={`flex items-center py-3 px-2 rounded-lg transition-colors ${
//             isExpanded ? 'hover:bg-[#91a5b1]' : 'justify-center hover:bg-[#91a5b1]'
//           }`}
//         >
//           <LogOut size={20} className="flex-shrink-0" />
//           <span
//             className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 ${
//               isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
//             }`}
//           >
//             Logout
//           </span>
//         </button>
//       </div>
//     </nav>
//   );
// };

// export default Sidebar;
