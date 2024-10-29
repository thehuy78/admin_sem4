import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { headerjson, hospitaljson, districtsHCM, typehospital, status, ListHospitalPage } from "../data/DataListHospital"

import SearchInput from '../../../shared/component/InputFilter/SearchInput';
import SelectInput from '../../../shared/component/InputFilter/SelectInput';
import { useAdminContext } from '../../../shared/hook/ContextToken';

import { apiRequestAutherize } from '../../../shared/hook/Api/ApiAuther';
import LoadingPage from '../../../shared/Config/LoadingPage';
import { Link } from 'react-router-dom';
import FormatWorkday from '../../../shared/function/FomatWorkday';
import { renderPagination } from '../../../shared/function/Pagination';
import { useCookies } from 'react-cookie';
import { createNotification } from '../../../shared/Config/Notifications';




export default function ListHospital() {
  //datafetch
  const [hospital, setHospital] = useState();
  const [header, setHeader] = useState(headerjson);

  //filter
  const [filter, setFilter] = useState({
    type: '',
    status: '',
    address: '',
    search: '',

  });
  const [page, setPage] = useState({
    page: 0,
    size: 7,
  })
  const [totalPage, setTotalPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const { token, user } = useAdminContext()
  const [, , removeCookie] = useCookies(["authorize_token_admin"]);

  useEffect(() => {
    setPage((prev) => ({ ...prev, page: 0 }))
  }, [filter]);

  const fetchdata = useCallback(async () => {
    try {
      if (token) {
        var f = {
          type: filter.type,
          status: filter.status,
          address: filter.address,
          search: filter.search,
          page: page.page,
          size: page.size,
        }
        setIsLoading(true)
        var rs = await apiRequestAutherize("post", "hospital/getall", token, f)
        console.log(rs.data);
        if (rs && rs.data && rs.data.status === 200) {
          setHospital(rs.data.data.content)
          setTotalPage(rs.data.data.totalPages)
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        createNotification("warning", "Your role is not accessible", "Warning")()
      } else if (error.response && error.response.status === 401) {
        createNotification("error", "Login session expired", "Error")()
        setTimeout(() => {
          removeCookie("authorize_token_admin", { path: '/admin_sem4' });
        }, 1000);

      } else {
        createNotification("error", error.message && error.message, "Error")()
      }
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 400);
    }
  }, [token, filter, page])


  useEffect(() => {

    fetchdata();

  }, [fetchdata, filter, page]);

  const handlePage = (value) => {
    console.log(value);
    setPage((prev) => ({
      ...prev, page: value - 1
    }))
  }

  const [timeoutId, setTimeoutId] = useState(null);
  const handelChangeSearch = (e) => {
    const newValue = e.target.value;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const handler = setTimeout(() => {
      setFilter((prev) => ({ ...prev, search: newValue }));
    }, 1000);
    setTimeoutId(handler);
  };


  //state animation
  const [showFilterOption, setShowFilterOption] = useState(false);


  const [showFilterColumn, setShowFilterColumn] = useState(false);
  const [filterColumn, setFilterColumn] = useState([
    "code",
    "name",
    "logo",
    "district",
    "workday",
    "type",
    "status"
  ]);
  const handleFilterColumn = (e) => {
    const value = e.target.value;
    console.log(value);
    if (filterColumn.includes(value)) {
      setFilterColumn(filterColumn.filter((item) => item !== value));
    } else {
      setFilterColumn([...filterColumn, value]);
    }
  };
  return (
    <ListHospitalPage>
      <LoadingPage isloading={isLoading} />
      <section className='section_filter'>
        <div className='left'>
          <div className='box_create_newHospital'>
            <Link className='link_tag' to={"/admin/hospital/create"}>
              <button>New Hospital</button>
            </Link>
          </div>
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
                      <span>Status</span>
                      <SelectInput
                        defaultVl={status.find(option => filter.status === option.value)}
                        options={status}
                        multi={false}
                        fnChangeOption={(selected) => {
                          setFilter((prev) => ({ ...prev, status: selected.value }));
                        }}

                      />
                    </div>
                  </div>
                </div>
              )
            }

          </div>
          <SearchInput fnChangeCallback={handelChangeSearch} />
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
          <div className="r_b_filter_column">
            <div
              className="b_filter_column"
              onClick={() => {
                setShowFilterColumn((prev) => !prev);
              }}
            >
              <i className="fa-brands fa-slack"></i>
            </div>
            {showFilterColumn && (
              <div className="overlay">
                <div className="triangle"></div>
                <div className="list_action">
                  {header &&
                    header.length > 0 &&
                    header.map((item, index) => (
                      <div key={item}>
                        <input
                          type="checkbox"
                          checked={filterColumn.includes(item)}
                          value={item}
                          onChange={handleFilterColumn}
                        />
                        <label>{item}</label>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <section className='section_list'>
        <div className="data_table">
          <table className="table_">
            <thead>
              {header &&
                header.length > 0 &&
                header.map((item, index) => (
                  <th
                    className={item}
                    key={index}
                    style={{
                      display: filterColumn.includes(item)
                        ? "table-cell"
                        : "none",
                    }}
                  >
                    {item}
                  </th>
                ))}
              <th>Action</th>
            </thead>
            <tbody>
              {hospital && hospital.length > 0 ? (hospital.map((item) => (
                <tr key={item.code}>
                  <td
                    style={{
                      display: filterColumn.includes("code")
                        ? "table-cell"
                        : "none",
                    }}
                  >
                    {item.code}
                  </td>

                  <td
                    style={{
                      display: filterColumn.includes("logo")
                        ? "table-cell"
                        : "none",
                    }}
                  >
                    <div style={{ width: "50px", margin: "auto" }}>
                      <img style={{ width: "100%", aspectRatio: "1/1" }} alt='' src={item.logo} />
                    </div>

                  </td>
                  <td
                    style={{
                      display: filterColumn.includes("name")
                        ? "table-cell"
                        : "none",
                    }}
                  >
                    {item.name}
                  </td>
                  <td
                    style={{
                      display: filterColumn.includes("address")
                        ? "table-cell"
                        : "none",
                    }}
                  >
                    {item.address}
                  </td>
                  <td
                    style={{
                      display: filterColumn.includes("open_hours")
                        ? "table-cell"
                        : "none",
                    }}
                  >
                    {item.openTime}
                  </td>
                  <td
                    style={{
                      display: filterColumn.includes("close_hours")
                        ? "table-cell"
                        : "none",
                    }}
                  >
                    {item.closeTime}
                  </td>
                  <td
                    style={{
                      display: filterColumn.includes("workday")
                        ? "table-cell"
                        : "none",
                    }}
                  >
                    {item.workDay && FormatWorkday(item.workDay)}
                  </td>
                  <td
                    style={{
                      display: filterColumn.includes("type")
                        ? "table-cell"
                        : "none",
                    }}
                  >
                    {item.typeName}
                  </td>

                  <td
                    style={{
                      display: filterColumn.includes("district")
                        ? "table-cell"
                        : "none",
                    }}
                  >
                    {item.district}
                  </td>

                  <td
                    style={{
                      display: filterColumn.includes("province")
                        ? "table-cell"
                        : "none",
                    }}
                  >
                    {item.province}
                  </td>

                  <td
                    style={{
                      display: filterColumn.includes("status")
                        ? "table-cell"
                        : "none",
                    }}
                  >
                    <p className={item.status && item.status.toLowerCase() === "active" ? "active" : "deactive"}>{item.status}</p>
                  </td>
                  <td>
                    <Link to={`/admin/hospital/${item.code}/service`} className='link_tag'>
                      <p className='view_'>View</p>
                    </Link>
                  </td>
                </tr>
              ))) : (
                <tr>
                  <td colSpan={header.length + 1} style={{ textAlign: "center" }}>
                    Not data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div>
          {totalPage > 0 && (
            <div className='pagination'>
              <button
                onClick={() => { setPage((prev) => ({ ...prev, page: page.page - 1 })) }}
                disabled={page.page + 1 === 1}
              >
                Prev
              </button>
              {renderPagination(page.page + 1, totalPage, handlePage)}
              <button
                onClick={() => { setPage((prev) => ({ ...prev, page: page.page + 1 })) }}
                disabled={page.page + 1 === totalPage}
              >
                Next
              </button>
            </div>

          )}
        </div>
      </section>

    </ListHospitalPage>
  );
}
