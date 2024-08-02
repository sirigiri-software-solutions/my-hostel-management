import React, { useState, useEffect } from 'react';
import Admin from '../../images/Icons.png';
import DashboardBoys from '../../components/DashboardBoys/DashboardBoys';
import { Tab, Tabs } from 'react-bootstrap';
import './Dashboard.css';
import { useTranslation } from 'react-i18next';
import DashboardGirls from '../../components/DashboardGirls/DashboardGirls'
import { useData } from '../../ApiData/ContextProvider';

const Dashboard = ({ onTabSelect, activeTab }) => {
  const { t } = useTranslation()
  const { activeBoysHostel , activeFlag,  changeActiveFlag} = useData();
  const name = localStorage.getItem("username");

  const handleTabSelect = (tab) => {
    // onTabSelect(tab);
    changeActiveFlag(tab)
  };


  return (
    <div className='container_main'>
      <div className='mobile-layout'>
        <Tabs activeKey={activeFlag} onSelect={handleTabSelect} className="mb-3 custom-tabs">
          <Tab eventKey="boys" title={t('dashboard.mens')} className={activeFlag === 'boys' ? 'active-tab' : ''}>
            <DashboardBoys />
          </Tab>
          <Tab eventKey="girls" title={t('dashboard.womens')} className={activeFlag === 'girls' ? 'active-tab' : ''}>
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
