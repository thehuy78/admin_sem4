import React, { useEffect, useMemo, useState } from 'react'
import "../style/ListHospital.scss"
import { headerjson, hospitaljson } from "../data/DataListHospital"
import { renderItem, renderPagination } from "../../../shared/function/Pagination"

import styled from 'styled-components';
import SearchInput from '../../../shared/component/InputFilter/SearchInput';
import SelectInput from '../../../shared/component/InputFilter/SelectInput';

const typehospital = [
  { value: 'all', label: 'All Type' },
  { value: 'BV CÔNG', label: 'Bệnh Viện Công' },
  { value: 'BV TƯ', label: 'Bệnh Viện Tư' },
  { value: 'Phòng Khám', label: 'Phòng Khám' },
  { value: 'Trung Tâm Tiêm Chủng', label: 'Trung Tâm Tiêm Chủng' },
];

const workday = [
  { value: 'T2', label: 'Monday' },
  { value: 'T3', label: 'Tuesday' },
  { value: 'T4', label: 'Wednesday' },
  { value: 'T5', label: 'Thursday' },
  { value: 'T6', label: 'Friday' },
  { value: 'T7', label: 'Saturday' },
  { value: 'CN', label: 'Sunday' },
];

const districtsHCM = [
  { value: 'all', label: 'All' },
  { value: 'Quận 1', label: 'Quận 1' },
  { value: 'Quận 2', label: 'Quận 2' },
  { value: 'Quận 3', label: 'Quận 3' },
  { value: 'Quận 4', label: 'Quận 4' },
  { value: 'Quận 5', label: 'Quận 5' },
  { value: 'Quận 6', label: 'Quận 6' },
  { value: 'Quận 7', label: 'Quận 7' },
  { value: 'Quận 8', label: 'Quận 8' },
  { value: 'Quận 9', label: 'Quận 9' },
  { value: 'Quận 10', label: 'Quận 10' },
  { value: 'Quận 11', label: 'Quận 11' },
  { value: 'Quận 12', label: 'Quận 12' },
  { value: 'Bình Thạnh', label: 'Bình Thạnh' },
  { value: 'Tân Bình', label: 'Tân Bình' },
  { value: 'Tân Phú', label: 'Tân Phú' },
  { value: 'Phú Nhuận', label: 'Phú Nhuận' },
  { value: 'Gò Vấp', label: 'Gò Vấp' },
  { value: 'Bình Tân', label: 'Bình Tân' },
  { value: 'Thủ Đức', label: 'Thủ Đức' },
  { value: 'Nhà Bè', label: 'Nhà Bè' },
  { value: 'Hóc Môn', label: 'Hóc Môn' },
  { value: 'Củ Chi', label: 'Củ Chi' },
  { value: 'Cần Giờ', label: 'Cần Giờ' },
  { value: 'Bình Chánh', label: 'Bình Chánh' },
];

const NotFound = styled.p`
      color: var(--cl_2);
      padding: 3rem;
      text-align: center;
      font-weight: 900;
`;

export default function ListHospital() {
  //datafetch
  const [hospital, setHospital] = useState(hospitaljson);
  const [header, setHeader] = useState(headerjson);
  //filter
  const [filter, setFilter] = useState({
    type: 'all',
    workday: [],
    address: 'all',
    search: ''

  });





  //filter hospital
  const hanldeFilters = useMemo(() => {
    return hospital.filter((hosp) => {
      const matchesType = filter.type === 'all' || hosp.type === filter.type;
      const matchesWorkday = filter.workday.length === 0 ||
        filter.workday.some(day => hosp.workday.split('-').includes(day));
      const matchesAddress = filter.address === 'all' || hosp.district === filter.address;
      const matchesSearch = hosp.name.toLowerCase().includes(filter.search.toLowerCase());

      return matchesType && matchesWorkday && matchesAddress && matchesSearch;
    });
  }, [hospital, filter]);

  //page
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;
  const totalPages = hanldeFilters && hanldeFilters.length > 0 && Math.ceil(hanldeFilters.length / perPage);
  //state animation
  const [showFilterOption, setShowFilterOption] = useState(false);

  //handleChangePage
  const handleClick = (page) => {
    setCurrentPage(page);
  };




  return (
    <div className='list_hospital_P'>
      <section className='section_filter'>
        <div className='left'>
          <div className='box_filter_option_conponent'>
            <div className='filter_option' onClick={() => {
              setShowFilterOption(prev => !prev);
            }}>
              <i className="fa-solid fa-filter"></i>
              <p>Filter Options</p>
            </div>
            {
              showFilterOption && (
                <div className="list_option">
                  <span className='triangle'></span> {/* Triangle connecting the filter to the dropdown */}
                  <div className='container_list_option'>
                    <div className='item'>
                      <span>District</span>
                      <SelectInput
                        defaultVl={districtsHCM.find(option => option.value === filter.address)}
                        options={districtsHCM} multi={false}
                        fnChangeOption={(selected) => {
                          setFilter((prev) => ({ ...prev, address: selected.value }));
                        }}
                      />
                    </div>
                    <div className='item'>
                      <span>Workday</span>
                      <SelectInput
                        defaultVl={workday.filter(option => filter.workday.includes(option.value))}
                        options={workday}
                        multi={true}
                        fnChangeOption={(selected) => {
                          const selectedValues = selected.map(option => option.value);
                          setFilter(prev => ({ ...prev, workday: selectedValues }));
                        }}
                      />
                    </div>
                  </div>
                </div>
              )
            }

          </div>
          <SearchInput fnChangeCallback={(e) => { setFilter((prev) => ({ ...prev, search: e.target.value })) }} />
        </div>
        <div className='right'>
          <div>
            <SelectInput key={1}
              defaultVl={typehospital.find(type => type.value === filter.type)}
              multi={false}
              options={typehospital}
              fnChangeOption={(selected) => {
                setFilter((prev) => ({ ...prev, type: selected.value }));
              }}
            />
          </div>
        </div>
      </section>
      <section className='section_list'>
        {header && (
          <div className='header_list'>
            <p>{header.code}</p>
            <p>{header.logo}</p>
            <p>{header.name}</p>
            <p>{header.workday}</p>
            <p>{header.type}</p>
            <p>{header.address}</p>
            <p>{header.status}</p>
          </div>
        )}

        {hanldeFilters && hanldeFilters.length > 0 ? (
          <div className='list_item'>
            {renderItem(currentPage, perPage, hanldeFilters, "hospital")}
          </div>
        ) : (
          <NotFound>Data Not found</NotFound>
        )}
        {hanldeFilters && hanldeFilters.length > 0 && (
          <div className='pagination'>
            <button
              onClick={() => handleClick(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            {renderPagination(currentPage, totalPages, handleClick)}
            <button
              onClick={() => handleClick(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
