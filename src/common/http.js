const axios = require("axios");

let httpFuc = {};

const axiosInstance = axios.create({
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

httpFuc.get = async (url, config = {}) => {
  try {
    const response = await axiosInstance.get(url, config);
    return response.data;
  } catch (error) {
    log.error("GET request failed:", error);
    throw error;
  }
};

httpFuc.post = async (url, data, config = {}) => {
  try {
    const response = await axiosInstance.post(url, data, config);
    return response.data;
  } catch (error) {
    log.error("POST request failed:", error);
    throw error;
  }
};

httpFuc.put = async (url, data, config = {}) => {
  try {
    const response = await axiosInstance.put(url, data, config);
    return response.data;
  } catch (error) {
    log.error("PUT request failed:", error);
    throw error;
  }
};

httpFuc.delete = async (url, config = {}) => {
  try {
    const response = await axiosInstance.delete(url, config);
    return response.data;
  } catch (error) {
    log.error("DELETE request failed:", error);
    throw error;
  }
};

global.http = httpFuc;
