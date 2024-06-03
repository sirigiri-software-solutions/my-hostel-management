import React, { useState } from 'react';
import Admin from '../../images/Icons.png';
import { Tab, Tabs } from 'react-bootstrap';
import BedsPageBoys from '../../components/BedsPageBoys/BedsPageBoys';
import BedsPageGirls from '../../components/BedsPageGirls/BedsPageGirls';
import { useTranslation } from 'react-i18next';

const Beds = () => {
    const { t }=useTranslation();
    const [activeTab, setActiveTab] = useState('boys');
    const [key, setKey] = useState('boys');


    const handleTabSelect = (tab) => {
        setActiveTab(tab);
        setKey(tab);
    };

    return (
        <div className="container">
            <Tabs activeKey={activeTab} onSelect={handleTabSelect} className="mb-3">
            <Tab eventKey="boys" title={t('dashboard.mens')}>
                    <BedsPageBoys key={key}  />
                </Tab>
                <Tab eventKey="girls" title={t('dashboard.womens')}>
                    <BedsPageGirls key={key}  />
                </Tab>
            </Tabs>
        </div>
    );
}

export default Beds;
