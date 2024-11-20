
import React, { useState } from 'react';
import Adminlogo from '../../images/Icons.png'
import { Tab, Tabs } from 'react-bootstrap';
import ExpensesBoys from '../../components/ExpensesBoys/ExpensesBoys';
import ExpensesGirls from '../../components/ExpensesGirls/ExpensesGirls';
import { useTranslation } from 'react-i18next';
import { useData } from '../../ApiData/ContextProvider';

const Expenses = () => {
    const { t } = useTranslation();
    const { activeBoysHostelButtons, activeGirlsHostelButtons, activeFlag,  changeActiveFlag  } = useData()
    const [searchQuery, setSearchQuery] = useState("");
    
    const getCurrentMonth = () => {
        const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
        const currentMonth = new Date().getMonth();
        return monthNames[currentMonth];
      };
      const [month, setMonth] = useState(getCurrentMonth());
    const handleTabSelect = (tab) => {
        // onTabSelect(tab);
        setSearchQuery("")
        setMonth(getCurrentMonth())
        changeActiveFlag(tab)
    };
    return (
        <div className="container">
            <Tabs activeKey={activeFlag} onSelect={handleTabSelect} className="mb-3 custom-tabs">
                {
                    activeBoysHostelButtons.length > 0 ?
                        <Tab eventKey="boys" title={t('dashboard.mens')} className={activeFlag === 'boys' ? 'active-tab' : ''}>
                            <ExpensesBoys setSearchQuery={setSearchQuery} searchQuery={searchQuery} setMonth={setMonth} month={month}/>
                        </Tab> : ''
                }
                {
                    activeGirlsHostelButtons.length > 0 ?
                        <Tab eventKey="girls" title={t('dashboard.womens')} className={activeFlag === 'girls' ? 'active-tab' : ''}>
                            <ExpensesGirls setSearchQuery={setSearchQuery} searchQuery={searchQuery} setMonth={setMonth} month={month}/>
                        </Tab> : ''
                }


            </Tabs>
        </div>
    );
}

export default Expenses;

