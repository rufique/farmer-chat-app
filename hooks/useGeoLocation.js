import React, { useEffect, useState, useCallback } from "react";
import * as Location from "expo-location";
import { useDebounce } from "./useDebounce";

const useGeoLocation = (config) => {
  let [location, updateLocation] = useState({});
  const [ locationEvent, updateLocationEvent ] = useState({})
  let [errorMsg, setErrorMsg] = useState();
  let [loadingMap, setloading] = useState(true);
  
  const debouncedLocation = useDebounce(locationEvent, 500);

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if(debouncedLocation) {
        updateLocation(debouncedLocation);
    }
  }, [debouncedLocation])

  const getLocation = useCallback(async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      setloading(false);
      return;
    }
    setErrorMsg(null);
    try {
      let location = await Location.getCurrentPositionAsync({});
      updateLocation(location);
      setloading(false);
    } catch (error) {
      setErrorMsg("Error loading location");
      setloading(false);
    }
  }, []);

  const setLocation = useCallback(async (location) => {
    let { latitude, longitude } = location;
    updateLocationEvent((currentLocation) => ({
      ...currentLocation,
      coords: {
        latitude: latitude.toFixed(8),
        longitude: longitude.toFixed(8),
      },
    }));
  }, []);

  return { loadingMap, location, errorMsg, setLocation, getLocation };
};

export default useGeoLocation;
