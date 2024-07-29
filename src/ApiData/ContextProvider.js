import React, { createContext, useState, useContext, useRef, useEffect } from 'react';

import { onValue } from 'firebase/database';
import isEqual from 'lodash/isEqual';
import { firebaseInstances, ref } from '../firebase/firebase';

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
  const [userUid, setUserUid] = useState(localStorage.getItem('userUid' || ''));

  // new code to implement multiple configuration
  const [area, setArea] = useState(localStorage.getItem('userarea') || 'hyderabad');
  const [firebase, setFirebase] = useState(firebaseInstances[area]);
  const [activeFlag, setActiveFlag] = useState();

  const { database } = firebase;
  // const [activeFlag, setActiveFlag] = useState(
  //   activeBoysHostelButtons.length > 0 && activeGirlsHostelButtons.length > 0 ? 'boys' : activeGirlsHostelButtons.length > 0 ? 'girls': activeBoysHostelButtons.length > 0 ? 'boys':'hhh'
  // )
  // console.log(activeFlag, "flag")
  // console.log(activeBoysHostelButtons.length > 0 , "flag")

  
  useEffect(() => {
    setFirebase(firebaseInstances[area]);

  }, [area]);


  const areaToApiEndpoint = {
    hyderabad: "https://ameerpet-588ee-default-rtdb.firebaseio.com/register.json",
    secunderabad: "https://sr-nagar-default-rtdb.firebaseio.com/register.json",
  };

  useEffect(() => {
    const userId = localStorage.getItem('userUid')
    setUserUid(userId);
  }, [userUid, area])




  useEffect(() => {
    const boysRef = ref(database, `Hostel/${userUid}/boys`);
    const unsubscribe = onValue(boysRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const buttonData = Object.keys(data).map(key => ({
          id: key,
          name: data[key].name
        }));
        setActiveBoysHostelButtons(buttonData);
      } else {
        setActiveBoysHostelButtons([]);
      }
    });
    return () => unsubscribe();
  }, [userUid, area]);

  useEffect(() => {
    const boysRef = ref(database, `Hostel/${userUid}/girls`);
    const unsubscribe = onValue(boysRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const buttonData = Object.keys(data).map(key => ({
          id: key,
          name: data[key].name
        }));
        setActiveGirlsHostelButtons(buttonData);
      } else {
        setActiveGirlsHostelButtons([]);
      }
    });
    return () => unsubscribe();
  }, [userUid, area]);


  useDeepCompareEffect(() => {
    if (activeBoysHostelButtons.length > 0) {
      setActiveBoysHostel(activeBoysHostelButtons[0].id);
      setActiveBoysHostelName(activeBoysHostelButtons[0].name)
    }
  }, [activeBoysHostelButtons]);

  useDeepCompareEffect(() => {
    if (activeGirlsHostelButtons.length > 0) {
      setActiveGirlsHostel(activeGirlsHostelButtons[0].id);
      setActiveGirlsHostelName(activeGirlsHostelButtons[0].name)
    }
  }, [activeGirlsHostelButtons]);


   // Determine the initial active flag
   useEffect(() => {
    let initialActiveFlag = '';
    if (activeBoysHostelButtons.length > 0) {
      initialActiveFlag = 'boys';
    } else if (activeGirlsHostelButtons.length > 0) {
      initialActiveFlag = 'girls';
    }
    setActiveFlag(initialActiveFlag);
  }, [activeBoysHostelButtons, activeGirlsHostelButtons]);


  // Function to update activeFlag
  const changeActiveFlag = (newFlag) => {
    setActiveFlag(newFlag);
  };
  console.log(activeFlag, "flaggg"); // ===> 'boys', 'girls', or 'hhh' based on conditions
  console.log(activeBoysHostelButtons.length > 0, "activeBoysHostelButtons flag"); // ===> true or false



  return (
    <DataContext.Provider value={{ data, activeBoysHostel, setActiveBoysHostel, setActiveBoysHostelName, activeBoysHostelName, activeGirlsHostelName, setActiveGirlsHostelName, activeBoysHostelButtons, activeGirlsHostel, setActiveGirlsHostel, activeGirlsHostelButtons, areaToApiEndpoint, setUserArea, userUid, firebase, setArea, setUserUid, activeFlag,  changeActiveFlag}}>
      {children}
    </DataContext.Provider>
  );
};

const useData = () => useContext(DataContext);
export { DataContext, useData, DataProvider };


