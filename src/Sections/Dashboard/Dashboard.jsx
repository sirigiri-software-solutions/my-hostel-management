import React, { useState, useEffect } from 'react';
import Admin from '../../images/Icons.png';
import DashboardBoys from '../../components/DashboardBoys/DashboardBoys';
import { Tab, Tabs } from 'react-bootstrap';
import './Dashboard.css';
import { useTranslation } from 'react-i18next';
import DashboardGirls from '../../components/DashboardGirls/DashboardGirls'
import { useData } from '../../ApiData/ContextProvider';
import { App as CapacitorApp } from '@capacitor/app';
import { isPlatform } from '@ionic/react';
import { Capacitor } from '@capacitor/core';
import { useLocation, useNavigate } from 'react-router-dom';




const Dashboard = ({ onTabSelect, activeTab }) => {
  const { t } = useTranslation()
  const { activeBoysHostel, activeFlag, changeActiveFlag, activeBoysHostelButtons, activeGirlsHostelButtons, } = useData();
  const name = localStorage.getItem("username");
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();

  
  const handleTabSelect = (tab) => {
    // onTabSelect(tab);
    changeActiveFlag(tab)
    setShowModal(false)
   
  };
  useEffect(()=>{
    setShowModal(false)
  },[])
console.log(activeBoysHostelButtons.length,"area",  "length")

  return (
    <div className='container_main'>
      <div className='mobile-layout'>
        <Tabs activeKey={activeFlag} onSelect={handleTabSelect} className="mb-3 custom-tabs">
          {
            activeBoysHostelButtons.length > 0 ?
              <Tab eventKey="boys" title={t('dashboard.mens')} className={activeFlag === 'boys' ? 'active-tab' : ''}>
                <DashboardBoys show={showModal} />
              </Tab> : ""
          }
          {
            activeGirlsHostelButtons.length > 0 ?
              <Tab eventKey="girls" title={t('dashboard.womens')} className={activeFlag === 'girls' ? 'active-tab' : ''}>
                <DashboardGirls />
              </Tab> : ""
          }

        </Tabs>
      </div>
      <div className='desktop-layout' >
        <DashboardBoys />
        <DashboardGirls />
      </div>
    </div>
  );
}

export default Dashboard;
