import React, { useCallback, useEffect, useState } from "react";
import LoadingPage from "../../../shared/Config/LoadingPage";
import SelectInput from "../../../shared/component/InputFilter/SelectInput";
import SearchInput from "../../../shared/component/InputFilter/SearchInput";
import { status, ListAccountPage, theadTopicCus } from "../data/DataAccount";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useAdminContext } from "../../../shared/hook/ContextToken";
import { apiRequestAutherize } from "../../../shared/hook/Api/ApiAuther";
import { createNotification } from "../../../shared/Config/Notifications";
import { renderPagination } from "../../../shared/function/Pagination";
import { formatDate } from "../../../shared/function/FomatDate";

export default function ListAccountCustomer() {
  const [filter, setFilter] = useState({
    status: "",
    search: ""
  });


  const [isLoading, setIsLoading] = useState(false);
  const [showFilterColumn, setShowFilterColumn] = useState(false);
  const [filterColumn, setFilterColumn] = useState([
    "email",
    "avatar",
    "firstName",
    "lastName",
    "role",
    "verify",
    "createDate",
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


  const [account, setAccount] = useState()
  const [, , removeCookie] = useCookies(["authorize_token_admin"]);
  const [page, setPage] = useState({
    page: 0,
    size: 7,
  })
  const [totalPage, setTotalPage] = useState(0)
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
          role: 'customer',
          page: page.page,
          size: page.size,

        }
        setIsLoading(true)
        var rs = await apiRequestAutherize("post", "auth/getaccount", token, f)
        setTimeout(() => {
          setIsLoading(false)
        }, 500);
        console.log(rs.data);
        if (rs && rs.data && rs.data.status === 200) {
          setAccount(rs.data.data.content)
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
      }, 500);
    }
  }, [token, filter, page, removeCookie])


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

  return (
    <ListAccountPage>
      <LoadingPage isloading={isLoading} />
      <section className="section_filter">
        <div className="left">

          <SearchInput
            fnChangeCallback={handelChangeSearch}
          />
        </div>
        <div className="right">
          <div>
            <SelectInput
              key={1}
              defaultVl={status.find(
                (type) => type.value === filter.status
              )}
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
                  {theadTopicCus &&
                    theadTopicCus.length > 0 &&
                    theadTopicCus.map((item, index) => (
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
              {theadTopicCus &&
                theadTopicCus.length > 0 &&
                theadTopicCus.map((item, index) => (
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
              {account &&
                account.length > 0 ? (
                account.map((item, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        display: filterColumn.includes("email")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.email}
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("avatar")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      <div style={{ width: "60px", padding: "0 0.5rem", margin: "auto" }}>
                        <img style={{ width: "100%", aspectRatio: "1/1", borderRadius: "50%" }} alt='' src={item.avatar} />
                      </div>
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("firstName")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.firstName}
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("lastName")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.lastName}
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("role")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.role}
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("verify")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.verify ? "Verified" : "Not verified"}
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("balance")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.balance}
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("booking")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.booking}
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
                        display: filterColumn.includes("status")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      <p className={item.status && item.status.toLowerCase() === "active" ? "active" : "deactive"}>{item.status}</p>
                    </td>
                    <td>
                      <Link className="link_tag">
                        <p className='view_'>View</p>
                      </Link>
                    </td>
                  </tr>
                ))) : (
                <tr>
                  <td colSpan={theadTopicCus.length + 1} style={{ textAlign: "center" }}>
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
    </ListAccountPage>
  );
}
