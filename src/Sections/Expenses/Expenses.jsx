
import React, { useState } from 'react';
import Adminlogo from '../../images/Icons.png'
import { Tab, Tabs } from 'react-bootstrap';
import ExpensesBoys from '../../components/ExpensesBoys/ExpensesBoys';
import ExpensesGirls from '../../components/ExpensesGirls/ExpensesGirls';
import { useTranslation } from 'react-i18next';

const  Expenses=({ onTabSelect,activeTab })=> {
    const { t } = useTranslation();
    
    const handleTabSelect = (tab) => {
        onTabSelect(tab);
    };
    return (
        <div className="container">
            <Tabs activeKey={activeTab} onSelect={handleTabSelect} className="mb-3">
                <Tab eventKey="boys" title={t('dashboard.mens')}>
                    <ExpensesBoys />
                </Tab>
                <Tab eventKey="girls" title={t('dashboard.womens')}>
                    <ExpensesGirls />
                </Tab>
            </Tabs>
        </div>
    );
}

export default Expenses;

