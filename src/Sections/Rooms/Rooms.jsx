import React, { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import RoomsBoys from '../../components/RoomsBoys/RoomsBoys';
import RoomsGirls from '../../components/RoomsGirls/RoomsGirls';
import { useTranslation } from 'react-i18next';
import { useData } from '../../ApiData/ContextProvider';

const Rooms = () => {
    const { t } = useTranslation();
    const { activeBoysHostelButtons, activeGirlsHostelButtons, activeFlag,  changeActiveFlag } = useData()

    const handleTabSelect = (tab) => {
        // onTabSelect(tab);
        changeActiveFlag(tab)    
    };

    return (
        <div className='container'>
            <Tabs activeKey={activeFlag} onSelect={handleTabSelect} className="mb-3 tabs-nav custom-tabs">
                {activeBoysHostelButtons.length > 0 ?
                    <Tab eventKey="boys" title={t('dashboard.mens')} className={activeFlag === 'boys' ? 'active-tab' : ''}>
                        <RoomsBoys />
                    </Tab> : ''
                }
                {
                    activeGirlsHostelButtons.length > 0 ?
                        <Tab eventKey="girls" title={t('dashboard.womens')} className={activeFlag === 'girls' ? 'active-tab' : ''}>
                            <RoomsGirls />
                        </Tab> : ''
                }

            </Tabs>
        </div>
    );
}

export default Rooms;
