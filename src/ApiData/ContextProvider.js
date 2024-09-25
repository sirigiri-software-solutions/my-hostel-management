import React, { createContext, useState, useContext, useRef, useEffect } from 'react';
 
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

  const [userUid, setUserUid] = useState(localStorage.getItem('userUid'));
  const [ boysExTenantsData, setBoysExTenantsData] = useState([])
  const [girlsExTenantsData, setGirlsExTenantsData] = useState([]);
 
  // new code to implement multiple configuration

  const [activeFlag, setActiveFlag] = useState("");
 
  const [expensesInteracted,setExpensesInteracted] = useState(false);
 
  
 
 
  // trying to fetch entire data from context
 
 
  const [defaultArea, setDefaultArea] = useState(localStorage.getItem('userarea'))
  const [entireHMAdata, setEntireHMAdata] = useState([]);
  const [firebase, setFirebase] = useState(firebaseInstances[defaultArea]);
  
  const areaToApiEndPointEntireData = {
    ameerpet:`https://ameerpet-c73e9-default-rtdb.firebaseio.com/Hostel/${userUid}.json`,
    srnagar:`https://sr-nagar-4426a-default-rtdb.firebaseio.com/Hostel/${userUid}.json`,
    secunderabad: `https://sr-nagar-default-rtdb.firebaseio.com/Hostel/${userUid}.json`,
    default:`https://defaulthostel-default-rtdb.firebaseio.com/Hostel/${userUid}.json`,
    kukatpally:`https://kukatpally-76219-default-rtdb.firebaseio.com/Hostel/${userUid}.json`,
    gachibouli:`https://gachibouli-fc19f-default-rtdb.firebaseio.com/Hostel/${userUid}.json`,
    ashoknagar:`https://ashoknagar-385c1-default-rtdb.firebaseio.com/Hostel/${userUid}.json`,
    dhilshuknagar:`https://dhilshuknagar-85672-default-rtdb.firebaseio.com/Hostel/${userUid}.json`,
    himayathnagar:`https://himayathnagar-43760-default-rtdb.firebaseio.com/Hostel/${userUid}.json`,
    madhuranagar:`https://madhuranagar-4da77-default-rtdb.firebaseio.com/Hostel/${userUid}.json`,
    madhapur:`https://madharpur-221df-default-rtdb.firebaseio.com/Hostel/${userUid}.json`,
    lbnagar:`https://lbnagar-86ba7-default-rtdb.firebaseio.com/Hostel/${userUid}.json`,
    nanakramguda:`https://nanakramguda-ebe50-default-rtdb.firebaseio.com/Hostel/${userUid}.json`,
  }
 
  const fetchData = async () => {
    const api = areaToApiEndPointEntireData[defaultArea];
 
    const options = {
      method: "GET",
    };
 
    try {
      const response = await fetch(api, options);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
 
      // Handle the data (e.g., set it to state)
      setEntireHMAdata(data);
    } catch (error) {
      console.error("Error fetching data:", error.message); // Improved error logging
    }
  };
 
 
 
 
  const [boysRooms, setBoysRooms] = useState()
  const [girlsRooms, setGirlsRooms] = useState()
  const [boysTenants, setBoysTenants] = useState([]);  
  const [girlsTenants, setGirlsTenants] = useState([]);
  const [boysTenantsWithRents, setBoysTenantsWithRents] = useState([]);
  const [girlsTenantsWithRents, setGirlsTenantsWithRents] = useState([]);
 
 
 // Extract and assign data from entireHMAdata
 
 useEffect(() => {
  if (entireHMAdata ) {
 
    const boysRoomsData = entireHMAdata?.boys?.[activeBoysHostel]?.rooms || {};
    const loadedBoysRooms = [];
    for (const key in boysRoomsData) {
      loadedBoysRooms.push({
        id: key,
        ...boysRoomsData[key],
      });
    }
    setBoysRooms(loadedBoysRooms);  
 
    const girlsRoomsData = entireHMAdata?.girls?.[activeGirlsHostel]?.rooms || {};
    const loadedGirlsRooms = [];
    for (const key in girlsRoomsData) {
      loadedGirlsRooms.push({
        id: key,
        ...girlsRoomsData[key],
      });
    }
    setGirlsRooms(loadedGirlsRooms);  
 
 
      // Extract boys tenants
      const boysTenantsData = entireHMAdata?.boys?.[activeBoysHostel]?.tenants || {};
      const loadedBoysTenants = [];
      for (const key in boysTenantsData) {
        loadedBoysTenants.push({
          id: key,
          ...boysTenantsData[key],
        });
      }
      setBoysTenants(loadedBoysTenants);  // Update the boysTenants state
 
      if (!boysTenantsData) return;
 
      // Process tenants to include rent data
      const processedBoysTenants = Object.keys(boysTenantsData).map(tenantId => {
        const tenant = boysTenantsData[tenantId];
        const rents = tenant.rents ? Object.keys(tenant.rents).map(rentId => ({
          id: rentId,
          ...tenant.rents[rentId],
        })) : [];
        return {
          id: tenantId,
          ...tenant,
          rents,
        };
      });
      setBoysTenantsWithRents(processedBoysTenants)
 
 
      // Extract girls tenants
      const girlsTenantsData = entireHMAdata?.girls?.[activeGirlsHostel]?.tenants || {};
      const loadedGirlsTenants = [];
      for (const key in girlsTenantsData) {
        loadedGirlsTenants.push({
          id: key,
          ...girlsTenantsData[key],
        });
      }
      setGirlsTenants(loadedGirlsTenants);  // Update the girlsTenants state
 
      if (!girlsTenantsData) return;
 
      // Process tenants to include rent data
      const processedGirlsTenants = Object.keys(girlsTenantsData).map(tenantId => {
        const tenant = girlsTenantsData[tenantId];
        const rents = tenant.rents ? Object.keys(tenant.rents).map(rentId => ({
          id: rentId,
          ...tenant.rents[rentId],
        })) : [];
        return {
          id: tenantId,
          ...tenant,
          rents,
        };
      });
      setGirlsTenantsWithRents(processedGirlsTenants)
 
 
      // Extracting Boys Hostel buttons
 
      const boysHostelButtons = entireHMAdata?.boys;
      if(boysHostelButtons && boysHostelButtons != undefined && boysHostelButtons != null){
        const dataBoysHostelButtons = Object.keys(boysHostelButtons).map(key => ({
          id:key,
          name:boysHostelButtons[key].name
        }))

        setActiveBoysHostelButtons(dataBoysHostelButtons)
        
      }else{
        setActiveBoysHostelButtons([])
      }
      
 
      // Extracting Girls Hostel buttons
 
      const girlsHostelButtons = entireHMAdata?.girls;

      if(girlsHostelButtons && girlsHostelButtons != undefined && girlsHostelButtons != null){
        const dataGirlsHostelButtons = Object.keys(girlsHostelButtons).map(key => ({
          id:key,
          name:girlsHostelButtons[key].name
        }))
        setActiveGirlsHostelButtons(dataGirlsHostelButtons);
      }else{
        setActiveGirlsHostelButtons([])
      }
 
 
      // extract ex-tenants boys data
      const exTenantsBoysData = entireHMAdata?.boys?.[activeBoysHostel]?.extenants || {};
      const exTenantsBoysFormattedData = Object.entries(exTenantsBoysData).map(([key,value]) => ({
        id:key,
        ...value,
      }))
      setBoysExTenantsData(exTenantsBoysFormattedData)
 
      // extract ex-tenants girls data
      const exTenantsGirlsData = entireHMAdata?.girls?.[activeGirlsHostel]?.extenants || {};
      const exTenantsGirlsFormattedData = Object.entries(exTenantsGirlsData).map(([key,value]) => ({
        id:key,
        ...value,
      }))
      setGirlsExTenantsData(exTenantsGirlsFormattedData)
   
  }
}, [entireHMAdata, activeBoysHostel, activeGirlsHostel, defaultArea]);
 
 
  // end to get entireData
 
  

 
 
 
 
  const areaToApiEndpoint = {
    // hyderabad: "https://ameerpet-588ee-default-rtdb.firebaseio.com/register.json",
    ameerpet:"https://ameerpet-c73e9-default-rtdb.firebaseio.com/register.json",
    srnagar:"https://sr-nagar-4426a-default-rtdb.firebaseio.com/register.json",
    // secunderabad: "https://sr-nagar-default-rtdb.firebaseio.com/register.json",
    default:"https://defaulthostel-default-rtdb.firebaseio.com/register.json",
    kukatpally:"https://kukatpally-76219-default-rtdb.firebaseio.com/register.json",
    gachibouli:"https://gachibouli-fc19f-default-rtdb.firebaseio.com/register.json",
    ashoknagar:"https://ashoknagar-385c1-default-rtdb.firebaseio.com/register.json",
    dhilshuknagar:"https://dhilshuknagar-85672-default-rtdb.firebaseio.com/register.json",
    himayathnagar:"https://himayathnagar-43760-default-rtdb.firebaseio.com/register.json",
    madhuranagar:"https://madhuranagar-4da77-default-rtdb.firebaseio.com/register.json",
    madhapur:"https://madharpur-221df-default-rtdb.firebaseio.com/register.json",
    lbnagar:"https://lbnagar-86ba7-default-rtdb.firebaseio.com/register.json",
    nanakramguda:"https://nanakramguda-ebe50-default-rtdb.firebaseio.com/register.json"
  };
 
 
 
  useEffect(() => {
    const userId = localStorage.getItem('userUid')
    setUserUid(userId);
  }, [userUid])
 
 
 
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
    if (activeBoysHostelButtons.length > 0 || activeGirlsHostelButtons.length === 0) {
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
 
 
 
  const changeActiveFlag = (newFlag) => {
    setActiveFlag(newFlag);
  };
 
 
  const [completeData, setCompleteData] = useState(false);

  useEffect(() => {
    fetchData();
}, [userUid, completeData, defaultArea]);

  return (
    <DataContext.Provider
     value={{
      activeBoysHostel,
      setActiveBoysHostel,
      setActiveBoysHostelName,
      activeBoysHostelName,
      activeGirlsHostelName,
      setActiveGirlsHostelName,
      activeBoysHostelButtons,
      activeGirlsHostel,
      setActiveGirlsHostel,
      activeGirlsHostelButtons,
      areaToApiEndpoint,
      userUid,
      firebase,
    
      setUserUid,
      activeFlag,  
      changeActiveFlag,
      girlsExTenantsData,
      boysExTenantsData,
      expensesInteracted,
      setExpensesInteracted,
      fetchData,
      boysRooms,
      girlsRooms,
      boysTenants,
      girlsTenants,
      boysTenantsWithRents,
      girlsTenantsWithRents,
      entireHMAdata,
      setCompleteData,
      setDefaultArea,
      setEntireHMAdata,
      }}>
      {children}
    </DataContext.Provider>
  );
};
 
const useData = () => useContext(DataContext);
export { DataContext, useData, DataProvider };