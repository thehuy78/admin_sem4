import React, { useCallback, useEffect, useRef, useState } from 'react';
import LoadingPage from '../../../shared/Config/LoadingPage';
import Chart from 'chart.js/auto';
import '../style/Dashboard.scss';
//hook
import { useAdminContext } from '../../../shared/hook/ContextToken';
import { apiRequestAutherize } from '../../../shared/hook/Api/ApiAuther';
//function
import { formatDateNotTime } from '../../../shared/function/FomatDate';
import { SelectStyle, CaculatorPer, findItem } from "../data/dataDashboard"
import { formatNumberWithDot } from "../../../shared/function/FomatNumber"
//json data
import { labelData, labelSet, labelValue } from "../data/LabelChartBookingHours"
import { labelDataAge } from "../data/LabelChartBookingByAge"
import { labelSetDoW, labelValueDoW } from "../data/LabelChartBookingByDayOfWeek"
//component
import ChartBookingByHours from '../component/ChartBookingByHours';
import ChartBookingByAge from '../component/ChartBookingByAge';
import ChartBookingByDayOfWeek from '../component/ChartBookingByDayOfWeek';
import { CaculatorPercentfn } from '../../../shared/function/CaculatorPercent';


export default function Dashboard() {
  const [isloading, setIsloading] = useState(false);
  const { token } = useAdminContext();
  const currentDate = new Date();

  const [totalRevenueProfit, setTotalRevenueProfit] = useState()
  const fetchTotalRevenue = useCallback(async () => {
    try {
      if (token) {
        var rs = await apiRequestAutherize("GET", `chart/revenueprofit`, token)
        console.log(rs);
        if (rs && rs.data && rs.data.status === 200) {
          setTotalRevenueProfit(rs.data.data)
        }
      }

    } catch (error) {

    }
  }, [token])

  const [dayChartGender, setdayChartGender] = useState(1)
  const [totalGender, setTotalGender] = useState()
  const fetchTotalGender = useCallback(async () => {
    try {
      if (token) {
        var rs = await apiRequestAutherize("GET", `chart/gender/${dayChartGender}`, token)

        if (rs && rs.data && rs.data.status === 200) {
          setTotalGender(rs.data.data)
        }
      }

    } catch (error) {

    }
  }, [token, dayChartGender])


  const [bookingByHours, setBookingByHours] = useState()
  const fetchCountBookingByHours = useCallback(async () => {
    try {
      if (token) {
        var rs = await apiRequestAutherize("GET", `chart/byhours`, token)

        if (rs && rs.data && rs.data.status === 200) {
          var data = rs.data.data
          if (Array.isArray(data) && data.length === 2) {
            // Lọc ra chỉ số `count` cho từng giờ từ 0 đến 23
            const todayCounts = data[0].map(item => item.count);
            const yesterdayCounts = data[1].map(item => item.count);
            // Tạo mảng kết quả chứa hai mảng `count`
            const result = [todayCounts, yesterdayCounts];
            setBookingByHours(result)
          } else {
            console.error("Data không đúng định dạng");
          }
        }
      }

    } catch (error) {

    }
  }, [token])

  const [ageBooking, setAgeBooking] = useState()
  const [dayChartAge, setdayChartAge] = useState(7)
  const fetchCountBookingByAge = useCallback(async () => {
    try {
      if (token) {
        var rs = await apiRequestAutherize("GET", `chart/byage/${dayChartAge}`, token)

        if (rs && rs.data && rs.data.status === 200) {
          var data = rs.data.data
          var age = [0, 0, 0];
          age[0] = data.under18
          age[1] = data.between18And50
          age[2] = data.over50

          setAgeBooking(age)
        }
      }
    } catch (error) {

    }
  }, [token, dayChartAge])


  const [countBookingDoW, setCountBookingDoW] = useState()
  const [labelCountBookingDow, setLableCountBookingDow] = useState()
  const [dayChartDow, setDayChartDoW] = useState(7)
  const [labelSetDown, setLableSetDown] = useState(["This week", "Last week"])
  const fetchCountBookingByDayOffWeek = useCallback(async () => {
    try {
      if (token) {
        var rs = await apiRequestAutherize("GET", `chart/dayoffweek/${dayChartDow}`, token)
        console.log(rs);
        if (rs && rs.data && rs.data.status === 200) {
          var data = rs.data.data
          var label = []
          var currentW = []
          var previousW = []
          data.currentPeriod.forEach(e => {
            label.push(e.dayName)
            currentW.push(e.bookingCount)
          });
          data.previousPeriod.forEach(e => {
            previousW.push(e.bookingCount)
          });
          setCountBookingDoW([currentW, previousW])
          setLableCountBookingDow(label)
          if (dayChartDow == 7) {
            setLableSetDown(["This Week", "Last Week"])
          } else if (dayChartDow == 30) {
            setLableSetDown(["This Month", "Last Month"])
          }
        }
      }
    } catch (error) {

    }
  }, [token, dayChartDow])


  const [topHospital, setTopHospital] = useState()
  const [totalBookingTop, setTotalBookingTop] = useState()
  const [dayChartTopHospital, setDayChartTopHospital] = useState(30)
  const fetchCountTopHospital = useCallback(async () => {
    try {
      if (token) {
        var rs = await apiRequestAutherize("GET", `chart/tophospital/${dayChartTopHospital}`, token)

        if (rs && rs.data && rs.data.status === 200) {
          setTopHospital(rs.data.data.top)
          setTotalBookingTop(rs.data.data.total)
        }
      }
    } catch (error) {

    }
  }, [token, dayChartTopHospital])




  const [dayChartByType, setDayChartByType] = useState(7)
  const [bookingGroupByType, setBookingGroupByType] = useState([])
  const fetchCountByType = useCallback(async () => {
    try {
      if (token) {
        var rs = await apiRequestAutherize("GET", `chart/bookinggroupbyType/${dayChartByType}`, token)
        console.log(rs);
        if (rs && rs.data && rs.data.status === 200) {
          setBookingGroupByType(rs.data.data)
        }
      }
    } catch (error) {
    }
  }, [token, dayChartByType])
  useEffect(() => {
    fetchCountByType()
  }, [fetchCountByType]);


  useEffect(() => {
    fetchCountTopHospital()
  }, [fetchCountTopHospital]);


  useEffect(() => {
    fetchCountBookingByDayOffWeek()
  }, [fetchCountBookingByDayOffWeek]);

  useEffect(() => {
    fetchTotalGender()
  }, [fetchTotalGender]);
  useEffect(() => {
    fetchTotalRevenue()
  }, [fetchTotalRevenue]);
  useEffect(() => {
    fetchCountBookingByHours()
  }, [fetchCountBookingByHours]);
  useEffect(() => {
    fetchCountBookingByAge()
  }, [fetchCountBookingByAge]);

  //chart_r_3


  return (
    <div className='dashboard_P'>
      <LoadingPage isloading={isloading} />
      <div className='left'>

        <div className='row_1'>
          <div className='item'>
            <p className='title'>
              <span>Revenue </span><span>Today</span>
            </p>
            {totalRevenueProfit && totalRevenueProfit.percentChangeRevenue ? (
              <div className='css_line'>
                <div style={{ width: '100%', height: '300px', position: 'relative' }}>
                  <svg width="100%" height="100%" viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="gradientRevenue" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: totalRevenueProfit?.percentChangeRevenue >= 0 ? "green" : "red", stopOpacity: 0.8 }} />
                        <stop offset="70%" style={{ stopColor: totalRevenueProfit?.percentChangeRevenue >= 0 ? "green" : "red", stopOpacity: 0 }} />
                      </linearGradient>
                    </defs>

                    {/* Vẽ vùng bên dưới đường biểu đồ, dùng gradient */}
                    <path
                      d="M10,270 
              C50,260, 90,250, 130,230 
              S170,240, 210,230 
              S250,210, 290,220 
              S330,200, 370,210 
              S410,190, 450,180 
              L500,300 L10,300 Z"
                      fill="url(#gradientRevenue)" // Sử dụng gradient dành cho doanh thu
                    />

                    {/* Vẽ đường biểu đồ */}
                    <path
                      d="M10,270 
              C50,260, 90,250, 130,230 
              S170,240, 210,230 
              S250,210, 290,220 
              S330,200, 370,210 
              S410,190, 450,180"
                      stroke={totalRevenueProfit?.percentChangeRevenue >= 0 ? "green" : "red"}
                      strokeWidth="3"
                      fill="none"
                    />
                  </svg>
                </div>
              </div>
            ) : (<></>)}
            <p className='number'>
              {totalRevenueProfit && totalRevenueProfit.totalRevenue && formatNumberWithDot(totalRevenueProfit.totalRevenue)} VNĐ
            </p>
            {totalRevenueProfit && totalRevenueProfit.percentChangeRevenue ? (
              <p className={totalRevenueProfit.percentChangeRevenue > 0 ? "up" : "down"}>
                {totalRevenueProfit.percentChangeRevenue > 0 ? (
                  <i className="fa-solid fa-arrow-up-wide-short"></i>
                ) : (
                  <i className="fa-solid fa-arrow-down-wide-short"></i>
                )}
                {totalRevenueProfit.percentChangeRevenue.toFixed(2)}%
              </p>
            ) : (<></>)}
          </div>

          <div className='item'>
            <p className='title'>
              <span>Profit </span><span>Today</span>
            </p>
            {totalRevenueProfit && totalRevenueProfit?.percentChangeProfit ? (
              <div className='css_line_1'>
                <div style={{ width: '100%', height: '300px', position: 'relative' }}>
                  <svg width="100%" height="100%" viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="gradientProfit" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: totalRevenueProfit?.percentChangeProfit > 0 ? "green" : "rgb(179, 31, 31)", stopOpacity: 0.8 }} />
                        <stop offset="70%" style={{ stopColor: totalRevenueProfit?.percentChangeProfit > 0 ? "green" : "rgb(179, 31, 31)", stopOpacity: 0 }} />
                      </linearGradient>
                    </defs>

                    {/* Vẽ vùng bên dưới đường biểu đồ, dùng gradient */}
                    <path
                      d="M10,270 
              C50,210, 90,100, 130,180 
              S170,50, 210,130 
              S250,50, 290,100 
              S330,70, 370,120 
              S410,40, 450,60 
              L500,300 L10,300 Z"
                      fill="url(#gradientProfit)" // Sử dụng gradient dành cho lợi nhuận
                    />

                    {/* Vẽ đường biểu đồ */}
                    <path
                      d="M10,270 
              C50,210, 90,100, 130,180 
              S170,50, 210,130 
              S250,50, 290,100 
              S330,70, 370,120 
              S410,40, 450,60"
                      stroke={totalRevenueProfit?.percentChangeProfit > 0 ? "green" : "rgb(179, 31, 31)"} // Fixed the condition for stroke color
                      strokeWidth="3"
                      fill="none"
                    />
                  </svg>
                </div>
              </div>
            ) : (<></>)}
            <p className='number'>
              {totalRevenueProfit && totalRevenueProfit.totalProfit && formatNumberWithDot(totalRevenueProfit.totalProfit)} VNĐ
            </p>
            {totalRevenueProfit && totalRevenueProfit?.percentChangeProfit ? (
              <p className={totalRevenueProfit.percentChangeProfit > 0 ? "up" : "down"}>
                {totalRevenueProfit?.percentChangeProfit > 0 ? (
                  <i className="fa-solid fa-arrow-up-wide-short"></i>
                ) : (
                  <i className="fa-solid fa-arrow-down-wide-short"></i>
                )}
                {totalRevenueProfit.percentChangeProfit.toFixed(2)}%
              </p>
            ) : (<></>)}
          </div>
        </div>


        <div className='row_2'>
          <div className='item'>
            <div className='b_info'>
              <p>Booking</p>
              <div>{formatDateNotTime(currentDate)}</div>
            </div>
            {bookingByHours && bookingByHours.length > 0 && (
              <ChartBookingByHours labelData={labelData} labelSet={labelSet} lableValue={labelValue} bookingData={bookingByHours} key={"l_2_1"} />
            )}

          </div>
        </div>
        <div className='row_3'>
          <div className='item'>
            <div className='b_info'>
              <p>Top Hospital</p>
              <SelectStyle defaultValue={dayChartTopHospital} onChange={(e) => { setDayChartTopHospital(e.target.value) }}>
                <option value={1}>Today</option>
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={365}>1 Year Recently</option>
              </SelectStyle>
            </div>
            <div className='list_chart_item'>
              <table className='table_'>
                <thead>
                  <tr>
                    <th><p>Rank</p></th>
                    <th><p>Hospital</p></th>
                    <th><p>Booking</p></th>
                    <th><p>Revenue</p></th>
                    <th><p>Proportion</p></th>
                  </tr>
                </thead>

                <tbody>
                  {topHospital && topHospital.length > 0 && topHospital.map((item, index) => (
                    <tr>
                      <td><p><i style={{ color: index === 0 ? "yellow" : index === 1 ? "white" : "rgb(139, 114, 86)" }} class="fa-solid fa-crown"></i> {index + 1}</p></td>
                      <td><p>{item.code}</p></td>
                      <td><p>{item.bookingCount}</p></td>
                      <td><p>{formatNumberWithDot(item.revenueTotal)}</p></td>
                      <td><p>{totalBookingTop && CaculatorPercentfn(item.bookingCount, totalBookingTop).toFixed(1)} %</p></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className='right'>
        <div className='row_3'>
          <div className='item'>
            <div className='b_info'>
              <p>Booking</p>
              <div>
                <SelectStyle defaultValue={dayChartDow} onChange={(e) => {
                  setDayChartDoW(e.target.value)


                }}>
                  <option value={7}>7 days</option>
                  <option value={30}>30 days</option>

                </SelectStyle>
              </div>
            </div>
            {countBookingDoW && countBookingDoW.length > 0 && labelCountBookingDow && labelCountBookingDow.length > 0 && (
              <ChartBookingByDayOfWeek data={countBookingDoW} labelData={labelCountBookingDow} labelSet={labelSetDown} labelValue={labelValueDoW} key={"r_2"} />
            )}
          </div>
        </div>
        <div className='row_1'>
          <div className='item item_l'>
            <div className='b_info'>
              <p>Gender</p>
              <SelectStyle defaultValue={dayChartGender} onChange={(e) => { setdayChartGender(e.target.value) }}>
                <option value={1}>Today</option>
                <option value={7}>Last 7 days</option>
              </SelectStyle>

            </div>
            <div className='list_chart_item'>
              <div className='item_gender'>
                <div className='info_gender'>
                  <p>Male</p>
                  <p>{totalGender && totalGender.male && CaculatorPer(totalGender, "male") && CaculatorPer(totalGender, "male").toFixed(1)}%</p>
                </div>
                <div className='b_value'>
                  <p className='value' style={{ width: `${CaculatorPer(totalGender, "male")}%` }}></p>
                </div>
              </div>
              <div className='item_gender'>
                <div className='info_gender'>
                  <p>Female</p>
                  <p>{totalGender && totalGender.female && CaculatorPer(totalGender, "female") && CaculatorPer(totalGender, "female").toFixed(1)}%</p>
                </div>
                <div className='b_value'>
                  <p className='value' style={{ width: `${CaculatorPer(totalGender, "female")}%` }}></p>
                </div>
              </div>

            </div>
          </div>
          <div className='item'>
            <div className='b_info'>
              <p>Age User</p>
              <div>
                <SelectStyle defaultValue={dayChartAge} onChange={(e) => { setdayChartAge(e.target.value) }}>
                  <option value={1}>Today</option>
                  <option value={7}>Last 7 days</option>
                </SelectStyle>
              </div>
            </div>
            <div className='b_canvas'>
              {ageBooking && ageBooking.length === 3 && (
                <ChartBookingByAge labelData={labelDataAge} data={ageBooking} key={"r_1_2"} />
              )}
            </div>
          </div>
        </div>

        <div className='row_2'>
          <div className='item'>
            <div className='b_info'>
              <p>Type Booking</p>
              <div>
                <SelectStyle defaultValue={dayChartByType} onChange={(e) => { setDayChartByType(e.target.value) }}>
                  <option value={1}>Today</option>
                  <option value={7}>Last 7 days</option>
                  <option value={30}>Last 30 days</option>
                  <option value={365}>1 Year Recently</option>
                </SelectStyle>
              </div>
            </div>
            {bookingGroupByType && (
              <div className='list_item_region'>
                <div className='item_region doctor'>
                  <div>
                    <p>{findItem(bookingGroupByType, 'doctor')}</p>
                  </div>
                  <p className='title_'>Doctor</p>
                </div>
                <div className='item_region package'>
                  <div>
                    <p>{findItem(bookingGroupByType, 'package')}</p>
                  </div>
                  <p className='title_'>Package</p>
                </div>
                <div className='item_region testing'>
                  <div>
                    <p>{findItem(bookingGroupByType, 'testing')}</p>
                  </div>
                  <p className='title_'>Testing</p>
                </div>
                <div className='item_region vaccine'>
                  <div>
                    <p>{findItem(bookingGroupByType, 'vaccine')}</p>
                  </div>
                  <p className='title_'>Vaccine</p>
                </div>
              </div>
            )}


          </div>
        </div>

      </div>
    </div >
  );
}
