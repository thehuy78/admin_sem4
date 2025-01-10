import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { status, headerjson, ListVaccinePage, fee } from "../data/DataVaccine"

import SearchInput from '../../../shared/component/InputFilter/SearchInput';
import SelectInput from '../../../shared/component/InputFilter/SelectInput';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { apiRequestAutherize } from '../../../shared/hook/Api/ApiAuther';
import { useAdminContext } from '../../../shared/hook/ContextToken';
import { renderPagination } from '../../../shared/function/Pagination';
import { formatDate } from '../../../shared/function/FomatDate';
import { createNotification } from '../../../shared/Config/Notifications';
import { useCookies } from 'react-cookie';
import LoadingPage from '../../../shared/Config/LoadingPage';


export default function ListVaccine() {
  //datafetch
  const [vaccine, setVaccine] = useState();
  //filter
  const [filter, setFilter] = useState({
    status: '',
    search: '',
    fee: []
  });

  const navigate = useNavigate();
  const [, , removeCookie] = useCookies(["authorize_token_admin"]);
  const { code } = useParams()
  const [page, setPage] = useState({
    page: 0,
    size: 7,
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
          status: filter.status,
          search: filter.search,
          fee: filter.fee,
          page: page.page,
          size: page.size,
          codehospital: code
        }
        setIsLoading(true)
        var rs = await apiRequestAutherize("post", "vaccine/getbyhospital", token, f)
        console.log(rs.data);
        if (rs && rs.data && rs.data.status === 200) {
          setVaccine(rs.data.data.content)
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
  }, [token, filter, page, code])

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
    "code", "name", "fee", "floor", "zone", "createDate", "status"
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
    <ListVaccinePage>
      <LoadingPage key={"lvc"} isloading={isLoading} />
      {vaccine && vaccine.length > 0 ? (
        <section className='brums_nav'>
          <span onClick={() => { navigate(-1) }}><i class="fa-solid fa-arrow-left"></i> </span>
          <Link className='link_tag' to={"/admin/hospital"}><span>Hospital</span></Link>

          <i className="fa-solid fa-angle-right"></i>
          <span>{vaccine[0].hospitalName}</span>
          <i className="fa-solid fa-angle-right"></i>
          <span>List Vaccine</span>

        </section>
      ) : (
        <section className='brums_nav'>

          <span onClick={() => { navigate(-1) }}><i class="fa-solid fa-arrow-left"></i> Back</span>

        </section>
      )}

      <section className='section_filter'>
        <div className='left'>
          <SelectInput
            defaultVl={fee.find(option => option.value === filter.fee)}
            options={fee} multi={false}
            placeholder="Filter by Fee"
            fnChangeOption={(selected) => {
              setFilter((prev) => ({ ...prev, fee: selected.value }));
            }}
          />
          <SearchInput fnChangeCallback={handelChangeSearch} />
        </div>
        <div className='right'>

          <div>
            <SelectInput key={1}
              defaultVl={status.find(status => status.value === filter.status)}
              multi={false}
              options={status}
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
                  {headerjson &&
                    headerjson.length > 0 &&
                    headerjson.map((item, index) => (
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
              {headerjson &&
                headerjson.length > 0 &&
                headerjson.map((item, index) => (
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
              {vaccine &&
                vaccine.length > 0 ? (
                vaccine.map((item, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        display: filterColumn.includes("code hospital")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.hospitalCode}
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("name hospital")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.hospitalName}
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
                        display: filterColumn.includes("fee")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.fee}
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
                        display: filterColumn.includes("description")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      <div>
                        <span
                          data-tooltip-id="tooltip" // Tạo ID cho tooltip
                          data-tooltip-content={item.description} // Nội dung của tooltip
                          style={{
                            maxWidth: '200px', // Chiều rộng tối đa cho text
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: 'inline-block',
                            cursor: 'pointer',
                          }}
                        >
                          {item.description}
                        </span>
                        <ReactTooltip id="tooltip" place="top" effect="solid" />
                      </div>
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("createDate")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {formatDate(item.createDate)}
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("updateDate")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {formatDate(item.updateDate)}
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("last edit")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.emailUser}
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
                      <Link to={`/admin/booking/vaccine/${item.code}`} className='link_tag'>
                        <p className='view_'>View</p>
                      </Link>
                    </td>
                  </tr>
                ))) : (
                <tr>
                  <td colSpan={headerjson.length + 1} style={{ textAlign: "center" }}>
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
    </ListVaccinePage>
  );
}
