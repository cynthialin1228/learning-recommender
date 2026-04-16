import axios from 'axios'

// VITE_API_URL should be your Railway backend URL, e.g. https://xxx.up.railway.app
// All route calls should use paths like '/api/resumes/upload' — baseURL has no trailing path
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || ''
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
