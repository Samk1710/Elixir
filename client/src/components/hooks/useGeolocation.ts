"use client"
import { useState, useEffect } from 'react';

interface GeolocationState {
  location: {
    latitude: number | null;
    longitude: number | null;
  };
  isLoading: boolean;
  isError: boolean;
  error?: string;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    location: {
      latitude: null,
      longitude: null
    },
    isLoading: true,
    isError: false,
    error: undefined
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isError: true,
        error: 'Geolocation is not supported by your browser'
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          isLoading: false,
          isError: false
        });
      },
      (error) => {
        setState({
          location: {
            latitude: null,
            longitude: null
          },
          isLoading: false,
          isError: true,
          error: error.message
        });
      }
    );
  }, []);

  return state;
};