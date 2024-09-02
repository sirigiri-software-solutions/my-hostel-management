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

  const [expensesInteracted,setExpensesInteracted] = useState(false);

  const { database } = firebase;


  // trying to fetch entire data from context
  
  
  const [defaultArea, setDefaultArea] = useState(localStorage.getItem('userarea'))
  const [entireHMAdata, setEntireHMAdata] = useState([]);

  const areaToApiEndPointEntireData = {
    ameerpet:"https://ameerpet-c73e9-default-rtdb.firebaseio.com/Hostel.json",
    srnagar:"https://sr-nagar-4426a-default-rtdb.firebaseio.com/Hostel.json",
    secunderabad: "https://sr-nagar-default-rtdb.firebaseio.com/Hostel.json",
    default:"https://defaulthostel-default-rtdb.firebaseio.com/Hostel.json",
    kukatpally:"https://kukatpally-76219-default-rtdb.firebaseio.com/Hostel.json",
    gachibouli:"https://gachibouli-fc19f-default-rtdb.firebaseio.com/Hostel.json",
    ashoknagar:"https://ashoknagar-385c1-default-rtdb.firebaseio.com/Hostel.json",
    dhilshuknagar:"https://dhilshuknagar-85672-default-rtdb.firebaseio.com/Hostel.json",
    himayathnagar:"https://himayathnagar-43760-default-rtdb.firebaseio.com/Hostel.json",
    madhuranagar:"https://madhuranagar-4da77-default-rtdb.firebaseio.com/Hostel.json",
    madhapur:"https://madharpur-221df-default-rtdb.firebaseio.com/Hostel.json",
    lbnagar:"https://lbnagar-86ba7-default-rtdb.firebaseio.com/Hostel.json",
    nanakramguda:"https://nanakramguda-ebe50-default-rtdb.firebaseio.com/Hostel.json",
  }

  const fetchData = async () => {
    const api = areaToApiEndPointEntireData[defaultArea];
    console.log(api, 'apiii')
    const options = {
      method: "GET",
    };

    try {
      const response = await fetch(api, options);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data, "EntireDataOfHMA");
      // Handle the data (e.g., set it to state)
      setEntireHMAdata(data);
    } catch (error) {
      console.error("Error fetching data:", error.message); // Improved error logging
    }
  };

 

console.log(entireHMAdata, "entireHMAdata")
const [boysRooms, setBoysRooms] = useState()
const [girlsRooms, setGirlsRooms] = useState()
const [boysTenants, setBoysTenants] = useState([]);  // State to hold boys tenants data
  const [girlsTenants, setGirlsTenants] = useState([]);
  const [boysTenantsWithRents, setBoysTenantsWithRents] = useState([]);
  const [girlsTenantsWithRents, setGirlsTenantsWithRents] = useState([]);
 // Extract and assign rooms data from entireHMAdata
 useEffect(() => {
  if (entireHMAdata && userUid) {

    const boysRoomsData = entireHMAdata[userUid]?.boys?.[activeBoysHostel]?.rooms || {};
    const loadedBoysRooms = [];
    for (const key in boysRoomsData) {
      loadedBoysRooms.push({
        id: key,
        ...boysRoomsData[key],
      });
    }
    setBoysRooms(loadedBoysRooms);  

    const girlsRoomsData = entireHMAdata[userUid]?.girls?.[activeGirlsHostel]?.rooms || {};
    const loadedGirlsRooms = [];
    for (const key in girlsRoomsData) {
      loadedGirlsRooms.push({
        id: key,
        ...girlsRoomsData[key],
      });
    }
    setGirlsRooms(loadedGirlsRooms);  


      // Extract boys tenants
      const boysTenantsData = entireHMAdata[userUid]?.boys?.[activeBoysHostel]?.tenants || {};
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
      const girlsTenantsData = entireHMAdata[userUid]?.girls?.[activeGirlsHostel]?.tenants || {};
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

      const boysExpenses = entireHMAdata[userUid]?.boys?.[activeBoysHostel]?.expenses
      console.log(boysExpenses, "boysExpenses")
  }
}, [entireHMAdata, activeBoysHostel, activeGirlsHostel, userUid, ]);

console.log(boysRooms, "tttboysRooms");
console.log(girlsRooms, "tttgirlsRooms");
console.log(boysTenants, "tttboysTenants");
console.log(girlsTenants, "tttgirlsTenants");
console.log(boysTenantsWithRents, "boysTenantsWithRents")
console.log(girlsTenantsWithRents, "girlsTenantsWithRents")

  // end to get entireData

  
  useEffect(() => {
    setFirebase(firebaseInstances[area]);

  }, [area]);

  console.log(firebase, "fire")

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

  const [completeData, setCompleteData] = useState(false);
  useEffect(() => {
    fetchData();
}, [userUid, userarea, completeData, defaultArea]);
console.log(completeData, "completeData")
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
      setUserArea, 
      userUid, 
      firebase, 
      setArea, 
      setUserUid, 
      activeFlag,  
      changeActiveFlag, 
      girlsTenantsData, 
      boysTenantsData, 
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
      }}>
      {children}
    </DataContext.Provider>
  );
};

const useData = () => useContext(DataContext);
export { DataContext, useData, DataProvider };


