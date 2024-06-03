import React, { createContext, useState, useContext, useRef, useEffect } from 'react';
import { FetchData } from './FetchData';
import { onValue, ref } from 'firebase/database';
import { database } from '../firebase';
import isEqual from 'lodash/isEqual';

const DataContext = createContext();

function useDeepCompareEffect(callback, dependencies) {
  const currentDependenciesRef = useRef();
  if (!isEqual(currentDependenciesRef.current, dependencies)) {
    currentDependenciesRef.current = dependencies;
  }
  React.useEffect(callback, [currentDependenciesRef.current]);
}

const DataProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [activeBoysHostel, setActiveBoysHostel] = useState(null);
  const [activeBoysHostelButtons, setActiveBoysHostelButtons] = useState([]);
  const [activeGirlsHostel, setActiveGirlsHostel] = useState(null);
  const [activeGirlsHostelButtons, setActiveGirlsHostelButtons] = useState([]);

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        const fetchedData = await FetchData();
        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchApiData();
  }, []);

  useEffect(() => {
    const boysRef = ref(database, 'Hostel/boys');
    const unsubscribe = onValue(boysRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const keys = Object.keys(data);
        setActiveBoysHostelButtons(keys);
      } else {
        setActiveBoysHostelButtons([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const girlsRef = ref(database, 'Hostel/girls');
    const unsubscribe = onValue(girlsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const keys = Object.keys(data);
        setActiveGirlsHostelButtons(keys);
      } else {
        setActiveGirlsHostelButtons([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useDeepCompareEffect(() => {
    if (activeBoysHostelButtons.length > 0) {
      setActiveBoysHostel(activeBoysHostelButtons[0]);
    }
  }, [activeBoysHostelButtons]);

  useDeepCompareEffect(() => {
    if (activeGirlsHostelButtons.length > 0) {
      setActiveGirlsHostel(activeGirlsHostelButtons[0]);
    }
  }, [activeGirlsHostelButtons]);

  console.log("active boys hostel", activeBoysHostel);
  console.log("active buttons", activeBoysHostelButtons);

  return (
    <DataContext.Provider value={{ data, activeBoysHostel, setActiveBoysHostel, activeBoysHostelButtons, activeGirlsHostel, setActiveGirlsHostel, activeGirlsHostelButtons }}>
      {children}
    </DataContext.Provider>
  );
};

const useData = () => useContext(DataContext);
export { DataContext, useData, DataProvider };


