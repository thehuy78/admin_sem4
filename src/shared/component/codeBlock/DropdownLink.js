import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const DropdownLink = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [option, setOption] = useState(data)

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
      style={{ position: 'relative', display: 'inline-block' }}
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
        &#x22EE; {/* Dấu 3 chấm dọc */}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <ul
          style={{
            position: 'absolute',
            top: '30px',
            right: '0',
            zIndex: "5",
            backgroundColor: "var(--cl_3)",
            listStyle: 'none',
            margin: '0',
            overflow: "hidden",
            // background: '#fff',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '4px',
          }}
        >
          {option && option.length > 0 && option.map((item, index) => (
            <LiComponent style={{
              padding: "0.5rem 1rem",

            }}>
              <Link
                to={item.route}
                onClick={() => setIsOpen(false)}
                style={{ textDecoration: 'none', color: 'white', fontSize: "var(--fz_smallmax)" }}
              >
                {item.name}
              </Link>
            </LiComponent>
          ))}


        </ul>
      )}
    </div>
  );
};

export default DropdownLink;

const LiComponent = styled.li`
transition: 0.3s;
  &:hover {
    background-color: var(--cl_2);
  }
`;