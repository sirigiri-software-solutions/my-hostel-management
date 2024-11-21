import React, { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import TenantsBoys from '../../components/TenantsBoys/TenantsBoys';
import TenantsGirls from '../../components/TenantsGirls/TenantsGirls';
import { useTranslation } from 'react-i18next';
import { useData } from '../../ApiData/ContextProvider';

const Tenants = () => {
    const { t } = useTranslation();
    const { activeBoysHostelButtons, activeGirlsHostelButtons, activeFlag,  changeActiveFlag } = useData()
    const [searchQuery, setSearchQuery] = useState("");
    const [showBikeFilter, setShowBikeFilter] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState('');

    const onChangeStatus = (e) => {
        setSelectedStatus(e.target.value);
    };

      // const [key, setKey] = useState('boys');

    const handleTabSelect = (tab) => {
        // setKey(tab);
        // onTabSelect(tab);
        setSearchQuery("")
        setShowBikeFilter(true); // Reset the bike filter to its default state
        setSelectedStatus("");
            
            
        changeActiveFlag(tab)
    };

    return (
        <div className="container">
            <Tabs activeKey={activeFlag} onSelect={handleTabSelect} className="mb-3 custom-tabs">
                {
                    activeBoysHostelButtons.length > 0 ?
                        <Tab eventKey="boys" title={t('dashboard.mens')} className={activeFlag === 'boys' ? 'active-tab' : ''}>
                            <TenantsBoys setSearchQuery={setSearchQuery} searchQuery={searchQuery} showBikeFilter={showBikeFilter} setShowBikeFilter={setShowBikeFilter}
                            setSelectedStatus={setSelectedStatus} selectedStatus={selectedStatus}/>
                        </Tab> : ''
                }
                {
                    activeGirlsHostelButtons.length > 0 ?
                        <Tab eventKey="girls" title={t('dashboard.womens')} className={activeFlag === 'girls' ? 'active-tab' : ''}>
                            <TenantsGirls setSearchQuery={setSearchQuery} searchQuery={searchQuery} showBikeFilter={showBikeFilter} setShowBikeFilter={setShowBikeFilter}
                            setSelectedStatus={setSelectedStatus} selectedStatus={selectedStatus}/>
                        </Tab> : ''
                }

            </Tabs>
        </div>
    );
}

export default Tenants;

