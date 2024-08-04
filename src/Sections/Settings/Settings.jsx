import React, { useEffect, useState } from 'react';

import 'react-toastify/dist/ReactToastify.css';
import LanguageSwitch from '../../LanguageSwitch';
import { useTranslation } from 'react-i18next';
import './settings.css';
import { push, ref, set,onValue} from 'firebase/database';
import { toast } from 'react-toastify';
import { useData } from '../../ApiData/ContextProvider';
import { Button, Modal } from 'react-bootstrap';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Plugins,Capacitor } from '@capacitor/core';
// import * as XLSX from 'xlsx';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';
import { write, utils } from 'xlsx';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver'; // Add file-saver to handle downloads


// import Reports from './Reports';


const Settings = () => {

  const { t } = useTranslation();

  const { userUid, firebase, activeBoysHostelButtons, activeGirlsHostelButtons, hostelData , girlsTenantsData, boysTenantsData,activeBoysHostel,activeGirlsHostel,boysExTenantsData, girlsExTenantsData } = useData();
  const { database } = firebase;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newBoysHostelName, setNewBoysHostelName] = useState('');
  const [newBoysHostelAddress, setNewBoysHostelAddress] = useState('');
  const [newGirlsHostelName, setNewGirlsHostelName] = useState('');
  const [newGirlsHostelAddress, setNewGirlsHostelAddress] = useState('');

  const [boysHostelImage, setBoysHostelImage] = useState('');
  const [girlsHostelImage, setGirlsHostelImage] = useState('');
  const [isBoysModalOpen, setIsBoysModalOpen] = useState(false);
  const [isGirlsModalOpen, setIsGirlsModalOpen] = useState(false);
  const [entireBoysData,setEntireBoysData] = useState([]);
  const [entireGirlsData,setEntireGirlsData] = useState([]);
  const [selectedHostelType,setSelectedHostelType] = useState("mens");
  const [vacatedEntireBoysData,setVacatedEntireBoysData] = useState([]);
  const [vacatedEntireGirlsData,setVacatedEnitreGirlsData] = useState([]);

  const [entireBoysYearExpensesData,setEntireBoysYearExpensesData] = useState([])
  const [entireGirlsYearExpensesData,setEntireGirlsYearExpensesData] = useState([])

  const getCurrentMonth = () => {
    const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    const currentMonth = new Date().getMonth();
    return monthNames[currentMonth];
  };

  const getCurrentYear = () => {
    return new Date().getFullYear().toString();
  };
  const [year,setYear] = useState(getCurrentYear());
  const [month,setMonth] = useState(getCurrentMonth())



  useEffect(()=>{
    const tenantsRef = ref(database, `Hostel/${userUid}/boys/${activeBoysHostel}/tenants`);
    onValue(tenantsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedTenants = data ? Object.keys(data).map(key => ({
        id: key,
        ...data[key],
      })) : [];
      setEntireBoysData(loadedTenants)
    });
  },[selectedHostelType,activeBoysHostel])

  useEffect(()=>{
    const tenantsRef = ref(database, `Hostel/${userUid}/girls/${activeGirlsHostel}/tenants`);
    onValue(tenantsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedTenants = data ? Object.keys(data).map(key => ({
        id: key,
        ...data[key],
      })) : [];
      setEntireGirlsData(loadedTenants)
    });
  },[selectedHostelType,activeGirlsHostel])


  useEffect(()=>{
    const tenantsRef = ref(database, `Hostel/${userUid}/boys/${activeBoysHostel}/extenants`);
    onValue(tenantsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedTenants = data ? Object.keys(data).map(key => ({
        id: key,
        ...data[key],
      })) : [];
      setVacatedEntireBoysData(loadedTenants)
    });
  },[selectedHostelType,activeBoysHostel])

  useEffect(()=>{
    const tenantsRef = ref(database, `Hostel/${userUid}/girls/${activeGirlsHostel}/extenants`);
    onValue(tenantsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedTenants = data ? Object.keys(data).map(key => ({
        id: key,
        ...data[key],
      })) : [];
      setVacatedEnitreGirlsData(loadedTenants)
    });
  },[selectedHostelType,activeGirlsHostel])




  useEffect(() => {
    const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    let total = 0;

    const fetchExpenses = async () => {
      const promises = monthNames.map(month => {
        const monthRef = ref(database, `Hostel/${userUid}/boys/${activeBoysHostel}/expenses/${year}-${month}`);
        return new Promise((resolve) => {
          onValue(monthRef, (snapshot) => {
            const expenses = snapshot.val();
            if (expenses) {
              resolve(expenses);
            } else {
              resolve(0);
            }
          }, {
            onlyOnce: true
          });
        });
      });

      const monthlyTotals = await Promise.all(promises);
      setEntireBoysYearExpensesData(monthlyTotals)
    };

    fetchExpenses();
  }, [selectedHostelType,activeBoysHostel]);

  useEffect(() => {
    const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    let total = 0;

    const fetchExpenses = async () => {
      const promises = monthNames.map(month => {
        const monthRef = ref(database, `Hostel/${userUid}/boys/${activeGirlsHostel}/expenses/${year}-${month}`);
        return new Promise((resolve) => {
          onValue(monthRef, (snapshot) => {
            const expenses = snapshot.val();
            if (expenses) {
              resolve(expenses);
            } else {
              resolve(0);
            }
          }, {
            onlyOnce: true
          });
        });
      });

      const monthlyTotals = await Promise.all(promises);
      setEntireGirlsYearExpensesData(monthlyTotals)
    };

    fetchExpenses();
  }, [selectedHostelType,activeGirlsHostel]);

  

  const [tenantsData, setTenantsData] = useState()

console.log(hostelData, "dataaa") 

  const capitalizeFirstLetter = (string) => {
    return string.replace(/\b\w/g, char => char.toUpperCase());
  };

  const validateAlphanumeric = (input) => {
    const regex = /^[A-Za-z\s]*$/;
    return regex.test(input);
  };

  const handleHostelNameChange = (e, isBoys) => {
    const value = e.target.value;
    if (validateAlphanumeric(value)) {
      if (isBoys) {
        setNewBoysHostelName(value);
      } else {
        setNewGirlsHostelName(value);
      }
    } else {
      toast.error("Hostel name must contain only alphabets.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const handleHostelChange = (e, isBoys) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error("Please select a file.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      if (isBoys) {
        setBoysHostelImage(dataUrl);
      } else {
        setGirlsHostelImage(dataUrl);
      }
    };
    reader.onerror = () => {
      toast.error("Failed to read file.", {
        position: "top-center",
        autoClose: 3000,
      });
    };
    reader.readAsDataURL(file);
  };

  const addNewHostel = (e, isBoys) => {
    e.preventDefault();
    setIsSubmitting(true);
    const name = isBoys ? capitalizeFirstLetter(newBoysHostelName) : capitalizeFirstLetter(newGirlsHostelName);
    const address = isBoys ? capitalizeFirstLetter(newBoysHostelAddress) : capitalizeFirstLetter(newGirlsHostelAddress);
    const hostelImage = isBoys ? boysHostelImage : girlsHostelImage;

    if (name.trim() === '' || address.trim() === '' || hostelImage.trim() === '') {
      toast.error("Hostel name, address and image cannot be empty.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    // Create a new reference with a unique ID
    const newHostelRef = push(ref(database, `Hostel/${userUid}/${isBoys ? 'boys' : 'girls'}`));
    const hostelDetails = {
      id: newHostelRef.key, // Store the unique key if needed
      name,
      address,
      hostelImage
    };

    set(newHostelRef, hostelDetails)
      .then(() => {
        toast.success(`New ${isBoys ? 'boys' : 'girls'} hostel '${name}' added successfully.`, {
          position: "top-center",
          autoClose: 3000,
        });
        if (isBoys) {
          setNewBoysHostelName('');
          setBoysHostelImage('');
          setNewBoysHostelAddress('');
          setIsBoysModalOpen(false);
        } else {
          setNewGirlsHostelName('');
          setGirlsHostelImage('');
          setNewGirlsHostelAddress('');
          setIsGirlsModalOpen(false);
        }
      })
      .catch(error => {
        toast.error("Failed to add new hostel: " + error.message, {
          position: "top-center",
          autoClose: 3000,
        });
      })
      .finally(() => {
        setIsSubmitting(false); // Reset isSubmitting to false when submission completes
      });
  };
  const handleModalClose = (isBoys) => {
    if (isBoys) {
      setNewBoysHostelName('');
      setNewBoysHostelAddress('');
      setBoysHostelImage('');
      setIsBoysModalOpen(false);
    } else {
      setNewGirlsHostelName('');
      setNewGirlsHostelAddress('');
      setGirlsHostelImage('');
      setIsGirlsModalOpen(false);
    }
  };

const handleReportBtn = async () => {
    const doc = new jsPDF();

    // Define columns for tenants with bikes
    const columnsWithBike = [
        { header: 'S.No', dataKey: 'sNo' },
        { header: 'Name', dataKey: 'name' },
        { header: 'Mobile Number', dataKey: 'mobileNo' },
        { header: 'Room/Bed No', dataKey: 'bedNo' },
        { header: 'Join Date', dataKey: 'dateOfJoin' },
        { header: 'Last Fee Date', dataKey: 'lastFeeDate' },
        { header: 'Due Date', dataKey: 'dueDate' },
        { header: 'Rent', dataKey: 'rents' },
        { header: 'Unpaid Amount', dataKey: 'unpaidAmount' },
        { header: 'Bike Number', dataKey: 'bikeNumber' }
    ];

    // Define columns for tenants without bikes
    const columnsWithoutBike = [
        { header: 'S.No', dataKey: 'sNo' },
        { header: 'Name', dataKey: 'name' },
        { header: 'Mobile Number', dataKey: 'mobileNo' },
        { header: 'Room/Bed No', dataKey: 'bedNo' },
        { header: 'Join Date', dataKey: 'dateOfJoin' },
        { header: 'Last Fee Date', dataKey: 'lastFeeDate' },
        { header: 'Due Date', dataKey: 'dueDate' },
        { header: 'Rent', dataKey: 'rents' },
        { header: 'Unpaid Amount', dataKey: 'unpaidAmount' }
    ];

    // Determine the data source based on the selected hostel type
    const dataToUse = selectedHostelType === "mens" ? entireBoysData : entireGirlsData;

    // Filter and map data
    const dataWithBike = dataToUse.filter(tenant => tenant.bikeNumber && tenant.bikeNumber !== 'NA').map((tenant, index) => {
        const rents = tenant.rents || {}; 
        const rentsData = Object.values(rents)[0] || {}; 

        return {
            sNo: index + 1,
            name: tenant.name || 'N/A',
            mobileNo: tenant.mobileNo || 'N/A',
            bedNo: tenant.bedNo || 'N/A',
            dateOfJoin: tenant.dateOfJoin || 'N/A',
            lastFeeDate: rentsData.paidDate || 'N/A',
            dueDate: rentsData.dueDate || 'N/A',
            rents: rentsData.totalFee || '0',
            unpaidAmount: rentsData.due || '0',
            bikeNumber: tenant.bikeNumber || 'N/A'
        };
    });

    const dataWithoutBike = dataToUse.filter(tenant => tenant.bikeNumber === 'NA').map((tenant, index) => {
        const rents = tenant.rents || {}; 
        const rentsData = Object.values(rents)[0] || {}; 

        return {
            sNo: index + 1,
            name: tenant.name || 'N/A',
            mobileNo: tenant.mobileNo || 'N/A',
            bedNo: tenant.bedNo || 'N/A',
            dateOfJoin: tenant.dateOfJoin || 'N/A',
            lastFeeDate: rentsData.paidDate || 'N/A',
            dueDate: rentsData.dueDate || 'N/A',
            rents: rentsData.totalFee || '0',
            unpaidAmount: rentsData.due || '0'
        };
    });

    // Add title for the report
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Tenants Report', doc.internal.pageSize.width / 2, 10, { align: 'center' });

    // Add title for tenants with bikes
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Tenants with Bike', 14, 25);

    // Generate the table for tenants with bikes
    doc.autoTable({
        startY: 30,
        margin: { top: 20 },
        theme: 'striped',
        styles: { fontSize: 8, textAlign: 'center', cellPadding: 1, halign: 'center' },
        columns: columnsWithBike,
        body: dataWithBike,
    });

    // Add a space between the tables
    const lastY = doc.lastAutoTable.finalY;
    doc.text('Tenants without Bike', 14, lastY + 10);

    // Generate the table for tenants without bikes
    doc.autoTable({
        startY: lastY + 15,
        margin: { top: 20 },
        theme: 'striped',
        styles: { fontSize: 8, textAlign: 'center', cellPadding: 1, halign: 'center' },
        columns: columnsWithoutBike,
        body: dataWithoutBike,
    });

    // Convert the PDF to a Blob
    const pdfOutput = doc.output('blob');

    if (Capacitor.isNativePlatform()) {
        // Convert Blob to base64
        const reader = new FileReader();
        reader.readAsDataURL(pdfOutput);
        reader.onloadend = async () => {
            const base64String = reader.result.split(',')[1]; // Remove the prefix

            try {
                // Write the file to the filesystem
                const result = await Filesystem.writeFile({
                    path: 'Tenants_Report.pdf',
                    data: base64String,
                    directory: Directory.Documents,
                    encoding: Encoding.Base64
                });
                console.log('File saved successfully:', result.uri);

                // Optionally open the file using the FileOpener plugin
                await FileOpener.open({
                    filePath: result.uri,
                    fileMimeType: 'application/pdf'
                });
            } catch (error) {
                console.error('Error saving file:', error);
            }
        };
        reader.onerror = (error) => {
            console.error('Error converting PDF to base64:', error);
        };
    } else {
        // For web environment, use the default download method
        const url = URL.createObjectURL(pdfOutput);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Tenants_Report.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

//  const handleVacatedReportBtn =() => {
//     const doc = new jsPDF();

//     // Define columns for tenants with bikes
//     const columnsWithBike = [
//         { header: 'S.No', dataKey: 'sNo' },
//         { header: 'Name', dataKey: 'name' },
//         { header: 'Mobile Number', dataKey: 'mobileNo' },
//         { header: 'Room/Bed No', dataKey: 'bedNo' },
//         { header: 'Join Date', dataKey: 'dateOfJoin' },
//         { header: 'Last Fee Date', dataKey: 'lastFeeDate' },
//         { header: 'Due Date', dataKey: 'dueDate' },
//         { header: 'Rent', dataKey: 'rents' },
//         { header: 'Unpaid Amount', dataKey: 'unpaidAmount' },
//         { header: 'Bike Number', dataKey: 'bikeNumber' }
//     ];

//     // Define columns for tenants without bikes
//     const columnsWithoutBike = [
//         { header: 'S.No', dataKey: 'sNo' },
//         { header: 'Name', dataKey: 'name' },
//         { header: 'Mobile Number', dataKey: 'mobileNo' },
//         { header: 'Room/Bed No', dataKey: 'bedNo' },
//         { header: 'Join Date', dataKey: 'dateOfJoin' },
//         { header: 'Last Fee Date', dataKey: 'lastFeeDate' },
//         { header: 'Due Date', dataKey: 'dueDate' },
//         { header: 'Rent', dataKey: 'rents' },
//         { header: 'Unpaid Amount', dataKey: 'unpaidAmount' }
//     ];

//     // Determine the data source based on the selected hostel type
//     const dataToUse = selectedHostelType === "mens" ? vacatedEntireBoysData : vacatedEntireGirlsData;

//     // Filter and map data
//     const dataWithBike = dataToUse.filter(tenant => tenant.bikeNumber && tenant.bikeNumber !== 'NA').map((tenant, index) => {
//         const rents = tenant.rents || {}; 
//         const rentsData = Object.values(rents)[0] || {}; 

//         return {
//             sNo: index + 1,
//             name: tenant.name || 'N/A',
//             mobileNo: tenant.mobileNo || 'N/A',
//             bedNo: tenant.bedNo || 'N/A',
//             dateOfJoin: tenant.dateOfJoin || 'N/A',
//             lastFeeDate: rentsData.paidDate || 'N/A',
//             dueDate: rentsData.dueDate || 'N/A',
//             rents: rentsData.totalFee || '0',
//             unpaidAmount: rentsData.due || '0',
//             bikeNumber: tenant.bikeNumber || 'N/A'
//         };
//     });

//     const dataWithoutBike = dataToUse.filter(tenant => tenant.bikeNumber === 'NA').map((tenant, index) => {
//         const rents = tenant.rents || {}; 
//         const rentsData = Object.values(rents)[0] || {}; 

//         return {
//             sNo: index + 1,
//             name: tenant.name || 'N/A',
//             mobileNo: tenant.mobileNo || 'N/A',
//             bedNo: tenant.bedNo || 'N/A',
//             dateOfJoin: tenant.dateOfJoin || 'N/A',
//             lastFeeDate: rentsData.paidDate || 'N/A',
//             dueDate: rentsData.dueDate || 'N/A',
//             rents: rentsData.totalFee || '0',
//             unpaidAmount: rentsData.due || '0'
//         };
//     });

//     // Add title for the report
//     doc.setFontSize(18);
//     doc.setFont('helvetica', 'bold');
//     doc.text('Vacated Tenants Report', doc.internal.pageSize.width / 2, 10, { align: 'center' });

//     // Add title for tenants with bikes
//     doc.setFontSize(12);
//     doc.setFont('helvetica', 'bold');
//     doc.text('Tenants with Bike', 14, 25);

//     // Generate the table for tenants with bikes
//     doc.autoTable({
//         startY: 30,
//         margin: { top: 20 },
//         theme: 'striped',
//         styles: { fontSize: 8, textAlign: 'center', cellPadding: 1, halign: 'center' },
//         columns: columnsWithBike,
//         body: dataWithBike,
//     });

//     // Add a space between the tables
//     const lastY = doc.lastAutoTable.finalY;
//     doc.text('Tenants without Bike', 14, lastY + 10);

//     // Generate the table for tenants without bikes
//     doc.autoTable({
//         startY: lastY + 15,
//         margin: { top: 20 },
//         theme: 'striped',
//         styles: { fontSize: 8, textAlign: 'center', cellPadding: 1, halign: 'center' },
//         columns: columnsWithoutBike,
//         body: dataWithoutBike,
//     });

//     // Save the PDF
//     doc.save('VacatedTenants_Report.pdf');

//   }


const handleVacatedReportBtn = async () => {
    const doc = new jsPDF();

    // Define columns for tenants with bikes
    const columnsWithBike = [
        { header: 'S.No', dataKey: 'sNo' },
        { header: 'Name', dataKey: 'name' },
        { header: 'Mobile Number', dataKey: 'mobileNo' },
        { header: 'Room/Bed No', dataKey: 'bedNo' },
        { header: 'Join Date', dataKey: 'dateOfJoin' },
        { header: 'Last Fee Date', dataKey: 'lastFeeDate' },
        { header: 'Due Date', dataKey: 'dueDate' },
        { header: 'Rent', dataKey: 'rents' },
        { header: 'Unpaid Amount', dataKey: 'unpaidAmount' },
        { header: 'Bike Number', dataKey: 'bikeNumber' }
    ];

    // Define columns for tenants without bikes
    const columnsWithoutBike = [
        { header: 'S.No', dataKey: 'sNo' },
        { header: 'Name', dataKey: 'name' },
        { header: 'Mobile Number', dataKey: 'mobileNo' },
        { header: 'Room/Bed No', dataKey: 'bedNo' },
        { header: 'Join Date', dataKey: 'dateOfJoin' },
        { header: 'Last Fee Date', dataKey: 'lastFeeDate' },
        { header: 'Due Date', dataKey: 'dueDate' },
        { header: 'Rent', dataKey: 'rents' },
        { header: 'Unpaid Amount', dataKey: 'unpaidAmount' }
    ];

    // Determine the data source based on the selected hostel type
    const dataToUse = selectedHostelType === "mens" ? vacatedEntireBoysData : vacatedEntireGirlsData;

    // Filter and map data
    const dataWithBike = dataToUse.filter(tenant => tenant.bikeNumber && tenant.bikeNumber !== 'NA').map((tenant, index) => {
        const rents = tenant.rents || {}; 
        const rentsData = Object.values(rents)[0] || {}; 

        return {
            sNo: index + 1,
            name: tenant.name || 'N/A',
            mobileNo: tenant.mobileNo || 'N/A',
            bedNo: tenant.bedNo || 'N/A',
            dateOfJoin: tenant.dateOfJoin || 'N/A',
            lastFeeDate: rentsData.paidDate || 'N/A',
            dueDate: rentsData.dueDate || 'N/A',
            rents: rentsData.totalFee || '0',
            unpaidAmount: rentsData.due || '0',
            bikeNumber: tenant.bikeNumber || 'N/A'
        };
    });

    const dataWithoutBike = dataToUse.filter(tenant => tenant.bikeNumber === 'NA').map((tenant, index) => {
        const rents = tenant.rents || {}; 
        const rentsData = Object.values(rents)[0] || {}; 

        return {
            sNo: index + 1,
            name: tenant.name || 'N/A',
            mobileNo: tenant.mobileNo || 'N/A',
            bedNo: tenant.bedNo || 'N/A',
            dateOfJoin: tenant.dateOfJoin || 'N/A',
            lastFeeDate: rentsData.paidDate || 'N/A',
            dueDate: rentsData.dueDate || 'N/A',
            rents: rentsData.totalFee || '0',
            unpaidAmount: rentsData.due || '0'
        };
    });

    // Add title for the report
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Vacated Tenants Report', doc.internal.pageSize.width / 2, 10, { align: 'center' });

    // Add title for tenants with bikes
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Tenants with Bike', 14, 25);

    // Generate the table for tenants with bikes
    doc.autoTable({
        startY: 30,
        margin: { top: 20 },
        theme: 'striped',
        styles: { fontSize: 8, textAlign: 'center', cellPadding: 1, halign: 'center' },
        columns: columnsWithBike,
        body: dataWithBike,
    });

    // Add a space between the tables
    const lastY = doc.lastAutoTable.finalY;
    doc.text('Tenants without Bike', 14, lastY + 10);

    // Generate the table for tenants without bikes
    doc.autoTable({
        startY: lastY + 15,
        margin: { top: 20 },
        theme: 'striped',
        styles: { fontSize: 8, textAlign: 'center', cellPadding: 1, halign: 'center' },
        columns: columnsWithoutBike,
        body: dataWithoutBike,
    });

    // Convert the PDF to a Blob
    const pdfOutput = doc.output('blob');

    if (Capacitor.isNativePlatform()) {
        // Convert Blob to base64
        const reader = new FileReader();
        reader.readAsDataURL(pdfOutput);
        reader.onloadend = async () => {
            const base64String = reader.result.split(',')[1]; // Remove the prefix

            try {
                // Write the file to the filesystem
                const result = await Filesystem.writeFile({
                    path: 'VacatedTenants_Report.pdf',
                    data: base64String,
                    directory: Directory.Documents,
                    encoding: Encoding.Base64
                });
                console.log('File saved successfully:', result.uri);

                // Optionally open the file using the FileOpener plugin
                await FileOpener.open({
                    filePath: result.uri,
                    fileMimeType: 'application/pdf'
                });
            } catch (error) {
                console.error('Error saving file:', error);
            }
        };
        reader.onerror = (error) => {
            console.error('Error converting PDF to base64:', error);
        };
    } else {
        // For web environment, use the default download method
        const url = URL.createObjectURL(pdfOutput);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'VacatedTenants_Report.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};






const monthMapping = {
  'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
  'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
};

// const handleExpensesGenerateBtn = () => {
//   const doc = new jsPDF();

//   // Define columns for monthly and yearly views
//   const monthlyColumns = [
//       { header: 'S.No', dataKey: 'sNo' },
//       { header: 'Expense Name', dataKey: 'expensename' },
//       { header: 'Expense Amount', dataKey: 'expenseamount' },
//       { header: 'Date', dataKey: 'date' }
//   ];

//   const yearlyColumns = [
//       { header: 'S.No', dataKey: 'sNo' },
//       { header: 'Expense Name', dataKey: 'expensename' },
//       { header: 'Expense Amount', dataKey: 'expenseamount' },
//       { header: 'Date', dataKey: 'date' }
//   ];

//   // Determine the data source based on the selected hostel type
//   const dataToUse = selectedHostelType === "mens" ? entireBoysYearExpensesData : entireGirlsYearExpensesData;

//   // Convert month name to number
//   const newMonth = monthMapping[month.toLowerCase()];

//   if (month !== "" && year) {
//       // Monthly Report
//       const filteredData = [];
//       dataToUse.forEach(item => {
//           if (typeof(item) === 'object' && item !== null) {
//               Object.keys(item).forEach(key => {
//                   const expenseData = item[key];
//                   if (expenseData && expenseData.expenseDate) {
//                       const expenseDate = new Date(expenseData.expenseDate);
//                       if (expenseDate.getFullYear() === parseInt(year) && expenseDate.getMonth() === newMonth) {
//                           filteredData.push({
//                               expensename: expenseData.expenseName,
//                               expenseamount: expenseData.expenseAmount,
//                               date: expenseDate.toLocaleDateString()
//                           });
//                       }
//                   }
//               });
//           }
//       });

//       console.log("Filtered Data:", filteredData); // Check the filtered data

//       if (filteredData.length > 0) {
//           // Add heading for monthly report
//           const monthName = Object.keys(monthMapping).find(key => monthMapping[key] === newMonth);
//           doc.setFontSize(16);
//           doc.text(`${monthName.charAt(0).toUpperCase() + monthName.slice(1)} Expenses`, 105, 20, { align: 'center' });

//           // Create table for specific month
//           doc.autoTable({
//               startY: 30, // Adjust starting Y position to leave space for heading
//               head: [monthlyColumns.map(col => col.header)],
//               body: filteredData.map((row, index) => ([
//                   index + 1,
//                   row.expensename,
//                   row.expenseamount,
//                   row.date
//               ])),
//               theme: 'grid'
//           });

//           const totalAmount = filteredData.reduce((acc, item) => acc + item.expenseamount, 0);
//           doc.text(`Total Expenses: ${totalAmount}`, 10, doc.lastAutoTable.finalY + 10);

//           // Save file with month in filename
//           doc.save(`${monthName}_expenses.pdf`);
//       } else {
//           doc.setFontSize(16);
//           const monthName = Object.keys(monthMapping).find(key => monthMapping[key] === newMonth);
//           doc.text(`${monthName.charAt(0).toUpperCase() + monthName.slice(1)} Expenses`, 105, 20, { align: 'center' });

//           // Create an empty table
//           doc.autoTable({
//               startY: 30, // Adjust starting Y position to leave space for heading
//               head: [monthlyColumns.map(col => col.header)],
//               body: [['', '', '', '']],
//               theme: 'grid'
//           });

//           doc.text('No expenses found for the selected month and year.', 10, doc.lastAutoTable.finalY + 10);
//           doc.save(`${monthName}_expenses.pdf`);
//       }
//   } else if (year) {
//       // Yearly Report
//       const expensesByMonth = {};
//       const months = Object.keys(monthMapping);

//       dataToUse.forEach(item => {
//           if (typeof(item) === 'object' && item !== null) {
//               Object.keys(item).forEach(key => {
//                   const expenseData = item[key];
//                   if (expenseData && expenseData.expenseDate) {
//                       const expenseDate = new Date(expenseData.expenseDate);
//                       if (expenseDate.getFullYear() === parseInt(year)) {
//                           const month = months[expenseDate.getMonth()];
//                           if (!expensesByMonth[month]) {
//                               expensesByMonth[month] = [];
//                           }
//                           expensesByMonth[month].push({
//                               expenseName: expenseData.expenseName,
//                               expenseAmount: expenseData.expenseAmount,
//                               date: expenseDate.toLocaleDateString()
//                           });
//                       }
//                   }
//               });
//           }
//       });

//       // Add heading for yearly report
//       doc.setFontSize(16);
//       doc.text('Yearly Expenses', 105, 20, { align: 'center' });

//       let grandTotal = 0;
//       let startY = 30;

//       months.forEach((month, index) => {
//           let monthTotal = 0;

//           // Add heading for each month's table
//           doc.setFontSize(14);
//           doc.text(`${month.charAt(0).toUpperCase() + month.slice(1)} Expenses`, 10, startY);

//           if (expensesByMonth[month] && expensesByMonth[month].length > 0) {
//               // Create table for each month with expenses
//               doc.autoTable({
//                   startY: startY + 10,
//                   head: [yearlyColumns.map(col => col.header)],
//                   body: expensesByMonth[month].map((item, itemIndex) => ([
//                       itemIndex + 1,
//                       item.expenseName,
//                       item.expenseAmount,
//                       item.date
//                   ])),
//                   theme: 'grid'
//               });

//               monthTotal = expensesByMonth[month].reduce((acc, item) => acc + item.expenseAmount, 0);
//               doc.text(`Total for ${month}: ${monthTotal}`, 10, doc.lastAutoTable.finalY + 10);
//               grandTotal += monthTotal;
//               startY = doc.lastAutoTable.finalY + 20;
//           } else {
//               // Create an empty table for months with no expenses
//               doc.autoTable({
//                   startY: startY + 10,
//                   head: [yearlyColumns.map(col => col.header)],
//                   body: [['', '', '', '']],
//                   theme: 'grid'
//               });
//               doc.setFontSize(8);
//               doc.text('No expenses found for this month.', 10, doc.lastAutoTable.finalY + 10);
//               startY = doc.lastAutoTable.finalY + 20;
//           }
//       });

//       // Add grand total
//       doc.setFontSize(14);
//       doc.text(`Grand Total: ${grandTotal}`, 10, startY + 2);

//       // Save file with year in filename
//       doc.save(`${year}_expenses.pdf`);
//   }
// };


const { Filesystem,FilesystemDirectory } = Plugins;

const handleExpensesGenerateBtn = async () => {
  const doc = new jsPDF();

  // Define columns for monthly and yearly views
  const columns = [
      { header: 'S.No', dataKey: 'sNo' },
      { header: 'Expense Name', dataKey: 'expensename' },
      { header: 'Expense Amount', dataKey: 'expenseamount' },
      { header: 'Date', dataKey: 'date' }
  ];

  // Determine the data source based on the selected hostel type
  const dataToUse = selectedHostelType === "mens" ? entireBoysYearExpensesData : entireGirlsYearExpensesData;

  // Convert month name to number
  const newMonth = monthMapping[month.toLowerCase()];

  if (month !== "" && year) {
      // Monthly Report
      const filteredData = [];
      dataToUse.forEach(item => {
          if (typeof item === 'object' && item !== null) {
              Object.keys(item).forEach(key => {
                  const expenseData = item[key];
                  if (expenseData && expenseData.expenseDate) {
                      const expenseDate = new Date(expenseData.expenseDate);
                      if (expenseDate.getFullYear() === parseInt(year) && expenseDate.getMonth() === newMonth) {
                          filteredData.push({
                              expensename: expenseData.expenseName,
                              expenseamount: parseFloat(expenseData.expenseAmount) || 0,
                              date: expenseDate.toLocaleDateString()
                          });
                      }
                  }
              });
          }
      });

      if (filteredData.length > 0) {
          // Add heading for monthly report
          const monthName = Object.keys(monthMapping).find(key => monthMapping[key] === newMonth);
          doc.setFontSize(16);
          doc.text(`${monthName.charAt(0).toUpperCase() + monthName.slice(1)} Expenses`, 105, 20, { align: 'center' });

          // Create table for specific month
          doc.autoTable({
              startY: 30, // Adjust starting Y position to leave space for heading
              head: [columns.map(col => col.header)],
              body: filteredData.map((row, index) => ([
                  index + 1,
                  row.expensename,
                  row.expenseamount.toFixed(2),
                  row.date
              ])),
              theme: 'grid'
          });

          const totalAmount = filteredData.reduce((acc, item) => acc + item.expenseamount, 0);
          doc.text(`Total Expenses: ${totalAmount.toFixed(2)}`, 10, doc.lastAutoTable.finalY + 10);

          // Save file with month in filename
          await savePDF(doc, `${monthName}_expenses.pdf`);
      } else {
          doc.setFontSize(16);
          const monthName = Object.keys(monthMapping).find(key => monthMapping[key] === newMonth);
          doc.text(`${monthName.charAt(0).toUpperCase() + monthName.slice(1)} Expenses`, 105, 20, { align: 'center' });

          // Create an empty table
          doc.autoTable({
              startY: 30, // Adjust starting Y position to leave space for heading
              head: [columns.map(col => col.header)],
              body: [['', '', '', '']],
              theme: 'grid'
          });

          doc.text('No expenses found for the selected month and year.', 10, doc.lastAutoTable.finalY + 10);
          await savePDF(doc, `${monthName}_expenses.pdf`);
      }
  } else if (year) {
      // Yearly Report
      const expensesByMonth = {};
      const months = Object.keys(monthMapping);

      dataToUse.forEach(item => {
          if (typeof item === 'object' && item !== null) {
              Object.keys(item).forEach(key => {
                  const expenseData = item[key];
                  if (expenseData && expenseData.expenseDate) {
                      const expenseDate = new Date(expenseData.expenseDate);
                      if (expenseDate.getFullYear() === parseInt(year)) {
                          const month = months[expenseDate.getMonth()];
                          if (!expensesByMonth[month]) {
                              expensesByMonth[month] = [];
                          }
                          expensesByMonth[month].push({
                              expenseName: expenseData.expenseName,
                              expenseAmount: parseFloat(expenseData.expenseAmount) || 0,
                              date: expenseDate.toLocaleDateString()
                          });
                      }
                  }
              });
          }
      });

      // Add heading for yearly report
      doc.setFontSize(16);
      doc.text('Yearly Expenses', 105, 20, { align: 'center' });

      let grandTotal = 0;
      let startY = 30;

      months.forEach((month, index) => {
          let monthTotal = 0;

          // Add heading for each month's table
          doc.setFontSize(14);
          doc.text(`${month.charAt(0).toUpperCase() + month.slice(1)} Expenses`, 10, startY);

          if (expensesByMonth[month] && expensesByMonth[month].length > 0) {
              // Create table for each month with expenses
              doc.autoTable({
                  startY: startY + 10,
                  head: [columns.map(col => col.header)],
                  body: expensesByMonth[month].map((item, itemIndex) => ([
                      itemIndex + 1,
                      item.expenseName,
                      item.expenseAmount.toFixed(2),
                      item.date
                  ])),
                  theme: 'grid'
              });

              monthTotal = expensesByMonth[month].reduce((acc, item) => acc + item.expenseAmount, 0);
              doc.text(`Total for ${month}: ${monthTotal.toFixed(2)}`, 10, doc.lastAutoTable.finalY + 10);
              grandTotal += monthTotal;
              startY = doc.lastAutoTable.finalY + 20;
          } else {
              // Create an empty table for months with no expenses
              doc.autoTable({
                  startY: startY + 10,
                  head: [columns.map(col => col.header)],
                  body: [['', '', '', '']],
                  theme: 'grid'
              });
              doc.setFontSize(8);
              doc.text('No expenses found for this month.', 10, doc.lastAutoTable.finalY + 10);
              startY = doc.lastAutoTable.finalY + 20;
          }
      });

      // Add grand total
      doc.setFontSize(14);
      doc.text(`Grand Total: ${grandTotal.toFixed(2)}`, 10, startY + 2);

      // Save file with year in filename
      await savePDF(doc, `${year}_expenses.pdf`);
  }
};

const savePDF = async (doc, filename) => {
  const isMobile = Capacitor.isNativePlatform();

  if (isMobile) {
      // Generate PDF as Blob
      const pdfData = doc.output('blob');
      const reader = new FileReader();

      reader.onload = async () => {
          const base64Data = reader.result.split(',')[1];

          await Filesystem.writeFile({
              path: filename,
              data: base64Data,
              directory: FilesystemDirectory.Documents,
              recursive: true
          });

          // Optionally, you can open the file after saving
          await Filesystem.getUri({
              directory: FilesystemDirectory.Documents,
              path: filename
          }).then(result => {
              const path = result.uri;
              Capacitor.Plugins.FileOpener.open({
                  path,
                  mimeType: 'application/pdf'
              });
          });
      };

      reader.readAsDataURL(pdfData);
  } else {
      // For web
      doc.save(filename);
  }
};






// excel code 



const handleTenantBtnExcel = async () => {
    const dataToUse = selectedHostelType === "mens" ? boysTenantsData : girlsTenantsData;

    const flatData = dataToUse.map(item => {
        const flatRents = Object.entries(item.rents || { NA: {} }).map(([rentId, rent]) => ({
            PaidAmount: rent.paidAmount || "NA",
            Due: rent.due || "NA",
            DueDate: rent.dueDate || "NA",
            PaidDate: rent.paidDate || "NA",
            Status: rent.status || "NA",
            TotalFee: rent.totalFee || "NA",
        }));

        return flatRents.map(flatRent => ({
            Room: item.roomNo || "NA",
            Bed: item.bedNo || "NA",
            Name: item.name || "NA",
            Address: item.permnentAddress || "NA",
            bikeNumber: item.bikeNumber || "NA",
            DateOfJoin: item.dateOfJoin || "NA",
            Emergency: item.emergencyContact || "NA",
            Id: item.idNumber || "NA",
            Mobile: item.mobileNo || "NA",
            Status: item.status || "NA",
            ...flatRent // Spread the flattened rent information
        }));
    }).flat();

    // Create a new workbook and a worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(flatData);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tenants');

    // Generate a binary Excel file
    const fileData = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

    if (Capacitor.isNativePlatform()) {
        // Convert array buffer to base64
        const reader = new FileReader();
        reader.readAsDataURL(new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
        reader.onloadend = async () => {
            const base64String = reader.result.split(',')[1]; // Remove the prefix

            try {
                // Write the file to the filesystem
                const result = await Filesystem.writeFile({
                    path: 'tenants_data.xlsx',
                    data: base64String,
                    directory: Directory.Documents,
                    encoding: Encoding.Base64
                });
                console.log('File saved successfully:', result.uri);

                // Optionally open the file using the FileOpener plugin
                await FileOpener.open({
                    filePath: result.uri,
                    fileMimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });
            } catch (error) {
                console.error('Error saving file:', error);
            }
        };
        reader.onerror = (error) => {
            console.error('Error converting Excel to base64:', error);
        };
    } else {
        // For web environment, use the default download method
        try {
            // Convert array buffer to blob
            const blob = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            
            // Use FileSaver to trigger download
            saveAs(blob, 'tenants_data.xlsx');
        } catch (error) {
            console.error('Error saving file:', error);
        }
    }
};


// const handleTenantBtnExcel = async () => {
//     const dataToUse = selectedHostelType === "mens" ? boysTenantsData : girlsTenantsData;

//     const flatData = dataToUse.map(item => {
//         const flatRents = Object.entries(item.rents || {NA:{}}).map(([rentId, rent]) => ({
//             PaidAmount: rent.paidAmount || "NA",
//             Due: rent.due || "NA",
//             DueDate: rent.dueDate || "NA",
//             PaidDate: rent.paidDate || "NA",
//             Status: rent.status || "NA",
//             TotalFee: rent.totalFee || "NA",
//         }));

//         return flatRents.map(flatRent => ({
//             Room: item.roomNo || "NA",
//             Bed: item.bedNo || "NA",
//             Name: item.name || "NA",
//             Address: item.permnentAddress || "NA",
//             bikeNumber: item.bikeNumber || "NA",
//             DateOfJoin: item.dateOfJoin || "NA",
//             Emergency: item.emergencyContact || "NA",
//             Id: item.idNumber || "NA",
//             Mobile: item.mobileNo || "NA",
//             Status: item.status || "NA",
//             ...flatRent // Spread the flattened rent information
//         }));
//     }).flat();

//     // Create a new workbook and a worksheet
//     const workbook = XLSX.utils.book_new();
//     const worksheet = XLSX.utils.json_to_sheet(flatData);

//     // Add the worksheet to the workbook
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Tenants');

//     // Generate a binary Excel file
//     const fileData = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

//     // Use file-saver to download the file
//     try {
//         // Convert array buffer to blob
//         const blob = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
//         // Use FileSaver to trigger download
//         saveAs(blob, 'tenants_data.xlsx');
//     } catch (error) {
//         console.error('Error saving file:', error);
//     }
// };

const handleVacatedBtnExcel = async () => {
    const dataToUse = selectedHostelType === "mens" ? boysExTenantsData : girlsExTenantsData;

    const flatData = dataToUse.map(item => {
        const flatRents = Object.entries(item.rents || { NA: {} }).map(([rentId, rent]) => ({
            PaidAmount: rent.paidAmount || "NA",
            Due: rent.due || "NA",
            DueDate: rent.dueDate || "NA",
            PaidDate: rent.paidDate || "NA",
            Status: rent.status || "NA",
            TotalFee: rent.totalFee || "NA",
        }));

        return flatRents.map(flatRent => ({
            Room: item.roomNo || "NA",
            Bed: item.bedNo || "NA",
            Name: item.name || "NA",
            Address: item.permnentAddress || "NA",
            bikeNumber: item.bikeNumber || "NA",
            DateOfJoin: item.dateOfJoin || "NA",
            Emergency: item.emergencyContact || "NA",
            Id: item.idNumber || "NA",
            Mobile: item.mobileNo || "NA",
            Status: item.status || "NA",
            ...flatRent // Spread the flattened rent information
        }));
    }).flat();

    // Create a new workbook and a worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(flatData);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tenants');

    // Generate a binary Excel file
    const fileData = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

    if (Capacitor.isNativePlatform()) {
        // Convert array buffer to base64
        const reader = new FileReader();
        reader.readAsDataURL(new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
        reader.onloadend = async () => {
            const base64String = reader.result.split(',')[1]; // Remove the prefix

            try {
                // Write the file to the filesystem
                const result = await Filesystem.writeFile({
                    path: 'vacated_tenants_data.xlsx',
                    data: base64String,
                    directory: Directory.Documents,
                    encoding: Encoding.Base64
                });
                console.log('File saved successfully:', result.uri);

                // Optionally open the file using the FileOpener plugin
                await FileOpener.open({
                    filePath: result.uri,
                    fileMimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });
            } catch (error) {
                console.error('Error saving file:', error);
            }
        };
        reader.onerror = (error) => {
            console.error('Error converting Excel to base64:', error);
        };
    } else {
        // For web environment, use the default download method
        try {
            // Convert array buffer to blob
            const blob = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            
            // Use FileSaver to trigger download
            saveAs(blob, 'vacated_tenants_data.xlsx');
        } catch (error) {
            console.error('Error saving file:', error);
        }
    }
};












const handleChangeHostelType =(e)=>{
    setSelectedHostelType(e.target.value);
  }


 


  return (
    <div className="settings">
      <h1 className='settingsPageHeading'>{t('menuItems.settings')}</h1>
      <div className="settings-top">
        <div className="language-switch-section">
          <label className='settingsHeading' htmlFor="language-selector">{t("settings.languages")} </label>
          <LanguageSwitch id="language-selector" />
        </div>
        
      </div>
      <div className='mt-4'>
        {
          activeBoysHostelButtons.length > 0 ? '' :
            <div className='d-flex  align-items-center'>
              <h5 className="addHostelTextBtn">{t('settings.addboysHostel')}</h5><button className="addHostelBtn" onClick={() => setIsBoysModalOpen(true)}>{t("settings.addHostel")}</button>
            </div>
        }
        {
          activeGirlsHostelButtons.length > 0 ? '' :
            <div className='d-flex  align-items-center'>
              <h5 className="addHostelTextBtn">{t('settings.addGirlsHostel')}</h5><button className="addHostelBtn" onClick={() => setIsGirlsModalOpen(true)}>{t("settings.addHostel")}</button>
            </div>
        }

        {/* ================== */}

        <Modal show={isBoysModalOpen} onHide={() => handleModalClose(true)}>
          <Modal.Header closeButton>
            <Modal.Title>{t("settings.addboysHostel")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={(e) => addNewHostel(e, true)}>
              <div className="form-group">
                <label htmlFor="newBoysHostelName">{t("settings.hostelName")}</label>
                <input
                  type="text"
                  className="form-control"
                  id="newBoysHostelName"
                  placeholder={t("settings.hostelName")}
                  value={newBoysHostelName}
                  onChange={(e) => handleHostelNameChange(e, true)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="newBoysHostelAddress">{t("settings.hostelAddress")}</label>
                <input
                  type="text"
                  className="form-control"
                  id="newBoysHostelAddress"
                  placeholder={t("settings.hostelAddress")}
                  value={newBoysHostelAddress}
                  onChange={(e) => setNewBoysHostelAddress(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="Hostel Image" className="form-label">{t('settings.hostelImage')}</label>
                <input type="file" className="form-control" onChange={(e) => handleHostelChange(e, true)} />
              </div>
              <div className='mt-3 d-flex justify-content-between'>
                <Button variant="primary" style={{ marginRight: '10px' }} type="submit" disabled={isSubmitting}>{isSubmitting ? 'Adding...' : t("settings.addHostel")}</Button>
                <Button variant="secondary" onClick={() => handleModalClose(true)}>{t("settings.close")}</Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>

        <Modal show={isGirlsModalOpen} onHide={() => handleModalClose(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{t("settings.addGirlsHostel")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={(e) => addNewHostel(e, false)}>
              <div className="form-group">
                <label htmlFor="newGirlsHostelName">{t("settings.hostelName")}</label>
                <input
                  type="text"
                  className="form-control"
                  id="newGirlsHostelName"
                  placeholder={t("settings.hostelName")}
                  value={newGirlsHostelName}
                  onChange={(e) => handleHostelNameChange(e, false)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="newGirlsHostelAddress">{t("settings.hostelAddress")}</label>
                <input
                  type="text"
                  className="form-control"
                  id="newGirlsHostelAddress"
                  placeholder={t("settings.hostelAddress")}
                  value={newGirlsHostelAddress}
                  onChange={(e) => setNewGirlsHostelAddress(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="Hostel Image" className="form-label">{t('settings.hostelImage')}</label>
                <input type="file" className="form-control" onChange={(e) => handleHostelChange(e, false)} />
              </div>
              <div className='mt-3 d-flex justify-content-between'>
                <Button variant="primary" type="submit" style={{ marginRight: '10px' }} disabled={isSubmitting}>{isSubmitting ? 'Adding...' : t("settings.addHostel")}</Button>
                <Button variant="secondary" onClick={() => handleModalClose(false)}>{t("settings.close")}</Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </div>
      <h1 className='settingsHeading'>{t('settings.generateReport')}</h1>
      <div className="hostelTypeDropDown">
      <p className='selectTypeText'>{t('settings.selectHostelType')}</p>
      <select className='languageDropdown' value={selectedHostelType} onChange={handleChangeHostelType}>
        <option value="mens" >{t('dashboard.mens')}</option>
        <option value="girls">{t('dashboard.womens')}</option>
      </select>
      </div>
      <h1 className='settingsSideHeading'>{t('settings.tenantsReport')}</h1>
     
      <button className='reportsButton' onClick={handleReportBtn}>{t('settings.generatePdf')}</button>
      <button className='reportsButton' onClick={handleTenantBtnExcel}>{t('settings.generateExcel')}</button>
      <h2  className='settingsSideHeading'>{t('settings.vacatedTenantsReport')}</h2>
      <button className='reportsButton' onClick={handleVacatedReportBtn}>{t('settings.generatePdf')}</button>
      <button className='reportsButton' onClick={handleVacatedBtnExcel}>{t('settings.generateExcel')}</button>

      <h2  className='settingsSideHeading'>{t('settings.expensesReport')}</h2>
      <select className='languageDropdown dropDownMbl' value={year} onChange={e => setYear(e.target.value)}>
              
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2022">2026</option>
                <option value="2023">2027</option>
                <option value="2022">2028</option>
               
              </select>

              <select className='languageDropdown dropDownMblMonth' value={month} onChange={e => { setMonth(e.target.value) }}>
                <option value="">None</option>
                <option value="jan">{t('months.jan')}</option>
                <option value="feb">{t('months.feb')}</option>
                <option value="mar">{t('months.mar')}</option>
                <option value="apr">{t('months.apr')}</option>
                <option value="may">{t('months.may')}</option>
                <option value="jun">{t('months.jun')}</option>
                <option value="jul">{t('months.jul')}</option>
                <option value="aug">{t('months.aug')}</option>
                <option value="sep">{t('months.sep')}</option>
                <option value="oct">{t('months.oct')}</option>
                <option value="nov">{t('months.nov')}</option>
                <option value="dec">{t('months.dec')}</option>
              </select>
              <br />
     <button className='reportsButton expensesBtn' onClick={handleExpensesGenerateBtn}>{t('settings.generatePdf')}</button>
    </div>
  );
};

export default Settings;
