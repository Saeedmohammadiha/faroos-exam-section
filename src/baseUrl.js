import axios from "axios";

axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.headers.common["Authorization"] = `Bearer ${window.localStorage.getItem('token')}`;
axios.defaults.headers.common["Accept"] = "application/json";



export const baseUrl = axios.create({
  baseURL: "https://app.farostaha.net/"
});
