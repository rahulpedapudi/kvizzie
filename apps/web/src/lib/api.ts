import axios from "axios"

const BASE_URL = import.meta.env.VITE_BASE_URL

if (!BASE_URL) {
  throw new Error("BASE_URL is not set in .env!")
}

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})
