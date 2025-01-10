import React, { useCallback, useEffect, useState } from 'react'

import { useAdminContext } from '../../../shared/hook/ContextToken';
import { createNotification } from "../../../shared/Config/Notifications";
import { apiRequestAutherize } from '../../../shared/hook/Api/ApiAuther';

import { formatNumberWithDot } from '../../../shared/function/FomatNumber';
export default function Accountant() {

  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAdminContext();


  const [totalWeek, setTotalWeek] = useState([])
  const [totalMonth, setTotalMonth] = useState([])
  const fetchData = useCallback(async () => {
    try {
      if (token) {

        setIsLoading(true)
        var rs = await apiRequestAutherize("GET", `accountant/getWeek/${12}`, token)
        var result = await apiRequestAutherize("GET", `accountant/getMonth/${12}`, token)
        console.log(rs.data);
        if (rs && rs.data && rs.data.status === 200) {
          setTotalWeek(rs.data.data)
        }
        if (result && result.data && result.data.status === 200) {
          setTotalMonth(result.data.data)
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        createNotification("warning", "Your role is not accessible", "Warning")()
      } else if (error.response && error.response.status === 401) {
        createNotification("error", "Login session expired", "Error")()
      } else {
        createNotification("error", error.message && error.message, "Error")()
      }
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 400);
    }
  }, [token],);

  useEffect(() => {
    fetchData()

  }, [fetchData]);





  const formatDate = (date) => {
    const months = ['TH1', 'TH2', 'TH3', 'TH4', 'TH5', 'TH6', 'TH7', 'TH8', 'TH9', 'TH10', 'TH11', 'TH12'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${day} ${month}`;
  }


  const [dateWeek, setDateWeek] = useState([])
  const [dateMonth, setDateMonth] = useState([])
  const getCurrentWeek = () => {
    const today = new Date();
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // Thứ Hai
    const lastDayOfWeek = new Date(today.setDate(firstDayOfWeek.getDate() + 6)); // Chủ Nhật
    var start = firstDayOfWeek // Format: YYYY-MM-DD
    var end = lastDayOfWeek
    setDateWeek([formatDate(start), formatDate(end)])
  };



  const getCurrentMonth = () => {
    const today = new Date();

    // Lấy ngày đầu của tháng hiện tại
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Lấy ngày cuối của tháng hiện tại (ngày đầu của tháng tiếp theo, trừ đi một ngày)
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Định dạng ngày bắt đầu và kết thúc của tháng
    const start = firstDayOfMonth;
    const end = lastDayOfMonth;

    setDateMonth([formatDate(start), formatDate(end)]);
  };




  useEffect(() => {
    getCurrentWeek()
    getCurrentMonth();
  }, []);


  const [hospitalCodeChoice, setHospitalCodeChoice] = useState('')
  const exPortExcel = async (time) => {
    try {
      if (token) {
        var f = {
          hospitalCode: hospitalCodeChoice,
          time: time
        }
        var rs = await apiRequestAutherize("post", "accountant/export", token, f)
        console.log(rs);
        console.log(rs.data);
        if (rs && rs.data && rs.data.status === 200) {
          const byteCharacters = atob(rs.data.data);
          const byteNumbers = Array.from(byteCharacters, (char) =>
            char.charCodeAt(0)
          );
          const byteArray = new Uint8Array(byteNumbers);

          // Tạo file blob
          const blob = new Blob([byteArray], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });

          // Tạo link download
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "accountant.xlsx");
          document.body.appendChild(link);
          link.click();
          link.remove();
          createNotification('success', "Export File Success", "Success")()
          // convertExcelFile(rs.data.data, `booking ${type === "list" ? filter.hospital : ""} ${type === "list" ? "" : type}${formatDateNotTime(dateRange[0])}-${formatDateNotTime(dateRange[1])}`)
        }
      }
    } catch (error) {
      createNotification('error', "Export File Fails", "Export Fails")()
    }
  }

  return (
    <div className='accountant'>

      <div className='left'>
        <div className='left-top'>
          <p className='lt_title'>Overview</p>
          {totalWeek && totalWeek.length > 0 && totalMonth && totalMonth.length > 0 && (
            <div className='lt-analysis'>

              <div className='box b-1'>
                <p>Revenue</p>
                <p>This week</p>
                <p>{formatNumberWithDot(totalWeek[0])}</p>
              </div>
              <div className='box b-2'>
                <p>Discount</p>
                <p>This week</p>
                <p>{formatNumberWithDot(totalWeek[1])}</p>
              </div>
              <div className='box_month'>
                <p className='title_box_month'>This month</p>
                <div className='row'>
                  <div className='box b-3'>
                    <p>Revenue</p>
                    <p>{formatNumberWithDot(totalMonth[0])}</p>
                  </div>
                  <div className='box b-4'>
                    <p>Discount</p>
                    <p>{formatNumberWithDot(totalMonth[1])}</p>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
        <div className='right'>
          <p className='title'>Financial reports</p>

          <div>
            <p>This Week  {dateWeek && dateWeek.length === 2 && " : " + dateWeek[0] + " - " + dateWeek[1]}</p>
            <i class="fa-solid fa-download" onClick={() => exPortExcel(7)}></i>
          </div>
          <div>
            <p>This Month {dateMonth && dateMonth.length === 2 && " : " + dateMonth[0] + " - " + dateMonth[1]}</p>
            <i class="fa-solid fa-download" onClick={() => exPortExcel(30)}></i>
          </div>




        </div>

      </div>
      {/* <div className='left-bottom'>
        <p className='lb_title'>Status ratio</p>
        <div className='lb_analysis'>
          <div className='box'>
            <div>
              <p></p>
              <p></p>
              <p></p>
              <p></p>
            </div>
            <p>Doctor</p>
          </div>
          <div className='box'>
            <div>
              <p></p>
              <p></p>
              <p></p>
              <p></p>
            </div>
            <p>Package</p>
          </div>
          <div className='box'>
            <div>
              <p></p>
              <p></p>
              <p></p>
              <p></p>
            </div>
            <p>Testing</p>
          </div>
          <div className='box'>
            <div>
              <p></p>
              <p></p>
              <p></p>
              <p></p>
            </div>
            <p>Vaccine</p>
          </div>
        </div>

      </div> */}

    </div>
  )
}
