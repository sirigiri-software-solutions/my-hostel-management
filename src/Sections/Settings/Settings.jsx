import React, { useState,useEffect } from 'react';
import { ref, set,push, onValue } from 'firebase/database';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LanguageSwitch from '../../LanguageSwitch';
import { useTranslation } from 'react-i18next';
import './settings.css';
import { Modal, Button } from 'react-bootstrap';
import { useData } from '../../ApiData/ContextProvider';

const Settings = () => {
  const { firebase } = useData();

  const { t } = useTranslation();

  return (
    <div className="settings">
      <h1 className='settingsPageHeading'>{t('menuItems.settings')}</h1>
      <div className="settings-top">
        <div className="language-switch-section">
          <label className="languageLabel" htmlFor="language-selector">{t("settings.languages")} </label>
          <LanguageSwitch id="language-selector" />
        </div>
      </div>
    </div>
  );
};

export default Settings;
