import React from 'react'
import Button from './Button'
import './Table.css'
import { useTranslation } from 'react-i18next'
 
const Table = ({columns, rows,onClickTentantRow}) => {
  const { t } = useTranslation();

  const getTranslationCreatedBy = (createdby) => {
    switch(createdby){
      case "Admin":
      case "Sub-admin":
        return t(`createdBy.${createdby}`)
      default:
        return createdby;
    }
  }

  const getTranslationStatus = (status) => {
    switch(status){
      case "Occupied":
      case "Unoccupied":
      case "Paid":
      case "Unpaid":
        return t(`status.${status}`)
      default:
        return status;
    }
  }


  return (
    <div className='table-container'>
        <table className="table text-center">
          <thead>
            <tr className="fixed">
              {
                columns.map((item, index) => <th style={{padding: "10px"}}>{item}</th>)
              }
            </tr>
          </thead>  
          <tbody className='bodystar'>
            {
              rows.map((item, index) => <tr>
               {item.s_no && <td data-label={t('mobileTable.serialNumber')} style={{padding:"7px"}} onClick={onClickTentantRow ? () => onClickTentantRow(item) : null}>{item.s_no}</td>}
{item.image && <td data-label={t('mobileTable.image')} onClick={onClickTentantRow ? () => onClickTentantRow(item) : null}><img className='personImage' src={item.image} alt='img'/></td>}
{item.name && <td data-label={t('mobileTable.name')} onClick={onClickTentantRow ? () => onClickTentantRow(item) : null}>{item.name}</td>}
{item.id && <td data-label={t('mobileTable.id')} onClick={onClickTentantRow ? () => onClickTentantRow(item) : null}>{item.id}</td>}
{item.mobile_no && <td data-label={t('mobileTable.mobileNumber')} onClick={onClickTentantRow ? () => onClickTentantRow(item) : null}>{item.mobile_no}</td>}
{item.room_bed_no && <td data-label={t('mobileTable.roomBedNumber')} onClick={onClickTentantRow ? () => onClickTentantRow(item) : null}>{item.room_bed_no}</td>}
{item.bed_number && <td data-label={t('mobileTable.bedNumber')}>{item.bed_number}</td>}
{item.room_no && <td data-label={t('mobileTable.roomNumber')}>{item.room_no}</td>}
{item.person_name && <td data-label={t('mobileTable.personName')}>{item.person_name}</td>}
{item.person_mobile && <td data-label={t('mobileTable.personMobile')}>{item.person_mobile}</td>}
{item.bed_no && <td data-label={t('mobileTable.bedNumber')}>{item.bed_no}</td>}
{item.floor && <td data-label={t('mobileTable.floor')}>{item.floor}</td>}
{item.noofBeds && <td data-label={t('mobileTable.numberOfBeds')}>{item.noofBeds}</td>}
{item.bedRent && <td data-label={t('mobileTable.bedRent')}>{item.bedRent}</td>}
{item.month_year && <td data-label={t('mobileTable.monthYear')}>{item.month_year}</td>}
{item.rent && <td data-label={t('mobileTable.rent')}>{item.rent}</td>}
{item.paid && <td data-label={t('mobileTable.paid')}>{item.paid}</td>}
{item.due && <td data-label={t('mobileTable.due')}>{item.due}</td>}
{item.joining_date && <td data-label={t('mobileTable.joiningDate')} onClick={onClickTentantRow ? () => onClickTentantRow(item) : null}>{item.joining_date}</td>}
{item.bike_number && <td data-label={t('mobileTable.bikeNumber')} onClick={onClickTentantRow ? () => onClickTentantRow(item) : null}>{item.bike_number}</td>}
{item.due_date && <td data-label={t('mobileTable.dueDate')}>{item.due_date}</td>}
{item.last_fee && <td data-label={t('mobileTable.lastFee')}>{item.last_fee}</td>}
{item.created_on && <td data-label={t('mobileTable.createdOn')}>{item.created_on}</td>}
{item.expense_name && <td data-label={t('mobileTable.expenseName')}>{item.expense_name}</td>}
{item.expense_amount && <td data-label={t('mobileTable.expenseAmount')}>{item.expense_amount}</td>}
{item.created_by && <td data-label={t('mobileTable.createdBy')}>{getTranslationCreatedBy(item.created_by)}</td>}
{item.last_updated_by && <td data-label={t('mobileTable.lastUpdatedDate')}>{item.last_updated_by}</td>}
{item.payment_date && <td data-label={t('mobileTable.paymentDate')}>{item.payment_date}</td>}
{item.status && <td data-label={t('mobileTable.status')} onClick={onClickTentantRow ? () => onClickTentantRow(item) : null}>{getTranslationStatus(item.status)}</td>}
{item.edit_room && <td data-label={t('mobileTable.edit')}>{item.edit_room}</td>}
{item.actions && <td data-label={t('mobileTable.actions')}>{item.actions}</td>}
{item.edit && <td data-label={t('mobileTable.edit')}><Button icon={item.edit.icon} variant={item.edit.variant} text={item.edit.text}/></td>}
{item.delete && <td data-label={t('mobileTable.delete')}><Button icon={item.edit.icon} variant={item.edit.variant} text={item.delete.text}/></td>}
              </tr>)
            }
          </tbody>
        </table>
    </div>
  )
}
 
export default Table