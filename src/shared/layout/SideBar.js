import React, { useEffect, useState } from 'react'
import "./style/Layout.scss"
import routerMain from "./data/RouteMain.json"
import { Link, useLocation } from 'react-router-dom'
export default function SideBar({ paddingTopNav }) {
  const [listShow, setListShow] = useState([])
  const [itemCurrent, setItemCurrent] = useState()
  const [itemChildCurrent, setItemChildCurrent] = useState()
  const location = useLocation()


  const handleClickShow = (index) => {

    if (listShow.includes(index)) {

      setListShow(listShow.filter((item) => item !== index));
    } else {

      setListShow([...listShow, index]);
    }
  };
  const handleClickItemPattent = (index) => {
    setItemCurrent(index)
    setItemChildCurrent()
  }
  const handleClickItemChild = (indexs, index) => {
    setItemChildCurrent(indexs)
    setItemCurrent(index)
  };

  return (
    <div className='sidebar_P'>
      <div className='logo_company' style={{ height: `${paddingTopNav}px` }}>
      </div>
      <div className='list_router' style={{ height: `calc(100vh - ${paddingTopNav}px)` }}>
        {routerMain && routerMain.length > 0 && routerMain.map((item, index) => (
          <div className='item' key={index}>
            <div className={location.pathname.startsWith(item.topic) ? "pattent pattent_choice" : 'pattent'} >
              <Link className='left' onClick={() => handleClickItemPattent(index)} to={item.route !== "" ? item.route : "#"}>

                <i className={item.icon}></i>
                <p className='link_tag'><span>{item.name}</span></p>

              </Link>
              {item.child && item.child.length > 0 && (
                <i className={listShow.includes(index) ? "fa-solid fa-angle-down" : "fa-solid fa-angle-down rotate"} onClick={() => handleClickShow(index)}></i>
              )}
            </div>

            <div className={!listShow.includes(index) ? "list_hide" : 'list_show'}>
              {item.child && item.child.length > 0 && item.child.map((items, indexs) => (
                <Link onClick={() => handleClickItemChild(indexs, index)} to={items.route !== "" ? items.route : "#"} className={itemChildCurrent === indexs && itemCurrent === index ? 'link_tag child_choice' : 'link_tag'} key={indexs}><span>{items.name}</span></Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
