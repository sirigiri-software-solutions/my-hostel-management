import React, { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import RentPageBoys from '../../components/RentPageBoys/RentPageBoys';
import RentPageGirls from '../../components/RentPageGirls/RentPageGirls';
import { useTranslation } from 'react-i18next';
import { useData } from '../../ApiData/ContextProvider';


const Rents = () => {
    const { t } = useTranslation();
    const { activeBoysHostelButtons, activeGirlsHostelButtons, activeFlag,  changeActiveFlag } = useData();
    const [searchQuery, setSearchQuery] = useState("");
    const [filterOption, setFilterOption] = useState("all");


    const handleTabSelect = (tab) => {
        // onTabSelect(tab)
        setSearchQuery("")
        setFilterOption("all")
        changeActiveFlag(tab)
    };

    return (
        <div className="container">

            <Tabs activeKey={activeFlag} onSelect={handleTabSelect} className="mb-3 custom-tabs">
                {
                    activeBoysHostelButtons.length > 0 ?
                        <Tab eventKey="boys" title={t('dashboard.mens')} className={activeFlag === 'boys' ? 'active-tab' : ''}>
                            <RentPageBoys setSearchQuery={setSearchQuery} searchQuery={searchQuery} setFilterOption={setFilterOption} filterOption={filterOption}/>
                        </Tab> : ''
                }
                {
                    activeGirlsHostelButtons.length > 0 ?
                        <Tab eventKey="girls" title={t('dashboard.womens')} className={activeFlag === 'girls' ? 'active-tab' : ''}>
                            <RentPageGirls setSearchQuery={setSearchQuery} searchQuery={searchQuery} setFilterOption={setFilterOption} filterOption={filterOption}/>
                        </Tab> : ''
                }

            </Tabs>
        </div>
    );
}

export default Rents;
