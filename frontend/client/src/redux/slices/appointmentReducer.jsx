// src/redux/slices/appointmentSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAppointments = createAsyncThunk(
  'appointmentReducer/fetchAppointments',
  async (doctorId) => {
    const response = await axios.get(`http://localhost:4025/api/doctorAppointmentsRoutes/getAppointments/${doctorId}`);
    return response.data.appointments;
  }
);

export const appointmentSlice = createSlice({
  name: 'appointmentReducer',
  initialState: {
    appointments: [],
    totalAppointments: 0, // Initialize totalAppointments
    loading: false,
    error: null,
  },
  reducers: {
    updateAppointmentStatus: (state, action) => {
      const { appointmentId, currentStatus } = action.payload;
      const appointment = state.appointments.find(app => app.id === appointmentId);
      if (appointment) {
        appointment.status = currentStatus === 'true' ? 'false' : 'true';
      }
    },
    setTotalAppointments: (state, action) => {
      state.totalAppointments = action.payload; // Set the total count
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
        state.totalAppointments = action.payload.length; // Calculate total appointments
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { updateAppointmentStatus, setTotalAppointments } = appointmentSlice.actions;
export default appointmentSlice.reducer;
