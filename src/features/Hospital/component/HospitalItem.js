import React from 'react'
import FomatWorkday from "../../../shared/function/FomatWorkday"
export default function HospitalItem({ item }) {
  return item && (
    <div className='item'>
      <p className='code'>{item.code}</p>
      <div className='logo'><img alt='' src="https://firebasestorage.googleapis.com/v0/b/medcare-9db1e.appspot.com/o/047f16f5-27b1-4c3f-b3d3-778c16d633db-tn.jpg?alt=media" /></div>
      <p className='name'>{item.name}</p>
      <p className='workday'>{FomatWorkday(item.workday)}</p>
      <p className='type'>{item.type}</p>
      <p className='address'>{item.district}-{item.province}</p>
      <p className={item.status.toLowerCase() === "active" ? "active status" : "deactive status"}>{item.status}</p>
    </div>
  )
}
