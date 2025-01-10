import React, { useCallback, useEffect, useState } from 'react'

import SearchInput from "../../../shared/component/InputFilter/SearchInput"
import { useAdminContext } from '../../../shared/hook/ContextToken'
import { apiRequestAutherize } from '../../../shared/hook/Api/ApiAuther'
import LoadingPage from '../../../shared/Config/LoadingPage'
import { createNotification } from '../../../shared/Config/Notifications'
import { renderPagination } from '../../../shared/function/Pagination'
import { formatDate } from '../../../shared/function/FomatDate'
import swal from 'sweetalert';
import { ServicePage } from '../data/dataServices'
export default function Services() {
  const { token } = useAdminContext()
  const [hospital, setHospital] = useState()
  const [service, setService] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState({
    page: 0,
    pageSize: 7
  })
  const [totalPage, setTotalPage] = useState(0)


  const [search, setSearch] = useState('')
  const [timeoutId, setTimeoutId] = useState(null);
  const handelChangeSearch = (e) => {
    const newValue = e.target.value;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const handler = setTimeout(() => {
      setSearch(newValue);
    }, 1000);
    setTimeoutId(handler);
  };

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      if (token) {
        var rs = await apiRequestAutherize("GET", `services/getall?pageNumber=${page.page}&pageSize=${page.pageSize}&search=${search}`, token)
        var rsservice = await apiRequestAutherize("GET", `services/getservice`, token)
        console.log(rsservice);
        if (rs && rs.data && rs.data.status === 200) {
          setHospital(rs.data.data.data)
          setTotalPage(rs.data.data.totalPages)
        }
        if (rsservice && rsservice.data && rsservice.data.status === 200) {
          setService(rsservice.data.data)

        }
      }

    } catch (error) {

    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 500);
    }
  }, [token, page, search])

  useEffect(() => {
    fetchData()
  }, [fetchData]);

  const handleChangeStatus = async (id) => {
    try {
      var rs = await apiRequestAutherize("GET", `services/changestatus/${id}`, token)

      if (rs && rs.data && rs.data.status === 200) {
        fetchData()
        createNotification("success", "Change Service Success", "Success")()
      }
    } catch (error) {

    }
  }


  const handlePage = (value) => {
    setPage((prev) => ({
      ...prev, page: value - 1
    }))
  }

  const [view, setView] = useState(true)
  const [mocupcreate, setMocupcreate] = useState(false)

  const [mocupUpdate, setMocupUpdate] = useState(false)
  const [serviceCurrentUpdate, setServiceCurrentUpdate] = useState()


  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true)
      var name = document.getElementById("name_service_create").value
      var rs = await apiRequestAutherize("Get", `services/addservice/${name.trim()}`, token,)
      setTimeout(() => {
        setIsLoading(false)
      }, 500);
      console.log(rs);
      if (rs && rs.data && rs.data.status === 200) {
        setMocupcreate(false)
        swal("Create", "Create Service Successfuly!", "success");
        fetchData()
      }
    } catch (error) {

    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 500);

    }
  }


  const handleEditService = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true)
      var name = document.getElementById("name_service_edit").value
      var id = document.getElementById("id_service_edit").value
      var res = {
        id: id.trim(),
        name: name.trim()
      }
      var rs = await apiRequestAutherize("Post", `services/editservice`, token, res)
      setTimeout(() => {
        setIsLoading(false)
      }, 500);
      console.log(rs);
      if (rs && rs.data && rs.data.status === 200) {
        setMocupUpdate(false)
        swal("Update", "Edit Service Successfuly!", "success");
        fetchData()
      }
    } catch (error) {

    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 500);

    }
  }
  return (
    <ServicePage>
      <LoadingPage isloading={isLoading} />
      <section className='sec1'>
        <div className='left'>
          <button onClick={() => { setMocupcreate(true) }}>New Service</button>
        </div>
        <div className='right'>
          <SearchInput fnChangeCallback={handelChangeSearch} />
          <div className='button_view' onClick={() => { setView(prev => !prev) }}>
            <i className="fa-solid fa-layer-group"></i>
          </div>
        </div>
      </section>
      {view ? (
        <section className='sec2'>
          <div className='b_table'>
            <table className='table_'>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  {service && service.length > 0 && service.map((item, index) => (
                    <th key={index}>{item.name}</th>
                  ))}

                </tr>
              </thead>
              <tbody>
                {hospital && hospital.length > 0 && hospital.map((hospitalItem, index) => (
                  <tr key={index}>
                    <td>{hospitalItem.code}</td>
                    <td>{hospitalItem.name}</td>
                    {service && service.length > 0 && service.map((serviceItem, serviceIndex) => {
                      const matchingService = hospitalItem.services.find(hospitalService => hospitalService.name === serviceItem.name);
                      return (
                        <td key={serviceIndex}>
                          {matchingService ? (
                            <div>
                              <p
                                onClick={() => handleChangeStatus(matchingService.id)}
                                className={matchingService.status}
                              >
                                {matchingService.status}
                              </p>
                            </div>
                          ) : (
                            <div>No service</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
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
      ) : (
        <section className='sec2'>
          <div className='b_table'>
            <table className='table_'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Service</th>
                  <th>Status</th>
                  <th>CreateDate</th>
                  <th>UpdateDate</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {service && service.length > 0 && service.map((item, index) => (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td><div><p className={item.status}>{item.status}</p></div></td>
                    <td>{formatDate(item.createDate)}</td>
                    <td>{formatDate(item.updateDate)}</td>
                    <td><div onClick={() => {
                      setMocupUpdate(true)
                      setServiceCurrentUpdate(item)
                    }}><i class="fa-solid fa-pen" ></i> </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}


      {mocupcreate && (
        <div className='moc_up_service'>
          <form onSubmit={handleAddService}>
            <p className='title'>Create new Service</p>
            <p className='close' onClick={() => { setMocupcreate(false) }}>x</p>
            <div>
              <label>Service Name</label>
              <input id='name_service_create' />
            </div>
            <div>
              <button type='submit'>Add Service</button>
            </div>
          </form>
        </div>
      )}


      {mocupUpdate && serviceCurrentUpdate && (
        <div className='moc_up_service'>
          <form onSubmit={handleEditService}>
            <p className='title'>Create new Service</p>
            <p className='close' onClick={() => { setMocupUpdate(false) }}>x</p>
            <div>
              <label>Service ID</label>
              <input defaultValue={serviceCurrentUpdate.id} readOnly id='id_service_edit' />
            </div>
            <div>
              <label>Service Name</label>
              <input defaultValue={serviceCurrentUpdate.name} id='name_service_edit' />
            </div>
            <div>
              <button type='submit'>Update Service</button>
            </div>
          </form>
        </div>
      )}
    </ServicePage>
  )
}
