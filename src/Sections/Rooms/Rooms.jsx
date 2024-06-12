import React, { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import RoomsBoys from '../../components/RoomsBoys/RoomsBoys';
import RoomsGirls from '../../components/RoomsGirls/RoomsGirls';
import { useTranslation } from 'react-i18next';
import { useData } from '../../ApiData/ContextProvider';

const Rooms =({ onTabSelect,activeTab }) => {
    const { t } = useTranslation();
    // const [activeTab, setActiveTab] = useState('boys');


    const handleTabSelect = (tab) => {
        // setActiveTab(tab);
        onTabSelect(tab);
    };

    return (
        <div className='container'>
            <Tabs activeKey={activeTab} onSelect={handleTabSelect} className="mb-3 tabs-nav">
                <Tab eventKey="boys" title={t('dashboard.mens')}>
                    <RoomsBoys />
                </Tab>
                <Tab eventKey="girls" title={t('dashboard.womens')}>
                    <RoomsGirls />
                </Tab>
            </Tabs>
        </div>
    );
}

export default Rooms;
