import React, { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import RentPageBoys from '../../components/RentPageBoys/RentPageBoys';
import RentPageGirls from '../../components/RentPageGirls/RentPageGirls';
import { useTranslation } from 'react-i18next';


const Rents = ({ onTabSelect,activeTab }) => {
    const { t } = useTranslation();

    const handleTabSelect = (tab) => {
        onTabSelect(tab)
    };

    return (
        <div className="container">
            <Tabs activeKey={activeTab} onSelect={handleTabSelect} className="mb-3">
                <Tab eventKey="boys" title={t('dashboard.mens')}>
                    <RentPageBoys />
                </Tab>
                <Tab eventKey="girls" title={t('dashboard.womens')}>
                    <RentPageGirls />
                </Tab>
            </Tabs>
        </div>
    );
}

export default Rents;
