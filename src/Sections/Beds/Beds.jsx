import React, { useState } from 'react';
import Admin from '../../images/Icons.png';
import { Tab, Tabs } from 'react-bootstrap';
import BedsPageBoys from '../../components/BedsPageBoys/BedsPageBoys';
import BedsPageGirls from '../../components/BedsPageGirls/BedsPageGirls';
import { useTranslation } from 'react-i18next';
import './Beds.css'

const Beds = ({ onTabSelect,activeTab }) => {
    const { t } = useTranslation();
    const [key, setKey] = useState('boys');

    const handleTabSelect = (tab) => {
        setKey(tab);
        onTabSelect(tab);
    };

    return (
        <div className="container">
            <Tabs activeKey={activeTab} onSelect={handleTabSelect} className="mb-3 custom-tabs">
                <Tab eventKey="boys" title={t('dashboard.mens')} className={activeTab === 'boys' ? 'active-tab' : ''}>
                    <BedsPageBoys key={key} />
                </Tab>
                <Tab eventKey="girls" title={t('dashboard.womens')} className={activeTab === 'girls' ? 'active-tab' : ''}>
                    <BedsPageGirls key={key} />
                </Tab>
            </Tabs>
        </div>
    );
}

export default Beds;
