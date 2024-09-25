import { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, DollarSign, FileText, Clock, Trash2 } from 'lucide-react'; // Import Trash icon
import Sidebar from './sidebar';
import UseSweetAlert from '../../components/useSweetAlert';

const PatientRecordsCards = () => {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(9); // Set a fixed limit
  const [totalRecords, setTotalRecords] = useState(0); // To keep track of total records
  const [filter, setFilter] = useState('all'); // Filter for is_paid status ('all', 'paid', 'unpaid')
  const [searchTerm, setSearchTerm] = useState(''); // State for the search term
  const { showSuccessAlert, showErrorAlert } = UseSweetAlert();

  const doctorId = localStorage.getItem('user_id'); // Get doctor_id from local storage

    /******************************* */
  

    const handleSuccessClick = (title, message) => {
      showSuccessAlert(title, message);
    };
  
    const handleErrorClick = (title, message) => {
      showErrorAlert(title, message);
    };
  /*************************************** */
  useEffect(() => {
    const fetchPatientRecords = async () => {
      try {
        let url = `http://localhost:4025/api/MedicalReportRoutes/getPatientMedicalRecords/${doctorId}?page=${page}&limit=${limit}`;

        // Append filters for paid status
        if (filter === 'paid') {
          url += '&is_paid=true';
        } else if (filter === 'unpaid') {
          url += '&is_paid=false';
        }

        // Append search term if it exists
        if (searchTerm) {
          url += `&name=${encodeURIComponent(searchTerm)}`;
        }

        console.log('Fetching from URL:', url); // Log the URL

        const response = await axios.get(url);
        setRecords(response.data.data);
        setTotalRecords(response.data.totalRecords);
      } catch (error) {
        console.error('Error fetching patient records:', error);
      }
    };

    fetchPatientRecords();
  }, [doctorId, page, limit, filter, searchTerm]); // Add searchTerm to the dependency array

  // Handle Mark as Paid
  const handleMarkAsPaid = async (record_id) => {
    const confirmAction = window.confirm('Are you sure you want to mark this as paid?');
    if (confirmAction) {
      try {
        const response = await axios.put(
          `http://localhost:4025/api/MedicalReportRoutes/updateRecordStatus/${record_id}`,
          { updatePaidStatus: true } // Include this in the request body
        );
        if (response.data.success) {
              handleSuccessClick(" successfully ", "Payment status updated successfully!");

        
          // Update the state to reflect the change
          setRecords(records.map(record => 
            record.id === record_id ? { ...record, is_paid: true } : record
          ));
        }
      } catch (error) {
        console.error('Error updating payment status:', error);
        handleErrorClick(" error ", "Failed to update payment status.");

      }
    }
  };

  // Handle Soft Delete
  const handleSoftDelete = async (record_id) => {
    const confirmAction = window.confirm('Are you sure you want to soft delete this record?');
    if (confirmAction) {
      try {
        const response = await axios.put(
          `http://localhost:4025/api/MedicalReportRoutes/updateRecordStatus/${record_id}`,
          { softDelete: true } // Include this in the request body
        );
        if (response.data.success) {
          handleSuccessClick(" successfully ", "Record deleted successfully!");
          // Update the state to reflect the deletion
          setRecords(records.filter(record => record.id !== record_id));
        }
      } catch (error) {
        console.error('Error soft deleting the record:', error);
        handleErrorClick(" error ", "Failed delete the record.");
      }
    }
  };

  // Calculate total pages based on total records and limit
  const totalPages = Math.ceil(totalRecords / limit);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <Sidebar/>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center my-20 text-[#34a5b1]">Patient Medical Records</h1>

        {/* Search Input */}
        <div className="mb-6 flex items-center justify-center border border-gray-300 w-60 mx-auto">
            <div className="p-2 bg-gray-200">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth={2} />
                <line x1="16.5" y1="16.5" x2="20" y2="20" stroke="currentColor" strokeWidth={2} />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Update search term
              placeholder="Search by patient name"
              className="border-0 p-2 focus:ring-0"
            />
          </div>




        {/* Filter Dropdown */}
        <div className="flex justify-center mb-8">
          <div className="flex justify-center mb-6">
            <button onClick={() => setFilter('all')} className={`px-4 py-2 ${filter === 'all' ? 'bg-[#34a5b1] text-white' : 'bg-gray-200'}`}>
              All
            </button>
            <button onClick={() => setFilter('paid')} className={`px-4 py-2 ml-4 ${filter === 'paid' ? 'bg-[#34a5b1] text-white' : 'bg-gray-200'}`}>
              Paid
            </button>
            <button onClick={() => setFilter('unpaid')} className={`px-4 py-2 ml-4 ${filter === 'unpaid' ? 'bg-[#34a5b1] text-white' : 'bg-gray-200'}`}>
              Unpaid
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 justify-center items-center mt-20">
        {records.length > 0 ? (
  records.map(record => (
    <div key={record.id} className="bg-white rounded-lg shadow-md overflow-hidden h-[19rem] w-[25.5rem]">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-900">{new Date(record.visit_date).toLocaleDateString()}</span>
          </div>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${record.is_paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {record.is_paid ? 'Paid' : 'Unpaid'}
          </span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{record.patient_name}</h2>
        <p className="text-gray-600 mb-4">{record.diagnosis}</p>
        <p className="text-gray-600 mb-4">{record.treatment_plan}</p>

        <div className="flex items-center mb-2">
          <FileText className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-sm text-gray-500">Medications: {record.medications}</span>
        </div>
        <div className="flex items-center mb-4">
          <Clock className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-sm text-gray-500">Follow-up: {record.follow_up_date || 'N/A'}</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-gray-400 mr-1" />
            <span className="text-lg font-bold text-gray-900 mr-20">{record.price}</span>
          </div>
          <button
            onClick={() => handleSoftDelete(record.id)}
            className=" text-black px-4 py-2 hover:text-red-700 transition duration-300 ease-in-out flex items-center ml-4"
          >
            <Trash2 className="mr-2 h-4 w-4" />
          </button>
          {!record.is_paid && (
            <button
              onClick={() => handleMarkAsPaid(record.id)}
              className="bg-[#34a5b1] text-white px-4 py-2 rounded-md hover:bg-[#81a5b1] transition duration-300 ease-in-out flex items-center"
            >
              <DollarSign className="mr-2 h-4 w-4" />
              Mark as Paid
            </button>
          )}
        </div>
      </div>
    </div>
  ))
) : (
  <div className="text-center text-gray-500 text-lg h-80">
    No records available at the moment.
  </div>
)}

        </div>

        {/* Pagination Controls */}
        <div className="flex justify-around my-10">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-lg font-bold">Page {page} of {totalPages}</span>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientRecordsCards;
