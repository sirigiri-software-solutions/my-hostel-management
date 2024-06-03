import React, { useState, useEffect, useContext } from 'react'
import DashboardImage from '../../images/Icons (11).png'
import RoomsImage from '../../images/Icons (2).png'
import BedsImage from '../../images/Icons (3).png'
import TenantsImage from '../../images/Icons (4).png'
import Admin from '../../images/Icons.png';
import ExpensesImage from '../../images/Icons (5).png'
import RentImage from '../../images/Icons (6).png'
import SettingsImage from '../../images/Icons (7).png'
import logo from "../../images/image.png"
import './MainPage.css'
import '../../Sections/Dashboard/Dashboard.css'
import Dashboard from '../../Sections/Dashboard/Dashboard'
import Beds from '../../Sections/Beds/Beds'
import Rooms from '../../Sections/Rooms/Rooms'
import Expenses from '../../Sections/Expenses/Expenses'
import Rents from '../../Sections/Rents/Rents'
import Tenants from '../../Sections/Tenants/Tenants'
import Settings from '../../Sections/Settings/Settings'
import { GiHamburgerMenu } from "react-icons/gi";
import Popup from 'reactjs-popup'
import { AiOutlineClose } from 'react-icons/ai'
import { DataContext } from '../../ApiData/ContextProvider'
import { useNavigate } from 'react-router-dom'
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useTranslation } from 'react-i18next'
import { useData } from '../../ApiData/ContextProvider';
import Hostels from '../../Sections/Hostels/Hostels'
const MainPage = () => {
  const { t } = useTranslation()
  const { activeBoysHostel, activeGirlsHostel } = useData();
  const name = localStorage.getItem("username");
  // Refer here for fetched Api Data use like this in all pages don't fetch api url
  const { data } = useContext(DataContext);
  console.log("start")
  if (data != null) {
    console.log(data && data);
  }
  console.log("end");

  const menuItems = [
    {
      id: 1,
      path: "/",
      name: t("menuItems.dashboard"),
      icon: DashboardImage,
    },
    {
      id: 2,
      path: "/rooms",
      name: t("menuItems.rooms"),
      icon: RoomsImage,
    },
    {
      id: 3,
      path: "/beds",
      name: t("menuItems.beds"),
      icon: BedsImage,
    },
    {
      id: 4,
      path: "/rent",
      name: t("menuItems.rent"),
      icon: RentImage,
    },
    {
      id: 5,
      path: "/tenants",
      name: t("menuItems.tenants"),
      icon: TenantsImage,
    },
    {
      id: 6,
      path: "/expenses",
      name: t("menuItems.expenses"),
      icon: ExpensesImage,
    },
    {
      id: 7,
      path: "/hostels",
      name: t("menuItems.hostels"),
      icon: RoomsImage,
    },
    {
      id: 8,
      path: "/settings",
      name: t("menuItems.settings"),
      icon: SettingsImage,
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const Components = [<Dashboard />, <Rooms />, <Beds />, <Rents />, <Tenants />, <Expenses />, <Hostels/>, <Settings />]

  const [flag, setFlag] = useState(1);

  const handlesideBar = (value) => {
    setFlag(value);
  }

  useEffect(() => {
    // Add event listener to handle clicks outside the popup
    const handleClickOutsideModal = (event) => {
      const popup = document.getElementById('poplogoutbtn');
      if (popup && !popup.contains(event.target)) {
        // Clicked outside the popup, close the modal
        setIsModalOpen(false);
      }
    };

    // Attach the event listener
    document.addEventListener('mousedown', handleClickOutsideModal);

    // Cleanup: remove event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModal);
    };
  }, []);


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // For smaller screens
        setMainBackgroundContainerStyle({ display: 'flex', width: '100%', margin: '0px', flexDirection: 'column' });
        setSidebarStyle({ width: '100%', backgroundColor: '#ECECEC', padding: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' });
        setSidebarItems({ display: 'none' });
        setrightSectionMainContainer({ width: '100%', padding: '20px' })
        setHamburgerMenu({ fontSize: '40px' })
      } else {
        // For larger screens
        setMainBackgroundContainerStyle({ display: 'flex', width: '100%', margin: '0px', flexDirection: 'row' });
        setSidebarStyle({ width: '21%', backgroundColor: '#ECECEC', padding: '20px', borderRadius: '0px 65px 65px 0px', display: 'flex', flexDirection: 'column' });
        setSidebarItems({ display: 'flex', flexDirection: 'column', gap: '15px' })
        setrightSectionMainContainer({ width: '80%', padding: '16px 20px' })
        setHamburgerMenu({ display: 'none' })
        setHamburgerMenuItems(false);
      }
    };

    // Call handleResize initially
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);



  const [mainBackgroundContainerStyle, setMainBackgroundContainerStyle] = useState({})
  const [sidebarStyle, setSidebarStyle] = useState({})
  const [sidebarItems, setSidebarItems] = useState({})
  const [rightSectionMainContainer, setrightSectionMainContainer] = useState({})
  const [hamburgerMenu, setHamburgerMenu] = useState(false)
  const [hamburgerMenuItems, setHamburgerMenuItems] = useState(false)



  const handleHamburgerMenu = () => {
    setHamburgerMenuItems(!hamburgerMenuItems)
  }


  const handleSidebarItemClick = (itemId, close) => {
    handlesideBar(itemId);
    close(); // Close the popup modal
  }

  // const [isModalOpen, setIsModalOpen] = useState(false);

  // const toggleModal = () => {
  //   setIsModalOpen(!isModalOpen);
  // };

  const navigate = useNavigate();

  const logout = () => {
    // Clear any stored data related to user session
    localStorage.removeItem('username');
    localStorage.removeItem('rememberedUsername');
    localStorage.removeItem('rememberedPassword');
    // Redirect to login page
    navigate('/');
  };

  return (
    <div className='bg-container' style={mainBackgroundContainerStyle}>
      <div className='sidebar' style={sidebarStyle}>
        <div className='top-section' >
          <img src={logo} alt="logo" className='logo' />
        </div>
        <div className='nav-div' >
        <div className='menufontchange'>
          <img src={Admin} alt="admin" className='mbl-dashboard-icon' />
          <h1 className='mb-dashboard-name'>{name}</h1>
          </div>
          <div className='logoutButton' onClick={toggleModal}>
            <RiLogoutCircleRLine />
          </div>
        </div>
        <div style={sidebarItems}>
          {
            menuItems.map((item, index) => (
              <div key={index} className="link" style={flag === item.id ? { backgroundColor: 'hsla(30, 100%, 50%, 0.41)', borderRadius: '10px' } : { borderRadius: '10px' }} onClick={() => handlesideBar(item.id)}>
                <img src={item.icon} alt={item.name} className='icon' />
                <label className='link-text'>{item.name}</label>
              </div>
            ))
          }
        </div>
        <Popup modal
          trigger={<GiHamburgerMenu style={hamburgerMenu} onClick={handleHamburgerMenu} />}>
          {close => (
            <div style={{
              backgroundColor: "#fff",
              minHeight: "100vh",
              minWidth: "100vw",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative"
            }}>
              <div style={{ display: "flex", flexDirection: "Column" }}>
                {

                  menuItems.map((item, index) => (
                    <div key={index} className="link" style={flag === item.id ? { backgroundColor: 'hsla(30, 100%, 50%, 0.41)', borderRadius: '10px' } : { borderRadius: '10px' }} onClick={() => handleSidebarItemClick(item.id, close)}>
                      <img src={item.icon} alt={item.name} className='icon' />
                      <label className='link-text'>{item.name}</label>
                    </div>
                  ))

                }
              </div>
              <AiOutlineClose
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                }}
                onClick={() => close()} />
            </div>
          )}
        </Popup>
      </div>

      <div style={rightSectionMainContainer} >
        <div >
          <div className='dashboardHead'>
            <div className='dashBoarWelcome'>
              <text>{t('dashboard.welcomeTo')} {activeBoysHostel} {t('dashboard.boysHostel')}  , {activeGirlsHostel} {t('dashboard.girlsHostel')} </text>
            </div>
            <div className='top-div'>
              <img src={Admin} alt="admin" className='dashboard-icon' />
              <h1 className='dashboard-heading'>{name}</h1>
              <div className='logoutButton' onClick={toggleModal}>
                <RiLogoutCircleRLine />
              </div>
            </div>
          </div>

          {isModalOpen && (
            <div id="poplogoutbtn" className="popup">
              <div>
                <p>Manage your account</p>
              </div>
              <p>Are you sure you want to logout?</p>
              <button onClick={logout} className="logout-button">Logout</button>

              <button className='logout-closeBtn' onClick={toggleModal}>Close</button>
            </div>
          )}
        </div>
        {Components && Components.map((item, index) =>
          <div key={index} style={flag === index + 1 ? { display: 'block' } : { display: 'none' }}>
            {item}
          </div>)}

      </div>
    </div>
  )
}

export default MainPage;