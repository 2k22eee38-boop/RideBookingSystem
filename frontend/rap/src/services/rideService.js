import axios from 'axios';

const API = "http://localhost:8080/api/rides";

const bookRide = (data) => {
  return axios.post(API, data);
};

export default {
  bookRide
};