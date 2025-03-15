import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const getPayers = async () => {
  return axios.get(`${API_BASE_URL}/payers`);
};

export const searchPayers = async (query) => {
  return axios.get(`${API_BASE_URL}/payers/search?query=${query}`);
};

export const getPayerDetails = async (id) => {
  return axios.get(`${API_BASE_URL}/payers/${id}`);
};


export const addPayer = async (payerData) => {
  return axios.post(`${API_BASE_URL}/payers`, payerData);
};

export const updatePayer = async (id, updatedData) => {
  return axios.put(`${API_BASE_URL}/payers/${id}`, updatedData);
};

export const deletePayer = async (id) => {
  return axios.delete(`${API_BASE_URL}/payers/${id}`);
};
