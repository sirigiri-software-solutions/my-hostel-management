// import React, { useState } from 'react'
// import DashboardImage from '../../images/Icons (1).png'
// import RoomsImage from '../../images/Icons (2).png'
// import BedsImage from '../../images/Icons (3).png'
// import TenantsImage from '../../images/Icons (4).png'
// import ExpensesImage from '../../images/Icons (5).png'
// import RentImage from '../../images/Icons (6).png'
// import SettingsImage from '../../images/Icons (7).png'
// import logo from '../../images/Kiran Reddy Boys Hostel 1.png'
// // import { NavLink } from 'react-router-dom'
// import Dashboard from '../../Sections/Dashboard/Dashboard'
// import Beds from '../../Sections/Beds/Beds'
// import Rooms from '../../Sections/Rooms/Rooms'
// import Expenses from '../../Sections/Expenses/Expenses'
// import Rent from '../../Sections/Rents/Rents'
// import Tenants from '../../Sections/Tenants/Tenants'
// import Settings from '../../Sections/Settings/Settings'
// const Sidebar = () => {

//   const menuItems = [
//     {
//       id: 1,
//       path: "/",
//       name: "Dashboard",
//       icon: DashboardImage
//     },
//     {
//       id: 2,
//       path: "/rooms",
//       name: "Rooms",
//       icon: RoomsImage
//     },
//     {
//       id: 3,
//       path: "/beds",
//       name: "Beds",
//       icon: BedsImage
//     },
//     {
//       id: 4,
//       path: "/rent",
//       name: "Rent",
//       icon: RentImage
//     },
//     {
//       id: 5,
//       path: "/tenants",
//       name: "Tenants",
//       icon: TenantsImage
//     },
//     {
//       id: 6,
//       path: "/expenses",
//       name: "Expenses",
//       icon: ExpensesImage
//     },
//     {
//       id: 7,
//       path: "/Settings",
//       name: "Settings",
//       icon: SettingsImage
//     },
//   ]

//   // const Components = [<Dashboard />, <Rooms />, <Beds />, <Rent />, <Tenants />, <Expenses />, <Settings />]

//   // const [flag, setFlag] = useState(1);

//   // const handlesideBar = (value) => {
//   //   setFlag(value);
//   // }

// console.log(flag, 'flag')

//   return (
//     <div className='bg-container' style={{ display: 'flex', width: '100%', margin: "0px" }}>
//       <div className='d-flex flex-column justify-content-center sidebar' style={{ minWidth: 'auto', backgroundColor: "#ECECEC", padding: "20px", borderRadius: "0px 80px 80px 0px" }}>
//         <div className='top-section text-center'>
//           <img src={logo} alt="logo" className='logo' />
//         </div>
//         {
//           menuItems.map((item, index) => (
//             <div key={index} className="link" 
//             // style={flag === item.id ? { backgroundColor: 'hsla(30, 100%, 50%, 0.41)', borderRadius: '10px' } : { borderRadius: '0' }} onClick={() => handlesideBar(item.id)}
//             >
//               <a href={item.path}>
//               <img src={item.icon} alt={item.name} className='icon' />
//               <div className='link-text'>{item.name}</div>
//               </a>
            
//             </div>
//           ))
//         }
//       </div>

//       {/* 
//       <div style={{ minWidth: '86%', padding: "10px" }}>
//         {Components && Components.map((item, index) => <div key={index} style={flag === index + 1 ? { display: 'block' } : { display: 'none' }}>{item}</div>)}
//       </div> 
//       */}

//     </div>
//   )
// }

// export default Sidebar