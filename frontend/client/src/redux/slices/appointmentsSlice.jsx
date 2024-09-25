// appointmentsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';




// Async thunk for fetching appointments
export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async (doctorId) => {
    const response = await axios.get(`http://localhost:4025/api/appointments/${doctorId}`);
    return response.data;
  }
);


const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState: {
    appointmentsData: {
      total_appointments: 0,
      total_patients: 0,
      appointments: []
    },
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.appointmentsData = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default appointmentsSlice.reducer;

