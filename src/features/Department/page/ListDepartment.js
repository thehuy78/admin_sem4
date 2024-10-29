import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { headerjson, ListDepartmentPage, statusDeparment } from "../data/DataDepartment"

import SearchInput from '../../../shared/component/InputFilter/SearchInput';
import SelectInput from '../../../shared/component/InputFilter/SelectInput';

import { Link, useNavigate, useParams } from 'react-router-dom';
import { apiRequestAutherize } from '../../../shared/hook/Api/ApiAuther';
import { useAdminContext } from '../../../shared/hook/ContextToken';
import { renderPagination } from '../../../shared/function/Pagination';
import { formatDate } from '../../../shared/function/FomatDate';
import { createNotification } from '../../../shared/Config/Notifications';
import { useCookies } from 'react-cookie';
import LoadingPage from '../../../shared/Config/LoadingPage';


export default function ListDepartment() {
  //datafetch
  const [department, setDepartment] = useState();
  const [header, setHeader] = useState(headerjson);
  //filter
  const [filter, setFilter] = useState({
    status: '',
    search: ''
  });

  const navigate = useNavigate();
  const [, , removeCookie] = useCookies(["authorize_token_admin"]);
  const { code } = useParams()
  const [page, setPage] = useState({
    page: 0,
    size: 7,
  })
  const [totalPage, setTotalPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const { token } = useAdminContext()
  useEffect(() => {
    setPage((prev) => ({ ...prev, page: 0 }))
  }, [filter]);

  const fetchdata = useCallback(async () => {
    try {
      if (token) {
        var f = {
          status: filter.status,
          search: filter.search,
          page: page.page,
          size: page.size,
          codehospital: code
        }
        setIsLoading(true)
        var rs = await apiRequestAutherize("post", "department/getall", token, f)
        console.log(rs.data);
        if (rs && rs.data && rs.data.status === 200) {
          setDepartment(rs.data.data.content)
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
  }, [token, filter, page, code, removeCookie])

  useEffect(() => {
    setTimeout(() => {
      fetchdata();
    }, 300);
  }, [fetchdata]);

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


  const [showFilterColumn, setShowFilterColumn] = useState(false);
  const [filterColumn, setFilterColumn] = useState([
    "code", "name", "floor", "zone", "doctorCount", "create", "status"
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
    <ListDepartmentPage>
      <LoadingPage key={"ldpm"} isloading={isLoading} />
      {department && department.length > 0 ? (
        <section className='brums_nav'>
          <span onClick={() => { navigate(-1) }}><i class="fa-solid fa-arrow-left"></i> </span>
          <Link className='link_tag' to={"/admin/hospital"}><span>Hospital</span></Link>

          <i className="fa-solid fa-angle-right"></i>
          <span>{department[0].nameHospital}</span>
          <i className="fa-solid fa-angle-right"></i>
          <span>List Department</span>

        </section>
      ) : (
        <section className='brums_nav'>

          <span onClick={() => { navigate(-1) }}><i class="fa-solid fa-arrow-left"></i> Back</span>

        </section>
      )}

      <section className='section_filter'>
        <div className='left'>

          <SearchInput fnChangeCallback={handelChangeSearch} />
        </div>
        <div className='right'>
          <div>
            <SelectInput key={1}
              defaultVl={statusDeparment.find(status => status.value === filter.status)}
              multi={false}
              options={statusDeparment}
              fnChangeOption={(selected) => {
                setFilter((prev) => ({ ...prev, status: selected.value }));
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
                      <div key={index}>
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
      <section className="section_list">
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
              {department &&
                department.length > 0 ? (
                department.map((item, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        display: filterColumn.includes("code hospital")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.codeHospital}
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("name hospital")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.nameHospital}
                    </td>
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
                        display: filterColumn.includes("name")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.name}
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("floor")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.floor}
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("zone")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.zone}
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("doctorCount")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.doctorCount}
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("create")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {formatDate(item.createDate)}
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
                      <Link to={`/admin/hospital/${code}/department/${item.code}/doctor`} className='link_tag'>
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
    </ListDepartmentPage>
  );
}
