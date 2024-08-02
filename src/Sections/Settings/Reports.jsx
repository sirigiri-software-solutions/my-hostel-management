import React, { useState } from 'react'
import * as XLSX from 'xlsx';
import { useData } from '../../ApiData/ContextProvider';


const Reports = () => {

    const { girlsTenantsData, boysTenantsData, boysExTenantsData, girlsExTenantsData } = useData()
    console.log(boysTenantsData, "boysTenantsData")
    // console.log(data, "boysTenantsData")
    const exportBoysTenantsToExcel = () => {

        const flatData = boysTenantsData.map(item => {
            const flatRents = Object.entries(item.rents || {NA:{}}).map(([rentId, rent]) => ({
              PaidAmount: rent.paidAmount || "NA",
              Due:  rent.due || "NA",
              DueDate:  rent.dueDate || "NA",
              PaidDate:  rent.paidDate || "NA",
              Status:  rent.status || "NA",
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
    XLSX.writeFile(workbook, 'tenants_data.xlsx');
       
    };

    const exportGirlsTenantsToExcel = () => {

      const flatData = girlsTenantsData.map(item => {
          const flatRents = Object.entries(item.rents || {NA:{}}).map(([rentId, rent]) => ({
            Paid: rent.paidAmount || "NA",
            Due:  rent.due || "NA",
            DueDate:  rent.dueDate || "NA",
            PaidDate:  rent.paidDate || "NA",
            Status:  rent.status || "NA",
            TotalFee: rent.totalFee || "NA",
          }));
    
          return flatRents.map(flatRent => ({
            Room: item.roomNo || "NA",
            Bed: item.bedNo || "NA",
            Name: item.name || "NA",
            Address: item.permnentAddress || "NA",
            bikeNumber: item.bikeNumber || "NA",
            dateOfJoin: item.dateOfJoin || "NA",
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
  XLSX.writeFile(workbook, 'tenants_data.xlsx');
     
  };

  const exportBoysExTenantsToExcel = () => {

    const flatData = boysExTenantsData.map(item => {
        const flatRents = Object.entries(item.rents || {NA:{}}).map(([rentId, rent]) => ({
          PaidAmount: rent.paidAmount || "NA",
          Due:  rent.due || "NA",
          DueDate:  rent.dueDate || "NA",
          PaidDate:  rent.paidDate || "NA",
          Status:  rent.status || "NA",
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
XLSX.writeFile(workbook, 'tenants_data.xlsx');
   
};

const exportGirlsExTenantsToExcel = () => {

  const flatData = girlsExTenantsData.map(item => {
      const flatRents = Object.entries(item.rents || {NA:{}}).map(([rentId, rent]) => ({
        Paid: rent.paidAmount || "NA",
        Due:  rent.due || "NA",
        DueDate:  rent.dueDate || "NA",
        PaidDate:  rent.paidDate || "NA",
        Status:  rent.status || "NA",
        TotalFee: rent.totalFee || "NA",
      }));

      return flatRents.map(flatRent => ({
        Room: item.roomNo || "NA",
        Bed: item.bedNo || "NA",
        Name: item.name || "NA",
        Address: item.permnentAddress || "NA",
        bikeNumber: item.bikeNumber || "NA",
        dateOfJoin: item.dateOfJoin || "NA",
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
XLSX.writeFile(workbook, 'tenants_data.xlsx');
 
};
    return (
        <div>
            <h3>Tenants Reports</h3>
            {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
            <button onClick={exportBoysTenantsToExcel}>Download Boys Excel</button>
            <br/>
            <br/>
            <button onClick={exportGirlsTenantsToExcel}>Download Girls Excel</button>
<br/><br/>
            <button onClick={exportBoysExTenantsToExcel}>Boys Vacated Tenants</button>
            <br/>
            <br/>
            <button onClick={exportGirlsExTenantsToExcel}>Girls Vacated Tenants</button>
        </div>
    )
}

export default Reports
