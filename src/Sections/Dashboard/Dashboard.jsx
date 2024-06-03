import React, { useState, useEffect } from 'react';
import Admin from '../../images/Icons.png';
import DashboardBoys from '../../components/DashboardBoys/DashboardBoys';
//import DashboardGirls from '../../components/DashboardGirls/DashboardGirls';
import { Tab, Tabs } from 'react-bootstrap';
import './Dashboard.css';
import { useTranslation } from 'react-i18next';
import DashboardGirls from '../../components/DashboardGirls/DashboardGirls'
import { useData } from '../../ApiData/ContextProvider';

const Dashboard = () => {
  const {t} = useTranslation()
  const { activeBoysHostel } = useData();
  const [activeTab, setActiveTab] = useState('boys');
  const name = localStorage.getItem("username");

  const handleTabSelect = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className='container_main'>
      {/* <h1 className='dashboard-welcome'>{t('dashboard.welcome')} to {activeBoysHostel} Hostel</h1> */}
      <div className='mobile-layout'>
        <Tabs activeKey={activeTab} onSelect={handleTabSelect} className="mb-3">
        <Tab eventKey="boys" title={t('dashboard.mens')}>
            <DashboardBoys />
          </Tab>
          <Tab eventKey="girls" title={t('dashboard.womens')}>
            <DashboardGirls />
          </Tab>
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
