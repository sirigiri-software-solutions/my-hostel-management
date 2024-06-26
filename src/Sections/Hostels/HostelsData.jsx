import React, { useEffect, useState } from 'react';
import { useData } from '../../ApiData/ContextProvider';
import { ref, onValue } from 'firebase/database';
import { database } from '../../firebase/firebase';
import { Tabs, Tab } from 'react-bootstrap';
import Table from '../../Elements/Table';
import './Hostels.css';

const AllHostels = ({ onTabSelect, activeTab }) => {
  const { userUid } = useData();
  const [hostelsData, setHostelsData] = useState({ boys: [], girls: [] });
  const [filteredHostels, setFilteredHostels] = useState([]);
  const [selectedGender, setSelectedGender] = useState('boys');
  const [selectedArea, setSelectedArea] = useState('');

  useEffect(() => {
    const boysRef = ref(database, `Hostel/${userUid}/boys`);
    const girlsRef = ref(database, `Hostel/${userUid}/girls`);

    const fetchBoysHostels = onValue(boysRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const formattedData = Object.keys(data).map(key => ({
          id: key,
          name: data[key].name,
          address: data[key].address,
          rooms: data[key].rooms
        }));
        setHostelsData(prev => ({ ...prev, boys: formattedData }));
      } else {
        setHostelsData(prev => ({ ...prev, boys: [] }));
      }
    });
          console.log(hostelsData,"selectedhostels");
    const fetchGirlsHostels = onValue(girlsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const formattedData = Object.keys(data).map(key => ({
          id: key,
          name: data[key].name,
          address: data[key].address,
          rooms: data[key].rooms
        }));
        setHostelsData(prev => ({ ...prev, girls: formattedData }));
      } else {
        setHostelsData(prev => ({ ...prev, girls: [] }));
      }
    });

    return () => {
      fetchBoysHostels();
      fetchGirlsHostels();
    };
  }, [userUid]);

  useEffect(() => {
    const hostels = selectedGender === 'boys' ? hostelsData.boys : hostelsData.girls;
    if (selectedArea) {
      setFilteredHostels(
        hostels.filter((hostel) => hostel.address.toLowerCase().includes(selectedArea.toLowerCase()))
      );
    } else {
      setFilteredHostels(hostels);
    }
  }, [selectedGender, selectedArea, hostelsData]);

  const getHostelColumns = () => [
    'S.No',
    'Hostel Name',
    'Hostel Address',
    'Hostel Rent'
  ];

  const getHostelRows = (hostels) => hostels.map((hostel, index) => ({
    id: index + 1,
    name: hostel.name,
    address: hostel.address,
    rent: hostel.rooms ? hostel.rooms[Object.keys(hostel.rooms)[0]].bedRent : 'N/A'
  }));

  const handleTabSelect = (tab) => {
    setSelectedGender(tab);
  };

  return (
    <div className='container'>
      <h1>All Hostels</h1>
      <select onChange={(e) => setSelectedArea(e.target.value)} value={selectedArea}>
        <option value="">Select Area</option>
        <option value="hyderabad">Hyderabad</option>
        <option value="secunderabadr">Secunderabad</option>
        <option value="Gachibowli">Gachibowli</option>
        {/* Add more areas as needed */}
      </select>
      <Tabs activeKey={selectedGender} onSelect={handleTabSelect} className="mb-3 tabs-nav">
        <Tab eventKey="boys" title="Mens">
          <div>
            <Table
              columns={getHostelColumns()}
              rows={getHostelRows(filteredHostels)}
            />
          </div>
        </Tab>
        <Tab eventKey="girls" title="Womens">
          <div>
            <Table
              columns={getHostelColumns()}
              rows={getHostelRows(filteredHostels)}
            />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default AllHostels;
