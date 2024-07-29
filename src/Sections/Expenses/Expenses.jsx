
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

    const handleTabSelect = (tab) => {
        // onTabSelect(tab);
        changeActiveFlag(tab)
    };
    return (
        <div className="container">
            <Tabs activeKey={activeFlag} onSelect={handleTabSelect} className="mb-3 custom-tabs">
                {
                    activeBoysHostelButtons.length > 0 ?
                        <Tab eventKey="boys" title={t('dashboard.mens')} className={activeFlag === 'boys' ? 'active-tab' : ''}>
                            <ExpensesBoys />
                        </Tab> : ''
                }
                {
                    activeGirlsHostelButtons.length > 0 ?
                        <Tab eventKey="girls" title={t('dashboard.womens')} className={activeFlag === 'girls' ? 'active-tab' : ''}>
                            <ExpensesGirls />
                        </Tab> : ''
                }


            </Tabs>
        </div>
    );
}

export default Expenses;

