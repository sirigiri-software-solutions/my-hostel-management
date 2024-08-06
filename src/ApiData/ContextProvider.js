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
  const [activeBoysHostel, setActiveBoysHostel] = useState(null);
  const [activeBoysHostelName, setActiveBoysHostelName] = useState(null);
  const [activeBoysHostelButtons, setActiveBoysHostelButtons] = useState([]);
  const [activeGirlsHostel, setActiveGirlsHostel] = useState(null);
  const [activeGirlsHostelName, setActiveGirlsHostelName] = useState(null);
  const [activeGirlsHostelButtons, setActiveGirlsHostelButtons] = useState([]);
  const [userarea, setUserArea] = useState();
  const [userUid, setUserUid] = useState(localStorage.getItem('userUid' || ''));
  const [ boysTenantsData, setBoysTenantsData] = useState([])
  const [girlsTenantsData, setGirlsTenantsData] = useState([]);
  const [ boysExTenantsData, setBoysExTenantsData] = useState([])
  const [girlsExTenantsData, setGirlsExTenantsData] = useState([]);

  // new code to implement multiple configuration
  const [area, setArea] = useState(localStorage.getItem('userarea') || 'default');
  const [firebase, setFirebase] = useState(firebaseInstances[area]);
  const [activeFlag, setActiveFlag] = useState("");

  const { database } = firebase;
  // const [activeFlag, setActiveFlag] = useState(
  //   activeBoysHostelButtons.length > 0 && activeGirlsHostelButtons.length > 0 ? 'boys' : activeGirlsHostelButtons.length > 0 ? 'girls': activeBoysHostelButtons.length > 0 ? 'boys':'hhh'
  // )
  // console.log(activeFlag, "flag")
  // console.log(activeBoysHostelButtons.length > 0 , "flag")

  
  useEffect(() => {
    setFirebase(firebaseInstances[area]);

  }, [area]);

  console.log(firebase, "fire")

  const areaToApiEndpoint = {
    // hyderabad: "https://ameerpet-588ee-default-rtdb.firebaseio.com/register.json",
    ameerpet:"https://ameerpet-c73e9-default-rtdb.firebaseio.com/register.json",
    srnagar:"https://sr-nagar-4426a-default-rtdb.firebaseio.com/register.json",
    secunderabad: "https://sr-nagar-default-rtdb.firebaseio.com/register.json",
    default:"https://defaulthostel-default-rtdb.firebaseio.com/register.json",
    kukatpally:"https://kukatpally-76219-default-rtdb.firebaseio.com/register.json",
    gachibouli:"https://gachibouli-fc19f-default-rtdb.firebaseio.com/register.json",
    ashoknagar:"https://ashoknagar-385c1-default-rtdb.firebaseio.com/register.json",
    dhilshuknagar:"https://dhilshuknagar-85672-default-rtdb.firebaseio.com/register.json",
    himayathnagar:"https://himayathnagar-43760-default-rtdb.firebaseio.com/register.json",
    madhuranagar:"https://madhuranagar-4da77-default-rtdb.firebaseio.com/register.json",
    madhapur:"https://madharpur-221df-default-rtdb.firebaseio.com/register.json",
    lbnagar:"https://lbnagar-86ba7-default-rtdb.firebaseio.com/register.json",
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
    if (activeBoysHostelButtons.length > 0 || activeGirlsHostelButtons.length == 0) {
          initialActiveFlag = 'boys';
        } else if (activeGirlsHostelButtons.length > 0) {
          initialActiveFlag = 'girls';
        }
        setActiveFlag(initialActiveFlag);
      
    if(activeFlag === 'boys' &&  activeBoysHostelButtons.length > 0){
      setActiveFlag('boys')
    }
    if(activeFlag === "girls" && activeGirlsHostelButtons.length > 0){
      setActiveFlag('girls')
    } 
  }

  , [activeBoysHostelButtons, activeGirlsHostelButtons]);


  // Function to update activeFlag
  const changeActiveFlag = (newFlag) => {
    setActiveFlag(newFlag);
  };
  // console.log(activeFlag, "flaggg"); // ===> 'boys', 'girls', or 'hhh' based on conditions
  // console.log(activeBoysHostelButtons.length > 0, "activeBoysHostelButtons flag"); // ===> true or false


  useEffect(() => {
    const tenantsRef = ref(database, `Hostel/${userUid}/boys/${activeBoysHostel}/tenants`);
    onValue(tenantsRef, snapshot => {
      const data = snapshot.val() || {};
      console.log(data, "dtat")
      const loadedTenants = Object.entries(data).map(([key, value]) => ({
        id: key,
        ...value,
      }));
      console.log(loadedTenants, "dta")
      setBoysTenantsData(loadedTenants);
    });
  }, [userUid, activeBoysHostel]);

  useEffect(() => {
    const tenantsRef = ref(database, `Hostel/${userUid}/girls/${activeGirlsHostel}/tenants`);
    onValue(tenantsRef, snapshot => {
      const data = snapshot.val() || {};
      console.log(data, "dtat")
      const loadedTenants = Object.entries(data).map(([key, value]) => ({
        id: key,
        ...value,
      }));
      console.log(loadedTenants, "dta")
      setGirlsTenantsData(loadedTenants);
    });
  }, [userUid, activeGirlsHostel]);

  
  useEffect(() => {
    const tenantsRef = ref(database, `Hostel/${userUid}/boys/${activeBoysHostel}/extenants`);
    onValue(tenantsRef, snapshot => {
      const data = snapshot.val() || {};
      console.log(data, "dtat")
      const loadedTenants = Object.entries(data).map(([key, value]) => ({
        id: key,
        ...value,
      }));
      console.log(loadedTenants, "dta")
      setBoysExTenantsData(loadedTenants);
    });
  }, [userUid, activeBoysHostel]);
  
  useEffect(() => {
    const tenantsRef = ref(database, `Hostel/${userUid}/girls/${activeGirlsHostel}/extenants`);
    onValue(tenantsRef, snapshot => {
      const data = snapshot.val() || {};
      console.log(data, "dtat")
      const loadedTenants = Object.entries(data).map(([key, value]) => ({
        id: key,
        ...value,
      }));
      console.log(loadedTenants, "dta")
      setGirlsExTenantsData(loadedTenants);
    });
  }, [userUid, activeGirlsHostel]);

  console.log(boysExTenantsData, "exx")
  console.log(girlsExTenantsData, "exx")
  return (
    <DataContext.Provider value={{  activeBoysHostel, setActiveBoysHostel, setActiveBoysHostelName, activeBoysHostelName, activeGirlsHostelName, setActiveGirlsHostelName, activeBoysHostelButtons, activeGirlsHostel, setActiveGirlsHostel, activeGirlsHostelButtons, areaToApiEndpoint, setUserArea, userUid, firebase, setArea, setUserUid, activeFlag,  changeActiveFlag, girlsTenantsData, boysTenantsData, girlsExTenantsData, boysExTenantsData}}>
      {children}
    </DataContext.Provider>
  );
};

const useData = () => useContext(DataContext);
export { DataContext, useData, DataProvider };


