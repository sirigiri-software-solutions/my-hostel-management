import React, { useState } from 'react';
import Admin from '../../images/Icons.png';
import { Tab, Tabs } from 'react-bootstrap';
import BedsPageBoys from '../../components/BedsPageBoys/BedsPageBoys';
import BedsPageGirls from '../../components/BedsPageGirls/BedsPageGirls';
import { useTranslation } from 'react-i18next';
import './Beds.css'
import { useData } from '../../ApiData/ContextProvider';

const Beds = () => {
    const { t } = useTranslation();
    const [key, setKey] = useState('boys');
    const { activeBoysHostelButtons, activeGirlsHostelButtons, activeFlag,  changeActiveFlag } = useData()
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFloor, setSelectedFloor] = useState('');
    const [selectedRoomNo, setSelectedRoomNo] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const handleTabSelect = (tab) => {
        // setKey(tab);
        // onTabSelect(tab);
        setSelectedFloor("")
        setSearchQuery("")
        setSelectedRoomNo("")
        setSelectedStatus("")
        changeActiveFlag(tab)
    };

    return (
        <div className="container">
            <Tabs activeKey={activeFlag} onSelect={handleTabSelect} className="mb-3 custom-tabs">
                { activeBoysHostelButtons.length > 0 ?
                    <Tab eventKey="boys" title={t('dashboard.mens')} className={activeFlag === 'boys' ? 'active-tab' : ''}>
                        <BedsPageBoys key={key}  setSearchQuery={setSearchQuery} searchQuery={searchQuery} setSelectedFloor={setSelectedFloor} selectedFloor={selectedFloor}
                        setSelectedRoomNo={setSelectedRoomNo} selectedRoomNo={selectedRoomNo} setSelectedStatus={setSelectedStatus} selectedStatus={selectedStatus}/>
                    </Tab> : ''
                }
                {
                    activeGirlsHostelButtons.length > 0 ?
                        <Tab eventKey="girls" title={t('dashboard.womens')} className={activeFlag === 'girls' ? 'active-tab' : ''}>
                            <BedsPageGirls key={key} setSearchQuery={setSearchQuery} searchQuery={searchQuery} setSelectedFloor={setSelectedFloor} selectedFloor={selectedFloor}
                            setSelectedRoomNo={setSelectedRoomNo} selectedRoomNo={selectedRoomNo} setSelectedStatus={setSelectedStatus} selectedStatus={selectedStatus}/>
                        </Tab> : ''
                }

            </Tabs>
        </div>
    );
}

export default Beds;
