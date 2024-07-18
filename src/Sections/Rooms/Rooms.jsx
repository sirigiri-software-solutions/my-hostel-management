import React, { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import RoomsBoys from '../../components/RoomsBoys/RoomsBoys';
import RoomsGirls from '../../components/RoomsGirls/RoomsGirls';
import { useTranslation } from 'react-i18next';
import { useData } from '../../ApiData/ContextProvider';

const Rooms =({ onTabSelect,activeTab }) => {
    const { t } = useTranslation();


    const handleTabSelect = (tab) => {
        onTabSelect(tab);
    };

    return (
        <div className='container'>
            <Tabs activeKey={activeTab} onSelect={handleTabSelect} className="mb-3 tabs-nav custom-tabs">
                <Tab eventKey="boys" title={t('dashboard.mens')}  className={activeTab === 'boys' ? 'active-tab' : ''}>
                    <RoomsBoys />
                </Tab>
                <Tab eventKey="girls" title={t('dashboard.womens')} className={activeTab === 'girls' ? 'active-tab' : ''}>
                    <RoomsGirls />
                </Tab>
            </Tabs>
        </div>
    );
}

export default Rooms;
