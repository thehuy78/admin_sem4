import React, { useCallback, useEffect, useState } from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip';
import SelectInput from '../../../shared/component/InputFilter/SelectInput';
import { OptionFilter, OptionSendNoti } from "../data/dataNotification"
import { useAdminContext } from '../../../shared/hook/ContextToken';
import RangeDateInput from '../../../shared/component/InputFilter/RangeDateInput';
import { apiRequestAutherize } from '../../../shared/hook/Api/ApiAuther';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { createNotification } from '../../../shared/Config/Notifications';
import { renderPagination } from '../../../shared/function/Pagination';
import { formatDate } from '../../../shared/function/FomatDate';
import LoadingPage from "../../../shared/Config/LoadingPage"
import styled from 'styled-components';
import swal from 'sweetalert';
import { jwtDecode } from 'jwt-decode';
const NotificationPage = styled.div`

  
  padding:0 0 1rem;
  border-radius: 0.5rem;

 
  .sec1 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      p {
        font-weight: 800;
        font-size: var(--fz_medium);
      }
    }
    .right {
      display: flex;
      gap: 1rem;
      align-items: center;
      .send_noti_btn {
        height: 2.5rem;
        padding: 0 1rem;
        background-color: green;
        color: white;
        font-weight: 700;
        border-radius: 0.3rem;
        height: 2.5rem;
        outline: none;
        overflow: hidden;
        border: 1px solid var(--shadow-black);
        box-shadow: 0 0 2px var(--shadow-black);
      }
    }
  }
  .sec2 {
    padding-top: 1rem;
    gap: 1rem;
    .table_container {
      min-height: 28rem;
      .table_ {
        border-collapse: collapse;
        width: 100%;
        transition: width 1s ease-in;
        // min-height: 28rem;
        thead {
          background-color: var(--cl_3);
          th {
            padding: 0.5rem 0.3rem;
            color: white;
            font-size: 1rem;
            font-weight: 700;
            text-transform: capitalize;
          }
        }
        tbody {
          background-color: white;
          tr {
            border-bottom: 0.05rem solid var(--shadow-black);
            td {
              height: 45px;
              padding: 0 0.5rem;
              text-align: center;
              font-size: var(--fz_small);
              width: max-content;
              white-space: nowrap;
              .active {
                padding: 0.2rem;
                font-size: var(--fz_smallmax);
                background-color: green;
                border-radius: 0.5rem;
                cursor: pointer;
                color: white;
              }
              .deactive {
                padding: 0.2rem;
                font-size: var(--fz_smallmax);
                background-color: orange;
                border-radius: 0.5rem;
                cursor: pointer;
                color: white;
              }
              .b_action___ {
                display: flex;
                gap: 1rem;
                justify-content: center;
                .link_tag {
                  i {
                    display: flex;
                    align-items: center;
                    background-color: var(--cl_1);
                    justify-content: center;
                    padding: 0.4rem;
                    border-radius: 0.2rem;
                  }
                }
              }
            }
          }
        }
      }
    }

    .form_create {
      width: 100%;
      transition: width 1s ease-in;
    }
    .box_table_,
    .form_create {
      transition: flex-basis 1s ease-in-out;
    }
    .form_create {
      background-color: var(--cl_3);
      padding: 1rem;
      .btn_close {
        text-align: right;
        cursor: pointer;
        span {
          background-color: white;
          padding: 0.3rem 0.5rem;
          font-size: var(--fz_smallmax);
        }
      }
      .title {
        text-align: center;
        font-size: var(--fz_medium);
        color: white;
        font-weight: 800;
        padding-bottom: 1rem;
      }
      div {
        p {
          font-size: var(--fz_small);
          text-transform: uppercase;
          font-weight: 700;
          padding: 0.2rem 0;
          color: var(--white);
        }
        textarea {
          width: 100%;
          line-height: 1.2rem;
          padding: 0.7rem 0.5rem;
          border: none;
          outline: none;
          min-height: 10rem;
          border-radius: 0.3rem;
          border: 0.05rem solid var(--shadow-black);
          box-shadow: 0 0 2px var(--shadow-black);

          &:focus {
            border: 1px solid var(--active);
          }
        }
      }
      .btn_submit_noti {
        display: flex;
        padding: 1rem 0;

        justify-content: center;
        button {
          width: 100%;
          padding: 0.5rem 0;
          background-color: var(--cl_4);
          color: white;
          outline: none;
          border: none;
          font-weight: 800;
          border-radius: 0.5rem;
          letter-spacing: 0.1rem;
          box-shadow:
            -2px -2px 6px -2px var(--cl_1),
            2px 2px 2px var(--cl_2);
        }
      }
    }
  }

`;


export default function Notification() {
  const today = new Date();
  const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 29);
  const startDate = new Date(thirtyDaysAgo.getFullYear(), thirtyDaysAgo.getMonth(), thirtyDaysAgo.getDate(), 0, 0, 0, 0);
  const [dateRange, setDateRange] = useState([startDate, endDate]);
  const { token } = useAdminContext()
  const [role, setRole] = useState('medcare')
  const [createActive, setCreateActive] = useState(false)
  const [notification, setNotification] = useState()
  const navigate = useNavigate();
  const [, , removeCookie] = useCookies(["authorize_token_admin"]);
  const [page, setPage] = useState({
    page: 0,
    size: 9,
  })
  const [totalPage, setTotalPage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      if (token) {
        var tokenJwt = jwtDecode(token);

        var filter = {
          idUser: tokenJwt.id,
          startDate: dateRange[0].toISOString(),
          endDate: dateRange[1].toISOString(),
          page: page.page,
          size: page.size

        }
        setIsLoading(true)
        var rs = await apiRequestAutherize("POST", "notification/getall", token, filter)
        console.log(rs);
        if (rs && rs.data && rs.data.status === 200) {
          setNotification(rs.data.data.content)
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
    }
    finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 500);

    }
  }, [token, dateRange, removeCookie, page, role])

  useEffect(() => {
    setTimeout(() => {
      fetchData()
    }, 300);

  }, [fetchData]);
  const handlePage = (value) => {
    console.log(value);
    setPage((prev) => ({
      ...prev, page: value - 1
    }))
  }


  var [roleSendNoti, setRoleSendNoti] = useState('customer')

  const sendNotification = async (e) => {
    e.preventDefault();
    try {
      var mes = document.getElementById("message_noti")
      var noti = {
        description: mes.value.trim(),
        role: roleSendNoti
      }
      var rs = await apiRequestAutherize("POST", "notification/create", token, noti)
      console.log(rs);
      if (rs && rs.data && rs.data.status === 200) {
        swal("Create", "Create Hospital Successfuly!", "success");
        e.target.reset()
        setCreateActive(false)
      }
    } catch (error) {
      createNotification("error", "Send message fails", "Error")()
    }
  }
  return (
    <NotificationPage>
      <LoadingPage isloading={isLoading} />
      <ReactTooltip id="all" place="bottom" effect="solid" />
      <ReactTooltip id="customer" place="bottom" effect="solid" />
      <ReactTooltip id="admin" place="bottom" effect="solid" />
      <div className='sec1'>
        <div className='left'>
          <p>   List    Notification</p>

        </div>
        <div className='right'>
          <SelectInput multi={false} key={"ono"}
            defaultVl={OptionFilter.find(op => op.value === role)}
            options={OptionFilter}
            fnChangeOption={(e) => { setRole(e.value) }} />
          <RangeDateInput defaultValue={dateRange} fnChangeValue={(e) => { setDateRange(e) }} />
          <button onClick={() => { setCreateActive(prev => !prev) }} className='send_noti_btn'>Send Notification</button>
        </div>
      </div>
      <div className='sec2' style={{ display: "flex" }}>
        <div className='box_table_' style={{ flexBasis: createActive ? '70%' : '100%' }}>
          <div className='table_container'>
            <table className='table_'>
              <thead>
                <tr>

                  <th>Content</th>
                  <th>Type</th>
                  <th>Create</th>
                </tr>
              </thead>
              <tbody>
                {notification && notification.length > 0 && notification.map((item, index) => (
                  <tr key={index}>

                    <td>{item.description}</td>
                    <td>{item.type}</td>
                    <td>{formatDate(item.createDate)}</td>
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
        </div>
        {createActive && (
          <div className='form_create' style={{ flexBasis: '30%' }}>
            <p className='btn_close' onClick={() => { setCreateActive(false) }}><span>Close</span></p>
            <form onSubmit={sendNotification}>
              <p className='title'>Send Notification</p>
              <div>
                <p>Role</p>
                <SelectInput options={OptionSendNoti}
                  defaultVl={OptionSendNoti.find(op => op.value === roleSendNoti)}
                  multi={false}
                  fnChangeOption={(e) => { setRoleSendNoti(e.value) }} />
              </div>
              <div>
                <p>Message:</p>
                <textarea id='message_noti' />
              </div>
              <div className='btn_submit_noti'>
                <button type='submit'>Send Notification</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </NotificationPage>
  )
}
