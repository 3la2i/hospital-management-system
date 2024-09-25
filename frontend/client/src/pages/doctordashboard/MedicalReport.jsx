import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { User, Hospital, Calendar, Stethoscope, Clipboard, Pill, Phone, MapPin } from 'lucide-react';
import Sidebar from './Sidebar';
import Appointment from "../../assets/Appointment.svg";
import UseSweetAlert from '../../components/useSweetAlert';
import { useNavigate } from 'react-router-dom';


const MedicalReport = () => {
  const location = useLocation();
  const { patientName, doctorId, date, patientId } = location.state || {};
  const { showSuccessAlert, showErrorAlert } = UseSweetAlert();
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString('en-US');
  };

  const [report, setReport] = useState({
    patient_id: patientId || "", 
    doctor_id: doctorId || "", 
    doctor_details: doctorId || "",  
    price: "",
    patientName: patientName || "",
    doctorName: "",
    hospitalName: "",
    visit_date: formatDate(date),
    diagnosis: "",
    treatment_plan: "",
    medications: "",
    follow_up_date: "",
    visit_notes: "",
    phoneNumber: "",
    address: "",
    email: "",
  });


 
  /******************************* */
  

  const handleSuccessClick = (title, message) => {
    showSuccessAlert(title, message);
  };

  const handleErrorClick = (title, message) => {
    showErrorAlert(title, message);
  };
/*************************************** */
  useEffect(() => {
    if (doctorId) {
      fetchDoctorDetails(doctorId);
    }
  }, [doctorId]);

  const fetchDoctorDetails = async (doctorId) => {
    try {
      const response = await axios.get(`http://localhost:4025/api/MedicalReportRoutes/getDoctorDetailsById/${doctorId}`);
      const doctorData = response.data;

      setReport((prevReport) => ({
        ...prevReport,
        doctorName: doctorData.doctor.doctor_name,
        hospitalName: doctorData.doctor.hospital_name,
        phoneNumber: doctorData.doctor.phone_number,
        address: doctorData.doctor.address,
        email: doctorData.doctor.email,
      }));
    } catch (error) {
      console.error("Error fetching doctor details:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReport({ ...report, [name]: value });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token'); // or sessionStorage.getItem('token');
  
    if (!token) {
      handleErrorClick(" error ", "No token found, please log in.");
  
      return;
    }

     // Validate input before converting and submitting
  if (!report.price || isNaN(parseFloat(report.price))) {
    handleErrorClick(" price ", "Please provide a valid price.");
 
    return;
  }

  
  
    // Convert the price to a number and the follow_up_date to a date format that your backend expects
    const formattedRecord = {
      ...report,
      phoneNumber: parseFloat(report.phoneNumber), 
      price: parseFloat(report.price), // Convert price to a number
      follow_up_date: report.follow_up_date ? new Date(report.follow_up_date).toISOString() : null, // Convert follow-up date to ISO string
    };

   
  
    try {
      const response = await axios.post('http://localhost:4025/api/MedicalReportRoutes/createPatientMedicalRecord', formattedRecord, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.status === 201) {
        handleSuccessClick(" successfully ", "Medical record created successfully");
        navigate('/PatientRecordsCards');
      } else {
        handleErrorClick(" error ", "Failed to create medical record");
      }
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };
  

  return (
    <div className="relative bg-cover bg-center bg-no-repeat" style={{ backgroundImage:  `url(${Appointment})` }}>
  <Sidebar />
  <div className="min-h-screen p-8 bg-opacity-80">
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-[#34a5b1] text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold animate-pulse">Medical Report</h1>
        <div className="text-sm">Report No: #12345</div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextItem icon={<User />} label="Patient Name" text={report.patientName} />
          <TextItem icon={<Stethoscope />} label="Doctor Name" text={report.doctorName} />
          <TextItem icon={<Hospital />} label="Hospital Name" text={report.hospitalName} />
          <TextItem icon={<Calendar />} label="Visit Date" text={report.visit_date} type="date" />
          <InputItem icon={<Stethoscope />} label="Diagnosis" name="diagnosis" value={report.diagnosis} onChange={handleChange} />
          <InputItem icon={<Calendar />} label="Follow-up Date" name="follow_up_date" value={report.follow_up_date} onChange={handleChange} type="date" />
        </div>

        <div className="mt-6">
          <InputItem icon={<Clipboard />} label="Treatment Plan" name="treatment_plan" value={report.treatment_plan} onChange={handleChange} />
        </div>

        <div className="mt-4">
          <InputItem icon={<Pill />} label="Medications" name="medications" value={report.medications} onChange={handleChange} />
        </div>

        <div className="mt-4">
          <h3 className="font-semibold text-lg mb-2 flex items-center">
            <Clipboard className="mr-2" /> Visit Notes
          </h3>
          <textarea
            className="w-full p-2 border border-gray-300 rounded"
            rows="4"
            name="visit_notes"
            value={report.visit_notes}
            onChange={handleChange}
          />
        </div>

        <div className="mt-4">
          <InputItem
            icon={<Pill />}
            label="Price"
            name="price"
            value={report.price}
            onChange={handleChange}
            type="number"
          />
        </div>

        <div className="mt-6 border-t pt-4">
          <TextItem icon={<Phone />} label="Phone Number" text={report.phoneNumber} />
          <TextItem icon={<MapPin />} label="Address" text={report.address} />
          <TextItem icon={<User />} label="Email" text={report.email} />
        </div>
      </div>

      <div className="bg-gray-100 p-4 mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Report generated on: {new Date().toLocaleDateString()}
        </div>
        <div className="flex items-center">
          <img src="https://png.pngtree.com/png-clipart/20230806/original/pngtree-tooth-logo-medicine-dental-dark-vector-picture-image_10006218.png" alt="Doctor Signature" className="w-16 h-16 mr-10" />
        </div>
      </div>

      <div className="m-6 flex justify-end ">
        <button
          onClick={handleSubmit}
          className="bg-[#34a5b1] text-white px-4 py-2 rounded shadow transition duration-300 hover:bg-[#28a19d]"
        >
          Submit Report
        </button>
      </div>
    </div>
  </div>
</div>

  );
};

const TextItem = ({ icon, label, text }) => (
  <div className="flex items-center">
    <div className="text-[#34a5b1] mr-2">{icon}</div>
    <div className="flex-1">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="mt-1 block w-full px-3 py-2 rounded-md">
        {text}
      </div>
    </div>
  </div>
);

const InputItem = ({ icon, label, name, value, onChange, type = "text" }) => (
  <div className="flex items-center">
    <div className="text-[#34a5b1] mr-2">{icon}</div>
    <div className="flex-1">
      <div className="text-sm text-gray-600">{label}</div>
      <input
        type={type} // Dynamically set the input type
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  </div>
);

export default MedicalReport;
