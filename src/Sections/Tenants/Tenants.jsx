import React, { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import TenantsBoys from '../../components/TenantsBoys/TenantsBoys';
import TenantsGirls from '../../components/TenantsGirls/TenantsGirls';
import { useTranslation } from 'react-i18next';
 
function Tenants() {
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
                    <TenantsBoys key={key}/>
                </Tab>
                <Tab eventKey="girls" title={t('dashboard.womens')}>
                    <TenantsGirls key={key}/>
                </Tab>
            </Tabs>
        </div>
    );
}
 
export default Tenants;
 
