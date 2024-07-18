import React, { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import TenantsBoys from '../../components/TenantsBoys/TenantsBoys';
import TenantsGirls from '../../components/TenantsGirls/TenantsGirls';
import { useTranslation } from 'react-i18next';

const  Tenants = ({ onTabSelect,activeTab }) => {
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
                    <TenantsBoys key={key} />
                </Tab>
                <Tab eventKey="girls" title={t('dashboard.womens')} className={activeTab === 'girls' ? 'active-tab' : ''}>
                    <TenantsGirls key={key} />
                </Tab>
            </Tabs>
        </div>
    );
}

export default Tenants;

