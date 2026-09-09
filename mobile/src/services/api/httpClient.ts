import axios from 'axios';

const rawUrl = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000';

export const httpClient = axios.create({
  baseURL: rawUrl.replace(/\/+$/, ''),
});
