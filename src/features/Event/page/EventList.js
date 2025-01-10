import React, { useCallback, useEffect, useState } from "react";
import { EventPage, status } from "../data/EventData";
import LoadingPage from "../../../shared/Config/LoadingPage";
import SearchInput from "../../../shared/component/InputFilter/SearchInput";
import { Link } from "react-router-dom";
import { useAdminContext } from "../../../shared/hook/ContextToken";
import { renderPagination } from "../../../shared/function/Pagination";
import { formatDate } from "../../../shared/function/FomatDate";
import SelectInput from "../../../shared/component/InputFilter/SelectInput";
import { createNotification } from "../../../shared/Config/Notifications";
import { useCookies } from "react-cookie";
import { apiRequestAutherize } from "../../../shared/hook/Api/ApiAuther";
import swal from 'sweetalert';
import RichTextEditor from "../../../shared/component/InputData/RichTextEditor"
import { Tooltip as ReactTooltip } from 'react-tooltip';
import InputComponent from "../../../shared/component/InputData/InputComponent"
import { jwtDecode } from "jwt-decode";
export default function EventList() {
  const [isLoading, setIsLoading] = useState(true);
  const [eventList, setEventList] = useState([]);
  const [, , removeCookie] = useCookies(["authorize_token_admin"]);
  const [page, setPage] = useState({
    page: 0,
    size: 7,
  });
  const [filter, setFilter] = useState({
    search: "",
    status: ""
  })
  const [totalPage, setTotalPage] = useState(0);
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
      setFilter((prev) => ({ ...prev, search: newValue }));
    }, 1000);
    setTimeoutId(handler);
  };
  const fetchData = useCallback(async () => {
    try {
      if (token) {
        var f = {
          status: filter.status,
          search: filter.search,
          page: page.page,
          size: page.size,

        }
        setIsLoading(true)
        var rs = await apiRequestAutherize("post", "eventVaccine/getAll", token, f)
        console.log(rs.data);
        if (rs && rs.data && rs.data.status === 200) {
          setEventList(rs.data.data.content)
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
  }, [page, filter, token, removeCookie],);
  useEffect(() => {
    fetchData()
  }, [fetchData]);






  const [mocupCreate, setMocupCreate] = useState(false);
  const [mocupEdit, setMocupEdit] = useState(false);
  const [valueForm, setValueForm] = useState({
    id: '',
    name: '',
    code: '',
    description: ''
  })
  const [errorForm, setErrorForm] = useState({
    name: '',
    code: '',
    description: ''
  })

  const hanldeUpdate = async (e) => {
    try {
      e.preventDefault()
      if (errorForm.name !== '' || errorForm.code !== '' || errorForm.description !== '') {
        swal("Validation", "Data invalid!", "error");
        return;
      }
      if (token) {
        var tokenjwt = jwtDecode(token)
        console.log(tokenjwt);
        var data = {
          name: valueForm.name,
          code: valueForm.code,
          description: valueForm.description,
          id: valueForm.id,
          userId: tokenjwt.id,
        }
        var rs = await apiRequestAutherize("post", "eventVaccine/update", token, data)
        console.log(rs);
        if (rs && rs.data && rs.data.status === 200) {
          setMocupEdit(false)
          setValueForm({
            code: '',
            name: '',
            description: '',
            id: null
          })
          setErrorForm({
            code: '',
            name: '',
            description: '',

          })
          fetchData()
          swal("Update", "Update Event Vaccine Success!", "success");
        } else {
          if (rs?.data?.message === "Duplicate code") {
            setErrorForm((prev) => ({
              ...prev,
              code: `Code is exist`
            }))
          }
          swal("Update", rs.data.message, "error");
        }

      }

    } catch (error) {
      swal("Update", error, "error");
    }
  }


  const handleCreate = async (e) => {
    try {
      e.preventDefault()
      var valid = true;
      if (valueForm.name === '') {
        setErrorForm((prev) => ({ ...prev, name: 'Name is required' }));
        valid = false;
      }

      if (valueForm.code === '') {
        setErrorForm((prev) => ({ ...prev, code: 'Code is required' }));
        valid = false;
      }

      if (valueForm.description === '') {
        setErrorForm((prev) => ({ ...prev, description: 'Description is required' }));
        valid = false;
      }
      if (errorForm.name !== ''
        || errorForm.code !== ''
        || errorForm.description !== ''
      ) {
        valid = false;
      }
      if (!valid) {
        swal("Validation", "Data invalid!", "error");
        return;
      }
      if (token) {
        var tokenjwt = jwtDecode(token)
        console.log(tokenjwt);
        var data = {
          name: valueForm.name,
          code: valueForm.code,
          description: valueForm.description,
          userId: tokenjwt.id,
        }
        var rs = await apiRequestAutherize("post", "eventVaccine/create", token, data)
        console.log(rs);
        if (rs && rs.data && rs.data.status === 200) {
          setMocupCreate(false)
          setValueForm({
            code: '',
            name: '',
            description: '',
            id: null
          })
          setErrorForm({
            code: '',
            name: '',
            description: '',

          })
          fetchData()
          swal("Create", "Create Event Vaccine Success!", "success");
        } else {
          if (rs?.data?.message === "Duplicate code") {
            setErrorForm((prev) => ({
              ...prev,
              code: `Code is exist`
            }))
          }
          swal("Create", rs.data.message, "error");
        }

      }

    } catch (error) {
      swal("Update", error, "error");
    }
  }






  const ChangeStatus = async (sid) => {
    try {
      setIsLoading(true)
      var rs = await apiRequestAutherize("GET", `eventVaccine/changeStatus/${sid}`, token)
      console.log(rs);
      if (rs && rs.data && rs.data.status) {
        switch (rs.data.status) {
          case 200:
            createNotification('success', 'Change Status success', 'Success')();
            fetchData()
            break;
          case 300:
            createNotification('error', rs.data.message, 'Failed')();
            break;
          case 400:
            createNotification('error', rs.data.data, 'Error')();
            break;
          default:
            break;
        }
      }
    } catch (error) {
      createNotification('error', "error", 'Error')();
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 300);
    }
  }
  return (
    <EventPage>
      <LoadingPage key={"ltt"} isloading={isLoading} />
      <section className="section_filter">
        <div className="left">
          <div className="box_create_newHospital">
            <button onClick={() => setMocupCreate(true)}>New Event</button>
          </div>
          <SearchInput fnChangeCallback={handelChangeSearch} />
        </div>
        <div className="right">
          <SelectInput
            defaultVl={status.find(option => option.value === filter.status)}
            options={status} multi={false}
            placeholder="Filter by status"
            fnChangeOption={(selected) => {
              setFilter((prev) => ({ ...prev, status: selected.value }));
            }}
          />
        </div>
      </section>
      <section className="section_list">
        <div className="data_table">
          <table className="table_">
            <thead>
              <th>Event Code</th>
              <th>Event Name</th>
              <th>Last Edit</th>
              <th>Create Date</th>
              <th>Update Date</th>
              <th>Status</th>
              <th>Action</th>
            </thead>
            <tbody>
              {eventList && eventList.length > 0 ? (
                eventList.map((item, index) => (
                  <tr key={index}>
                    <td>{item.code}</td>
                    <td>{item.name}</td>
                    <td>{item.emailUser}</td>
                    <td>{formatDate(item.createDate)}</td>
                    <td>{formatDate(item.updateDate)}</td>

                    <td>
                      <p
                        className={
                          item.status && item.status.toLowerCase() === "active"
                            ? "active"
                            : "deactive"
                        }
                        onClick={() => ChangeStatus(item.id)}
                      >
                        {item.status}
                      </p>
                    </td>
                    <td>
                      <div className='list_action'>
                        <Link className='link_tag' to={`/admin/event/details/${item.id}`}><i data-tooltip-id="tooltip"
                          data-tooltip-content={"View Details"} class="fa-solid fa-eye"></i></Link>
                        <i data-tooltip-id="tooltip"
                          data-tooltip-content={"Edit"} class="fa-solid fa-pen-to-square"
                          onClick={() => {
                            setValueForm({
                              code: item.code,
                              name: item.name,
                              description: item.description,
                              id: item.id
                            })
                            setMocupEdit(true)
                          }}
                        ></i>
                      </div>
                      <ReactTooltip id="tooltip" place="top" effect="solid" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center" }}>
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

      {mocupEdit && (
        <div className='mocup_edit_box'>
          <div className='container'>
            <p className='close' onClick={() => {
              setMocupEdit(false)
              setValueForm({
                code: '',
                name: '',
                description: '',
                id: null,
              })
              setErrorForm({
                code: '',
                name: '',
                description: '',
              })
            }}>X</p>
            <p className='title'>Edit Event Vaccine</p>
            <form onSubmit={hanldeUpdate}>
              <InputComponent
                Textlabel={"Name"}
                defaultValue={valueForm.name}
                isRequire={true}
                typeInput={"Text"}
                err={errorForm.name}
                fnChange={(value) => {
                  var name = value.target.value.trim()
                  setValueForm((prev) => ({
                    ...prev,
                    name: name
                  }))
                  if (name.trim() !== '') {
                    setErrorForm((prev) => ({
                      ...prev,
                      name: ''
                    }))
                  } else {
                    setErrorForm((prev) => ({
                      ...prev,
                      name: 'Name is required'
                    }))
                  }
                }}
              />
              <InputComponent
                Textlabel={"Code"}
                defaultValue={valueForm.code}
                err={errorForm.code}
                isRequire={true}
                typeInput={"Text"}
                fnChange={(value) => {
                  var code = value.target.value.trim()
                  var tokens = jwtDecode(token);
                  setValueForm((prev) => ({
                    ...prev,
                    code: code
                  }))

                  if (code.trim() !== '') {

                    setErrorForm((prev) => ({
                      ...prev,
                      code: ''
                    }))



                  } else {
                    setErrorForm((prev) => ({
                      ...prev,
                      code: `Code is required`
                    }))

                  }

                }}
              />
              <RichTextEditor
                Textlabel={"Description"}
                defaultValue={valueForm.description}
                isRequire={true}
                err={errorForm.description}
                typeInput={"Text"}
                fnChange={(value) => {
                  console.log(value);
                  var description = value
                  setValueForm((prev) => ({
                    ...prev,
                    description: description
                  }))
                  if (description.trim() !== '') {
                    setErrorForm((prev) => ({
                      ...prev,
                      description: ''
                    }))
                  } else {
                    setErrorForm((prev) => ({
                      ...prev,
                      description: 'description is required'
                    }))
                  }

                }}
              />

              <div className='box_btn'>
                <button type='submit'>Update</button>
              </div>

            </form>
          </div>
        </div>
      )}


      {mocupCreate && (
        <div className='mocup_edit_box'>
          <div className='container'>
            <p className='close' onClick={() => {
              setMocupCreate(false)
              setValueForm({
                code: '',
                name: '',
                description: '',
                id: null,
              })
              setErrorForm({
                code: '',
                name: '',
                description: '',
              })
            }}>X</p>
            <p className='title'>Create New Event Vaccine</p>
            <form onSubmit={handleCreate}>
              <InputComponent
                Textlabel={"Name"}
                isRequire={true}
                typeInput={"Text"}
                err={errorForm.name}
                fnChange={(value) => {
                  var name = value.target.value.trim()
                  setValueForm((prev) => ({
                    ...prev,
                    name: name
                  }))
                  if (name.trim() !== '') {
                    setErrorForm((prev) => ({
                      ...prev,
                      name: ''
                    }))
                  } else {
                    setErrorForm((prev) => ({
                      ...prev,
                      name: 'Name is required'
                    }))
                  }

                }}

              />

              <InputComponent
                Textlabel={"Code"}

                err={errorForm.code}
                isRequire={true}
                typeInput={"Text"}
                fnChange={(value) => {
                  var code = value.target.value.trim()
                  var tokens = jwtDecode(token);
                  setValueForm((prev) => ({
                    ...prev,
                    code: code
                  }))
                  if (code.trim() !== '') {

                    setErrorForm((prev) => ({
                      ...prev,
                      code: ''
                    }))

                  } else {
                    setErrorForm((prev) => ({
                      ...prev,
                      code: `Code is required`
                    }))
                  }
                }}
              />
              <RichTextEditor
                Textlabel={"Description"}
                defaultValue={valueForm.description}
                isRequire={true}
                err={errorForm.description}
                typeInput={"Text"}
                fnChange={(value) => {
                  console.log(value);
                  var description = value
                  setValueForm((prev) => ({
                    ...prev,
                    description: description
                  }))
                  if (description.trim() !== '') {
                    setErrorForm((prev) => ({
                      ...prev,
                      description: ''
                    }))
                  } else {
                    setErrorForm((prev) => ({
                      ...prev,
                      description: 'description is required'
                    }))
                  }

                }}
              />

              <div className='box_btn'>
                <button type='submit'>Create</button>
              </div>

            </form>
          </div>
        </div>
      )}


    </EventPage>
  );
}
