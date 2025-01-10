import React, { useCallback, useEffect, useState } from "react";
import { ListNewsPage } from "../data/dataBlogs";
import LoadingPage from "../../../shared/Config/LoadingPage";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useAdminContext } from "../../../shared/hook/ContextToken";
import SearchInput from "../../../shared/component/InputFilter/SearchInput";
import { formatDateBlogDetail } from "../../../shared/function/FomatDate";
import { renderPagination } from "../../../shared/function/Pagination";
import { apiRequestAutherize } from "../../../shared/hook/Api/ApiAuther";
import { createNotification } from "../../../shared/Config/Notifications";
import { Tooltip as ReactTooltip } from 'react-tooltip';
export default function BlogList() {
  const navigate = useNavigate();
  const [, , removeCookie] = useCookies(["authorize_token_admin"]);

  const [page, setPage] = useState({
    page: 0,
    size: 7,
  });
  const [search, setSearch] = useState("");
  const [totalPage, setTotalPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAdminContext();

  const handlePage = (value) => {
    console.log(value);
    setPage((prev) => ({
      ...prev,
      page: value - 1,
    }));
  };

  const [timeoutId, setTimeoutId] = useState(null);
  const handelChangeSearch = (e) => {
    const newValue = e.target.value;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const handler = setTimeout(() => {
      setSearch((prev) => ({ ...prev, search: newValue }));
    }, 1000);
    setTimeoutId(handler);
  };

  const [blogs, setBlogs] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      if (token) {

        setIsLoading(true)
        var rs = await apiRequestAutherize("POST", `news/getAll`, token, {
          search: search,
          page: page.page,
          size: page.size
        })
        console.log(rs.data);
        if (rs && rs.data && rs.data.status === 200) {
          setBlogs(rs.data.data.content)
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
  }, [page, search, token, removeCookie],);
  useEffect(() => {
    fetchData()
  }, [fetchData]);


  const changeStatus = async (id) => {
    try {
      if (token) {


        var rs = await apiRequestAutherize("GET", `news/changeStatus/${id}`, token)
        console.log(rs.data);
        if (rs && rs.data && rs.data.status === 200) {
          fetchData()
          createNotification("success", "Change Status success", "Success")()
        } else {
          createNotification("error", "Change Status failed", "Error")()
        }
      }
    } catch (error) {

      createNotification("error", error.message && error.message, "Error")()

    }
  }
  return (
    <ListNewsPage>
      <LoadingPage key={"ltt"} isloading={isLoading} />
      <section className="section_filter">
        <div className="left">
          <div className="box_create_newHospital">
            <Link className="link_tag" to={"/admin/blogs/create"}>
              <button >New Blogs</button>
            </Link>

          </div>
          <SearchInput fnChangeCallback={handelChangeSearch} />
        </div>
        <div className="right"></div>
      </section>
      <section className="section_list">
        <div className="data_table">
          <table className="table_">
            <thead>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Update Date</th>
              <th>Create Date</th>
              <th>Status</th>
              <th>Action</th>
            </thead>
            <tbody>
              {blogs && blogs.length > 0 ? (
                blogs.map((item, index) => (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td
                      style={{
                        maxWidth: "300px",


                        WebkitLineClamp: 1,
                        overflow: "hidden",

                        textOverflow: "ellipsis",


                      }}
                    >{item.title}</td>
                    <td>{item.firstName} {item.lastName}</td>
                    <td>{formatDateBlogDetail(item.createDate)}</td>
                    <td>{formatDateBlogDetail(item.updateDate)}</td>

                    <td>
                      <p
                        className={
                          item.status && item.status.toLowerCase() === "active"
                            ? "active"
                            : "deactive"
                        }
                        style={{ color: "white" }}
                        onClick={() => changeStatus(item.id)}
                      >
                        {item.status}
                      </p>
                    </td>
                    <td>


                      <div className='list_action'>
                        <Link className='link_tag' to={`/admin/blogs/details/${item.id}`}><i data-tooltip-id="tooltip"
                          data-tooltip-content={"View Details"} class="fa-solid fa-eye"></i></Link>

                        <ReactTooltip id="tooltip" place="top" effect="solid" />
                      </div>


                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center" }}>
                    Not data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div>
          {totalPage > 0 && (
            <div className="pagination">
              <button
                onClick={() => {
                  setPage((prev) => ({ ...prev, page: page.page - 1 }));
                }}
                disabled={page.page + 1 === 1}
              >
                Prev
              </button>
              {renderPagination(page.page + 1, totalPage, handlePage)}
              <button
                onClick={() => {
                  setPage((prev) => ({ ...prev, page: page.page + 1 }));
                }}
                disabled={page.page + 1 === totalPage}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </ListNewsPage>
  );
}
