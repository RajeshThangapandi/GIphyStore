import { useState, useCallback, useEffect, useRef } from 'react';
import { fetchTrendingGifs, searchGifs } from '../services/api';
import { ITEMS_PER_PAGE } from '../utils/constants';
import debounce from 'lodash.debounce';

export const useGifSearch = () => {
  const [gifs, setGifs] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);

  const fetchGifs = useCallback(async (searchTerm: string, loadMore = false) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = searchTerm.trim() === ''
        ? await fetchTrendingGifs(ITEMS_PER_PAGE, loadMore ? offset : 0)
        : await searchGifs(searchTerm, ITEMS_PER_PAGE, loadMore ? offset : 0);
      
      setGifs(prevGifs => loadMore ? [...prevGifs, ...response.data.data] : response.data.data);
      setOffset(prevOffset => loadMore ? prevOffset + ITEMS_PER_PAGE : ITEMS_PER_PAGE);
    } catch (err) {
      const errorMessage = err?.response?.status === 429
        ? 'Too many requests. Please try again in a moment.'
        : 'Failed to fetch GIFs. Please try again.';
      setError(errorMessage);
      
      // Keep old gifs if it was a loadMore request
      if (!loadMore) {
        setGifs([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [offset, isLoading]);

  const debouncedFetchGifs = useRef(
    debounce((searchTerm: string) => fetchGifs(searchTerm), 500) // Increased debounce time
  ).current;

  useEffect(() => {
    fetchGifs('');
    return () => {
      debouncedFetchGifs.cancel();
    };
  }, []);

  const handleSearchInput = useCallback((text: string) => {
    setSearch(text);
    debouncedFetchGifs(text);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (!isLoading && !error) {
      fetchGifs(search, true);
    }
  }, [search, fetchGifs, isLoading, error]);

  return { gifs, search, isLoading, error, handleSearchInput, handleLoadMore };
};

