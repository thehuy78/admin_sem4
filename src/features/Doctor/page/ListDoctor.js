import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { headerjson, ListDoctorPage, fee, leveldoctor, timeWork, gender } from "../data/DataDoctor"
import SearchInput from '../../../shared/component/InputFilter/SearchInput';
import SelectInput from '../../../shared/component/InputFilter/SelectInput';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { apiRequestAutherize } from '../../../shared/hook/Api/ApiAuther';
import { useAdminContext } from '../../../shared/hook/ContextToken';
import { renderPagination } from '../../../shared/function/Pagination';
import FormatWorkday from '../../../shared/function/FomatWorkday';
import { createNotification } from '../../../shared/Config/Notifications';
import { useCookies } from 'react-cookie';
import LoadingPage from '../../../shared/Config/LoadingPage';

export default function ListDoctor() {
  //datafetch
  const [doctor, setDoctor] = useState();
  const [header, setHeader] = useState(headerjson);
  //filter
  const [filter, setFilter] = useState({
    level: '',
    timeWork: '',
    gender: '',
    search: '',
    fee: []

  });
  const [, , removeCookie] = useCookies(["authorize_token_admin"]);
  const navigate = useNavigate()
  const { code, codedeparment } = useParams()
  const [page, setPage] = useState({
    page: 0,
    size: 5,
  })
  const [totalPage, setTotalPage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { token } = useAdminContext()
  useEffect(() => {
    setPage((prev) => ({ ...prev, page: 0 }))
  }, [filter]);

  const fetchdata = useCallback(async () => {
    try {
      if (token) {
        var f = {
          level: filter.level,
          timeWork: filter.timeWork,
          gender: filter.gender,
          fee: filter.fee,
          search: filter.search,
          page: page.page,
          size: page.size,
          codehospital: code,
          codedepartment: codedeparment
        }
        setIsLoading(true)
        var rs = await apiRequestAutherize("post", "doctor/getall", token, f)
        console.log(rs.data);
        if (rs && rs.data && rs.data.status === 200) {
          setDoctor(rs.data.data.content)
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
  }, [token, filter, page, code, codedeparment, removeCookie])


  useEffect(() => {

    fetchdata();

  }, [fetchdata, filter, page, code, codedeparment]);

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








  const [showFilterOption, setShowFilterOption] = useState(false);
  const [showFilterColumn, setShowFilterColumn] = useState(false);
  const [filterColumn, setFilterColumn] = useState([
    "name",
    "avatar",
    "daywork",
    "timework",
    "level",
    "gender",
    "fee",
    "status",
    "room",
    "pattient",
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
    <ListDoctorPage>
      <LoadingPage key={"ldt"} isloading={isLoading} />
      <section className='brums_nav'>
        {doctor && doctor.length > 0 ? (
          <>
            <span onClick={() => { navigate(-1) }}><i class="fa-solid fa-arrow-left"></i> </span>
            <Link className="link_tag" to={"/admin/hospital"}><span>Hospital</span></Link>
            <i className="fa-solid fa-angle-right"></i>
            <Link className="link_tag" to={`/admin/hospital/${doctor[0].hospitalCode}/department`}><span>{doctor[0].hospitalName}</span></Link>
            <i className="fa-solid fa-angle-right"></i>
            <span>{doctor[0].departmentName}</span>
            <i className="fa-solid fa-angle-right"></i>
            <span>List Doctor</span>
          </>
        ) : (
          <span onClick={() => { navigate(-1) }}><i class="fa-solid fa-arrow-left"></i> Back</span>
        )}
      </section>


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
                  <span className='triangle'></span>
                  <div className='container_list_option'>
                    <div className='item'>
                      <span>Gender</span>
                      <SelectInput
                        defaultVl={gender.find(option => option.value === filter.gender)}
                        options={gender} multi={false}
                        fnChangeOption={(selected) => {
                          setFilter((prev) => ({ ...prev, gender: selected.value }));
                        }}
                      />
                    </div>
                    <div className='item'>
                      <span>TimeWork</span>
                      <SelectInput
                        defaultVl={timeWork.find(option => option.value === filter.timeWork)}
                        options={timeWork} multi={false}
                        fnChangeOption={(selected) => {
                          setFilter((prev) => ({ ...prev, timeWork: selected.value }));
                        }}
                      />
                    </div>
                    <div className='item'>
                      <span>Fee</span>
                      <SelectInput
                        defaultVl={fee.find(option => option.value === filter.fee)}
                        options={fee} multi={false}
                        fnChangeOption={(selected) => {
                          setFilter((prev) => ({ ...prev, fee: selected.value }));
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
              defaultVl={leveldoctor.find(type => type.value === filter.level)}
              multi={false}
              options={leveldoctor}
              fnChangeOption={(selected) => {
                setFilter((prev) => ({ ...prev, level: selected.value }));
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
              {doctor &&
                doctor.length > 0 ? (
                doctor.map((item, index) => (
                  <tr key={index}>
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
                        display: filterColumn.includes("avatar")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      <div style={{ width: "60px", margin: "auto" }}>
                        <img style={{ width: "100%", aspectRatio: "1/1", borderRadius: "50%" }} alt='' src={item.avatar} />
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
                        display: filterColumn.includes("daywork")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {FormatWorkday(item.workDay)}
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("timework")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.timeWork}
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("level")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.level}
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("gender")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.gender}
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("fee")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.fee}
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("room")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.room}
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("pattient")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.patients}
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
                      <Link to={`/admin/booking/doctor/${item.code}`} className='link_tag'>
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
    </ListDoctorPage>
  );
}

