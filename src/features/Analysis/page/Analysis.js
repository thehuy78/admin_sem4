
import React, { useCallback, useEffect, useState } from 'react'
import SelectInput from '../../../shared/component/InputFilter/SelectInput'
import { optionTypeData, optionTypeServices, optionTimeChart, optionChart } from "../data/dataAnalysis"
import { useAdminContext } from '../../../shared/hook/ContextToken'
import { apiRequestAutherize } from '../../../shared/hook/Api/ApiAuther'
import ChartBookingByDayOfWeek from '../../Dashboard/component/ChartBookingByDayOfWeek'
import ChartBookingByHours from '../../Dashboard/component/ChartBookingByHours'
export default function Analysis() {

  const { token } = useAdminContext()
  const [optionHospital, setOptionHospital] = useState()
  const [optionHospitalCompare, setOptionHospitalCompare] = useState()
  const [btnTypeChart, setBtnTypeChart] = useState("column")
  //data render chart

  const [typeData, setTypeData] = useState(optionTypeData[0].value)
  const [typeServices, setTypeServices] = useState(optionTypeServices[0].value)
  const [hospital, setHospital] = useState('')
  const [hospitalFirst, setHospitalFirst] = useState('')
  const [hospitalSecond, setHospitalSecond] = useState('')
  const [timeChart, setTimechart] = useState(optionTimeChart[0].value)

  const [label, setLabel] = useState()
  const [data, setData] = useState()
  const [labelSet, setLabelSet] = useState()
  const [LabelValue, setLabelValue] = useState()
  const drawChart1 = async () => {
    try {
      if (token) {
        var data = {
          hospitalCode: hospital,
          type: typeData,
          service: typeServices,
          time: timeChart
        }
        var rs = await apiRequestAutherize("post", 'analysis/chart1', token, data)
        console.log(rs);
        if (rs && rs.data && rs.data.status === 200) {
          var dt = rs.data.data
          var lb = []
          var dataChart = []
          var curent = []
          var prev = []
          if (dt.currentPeriod.length === 7) {
            lb = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
            if (timeChart === 7) {
              setLabelSet(["This Week", "Last Week"])

            } else {
              setLabelSet(["This Month", "Last Month"])
            }

            dt.currentPeriod.forEach(e => {
              if (typeData === "revenue") {
                setLabelValue(["Day of Week", "Revenue"])
                curent.push(e.totalRevenue)
              } else if (typeData === "profit") {
                curent.push(e.totalProfit)
                setLabelValue(["Day of Week", "Profit"])
              } else {
                setLabelValue(["Day of Week", "Booking"])
                curent.push(e.bookingsCount)
              }

            });
            dt.previousPeriod.forEach(e => {
              if (typeData === "revenue") {
                prev.push(e.totalRevenue)
              } else if (typeData === "profit") {
                prev.push(e.totalProfit)
              } else {
                prev.push(e.bookingsCount)
              }

            });
            dataChart.push(curent)
            dataChart.push(prev)
            setLabel(lb)
            setData(dataChart)
          }
          else if (dt.currentPeriod.length === 24) {
            lb = ["0h", "1h", "2h", "3h", "4h", "5h", "6h", "7h",
              "8h", "9h", "10h", "11h", "12h", "13h", "14h",
              "15h", "16h", "17h", "18h", "19h", "20h", "21h",
              "22h", "23h"]
            setLabelSet(["Today", "Yesterday"])
            dt.currentPeriod.forEach(e => {
              if (typeData === "revenue") {
                setLabelValue(["Hours", "Revenue"])
                curent.push(e.totalRevenue)
              } else if (typeData === "profit") {
                curent.push(e.totalProfit)
                setLabelValue(["Hours", "Profit"])
              } else {
                curent.push(e.bookingsCount)
                setLabelValue(["Hours", "Booking"])
              }
            });
            dt.previousPeriod.forEach(e => {
              if (typeData === "revenue") {
                prev.push(e.totalRevenue)
              } else if (typeData === "profit") {
                prev.push(e.totalProfit)
              } else {
                prev.push(e.bookingsCount)
              }
            });
            dataChart.push(curent)
            dataChart.push(prev)
            setLabel(lb)
            setData(dataChart)
          }
          else if (dt.currentPeriod.length === 12) {
            lb = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            setLabelSet(["This Year", "Last Year"])
            dt.currentPeriod.forEach(e => {
              if (typeData === "revenue") {
                curent.push(e.totalRevenue)
                setLabelValue(["Month", "Revenue"])
              } else if (typeData === "profit") {
                curent.push(e.totalProfit)
                setLabelValue(["Month", "Profit"])
              } else {
                curent.push(e.bookingsCount)
                setLabelValue(["Month", "Booking"])
              }
            });
            dt.previousPeriod.forEach(e => {
              if (typeData === "revenue") {
                prev.push(e.totalRevenue)
              } else if (typeData === "profit") {
                prev.push(e.totalProfit)
              } else {
                prev.push(e.bookingsCount)
              }
            });
            dataChart.push(curent)
            dataChart.push(prev)
            setLabel(lb)
            setData(dataChart)
          } else {

          }
        }
      }
    } catch (error) {

    }
  }


  const compareChart = async () => {
    try {
      if (token) {
        var data = {
          hospitalFirstCode: hospitalFirst,
          hospitalSecondCode: hospitalSecond,
          type: typeData,
          service: typeServices,
          time: timeChart
        }
        var times = ''
        switch (timeChart) {
          case 1:
            times = 'Today'
            break;
          case 7:
            times = 'Last 7 Day'
            break;
          case 30:
            times = 'Last 1 Month'
            break;
          case 365:
            times = 'Last 1 Year'
            break;

          default:
            break;
        }
        var rs = await apiRequestAutherize("post", 'analysis/compareChart', token, data)
        console.log(rs);
        var hos1 = optionHospitalCompare.find(op => op.code === hospitalFirst)
        var hos2 = optionHospitalCompare.find(op => op.code === hospitalSecond)
        setLabelSet([hos1.name, hos2.name])
        if (rs && rs.data && rs.data.status === 200) {
          var dt = rs.data.data
          var lb = []
          var dataChart = []
          var curent = []
          var prev = []


          if (dt.currentPeriod.length === 7) {
            lb = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

            dt.currentPeriod.forEach(e => {
              if (typeData === "revenue") {
                setLabelValue([`Day of Week (${times})`, "Revenue"])
                curent.push(e.totalRevenue)
              } else if (typeData === "profit") {
                curent.push(e.totalProfit)
                setLabelValue([`Day of Week (${times})`, "Profit"])
              } else {
                setLabelValue([`Day of Week (${times})`, "Booking"])
                curent.push(e.bookingsCount)
              }

            });
            dt.previousPeriod.forEach(e => {
              if (typeData === "revenue") {
                prev.push(e.totalRevenue)
              } else if (typeData === "profit") {
                prev.push(e.totalProfit)
              } else {
                prev.push(e.bookingsCount)
              }

            });
            dataChart.push(curent)
            dataChart.push(prev)
            setLabel(lb)
            setData(dataChart)
          }
          else if (dt.currentPeriod.length === 24) {
            lb = ["0h", "1h", "2h", "3h", "4h", "5h", "6h", "7h",
              "8h", "9h", "10h", "11h", "12h", "13h", "14h",
              "15h", "16h", "17h", "18h", "19h", "20h", "21h",
              "22h", "23h"]

            dt.currentPeriod.forEach(e => {
              if (typeData === "revenue") {
                setLabelValue([`Hours  (${times})`, "Revenue"])
                curent.push(e.totalRevenue)
              } else if (typeData === "profit") {
                curent.push(e.totalProfit)
                setLabelValue([`Hours  (${times})`, "Profit"])
              } else {
                curent.push(e.bookingsCount)
                setLabelValue([`Hours  (${times})`, "Booking"])
              }
            });
            dt.previousPeriod.forEach(e => {
              if (typeData === "revenue") {
                prev.push(e.totalRevenue)
              } else if (typeData === "profit") {
                prev.push(e.totalProfit)
              } else {
                prev.push(e.bookingsCount)
              }
            });
            dataChart.push(curent)
            dataChart.push(prev)
            setLabel(lb)
            setData(dataChart)
          }
          else if (dt.currentPeriod.length === 12) {
            lb = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

            dt.currentPeriod.forEach(e => {
              if (typeData === "revenue") {
                curent.push(e.totalRevenue)
                setLabelValue([`Month  (${times})`, "Revenue"])
              } else if (typeData === "profit") {
                curent.push(e.totalProfit)
                setLabelValue([`Month  (${times})`, "Profit"])
              } else {
                curent.push(e.bookingsCount)
                setLabelValue([`Month  (${times})`, "Booking"])
              }
            });
            dt.previousPeriod.forEach(e => {
              if (typeData === "revenue") {
                prev.push(e.totalRevenue)
              } else if (typeData === "profit") {
                prev.push(e.totalProfit)
              } else {
                prev.push(e.bookingsCount)
              }
            });
            dataChart.push(curent)
            dataChart.push(prev)
            setLabel(lb)
            setData(dataChart)
          } else {

          }
        }
      }
    } catch (error) {

    }
  }

  const fetchHospital = useCallback(async () => {
    try {
      if (token) {
        var rs = await apiRequestAutherize("get", "hospital/getname", token)
        console.log(rs);
        if (rs && rs.data && rs.data.status === 200) {
          const result = rs.data.data;
          setOptionHospitalCompare([...result]);
          const modifiedResult = [{ code: '', name: "All" }, ...result];
          setOptionHospital(modifiedResult);

        }
      }
    } catch (error) {
    }

  }, [token])

  useEffect(() => {
    fetchHospital()
  }, [fetchHospital]);


  const formattedOptions = (options) => {
    return options.map(option => ({
      value: option.code,
      label: option.name
    }));
  }

  const [opChart, setOpChart] = useState(1)

  useEffect(() => {
    setData()
    setLabel()
    setLabelSet()
    setLabelValue()
  }, [opChart]);

  return (
    <div className='analysis_page'>
      <p className='title'>Analysis Report Medcare</p>
      <section className='sec_1_filter'>
        <div className='b____'>
          <p>Type:</p>
          <SelectInput multi={false} defaultVl={optionChart.find(op => op.value === opChart)} options={optionChart} fnChangeOption={(e) => { setOpChart(e.value) }} />
        </div>
        {opChart && opChart === 1 && (
          <div className='box_selectfilter'>
            <div className='item_select_'>
              <p>Choose Hospital</p>
              {optionHospital && optionHospital.length > 0 && (
                <SelectInput minWidth={"auto"} options={formattedOptions(optionHospital)} defaultVl={formattedOptions(optionHospital).find(op => op.value === hospital)} multi={false} fnChangeOption={(e) => { setHospital(e.value) }} />
              )}
            </div>
            <div className='item_select_'>
              <p>Choose Type</p>
              <SelectInput minWidth={"auto"} options={optionTypeData} defaultVl={optionTypeData.find(op => op.value === typeData)} multi={false} fnChangeOption={(e) => { setTypeData(e.value) }} />
            </div>
            <div className='item_select_'>
              <p>Choose Service</p>
              <SelectInput minWidth={"auto"} options={optionTypeServices} defaultVl={optionTypeServices.find(op => op.value === typeServices)} multi={false} fnChangeOption={(e) => { setTypeServices(e.value) }} />
            </div>
            <div className='item_select_'>
              <p>Choose Times</p>
              <SelectInput minWidth={"auto"} options={optionTimeChart} defaultVl={optionTimeChart.find(op => op.value === timeChart)} multi={false} fnChangeOption={(e) => { setTimechart(e.value) }} />
            </div>
            <div className='btn_button_chart'>
              <button onClick={drawChart1}>Draw a chart</button>
            </div>
          </div>
        )}
        {opChart && opChart === 2 && (

          <div className='box_selectfilter'>
            <div className='item_select_'>
              <p>Choose Hospital</p>
              {optionHospitalCompare && optionHospitalCompare.length > 0 && (
                <SelectInput minWidth={"auto"} options={formattedOptions(optionHospitalCompare.filter((op) => op.code !== hospitalSecond))} defaultVl={formattedOptions(optionHospitalCompare.filter((op) => op.code !== hospitalSecond)).find(op => op.value === hospitalFirst)} multi={false} fnChangeOption={(e) => { setHospitalFirst(e.value) }} />
              )}
              {optionHospitalCompare && optionHospitalCompare.length > 0 && (
                <SelectInput minWidth={"auto"} options={formattedOptions(optionHospitalCompare.filter((op) => op.code !== hospitalFirst))} defaultVl={formattedOptions(optionHospitalCompare.filter((op) => op.code !== hospitalFirst)).find(op => op.value === hospitalSecond)} multi={false} fnChangeOption={(e) => { setHospitalSecond(e.value) }} />
              )}
            </div>
            <div className='item_select_'>
              <p>Choose Type</p>
              <SelectInput minWidth={"auto"} options={optionTypeData} defaultVl={optionTypeData.find(op => op.value === typeData)} multi={false} fnChangeOption={(e) => { setTypeData(e.value) }} />
            </div>
            <div className='item_select_'>
              <p>Choose Service</p>
              <SelectInput minWidth={"auto"} options={optionTypeServices} defaultVl={optionTypeServices.find(op => op.value === typeServices)} multi={false} fnChangeOption={(e) => { setTypeServices(e.value) }} />
            </div>
            <div className='item_select_'>
              <p>Choose Times</p>
              <SelectInput minWidth={"auto"} options={optionTimeChart} defaultVl={optionTimeChart.find(op => op.value === timeChart)} multi={false} fnChangeOption={(e) => { setTimechart(e.value) }} />
            </div>
            <div className='btn_button_chart'>

              <button onClick={compareChart} disabled={hospitalFirst === '' || hospitalSecond === '' ? true : false}>Compare</button>
            </div>
          </div>
        )}
      </section>
      <section className='chart_session'>

        {data && label && data.length > 0 && label.length > 0 &&
          labelSet && LabelValue && labelSet.length > 0 && LabelValue.length > 0 &&
          (
            <>
              {btnTypeChart === "column" && (
                <div className='chart_content'>
                  <ChartBookingByDayOfWeek data={data} labelData={label} labelSet={labelSet} labelValue={LabelValue} />
                </div>
              )}
              {btnTypeChart === "line" && (
                <div className='chart_content'>
                  <ChartBookingByHours bookingData={data} lableValue={LabelValue} labelData={label} labelSet={labelSet} />
                </div>
              )}
              <div className='type_chart'>
                <button onClick={() => { setBtnTypeChart('line') }}><i className="fa-solid fa-chart-line"></i></button>
                <button onClick={() => { setBtnTypeChart('column') }}><i className="fa-solid fa-chart-column"></i></button>
              </div>

            </>
          )}

      </section>
    </div>
  )
}
