import React, { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import RentPageBoys from '../../components/RentPageBoys/RentPageBoys';
import RentPageGirls from '../../components/RentPageGirls/RentPageGirls';
import { useTranslation } from 'react-i18next';
import { useData } from '../../ApiData/ContextProvider';


const Rents = () => {
    const { t } = useTranslation();
    const { activeBoysHostelButtons, activeGirlsHostelButtons, activeFlag,  changeActiveFlag } = useData()

    const handleTabSelect = (tab) => {
        // onTabSelect(tab)
        changeActiveFlag(tab)
    };

    return (
        <div className="container">

            <Tabs activeKey={activeFlag} onSelect={handleTabSelect} className="mb-3 custom-tabs">
                {
                    activeBoysHostelButtons.length > 0 ?
                        <Tab eventKey="boys" title={t('dashboard.mens')} className={activeFlag === 'boys' ? 'active-tab' : ''}>
                            <RentPageBoys />
                        </Tab> : ''
                }
                {
                    activeGirlsHostelButtons.length > 0 ?
                        <Tab eventKey="girls" title={t('dashboard.womens')} className={activeFlag === 'girls' ? 'active-tab' : ''}>
                            <RentPageGirls />
                        </Tab> : ''
                }

            </Tabs>
        </div>
    );
}

export default Rents;
