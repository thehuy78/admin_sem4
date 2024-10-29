import React from 'react'
import FomatWorkday from "../../../shared/function/FomatWorkday"
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const GridItem = styled.div`

        display: grid;
        gap: 0.5rem;
        background-color: var(--white);
        padding: 0.2rem 0.5rem;
        align-items: center;
        box-shadow: 0.1rem 0.1rem 0.3rem -0.1rem var(--shadow-black);
        grid-template-columns: 1fr 1fr 3fr 1.5fr 2fr 2fr 1fr 1fr;
        .code {
          font-weight: 800;
          font-size: var(--fz_smallmax);
        }
        .logo {
          width: 100%;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 80%;
          }
        }
        .name {
          font-weight: 700;
          color: var(--cl_2);
        }
        .address {
          font-size: var(--fz_small);
          text-align:center;
        }
        .workday {
          text-align: center;
          font-size: var(--fz_small);
        }
        .type {
          text-align: center;
          font-size: var(--fz_small);
        }
        .status {
          text-transform: capitalize;
          font-size: var(--fz_smallmax);
          color: var(--white);
          padding: 0.3rem 0;
          text-align: center;
          border-radius: 0.5rem;
          cursor: pointer;
          box-shadow: 0 0 0.2rem var(--shadow-black);
        }
        .active {
          background-color: green;
        }
        .deactive {
          background-color: red;
        }
          .link_tag{
          width:100%;
          p{
            text-transform: capitalize;
          font-size: var(--fz_smallmax);
             width:100%;
          color: var(--white);
          padding: 0.3rem 1rem;
          text-align: center;
          border-radius: 0.5rem;
          cursor: pointer;
          box-shadow: 0 0 0.2rem var(--shadow-black);
          background-color: blue;
          }
          }
      
`;




export default function HospitalItem({ item }) {
  return item && (
    <GridItem>
      <p className='code'>{item.code}</p>
      <div className='logo'><img alt='' src={item.logo} /></div>
      <p className='name'>{item.name}</p>
      <p className='workday'>{item.workDay && FomatWorkday(item.workDay)}</p>
      <p className='type'>{item.type.name}</p>
      <p className='address'>{item.district}</p>
      <p className={item.status && item.status.toLowerCase() === "active" ? "active status" : "deactive status"}>{item.status}</p>
      <Link className='link_tag' to={"/admin/hospital/department"}><p className='doctor'>View</p></Link>

    </GridItem>
  )
}
