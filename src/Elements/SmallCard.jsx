import React, { useEffect, useState } from 'react'
const SmallCard = (props) => {

    const { index, item, handleClick } = props

    const handleCardClick = () => {
        handleClick(item);
    };

    return (
        <>
            <div key={index} className="menu-item" onClick={handleCardClick}>
                <div style={{ backgroundColor: 'rgba(255, 205, 77, 0.2)', padding: '30px 20px', borderRadius: '15px' }} className='image-container'>
                    <img style={{ width: '45px', height: '45px' }} src={item.image} alt={item.heading} className='image' />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '5px 20px' }}>
                    <label>{item.heading}</label>
                    <label style={{ fontSize: '25px' }}>{item.number}</label>
                </div>
            </div>


        </>
    )
}

export default SmallCard;
