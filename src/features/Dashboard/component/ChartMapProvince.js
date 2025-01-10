import React, { useCallback, useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, Annotation } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { geoCentroid } from 'd3-geo';
import vietnamGeoJSON from '../../../shared/data/vietnam.geojson'; // Đường dẫn đến file GeoJSON của bạn
import { Tooltip as ReactTooltip } from 'react-tooltip'; // Import Tooltip từ react-tooltip
import styled from 'styled-components';
import { apiRequestAutherize } from '../../../shared/hook/Api/ApiAuther';
import { useAdminContext } from '../../../shared/hook/ContextToken';

function ChartMapProvince({ datachart }) {

  const [hoveredProvince, setHoveredProvince] = useState(null); // Lưu tên tỉnh khi hover
  const [bookingProvinceCurrent, setBookingProvinceCurrent] = useState(null);
  const { token } = useAdminContext();

  const [data, setData] = useState(datachart)
  const [rows, setRows] = useState([])

  useEffect(() => {
    setData(datachart)
    setRows(splitDataIntoRows(datachart, 23))
  }, [datachart]);


  // const fetchData = useCallback(async () => {
  //   try {
  //     if (token) {
  //       var data = {
  //         "vaccineCode": vaccine,
  //         "time": time
  //       }
  //       var rs = await apiRequestAutherize("POST", "analysis/chartMap", token, data)
  //       console.log(rs);
  //       if (rs && rs.data && rs.data.status === 200) {
  //         setData(rs.data.data)
  //         setRows(splitDataIntoRows(rs.data.data, 23))
  //       }
  //     }

  //   } catch (error) {

  //   }
  // }, [token, vaccine, time])

  // useEffect(() => {
  //   fetchData()
  // }, [fetchData]);


  const colorScale = (data) => {
    var per = 0;
    if (data <= 0) {
      per = 0
    } else if (data <= 5 && data > 0) {
      per = 0.1
    } else if (data <= 10 && data > 5) {
      per = 0.3
    } else if (data <= 20 && data > 10) {
      per = 0.5
    } else if (data <= 50 && data > 20) {
      per = 0.7
    } else {
      per = 1
    }


    const scale = scaleLinear()
      .domain([0, 1])
      .range(['rgb(246, 251, 162)', 'rgb(255, 0, 0)']);

    return scale(per);
  }

  const splitDataIntoRows = (data, rowSize) => {
    const rows = [];
    for (let i = 0; i < data.length; i += rowSize) {
      rows.push(data.slice(i, i + rowSize));
    }
    return rows;
  };





  return (
    <ChartStyle>
      <div className='b_table'>
        {rows && rows.length > 0 && rows.map((item, index) => (
          <table key={index}>
            <thead>
              <tr>
                <th>Province</th>
                <th>Booking</th>
              </tr>
            </thead>
            <tbody>
              {item && item.length > 0 && item.map((province, indexs) => (
                <tr key={indexs} className={hoveredProvince === province.name ? "active" : ""}
                  onMouseEnter={() => setHoveredProvince(province.name)}
                  onMouseLeave={() => setHoveredProvince(null)}
                >
                  <td>{province.name}</td>
                  <td>{province.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}

      </div>
      <div className='chart'>
        <ComposableMap
          projection="geoMercator"
          width={400}
          height={600}
          viewBox="0 0 400 900"
          projectionConfig={{
            scale: 2100,
            center: [105.8, 15.9],
          }}
        >
          <Geographies geography={vietnamGeoJSON}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const provinceName = geo.properties.name;
                const bookingDataEntry = data && data.find(data => data.name === provinceName);
                const bookingRate = bookingDataEntry ? bookingDataEntry.count : 0;
                const centroid = geoCentroid(geo);

                return (
                  <React.Fragment key={geo.rsmKey}>
                    <Geography
                      geography={geo}
                      fill={colorScale(bookingRate)}
                      onMouseEnter={() => {
                        setHoveredProvince(provinceName);
                        setBookingProvinceCurrent(bookingDataEntry);
                      }}
                      onMouseLeave={() => {
                        setHoveredProvince(null);
                        setBookingProvinceCurrent(null);
                      }}
                      style={{

                        default: { outline: "none", cursor: "pointer", fill: hoveredProvince === provinceName && "green" },
                        hover: { outline: "none", fill: "green" },
                        pressed: { outline: "none" },
                        cursor: "pointer"
                      }}
                    />
                    {hoveredProvince === provinceName && centroid[0] && centroid[1] && (
                      <Annotation
                        subject={centroid}
                        dx={0}
                        dy={-20}
                        connectorProps={{
                          stroke: "none",
                        }}
                      >
                        <text
                          x={0}
                          y={0}
                          style={{
                            fill: '#000',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            pointerEvents: 'none',
                            textAnchor: 'middle',

                          }}
                          data-tooltip-id={provinceName}
                          data-tooltip-content={provinceName}
                        />
                        <ReactTooltip id={provinceName} place="top" effect="solid" />
                      </Annotation>
                    )}
                  </React.Fragment>
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>
    </ChartStyle>
  );
}

export default ChartMapProvince;



const ChartStyle = styled.div`


  display: flex;
  //grid-template-columns: 2fr 2.8fr;
  gap: 1rem;
  justify-content: space-between;
  .chart {
    width: 400px;
    height: 700px;
    // background-color: aqua;
  }
  .b_table {
    width: calc(100% - 400px);
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 0 0.3rem var(--shadow-black);
    height: fit-content;
    padding: 1rem 0;

    table {
      height: fit-content;
      border-collapse: collapse;
      thead {
        tr {
          background-color: var(--cl_3);

          th {
            font-weight: 700;
            font-size: var(--fz_small);
            padding: 0 1rem;
            color: white;
          }
        }
      }
      tbody {
        height: fit-content;
        tr {
          height: fit-content;
          overflow: hidden;
          transition: 0.3s ease-in;
          cursor: pointer;
          td {
            font-size: var(--fz_smallmax);
            text-align: center;
            height: fit-content;
            padding: 0.2rem 0.5rem;
          }
        }
        tr:nth-child(even) {
          background-color: var(--cl_1);
        }
        .active {
          background-color: green !important;
          transform: scale(1.1);
          td {
            color: white;
          }
        }
      }
    }
  }

`;