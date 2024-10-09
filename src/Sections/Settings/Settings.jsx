import React, { useEffect, useState } from 'react';

import 'react-toastify/dist/ReactToastify.css';
import LanguageSwitch from '../../LanguageSwitch';
import { useTranslation } from 'react-i18next';
import './settings.css';
import { push, ref, set, onValue } from 'firebase/database';
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
import imageCompression from 'browser-image-compression';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { Camera, CameraResultType } from '@capacitor/camera';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
// import { Capacitor } from '@capacitor/core';

const Settings = () => {

  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const { activeBoysHostelName,activeGirlsHostelName,userUid, firebase, activeBoysHostelButtons, activeGirlsHostelButtons,girlsTenants, boysTenants, activeBoysHostel, activeGirlsHostel, boysExTenantsData, girlsExTenantsData, expensesInteracted, activeFlag, changeActiveFlag,entireHMAdata, fetchData } = useData();
  const { database,storage } = firebase;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newBoysHostelName, setNewBoysHostelName] = useState('');
  const [newBoysHostelAddress, setNewBoysHostelAddress] = useState('');
  const [newGirlsHostelName, setNewGirlsHostelName] = useState('');
  const [newGirlsHostelAddress, setNewGirlsHostelAddress] = useState('');

  const [boysHostelImage, setBoysHostelImage] = useState('');
  const [girlsHostelImage, setGirlsHostelImage] = useState('');
  const [isBoysModalOpen, setIsBoysModalOpen] = useState(false);
  const [isGirlsModalOpen, setIsGirlsModalOpen] = useState(false);
  const [selectedHostelType, setSelectedHostelType] = useState("mens");
  const [entireBoysYearExpensesData, setEntireBoysYearExpensesData] = useState([])
  const [entireGirlsYearExpensesData, setEntireGirlsYearExpensesData] = useState([]);
  const [hostelImageUrl, setHostelImageUrl] = useState('');
  let activeToastId=null;

  const [photoUrl, setPhotoUrl] = useState('');
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const[isCameraUsed,setIsCameraUsed]=useState(false);
  const isMobile = Capacitor.isNativePlatform(); // Detect if running on mobile
 
  const getCurrentMonth = () => {
    const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    const currentMonth = new Date().getMonth();
    return monthNames[currentMonth];
  };

  const getCurrentYear = () => {
    return new Date().getFullYear().toString();
  };
  const [year, setYear] = useState(getCurrentYear());
  const [month, setMonth] = useState(getCurrentMonth())
  


  
  const takePicture = async (isBoys, name) => {
    if (!isMobile) {
        console.error("Camera access is not supported on your device.");
        return;
    }
    if (isFileUploaded) {
        setErrorMessage((prevErrors) => ({
            ...prevErrors,
            hostelImage: "You've already uploaded a photo from the file manager.",
        }));
        return;
    }
    try {
        const photo = await Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.Uri
        });

        const response = await fetch(photo.webPath);
        const blob = await response.blob();

        // Set image state based on whether it's a boys' or girls' hostel
        if (isBoys) {
            setBoysHostelImage(blob);
        } else {
            setGirlsHostelImage(blob);
        }

        const uploadFile = async (file, path) => {
            try {
                const imageRef = storageRef(storage, path);
                const snapshot = await uploadBytes(imageRef, file);
                return await getDownloadURL(snapshot.ref);
            } catch (error) {
                console.error(`Error uploading file ${file.name}:`, error);
                throw error;
            }
        };

        // Construct the path for storage
        const uploadedUrl = await uploadFile(blob, `Hostel/${userUid}/${isBoys ? 'boys' : 'girls'}/${name}`);
        setPhotoUrl(uploadedUrl); // Set the uploaded URL to display the image

        // After successful upload
        setIsCameraUsed(true);
        setIsFileUploaded(false); // Indicate that a file has been uploaded from the camera
    } catch (error) {
        console.error("Error accessing the camera", error);
        // Optionally show a toast error message here
    }
};



  // const fetchExpensesData = (hostelType, hostel) => {
  //   const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

    

  //   const entireYearData = [];
    
  //   monthNames.forEach(month => {
  //     console.log(entireHMAdata, "hhh")
  //     console.log(userUid, "hhh")
  //     const expensesData = entireHMAdata[userUid]?.[hostelType]?.[hostel]?.expenses?.[`${year}-${month}`];
  //     if (expensesData !== undefined && expensesData !== null) {
  //       entireYearData.push(expensesData);
  //   } else {
  //       entireYearData.push(0);
  //   }
  //   })
  //   return entireYearData;
  // };

  const fetchExpensesData = (hostelType, hostel) => {
    const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    const entireYearData = [];
  
    monthNames.forEach(month => {
      const hostelData = entireHMAdata?.[hostelType]?.[hostel];
      if (!hostelData || !hostelData.expenses) {
        entireYearData.push(0);
        return;
      }
  
      const expensesData = hostelData.expenses[`${year}-${month}`];
      if (expensesData !== undefined && expensesData !== null) {
        entireYearData.push(expensesData);
      } else {
        entireYearData.push(0);
      }
    });
  
    return entireYearData;
  };
  

  useEffect(() => {
    const fetchExpenses = () => {
      const data = fetchExpensesData(selectedHostelType === 'mens' ? 'boys' : 'girls', selectedHostelType === 'mens' ? activeBoysHostel : activeGirlsHostel);
      if (selectedHostelType === 'mens') {
        console.log(data,"yearlyExpensesData")
        setEntireBoysYearExpensesData(data);
      } else {
        setEntireGirlsYearExpensesData(data);
      }
    };

    fetchExpenses();
  }, [selectedHostelType, activeBoysHostel, activeGirlsHostel,entireHMAdata]);


 

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
      if (!toast.isActive(activeToastId)) {
        activeToastId=toast.error("Hostel name must contain only alphabets.", {
        position: "top-center",
        autoClose: 3000,
        onClose: () => {
          activeToastId = null; // Reset activeToastId when the toast is closed
        },
      });
    }
    }
  };

  const compressImage = async (file) => {
    const options = {
        maxSizeMB: 0.6, // Compress to a maximum of 600 KB
        maxWidthOrHeight: 1920,
        useWebWorker: true, // Use a web worker for better performance
        fileType: 'image/jpeg',
    };

    try {
        const compressedFile = await imageCompression(file, options);
        return compressedFile;
    } catch (error) {
        console.error('Error compressing the image:', error);
        return null;
    }
};

const isImageFile = (file) => {
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
  return file && allowedImageTypes.includes(file.type);
};

  const handleHostelChange = (e, isBoys) => {
    const file = e.target.files[0];
    if (!file) {
      if (!toast.isActive(activeToastId)) {
        activeToastId=toast.error("Please select a file.", {
        position: "top-center",
        autoClose: 3000,
        onClose: () => {
          activeToastId = null; // Reset activeToastId when the toast is closed
        }
      });
    }
      return;
    }
    if (file && isImageFile(file)) {
      if (isBoys) {
        setBoysHostelImage(file);
      } else {
        setGirlsHostelImage(file);
      }
      
    }
    if (!isImageFile(file)) {
      if (!toast.isActive(activeToastId)) {
        activeToastId=toast.error("Please upload a valid image file (JPEG, PNG, GIF).", {
        position: "top-center",
        autoClose: 3000,
        onClose: () => {
          activeToastId = null; // Reset activeToastId when the toast is closed
        }
      });
    }
      e.target.value = ''; // Clear the input
      return;
    }

    if (isBoys) {
        setBoysHostelImage(file); 
    } else {
        setGirlsHostelImage(file); 
    }
    setPhotoUrl(''); // Reset photoUrl if file is uploaded
       setIsFileUploaded(true); // Mark the file as uploaded
       setIsCameraUsed(false);
        setErrorMessage('');
   
  };

  const addNewHostel = async (e, isBoys) => {
    e.preventDefault();
    
    const name = isBoys ? capitalizeFirstLetter(newBoysHostelName) : capitalizeFirstLetter(newGirlsHostelName);
    const address = isBoys ? capitalizeFirstLetter(newBoysHostelAddress) : capitalizeFirstLetter(newGirlsHostelAddress);
    const hostelImage = isBoys ? boysHostelImage : girlsHostelImage;

    if (name.trim() === '' || address.trim() === '' || !hostelImage ) {
      if (!toast.isActive(activeToastId)) {
        activeToastId=toast.error("Hostel name, address and image cannot be empty.", {
        position: "top-center",
        autoClose: 3000,
        onClose: () => {
          activeToastId = null; // Reset activeToastId when the toast is closed
        }
      });
    }
      return;
    }
    setIsSubmitting(true);
    let hostelImageUrlToUpdate = hostelImageUrl;
    // console.log(isBoys ? boysHostelImage : girlsHostelImage, "kkk")
    const hostelImageFile = isBoys ? boysHostelImage : girlsHostelImage;
    let compressedHostelImageFile = await compressImage(hostelImageFile);
    if (compressedHostelImageFile) {
      const imageRef = storageRef(storage, `Hostel/${userUid}/${isBoys ? 'boys' : 'girls'}/${name}`);
      try {
        const snapshot = await uploadBytes(imageRef, compressedHostelImageFile);
        hostelImageUrlToUpdate = await getDownloadURL(snapshot.ref);
        console.log(hostelImageUrlToUpdate, "hostelImageUrlToUpdate")
      } catch (error) {
        console.error("Error uploading tenant image:", error);
      }
    }

    // Create a new reference with a unique ID
    const newHostelRef = push(ref(database, `Hostel/${userUid}/${isBoys ? 'boys' : 'girls'}`));
    const hostelDetails = {
      id: newHostelRef.key, // Store the unique key if needed
      name,
      address,
      hostelImage: hostelImageUrlToUpdate
    };

    set(newHostelRef, hostelDetails)
      .then(() => {
        if (!toast.isActive(activeToastId)) {
          activeToastId=toast.success(`New ${isBoys ? "men's" : "women's"} hostel '${name}' added successfully.`, {
          position: "top-center",
          autoClose: 3000,
          onClose: () => {
            activeToastId = null; // Reset activeToastId when the toast is closed
          }
        });
      }
        fetchData()
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
        setPhotoUrl('');

        navigate(-1)
      })
      .catch(error => {
        if (!toast.isActive(activeToastId)) {
          activeToastId=toast.error("Failed to add new hostel: " + error.message, {
          position: "top-center",
          autoClose: 3000,
          onClose: () => {
            activeToastId = null; // Reset activeToastId when the toast is closed
          }
        });
      }navigate(-1)
      })
      .finally(() => {
        setIsSubmitting(false); // Reset isSubmitting to false when submission completes
      });
  };
  const [closeBtnStatus,setCloseBtnStatus] = useState(false)
  const handleModalClose = (isBoys) => {
    setCloseBtnStatus(true)
    if (isBoys) {
      setNewBoysHostelName('');
      setNewBoysHostelAddress('');
      setBoysHostelImage('');
      setIsBoysModalOpen(false);
      navigate(-1)
      setTimeout(()=>{
        setCloseBtnStatus(false)
      },1000)
    } else {
      setNewGirlsHostelName('');
      setNewGirlsHostelAddress('');
      setGirlsHostelImage('');
      setIsGirlsModalOpen(false);
      navigate(-1)
      setTimeout(()=>{
        setCloseBtnStatus(false)
      },1000)
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
    const dataToUse = selectedHostelType === "mens" ? boysTenants : girlsTenants;
    const nameToUse = selectedHostelType === "mens" ? activeBoysHostelName + " Mens " : activeGirlsHostelName + " Womens ";

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
    doc.text(`${nameToUse}Tenants Report`, doc.internal.pageSize.width / 2, 10, { align: 'center' });

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
    const pdfBlob = doc.output('blob');
    const fileName = `${nameToUse} Tenants_Report.pdf`;

    // if (Capacitor.isNativePlatform()) {
    //     // Convert Blob to base64
    //     const reader = new FileReader();
    //     reader.readAsDataURL(pdfOutput);
    //     reader.onloadend = async () => {
    //         const base64String = reader.result.split(',')[1]; // Remove the prefix

    //         try {
    //             // Write the file to the filesystem
    //             const result = await Filesystem.writeFile({
    //                 path: 'Tenants_Report.pdf',
    //                 data: base64String,
    //                 directory: Directory.Documents,
    //                 encoding: Encoding.Base64
    //             });
    //             console.log('File saved successfully:', result.uri);

    //             // Optionally open the file using the FileOpener plugin
    //             await FileOpener.open({
    //                 filePath: result.uri,
    //                 fileMimeType: 'application/pdf'
    //             });
    //         } catch (error) {
    //             console.error('Error saving file:', error);
    //         }
    //     };
    //     reader.onerror = (error) => {
    //         console.error('Error converting PDF to base64:', error);
    //     };
    // } else {
    //     // For web environment, use the default download method
    //     const url = URL.createObjectURL(pdfOutput);
    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.setAttribute('download', `${nameToUse} Tenants_Report.pdf`);
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    // }
    const saveAndOpenPDF = (fileName) => {
      if (Capacitor.isNativePlatform()) {
          const reader = new FileReader();
          reader.readAsDataURL(pdfBlob);
          reader.onloadend = async () => {
              const base64String = reader.result.split(',')[1]; // Remove the prefix

              try {
                  const result = await Filesystem.writeFile({
                      path: fileName,
                      data: base64String,
                      directory: Directory.Data,
                      encoding: Encoding.Base64
                  });
                  console.log('File saved successfully:', result.uri);

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
          const url = URL.createObjectURL(pdfBlob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }
  };

  // Call the function to save and open the PDF
  saveAndOpenPDF(fileName);

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


// 

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

    const dataToUse = selectedHostelType === "mens" ? boysExTenantsData : girlsExTenantsData;
    const nameToUse = selectedHostelType === "mens" ? activeBoysHostelName + " Mens " : activeGirlsHostelName + " Womens ";

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

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`${nameToUse} Vacated Tenants Report`, doc.internal.pageSize.width / 2, 10, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Tenants with Bike', 14, 25);

    doc.autoTable({
      startY: 30,
      margin: { top: 20 },
      theme: 'striped',
      styles: { fontSize: 8, textAlign: 'center', cellPadding: 1, halign: 'center' },
      columns: columnsWithBike,
      body: dataWithBike,
    });

    const lastY = doc.lastAutoTable.finalY;
    doc.text('Tenants without Bike', 14, lastY + 10);

    doc.autoTable({
      startY: lastY + 15,
      margin: { top: 20 },
      theme: 'striped',
      styles: { fontSize: 8, textAlign: 'center', cellPadding: 1, halign: 'center' },
      columns: columnsWithoutBike,
      body: dataWithoutBike,
    });

    const pdfBlob = doc.output('blob');
    const fileName = `${nameToUse} VacatedTenants_Report.pdf`;

    const saveAndOpenPDF = (fileName) => {
        if (Capacitor.isNativePlatform()) {
            const reader = new FileReader();
            reader.readAsDataURL(pdfBlob);
            reader.onloadend = async () => {
                const base64String = reader.result.split(',')[1]; // Remove the prefix

                try {
                    const result = await Filesystem.writeFile({
                        path: fileName,
                        data: base64String,
                        directory: Directory.Data,
                        encoding: Encoding.Base64
                    });
                    console.log('File saved successfully:', result.uri);

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
            const url = URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    // Call the function to save and open the PDF
    saveAndOpenPDF(fileName);
};






  const monthMapping = {
    'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
    'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
  };


  const { Filesystem,FilesystemDirectory,FilesystemEncoding } = Plugins;
  

  const handleExpensesGenerateBtn = () => {
    const doc = new jsPDF();

    const monthlyColumns = [
        { header: 'S.No', dataKey: 'sNo' },
        { header: 'Expense Name', dataKey: 'expensename' },
        { header: 'Expense Amount', dataKey: 'expenseamount' },
        { header: 'Date', dataKey: 'date' }
    ];

    const yearlyColumns = [
        { header: 'S.No', dataKey: 'sNo' },
        { header: 'Expense Name', dataKey: 'expensename' },
        { header: 'Expense Amount', dataKey: 'expenseamount' },
        { header: 'Date', dataKey: 'date' }
    ];

    const dataToUse = selectedHostelType === "mens" ? entireBoysYearExpensesData : entireGirlsYearExpensesData;
    const nameToUse = selectedHostelType === "mens" ? activeBoysHostelName + " Mens" : activeGirlsHostelName + " Womens";
    const newMonth = monthMapping[month.toLowerCase()];

    const saveAndOpenPDF = (fileName) => {
        const pdfBlob = doc.output('blob');

        if (Capacitor.isNativePlatform()) {
            const reader = new FileReader();
            reader.readAsDataURL(pdfBlob);
            reader.onloadend = async () => {
                const base64String = reader.result.split(',')[1]; // Remove the prefix

                try {
                    const result = await Filesystem.writeFile({
                        path: fileName,
                        data: base64String,
                        directory: Directory.Data,
                        encoding: Encoding.Base64
                    });
                    console.log('File saved successfully:', result.uri);

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
            const url = URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    if (month !== "" && year) {
        // Monthly Report
        const filteredData = [];
        dataToUse.forEach(item => {
            if (typeof (item) === 'object' && item !== null) {
                Object.keys(item).forEach(key => {
                    const expenseData = item[key];
                    if (expenseData && expenseData.expenseDate) {
                        const expenseDate = new Date(expenseData.expenseDate);
                        if (expenseDate.getFullYear() === parseInt(year) && expenseDate.getMonth() === newMonth) {
                            filteredData.push({
                                expensename: expenseData.expenseName,
                                expenseamount: expenseData.expenseAmount,
                                date: expenseDate.toLocaleDateString()
                            });
                        }
                    }
                });
            }
        });

        const monthName = Object.keys(monthMapping).find(key => monthMapping[key] === newMonth);
        doc.setFontSize(16);
        doc.text(`${nameToUse} ${monthName.charAt(0).toUpperCase() + monthName.slice(1)} Expenses`, 105, 20, { align: 'center' });

        if (filteredData.length > 0) {
            doc.autoTable({
                startY: 30,
                head: [monthlyColumns.map(col => col.header)],
                body: filteredData.map((row, index) => ([
                    index + 1,
                    row.expensename,
                    row.expenseamount,
                    row.date
                ])),
                theme: 'grid'
            });

            const totalAmount = filteredData.reduce((acc, item) => acc + item.expenseamount, 0);
            doc.text(`Total Expenses: ${totalAmount}`, 10, doc.lastAutoTable.finalY + 10);

            saveAndOpenPDF(`${nameToUse} ${monthName}_expenses.pdf`);
        } else {
            doc.autoTable({
                startY: 30,
                head: [monthlyColumns.map(col => col.header)],
                body: [['', '', '', '']],
                theme: 'grid'
            });

            doc.text('No expenses found for the selected month and year.', 10, doc.lastAutoTable.finalY + 10);
            saveAndOpenPDF(`${nameToUse} ${monthName}_expenses.pdf`);
        }
    } else if (year) {
        // Yearly Report
        const expensesByMonth = {};
        const months = Object.keys(monthMapping);

        dataToUse.forEach(item => {
            if (typeof (item) === 'object' && item !== null) {
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
                                expenseAmount: expenseData.expenseAmount,
                                date: expenseDate.toLocaleDateString()
                            });
                        }
                    }
                });
            }
        });

        doc.setFontSize(16);
        doc.text(`${nameToUse} Yearly Expenses`, 105, 20, { align: 'center' });

        let grandTotal = 0;
        let startY = 30;

        months.forEach((month) => {
            let monthTotal = 0;

            doc.setFontSize(14);
            doc.text(`${month.charAt(0).toUpperCase() + month.slice(1)} Expenses`, 10, startY);

            if (expensesByMonth[month] && expensesByMonth[month].length > 0) {
                doc.autoTable({
                    startY: startY + 10,
                    head: [yearlyColumns.map(col => col.header)],
                    body: expensesByMonth[month].map((item, itemIndex) => ([
                        itemIndex + 1,
                        item.expenseName,
                        item.expenseAmount,
                        item.date
                    ])),
                    theme: 'grid'
                });

                monthTotal = expensesByMonth[month].reduce((acc, item) => acc + item.expenseAmount, 0);
                doc.text(`Total for ${month}: ${monthTotal}`, 10, doc.lastAutoTable.finalY + 10);
                grandTotal += monthTotal;
                startY = doc.lastAutoTable.finalY + 20;
            } else {
                doc.autoTable({
                    startY: startY + 10,
                    head: [yearlyColumns.map(col => col.header)],
                    body: [['', '', '', '']],
                    theme: 'grid'
                });
                doc.setFontSize(8);
                doc.text('No expenses found for this month.', 10, doc.lastAutoTable.finalY + 10);
                startY = doc.lastAutoTable.finalY + 20;
            }
        });

        doc.setFontSize(14);
        doc.text(`Grand Total: ${grandTotal}`, 10, startY + 2);

        saveAndOpenPDF(`${nameToUse} ${year}_expenses.pdf`);
    }
};


// const handleTenantBtnExcel = async () => {
//     const dataToUse = selectedHostelType === "mens" ? boysTenants : girlsTenants;

//     const flatData = dataToUse.map(item => {
//         const flatRents = Object.entries(item.rents || { NA: {} }).map(([rentId, rent]) => ({
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

//     // Add the worksheet to the workbook only if it doesn't already exist
//     if (!workbook.SheetNames.includes('Tenants')) {
//         XLSX.utils.book_append_sheet(workbook, worksheet, 'Tenants');
//     }
//     // Generate a binary Excel file
//     const fileData = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

//     if (Capacitor.isNativePlatform()) {
//         // Convert array buffer to base64
//         const reader = new FileReader();
//         reader.readAsDataURL(new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
//         reader.onloadend = async () => {
//             const base64String = reader.result.split(',')[1]; // Remove the prefix

//             try {
//                 // Write the file to the filesystem
//                 const result = await Filesystem.writeFile({
//                     path: 'tenants_data.xlsx',
//                     data: base64String,
//                     directory: Directory.ExternalStorage,
//                     encoding: Encoding.Base64
//                 });
//                 console.log('File saved successfully:', result.uri);

//                 // Optionally open the file using the FileOpener plugin
//                 await FileOpener.open({
//                     filePath: result.uri,
//                     fileMimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//                 });
//             } catch (error) {
//                 console.error('Error saving file:', error);
//             }
//         };
//         reader.onerror = (error) => {
//             console.error('Error converting Excel to base64:', error);
//         };
//     } else {
//         // For web environment, use the default download method
//         try {
//             // Convert array buffer to blob
//             const blob = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            
//             // Use FileSaver to trigger download
//             saveAs(blob, 'tenants_data.xlsx');
//         } catch (error) {
//             console.error('Error saving file:', error);
//         }
//     }
// };

const handleTenantBtnExcel = async () => {
  const dataToUse = selectedHostelType === "mens" ? boysTenants : girlsTenants;

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
  const fileName = `tenants_data.xlsx`;

  const saveAndOpenExcel = (fileName) => {
      const excelBlob = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      if (Capacitor.isNativePlatform()) {
          // Convert blob to base64
          const reader = new FileReader();
          reader.readAsDataURL(excelBlob);
          reader.onloadend = async () => {
              const base64String = reader.result.split(',')[1]; // Remove the prefix

              try {
                  // Write the file to the filesystem
                  const result = await Filesystem.writeFile({
                      path: fileName,
                      data: base64String,
                      directory: Directory.Data,
                      encoding: Encoding.Base64
                  });
                  console.log('File saved successfully:', result.uri);

                  // Open the Excel file using FileOpener plugin
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
          // For web environment, trigger download directly
          const url = URL.createObjectURL(excelBlob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }
  };

  saveAndOpenExcel(fileName);
};



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

    // Add the worksheet to the workbook only if it doesn't already exist
    if (!workbook.SheetNames.includes('Tenants')) {
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Tenants');
    }
    // Generate a binary Excel file
    const fileData = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
    // const handleChangeHostelType = (e) => {
    //   console.log(e.target.value, "e.target")
    //   if (e.target.value === "mens") {
    //     changeActiveFlag("boys")
    //   } else if (e.target.value === "girls") {
    //     changeActiveFlag("girls")
    //   }

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
                    directory: Directory.Data,
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

// Function to check file system permissions
// const checkPermissions = async () => {
//   if (Capacitor.isNativePlatform()) {
//     try {
//       const { uri } = await Filesystem.requestPermissions();
//       console.log('Permissions granted', uri);
//     } catch (error) {
//       console.error('Error requesting permissions:', error);
//     }
//   }
// };


// const handleVacatedBtnExcel = async () => {
//   const dataToUse = selectedHostelType === "mens" ? boysExTenantsData : girlsExTenantsData;

//   const flatData = dataToUse.map(item => {
//     const flatRents = Object.entries(item.rents || { NA: {} }).map(([rentId, rent]) => ({
//       PaidAmount: rent.paidAmount || "NA",
//       Due: rent.due || "NA",
//       DueDate: rent.dueDate || "NA",
//       PaidDate: rent.paidDate || "NA",
//       Status: rent.status || "NA",
//       TotalFee: rent.totalFee || "NA",
//     }));

//     return flatRents.map(flatRent => ({
//       Room: item.roomNo || "NA",
//       Bed: item.bedNo || "NA",
//       Name: item.name || "NA",
//       Address: item.permnentAddress || "NA",
//       bikeNumber: item.bikeNumber || "NA",
//       DateOfJoin: item.dateOfJoin || "NA",
//       Emergency: item.emergencyContact || "NA",
//       Id: item.idNumber || "NA",
//       Mobile: item.mobileNo || "NA",
//       Status: item.status || "NA",
//       ...flatRent, // Spread the flattened rent information
//     }));
//   }).flat();

//   // Create a new workbook and a worksheet
//   const workbook = XLSX.utils.book_new();
//   const worksheet = XLSX.utils.json_to_sheet(flatData);

//   // Add the worksheet to the workbook
//   XLSX.utils.book_append_sheet(workbook, worksheet, 'Vacated Tenants');

//   // Generate a binary Excel file
//   const fileData = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
//   const fileName = `vacated_tenants_data.xlsx`;

//   const saveAndOpenExcel = async (fileName) => {
//     const excelBlob = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

//     if (Capacitor.isNativePlatform()) {
//       const reader = new FileReader();
//       reader.readAsDataURL(excelBlob);
//       reader.onloadend = async () => {
//         const base64String = reader.result.split(',')[1]; // Remove the prefix

//         try {
//           // Ensure permissions are granted
//           await checkPermissions();

//           // Save file to external storage directory
//           const result = await Filesystem.writeFile({
//             path: fileName,
//             data: base64String,
//             directory: Directory.ExternalStorage, // Or Directory.Data for Android 10+
//             encoding: Encoding.Base64
//           });
//           console.log('File saved successfully:', result.uri);

//           // Open the file using the FileOpener plugin
//           try {
//             await FileOpener.open({
//               filePath: result.uri,
//               fileMimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//             });
//             console.log('File opened successfully');
//           } catch (error) {
//             console.error('Error opening file:', error);
//           }
//         } catch (error) {
//           console.error('Error saving file:', error);
//         }
//       };
//       reader.onerror = (error) => {
//         console.error('Error converting Excel to base64:', error);
//       };
//     } else {
//       // Web environment download
//       const url = URL.createObjectURL(excelBlob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', fileName);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   // Call the function to save and open the Excel file
//   await saveAndOpenExcel(fileName);
// };

console.log(activeFlag, "ActiveFlag")
  const handleChangeHostelType = (e) => {
    console.log(e.target.value, "e.target")
    if (e.target.value === "mens") {
      changeActiveFlag("boys")
    } else if (e.target.value === "girls") {
      changeActiveFlag("girls")
    }
    setSelectedHostelType(e.target.value);
  }
useEffect(()=>{
  if(activeFlag === 'boys'){
    setSelectedHostelType('mens')
  } else {
    setSelectedHostelType('womens')
  }
  
}, [activeFlag])
console.log(selectedHostelType, "ActiveFlagselectedHostelType")
  useEffect(() => {
    const handlePopState = () => {
      if(isBoysModalOpen){
        setIsBoysModalOpen(false)
      }
      if(isGirlsModalOpen){
        setIsGirlsModalOpen(false);
      }
      
    };

    window.addEventListener('popstate', handlePopState);


  }, [isBoysModalOpen,isGirlsModalOpen,location.pathname]);



  return (
    <div className="settings">
      <h1 className='settingsPageHeading'>{t('menuItems.settings')}</h1>
      <div className="settings-top">
        <div className="language-switch-section">
          <label className='settingsHeading' htmlFor="language-selector">{t("settings.languages")} </label>
          <LanguageSwitch id="language-selector" />
        </div>

      </div>
      <div className='mt-4 mb-4'>
        {
          activeBoysHostelButtons.length > 0 ? '' :
          <div className='d-flex align-items-center' style={{ marginBottom: '8px' }}>
         
      
              <h5 className="addHostelTextBtn">{t('settings.addboysHostel')}</h5>
              <div><button className="addHostelBtn" onClick={() => {setIsBoysModalOpen(true);window.history.pushState(null, null, location.pathname)}}>{t("settings.addHostel")}</button></div>
            </div>
        }
        {
          activeGirlsHostelButtons.length > 0 ? '' :
            <div className='d-flex  align-items-center'>
              <h5 className="addHostelTextBtn">{t('settings.addGirlsHostel')}</h5><button className="addHostelBtn" onClick={() => {setIsGirlsModalOpen(true);window.history.pushState(null, null, location.pathname)}}>{t("settings.addHostel")}</button>
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
                  onInput={e => e.target.value = e.target.value.replace(/[^a-zA-Z ]/g, '')}
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
                <input type="file" className="form-control" onChange={(e) => handleHostelChange(e, true)} 
                disabled={isCameraUsed} />
                {isMobile && !isFileUploaded && (
                  <div>
                  <p>{t('tenantsPage.or')}</p>
                  <div style={{display:'flex',flexDirection:'row'}}>
                  <p>{t('tenantsPage.takePhoto')}</p>
                  <FontAwesomeIcon icon={faCamera} size="2x" onClick={takePicture} style={{marginTop:'-7px',paddingLeft:'30px'}}
                  disabled={isFileUploaded} 

                  />
                  {photoUrl && <img src={photoUrl} alt="Captured" style={{ marginTop: 50,marginRight:40, Width: '100px', height: '100px' }} />}
                  </div>
                  </div>
                    )}

              </div>
              <div className='mt-3 d-flex justify-content-between'>
                <Button variant="primary" style={{ marginRight: '10px' }} type="submit" disabled={isSubmitting}>{isSubmitting ? 'Adding...' : t("settings.addHostel")}</Button>
                <Button disabled={closeBtnStatus} variant="secondary" onClick={() => handleModalClose(true)}>{t("settings.close")}</Button>
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
                  onInput={e => e.target.value = e.target.value.replace(/[^a-zA-Z ]/g, '')}
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
                <Button disabled={closeBtnStatus} variant="secondary" onClick={() => handleModalClose(false)}>{t("settings.close")}</Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </div>
      <h1 className='settingsHeading'>{t('settings.generateReport')}</h1>
      <div className="hostelTypeDropDown">
        <div className='mt-2'>
          <p className='selectTypeText'>{t('settings.selectHostelType')}</p>
        </div>
        <div>
          <select className='languageDropdown' value={activeFlag} onChange={handleChangeHostelType}>
            <option value="mens" >{t('dashboard.mens')}</option>
            <option value="girls">{t('dashboard.womens')}</option>
          </select>
        </div>
      </div>
      <h1 className='settingsSideHeading'>{t('settings.tenantsReport')}</h1>

      <button className='reportsButton' onClick={handleReportBtn}>{t('settings.generatePdf')}</button>
      <button className='reportsButton' onClick={handleTenantBtnExcel}>{t('settings.generateExcel')}</button>
      <h2 className='settingsSideHeading'>{t('settings.vacatedTenantsReport')}</h2>
      <button className='reportsButton' onClick={handleVacatedReportBtn}>{t('settings.generatePdf')}</button>
      <button className='reportsButton' onClick={handleVacatedBtnExcel}>{t('settings.generateExcel')}</button>

      <h2 className='settingsSideHeading'>{t('settings.expensesReport')}</h2>
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
