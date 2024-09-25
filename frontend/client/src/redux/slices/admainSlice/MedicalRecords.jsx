import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchMedicalRecords = createAsyncThunk(
  "medicalRecords/fetchMedicalRecords",
  async (patientId) => {
    const response = await axios.get(
      `http://localhost:4025/api/admain/medical-records`
    );
    return response.data;
  }
);

export const updateMedicalRecord = createAsyncThunk(
  "medicalRecords/updateMedicalRecord",
  async ({ id, recordData }) => {
    const response = await axios.put(
      `http://localhost:4025/api/admain/medical-records/${id}`,
      recordData
    );
    return response.data;
  }
);

export const deleteMedicalRecord = createAsyncThunk(
  "medicalRecords/deleteMedicalRecord",
  async (id) => {
    await axios.delete(
      `http://localhost:4025/api/admain/medical-records/${id}`
    );
    return id;
  }
);

const medicalRecordsSlice = createSlice({
  name: "medicalRecords",
  initialState: {
    records: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicalRecords.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMedicalRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(fetchMedicalRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateMedicalRecord.fulfilled, (state, action) => {
        const index = state.records.findIndex(
          (record) => record.id === action.payload.id
        );
        if (index !== -1) {
          state.records[index] = action.payload;
        }
      })
      .addCase(deleteMedicalRecord.fulfilled, (state, action) => {
        state.records = state.records.filter(
          (record) => record.id !== action.payload
        );
      });
  },
});

export default medicalRecordsSlice.reducer;
