import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  doctors: [],
  loading: false,
  error: null,
};

export const fetchDoctors = createAsyncThunk(
  "doctors/fetchDoctors",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:4025/api/admain/doctors"
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editDoctor = createAsyncThunk(
  "doctors/editDoctor",
  async ({ id, name, email }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:4025/api/admain/doctors/${id}`,
        { name, email }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteDoctor = createAsyncThunk(
  "doctors/deleteDoctor",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:4025/api/admain/doctors/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const doctorsSlice = createSlice({
  name: "doctors",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(editDoctor.fulfilled, (state, action) => {
        const index = state.doctors.findIndex(
          (doctor) => doctor.id === action.payload.id
        );
        if (index !== -1) {
          state.doctors[index] = action.payload;
        }
      })
      .addCase(deleteDoctor.fulfilled, (state, action) => {
        state.doctors = state.doctors.filter(
          (doctor) => doctor.id !== action.payload
        );
      });
  },
});

export default doctorsSlice.reducer;
