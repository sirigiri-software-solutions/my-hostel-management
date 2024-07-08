import React, { createContext, useState, useContext, useRef, useEffect } from 'react';
import { FetchData } from './FetchData';
import { onValue, ref } from 'firebase/database';
import isEqual from 'lodash/isEqual';
import { firebaseInstances } from '../firebase/firebase';

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
  const [activeBoysHostelName, setActiveBoysHostelName] = useState(null);
  const [activeBoysHostelButtons, setActiveBoysHostelButtons] = useState([]);
  const [activeGirlsHostel, setActiveGirlsHostel] = useState(null);
  const [activeGirlsHostelName, setActiveGirlsHostelName] = useState(null);
  const [activeGirlsHostelButtons, setActiveGirlsHostelButtons] = useState([]);
  const [userarea, setUserArea] = useState();
  const [userUid, setUserUid] = useState('');

  // new code to implement multiple configuration
  const [area, setArea] = useState(localStorage.getItem('userarea') || 'hyderabad');
  const [firebase, setFirebase] = useState(firebaseInstances[area]);

  const {database}  = firebase;

  useEffect(() => {
    setFirebase(firebaseInstances[area]);
    localStorage.setItem('userarea', area);
  }, [area]);


  const areaToApiEndpoint = {
    hyderabad: "https://ameerpet-588ee-default-rtdb.firebaseio.com/register.json",
    secunderabad: "https://sr-nagar-default-rtdb.firebaseio.com/register.json",
  };

  // useEffect(()=>{
  //   const id = localStorage.getItem("userUid")
  //   console.log(id,"dataNotGetting")
  // },[])

  useEffect(()=>{
    const userId = localStorage.getItem('userUid')
    setUserUid(userId);
  }, [userUid,area])
  console.log("user Id Context", userUid)

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

  // useEffect(() => {
  //   const boysRef = ref(database, `Hostel/${userUid}/boys`);
  //   const unsubscribe = onValue(boysRef, (snapshot) => {
  //     if (snapshot.exists()) {
  //       const data = snapshot.val();
  //       const keys = Object.keys(data);
  //       setActiveBoysHostelButtons(keys);
  //     } else {
  //       setActiveBoysHostelButtons([]);
  //     }
  //   });

  //   return () => unsubscribe();
  // }, [userUid]);

  useEffect(() => {
    const boysRef = ref(database, `Hostel/${userUid}/boys`);
    console.log(userUid,"dataNotGetting")
    const unsubscribe = onValue(boysRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const buttonData = Object.keys(data).map(key => ({
          id: key,  // Unique identifier for the hostel
          name: data[key].name  // Name of the hostel
        }));
        setActiveBoysHostelButtons(buttonData);
      } else {
        setActiveBoysHostelButtons([]);
      }
    });
    return () => unsubscribe();
  }, [userUid,area]);

  //   return () => unsubscribe();
  // }, [userUid]);
  useEffect(() => {
    const boysRef = ref(database, `Hostel/${userUid}/girls`);
    const unsubscribe = onValue(boysRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const buttonData = Object.keys(data).map(key => ({
          id: key,  // Unique identifier for the hostel
          name: data[key].name  // Name of the hostel
        }));
        setActiveGirlsHostelButtons(buttonData);
      } else {
        setActiveGirlsHostelButtons([]);
      }
    });
    return () => unsubscribe();
  }, [userUid, area]);

  console.log(activeBoysHostelButtons,"dataNotGetting")

  useDeepCompareEffect(() => {
    if (activeBoysHostelButtons.length > 0) {
      setActiveBoysHostel(activeBoysHostelButtons[0].id);
      setActiveBoysHostelName(activeBoysHostelButtons[0].name)
    }
  }, [activeBoysHostelButtons]);
console.log(activeBoysHostelName, "ActiveBoysHostelName")
  useDeepCompareEffect(() => {
    if (activeGirlsHostelButtons.length > 0) {
      setActiveGirlsHostel(activeGirlsHostelButtons[0].id);
      setActiveGirlsHostelName(activeGirlsHostelButtons[0].name)
    }
  }, [activeGirlsHostelButtons]);

  console.log("active boys hostel", activeBoysHostel);
  console.log("active buttons", activeBoysHostelButtons);
  console.log("user UID", userUid)
 
  return (
    <DataContext.Provider value={{ data, activeBoysHostel, setActiveBoysHostel, setActiveBoysHostelName, activeBoysHostelName, activeGirlsHostelName, setActiveGirlsHostelName, activeBoysHostelButtons, activeGirlsHostel, setActiveGirlsHostel, activeGirlsHostelButtons, areaToApiEndpoint, setUserArea , userUid, firebase, setArea,setUserUid  }}>
      {children}
    </DataContext.Provider>
  );
};

const useData = () => useContext(DataContext);
export { DataContext, useData, DataProvider };


