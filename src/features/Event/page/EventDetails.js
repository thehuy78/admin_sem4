import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAdminContext } from '../../../shared/hook/ContextToken';
import LoadingPage from '../../../shared/Config/LoadingPage';
import { createNotification } from '../../../shared/Config/Notifications';
import { apiRequestAutherize } from '../../../shared/hook/Api/ApiAuther';
import { jwtDecode } from 'jwt-decode';
import { formatNumberWithDot } from '../../../shared/function/FomatNumber';
import { EventVaccineDetailsPage } from '../data/EventData';

export default function EventDetails() {
  const { id } = useParams()
  const [event, setEvent] = useState()
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAdminContext();
  const [hospitalInEvent, setHospitalInEvent] = useState([])
  const fetchData = useCallback(async () => {
    try {
      if (token && id) {
        setIsLoading(true)
        var data = {
          idEvent: id
        }
        var rs = await apiRequestAutherize("GET", `eventVaccine/get/${id}`, token)
        var rs1 = await apiRequestAutherize("POST", `hospitalEvent/getByEvent`, token, data)
        console.log(rs1);
        if (rs1 && rs1.data && rs1.data.status === 200) {
          const groupedData = Object.values(groupAndTransformData(rs1.data.data));
          console.log(groupedData);
          setHospitalInEvent(groupedData);
        }
        if (rs && rs.data && rs.data.status) {
          switch (rs.data.status) {
            case 200:

              setEvent(rs.data.data)
              break;
            case 300:
              createNotification('error', rs.data.message, 'Failed')();
              break;
            case 400:
              createNotification('error', rs.data.message, 'Error')();
              break;
            default:
              break;
          }
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
  }, [token, id])

  useEffect(() => {
    fetchData()
  }, [fetchData]);
  const navigate = useNavigate();



  const HandleAccept = async (id) => {
    try {

      if (token) {
        var rs = await apiRequestAutherize("GET", `hospitalEvent/changeStatus/${id}`, token)
        if (rs && rs.data && rs.data.status === 200) {
          fetchData()
          createNotification("success", rs.data.message, "Success")()
        } else {
          createNotification("error", rs.data.message, "Error")()
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
    }
  }



  const HandleDenied = async (id) => {
    try {
      if (token) {
        var rs = await apiRequestAutherize("GET", `hospitalEvent/denied/${id}`, token)
        if (rs && rs.data && rs.data.status === 200) {
          fetchData()
          createNotification("success", rs.data.message, "Success")()
        } else {
          createNotification("error", rs.data.message, "Error")()
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
    }
  }

  return event && (
    <EventVaccineDetailsPage>
      <LoadingPage key={"ltt"} isloading={isLoading} />
      <section className='brums_nav'>
        <span onClick={() => { navigate(-1) }}><i class="fa-solid fa-arrow-left"></i> Back</span>
      </section>
      <div className='top_content'>
        <p className='name__'>Vaccination program: {event.name}</p>
      </div>
      <div className='bottom_content'>
        <div className='left_content'>
          {hospitalInEvent && hospitalInEvent.length > 0 && hospitalInEvent.map((item, index) => (
            <div key={index} className='box_hospital__'>
              <p className='name'>Hospital: {item.hospitalName}</p>
              <p className='code'>Code: {item.hospitalCode}</p>
              <div className='box_vaccine__list'>
                {item.vaccines && item.vaccines.length > 0 && item.vaccines.map((items, indexs) => (
                  <div key={indexs} className='box_vaccine__'>
                    <p className='v_name'>Vaccine: {items.vaccineName}</p>
                    <div className='row__'>
                      <p className='v_code'>Code: {items.vaccineCode}</p>
                      <p className='v_fee'>Fee: {formatNumberWithDot(items.vaccineFee)}</p>
                    </div>
                    {items.status.toLowerCase() === "active" ?
                      <p className='v_status'></p>
                      :
                      <div style={{ display: "flex", gap: "2rem" }}>
                        <p className='v_status_accept' onClick={() => HandleAccept(items.id)}>Accept</p>
                        <p className='v_status_denied' onClick={() => HandleDenied(items.id)}>Denied</p>
                      </div>
                    }

                  </div>


                ))}
              </div>
            </div>
          ))}
        </div>
        <div className='right_content'>
          <p className='code__'>Code: {event.code}</p>
          <p className='description__'
            dangerouslySetInnerHTML={{ __html: event.description }}
          >
          </p>
        </div>
      </div>
    </EventVaccineDetailsPage>
  )
}


const groupAndTransformData = (records) => {
  return records.reduce((acc, record) => {
    const { hospitalId, hospitalName, hospitalCode } = record;

    // Nếu hospital chưa tồn tại, khởi tạo object cho nó
    if (!acc[hospitalId]) {
      acc[hospitalId] = {
        hospitalId,

        hospitalName,
        hospitalCode,
        vaccines: []
      };
    }

    // Thêm thông tin vaccine vào danh sách vaccines
    acc[hospitalId].vaccines.push({
      vaccineId: record.vaccineId,
      vaccineName: record.vaccineName,
      vaccineCode: record.vaccineCode,
      vaccineFee: record.vaccineFee,
      status: record.status,
      id: record.id
    });

    return acc;
  }, {});
}
