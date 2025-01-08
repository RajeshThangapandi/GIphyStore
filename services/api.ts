import axios from 'axios';
import { GIPHY_API_KEY } from '../utils/constants';

const api = axios.create({
  baseURL: 'https://api.giphy.com/v1/gifs',
});

export const fetchTrendingGifs = (limit: number, offset: number) =>
  api.get('/trending', { params: { api_key: GIPHY_API_KEY, limit, offset } });

export const searchGifs = (query: string, limit: number, offset: number) =>
  api.get('/search', { params: { api_key: GIPHY_API_KEY, q: query, limit, offset } });

