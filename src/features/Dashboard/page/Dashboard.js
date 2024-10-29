import React, { useCallback, useEffect, useRef, useState } from 'react';
import LoadingPage from '../../../shared/Config/LoadingPage';
import Chart from 'chart.js/auto';
import '../style/Dashboard.scss';
//hook
import { useAdminContext } from '../../../shared/hook/ContextToken';
import { apiRequestAutherize } from '../../../shared/hook/Api/ApiAuther';
//function
import { formatDateNotTime } from '../../../shared/function/FomatDate';
import { SelectStyle, CaculatorPer } from "../data/dataDashboard"
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
            <p className='title'><span>Expected revenue </span><span>Today</span></p>
            <p className='number'>{totalRevenueProfit && totalRevenueProfit.totalRevenue && formatNumberWithDot(totalRevenueProfit.totalRevenue)} VNĐ</p>
            {totalRevenueProfit && totalRevenueProfit.percentChangeRevenue && (
              <p className={totalRevenueProfit.percentChangeProfit > 0 ? "up" : "down"}> {totalRevenueProfit.percentChangeRevenue > 0 ? (<i class="fa-solid fa-arrow-up-wide-short"></i>) : (<i class="fa-solid fa-arrow-down-wide-short"></i>)} {totalRevenueProfit.percentChangeRevenue.toFixed(2)}%</p>
            )}
          </div>
          <div className='item'>
            <p className='title'><span>Expected profit </span><span>Today</span></p>
            <p className='number'>{totalRevenueProfit && totalRevenueProfit.totalProfit && formatNumberWithDot(totalRevenueProfit.totalProfit)} VNĐ</p>
            {totalRevenueProfit && totalRevenueProfit.percentChangeProfit && (
              <p className={totalRevenueProfit.percentChangeProfit > 0 ? "up" : "down"}> {totalRevenueProfit.percentChangeProfit > 0 ? (<i class="fa-solid fa-arrow-up-wide-short"></i>) : (<i class="fa-solid fa-arrow-down-wide-short"></i>)} {totalRevenueProfit.percentChangeProfit.toFixed(2)}%</p>
            )}
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
          <div className='item'></div>
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
        </div>
      </div>
      <div className='right'>
        <div className='row_3'>
          <div className='item'>
            <div className='b_info'>
              <p>Booking</p>
              <div>
                <SelectStyle defaultValue={dayChartDow} onChange={(e) => { setDayChartDoW(e.target.value) }}>
                  <option value={7}>7 days</option>
                  <option value={30}>30 days</option>

                </SelectStyle>
              </div>
            </div>
            {countBookingDoW && countBookingDoW.length > 0 && labelCountBookingDow && labelCountBookingDow.length > 0 && (
              <ChartBookingByDayOfWeek data={countBookingDoW} labelData={labelCountBookingDow} labelSet={labelSetDoW} labelValue={labelValueDoW} key={"r_2"} />
            )}
          </div>
        </div>
        <div className='row_1'>
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
              {topHospital && topHospital.length > 0 && topHospital.map((item, index) => (
                <div className='item_hospital' key={index}>
                  <div className='b_top_info_hospital'>
                    <p className='count_top'><i style={{ color: index === 0 ? "yellow" : index === 1 ? "white" : "rgb(139, 114, 86)" }} class="fa-solid fa-crown"></i></p>
                    <div className='info_hospital'>
                      <div className='name_hosp'>
                        <p>{item[0]}</p>
                        <p>{totalBookingTop && CaculatorPercentfn(item[1], totalBookingTop).toFixed(1)} %</p>
                      </div>
                      <div className='b_value'>
                        {totalBookingTop && (
                          <p className='value' style={{ width: `${CaculatorPercentfn(item[1], totalBookingTop)}%` }}></p>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              ))}


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
              <p>Region</p>
              <p>Filter</p>
            </div>
            <div className='list_item_region'>
              <div className='item_region south'>
                <div>
                  <p>34</p>
                </div>
                <p className='title_'>Southern</p>
              </div>
              <div className='item_region central'>
                <div>
                  <p>12</p>
                </div>
                <p className='title_'>Central</p>
              </div>
              <div className='item_region north'>
                <div>
                  <p>15</p>
                </div>
                <p className='title_'>North</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div >
  );
}
