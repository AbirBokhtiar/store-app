import axios from "axios";

export const api = axios.create({
  baseURL: "https://interview-task-green.vercel.app/task"
});