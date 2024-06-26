import React, { useEffect, useState } from 'react';
import { useData } from '../../ApiData/ContextProvider';
import { set, ref, remove, onValue, update } from 'firebase/database';
import { database } from '../../firebase/firebase';
import { toast } from 'react-toastify';
import './Hostels.css';
import { Modal, Button, Tab, Tabs } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import RoomsIcon from '../../images/Icons (2).png';
import Table from '../../Elements/Table';

const Hostels = ({ onTabSelect, activeTab }) => {
  const { t } = useTranslation();
  const { activeBoysHostel, setActiveBoysHostel, activeBoysHostelButtons, setActiveBoysHostelButtons, userUid } = useData();
  const [isEditing, setIsEditing] = useState(null);
  const [hostels, setHostels] = useState({ boys: [], girls: [] });
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [hostelToDelete, setHostelToDelete] = useState(null);

  useEffect(() => {
    const boysRef = ref(database, `Hostel/${userUid}/boys`);
    const girlsRef = ref(database, `Hostel/${userUid}/girls`);

    const fetchBoysHostels = onValue(boysRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log(data,"hostelsdata2");
        const formattedData = Object.keys(data).map(key => ({
          id: key,
          name: data[key].name,
          address: data[key].address,
        }));
        setHostels(prev => ({ ...prev, boys: formattedData }));
      } else {
        setHostels(prev => ({ ...prev, boys: [] }));
      }
    });

    const fetchGirlsHostels = onValue(girlsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const formattedData = Object.keys(data).map(key => ({
          id: key,
          name: data[key].name,
          address: data[key].address,
        }));
        setHostels(prev => ({ ...prev, girls: formattedData }));
      } else {
        setHostels(prev => ({ ...prev, girls: [] }));
      }
    });

    return () => {
      fetchBoysHostels();
      fetchGirlsHostels();
    };
  }, [ userUid, database]);

  const submitHostelEdit = (e) => {
    e.preventDefault();
    const { id, name, originalName, address, isBoys } = isEditing;
    const basePath = `Hostel/${userUid}/${isBoys ? 'boys' : 'girls'}`;

    if (name !== originalName) {
      const updates = {};
      updates[`${basePath}/${originalName}`] = null;
      updates[`${basePath}/${name}`] = { name, address };

      update(ref(database), updates)
        .then(() => {
          toast.success("Hostel updated successfully.", {
            position: "top-center",
            autoClose: 3000,
          });
          cancelEdit();
        })
        .catch(error => {
          toast.error("Failed to update hostel: " + error.message, {
            position: "top-center",
            autoClose: 3000,
          });
        });
    } else {
      const hostelRef = ref(database, `${basePath}/${name}`);
      update(hostelRef, { name, address })
        .then(() => {
          toast.success("Hostel address updated successfully.", {
            position: "top-center",
            autoClose: 3000,
          });
          cancelEdit();
        })
        .catch(error => {
          toast.error("Failed to update hostel address: " + error.message, {
            position: "top-center",
            autoClose: 3000,
          });
        });
    }
  };

  const deleteHostel = (id) => {
    const isBoys = activeTab === 'boys';
    setIsDeleteConfirmationOpen(true);
    setHostelToDelete({ isBoys, id });
  };

  const confirmDeleteHostel = () => {
    const { isBoys, id } = hostelToDelete;
    const path = `Hostel/${userUid}/${isBoys ? 'boys' : 'girls'}/${id}`;
    remove(ref(database, path))
      .then(() => {
        toast.success("Hostel deleted successfully.", {
          position: "top-center",
          autoClose: 3000,
        });
        setIsDeleteConfirmationOpen(false);
        setHostelToDelete(null);
      })
      .catch(error => {
        toast.error("Failed to delete hostel: " + error.message, {
          position: "top-center",
          autoClose: 3000,
        });
      });
  };

  const cancelDeleteHostel = () => {
    setIsDeleteConfirmationOpen(false);
    setHostelToDelete(null);
  };

  const cancelEdit = () => {
    setIsEditing(null);
  };

  const startEdit = (id, name, address, isBoys) => {
    setIsEditing({ id, name, originalName: name, address, isBoys });
  };

  const handleEditChange = (field, value) => {
    setIsEditing(prev => ({ ...prev, [field]: value }));
  };

  const getHostelColumns = () => [
    t("hostels.name"),
    t("hostels.address"),
    t("hostels.actions"),
    t("hostels.deleteData")
  ];

  const getHostelRows = (hostels, isBoys) => hostels.map(hostel => ({
    name: hostel.name,
    address: hostel.address,
    edit: <button
      style={{ backgroundColor: '#ff8a00', padding: '4px', borderRadius: '5px', color: 'white', border: 'none', }}

      onClick={() => startEdit(hostel.id, hostel.name, hostel.address, isBoys)}
    >Edit</button>,

    delete: <button
      style={{ backgroundColor: "#ff8a00", padding: '4px', borderRadius: '5px', color: 'white', border: 'none', }}
      onClick={() => deleteHostel(hostel.id)}
    >Delete</button>
  }));

  const handleTabSelect = (tab) => {
    onTabSelect(tab);
  };

  return (
    <div className='container'>
      <Tabs activeKey={activeTab} onSelect={handleTabSelect} className=" mb-3 tabs-nav">
        <Tab eventKey="boys" title={t('dashboard.mens')}>
          <div className=" row d-flex flex-wrap align-items-center justify-content-between">
            <div className="col-12  col-md-4 d-flex  align-items-center mr-5 mb-2">
              <div className='roomlogo-container'>
                <img src={RoomsIcon} alt="RoomsIcon" className='roomlogo' />
              </div>
              <text className='management-heading2'>{t('roomsPage.HostelsManagement')}</text>
            </div>
          </div>
          <div>
            <Table
              columns={getHostelColumns()}
              rows={getHostelRows(hostels.boys, true)}
              onClickTentantRow={(row) => console.log(row)}
            />
          </div>
        </Tab>
        <Tab eventKey="girls" title={t('dashboard.womens')}>
          <div className=" row d-flex flex-wrap align-items-center justify-content-between">
            <div className="col-12  col-md-4 d-flex  align-items-center mr-5 mb-2">
              <div className='roomlogo-container'>
                <img src={RoomsIcon} alt="RoomsIcon" className='roomlogo' />
              </div>
              <text className='management-heading2'>{t('roomsPage.HostelsManagement')}</text>
            </div>
          </div>
          <div>
            <Table
              columns={getHostelColumns()}
              rows={getHostelRows(hostels.girls, false)}
              onClickTentantRow={(row) => console.log(row)}
            />
          </div>
        </Tab>
      </Tabs>
      <Modal show={isEditing !== null} onHide={cancelEdit}>
        <Modal.Header closeButton>
          <Modal.Title>{t("hostels.editHostel")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isEditing && (
            <div>
              <p>{t("hostels.editName")}</p>
              <input
                type="text"
                value={isEditing.name}
                onChange={(e) => handleEditChange('name', e.target.value)}
                className="edit-hostel-input"
              />
              <p>{t("hostels.editAddress")}</p>
              <input
                type="text"
                value={isEditing.address}
                onChange={(e) => handleEditChange('address', e.target.value)}
                className="edit-hostel-input"
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelEdit}>
            {t("hostels.cancel")}
          </Button>
          <Button variant="primary" onClick={submitHostelEdit}>
            {t("hostels.save")}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={isDeleteConfirmationOpen} onHide={cancelDeleteHostel}>
        <Modal.Header closeButton>
          <Modal.Title>{t("hostels.confirmDelete")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t("hostels.confirmMsg")}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDeleteHostel}>
            {t("hostels.cancel")}
          </Button>
          <Button variant="danger" onClick={confirmDeleteHostel}>
            {t("hostels.delete")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Hostels;

