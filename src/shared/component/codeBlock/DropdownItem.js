import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import GetImageFireBase from "../../function/GetImageFireBase"
const DropdownItem = ({ data, fnCallback }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [option, setOption] = useState(data)
  console.log(data);
  useEffect(() => {
    setOption(data)
  }, [data]);
  // Toggle menu visibility
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Close menu when clicking outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  // Attach and detach event listener
  useEffect(() => {
    if (isOpen) {
      window.addEventListener('mousedown', handleClickOutside);
    } else {
      window.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={dropdownRef}
      style={{ position: 'relative', display: 'block' }}
    >
      {/* Icon button */}
      <button
        onClick={toggleDropdown}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '24px',
        }}
      >
        <i class="fa-regular fa-pen-to-square" style={{ color: "var(--cl_2)" }}></i>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <ul
          style={{
            position: 'absolute',
            top: '30px',
            right: '0',
            zIndex: "5",
            backgroundColor: "white",
            listStyle: 'none',
            margin: '0',
            overflow: "hidden",
            width: "20rem",
            padding: "10px 0 ",
            // background: '#fff',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '4px',
          }}
        >
          {option && option.length > 0 && option.map((item, index) => (
            <LiComponent style={{
              padding: "0.5rem 0.5rem",

            }}
            >
              <Items

                onClick={() => {
                  setIsOpen(false)
                  fnCallback(item.email)
                }}
                style={{ textDecoration: 'none', color: 'rgb(0, 53, 83)', fontSize: "var(--fz_smallmax)" }}
              >
                <img alt='' src={GetImageFireBase(item.avatar)} />
                <div className='box_name'>
                  <p className='hospital_name_'>{item.hospital}</p>
                  <p>{item.firstName} {item.lastName}</p>
                  <p className='email_client'>{item.email}</p>
                </div>
              </Items>
            </LiComponent>
          ))}


        </ul>
      )}
    </div>
  );
};

export default DropdownItem;


const LiComponent = styled.li`
 transition: 0.3s ease-in-out;
   cursor: pointer;
  &:hover{
    background-color: var(--cl_3);
  }
`;
const Items = styled.div`
display: flex;
  gap: 0.5rem;
  align-items: start;
  img {
    width: 50px;
    border-radius: 50%;
  }
  .box_name {
    display: flex;
    flex-direction: column;
    .hospital_name_ {
      font-size: var(--fz_smallmax);
      color: orange;
    }
      .email_client {
      font-size: var(--fz_smallmax);
      color: black;
    }
  }
`;