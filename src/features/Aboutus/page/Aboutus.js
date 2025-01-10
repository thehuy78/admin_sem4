import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, Annotation } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { geoCentroid } from 'd3-geo';
import vietnamGeoJSON from '../../../shared/data/vietnam.geojson'; // Đường dẫn đến file GeoJSON của bạn
import { Tooltip as ReactTooltip } from 'react-tooltip'; // Import Tooltip từ react-tooltip

// Dữ liệu tỷ lệ đặt chỗ cho các tỉnh (63 tỉnh thành)
const bookingData = [
  { "name": "Hà Nội", "count": 800, "percent": 0.8 },
  { "name": "Hồ Chí Minh city", "count": 600, "percent": 0.6 },
  { "name": "Đà Nẵng", "count": 700, "percent": 0.7 },
  { "name": "Phú Yên", "count": 400, "percent": 0.4 },
  { "name": "Bình Định", "count": 500, "percent": 0.5 },
  { "name": "Hải Phòng", "count": 600, "percent": 0.6 },
  { "name": "Cần Thơ", "count": 500, "percent": 0.5 },
  { "name": "Hải Dương", "count": 600, "percent": 0.6 },
  { "name": "Bắc Giang", "count": 500, "percent": 0.5 },
  { "name": "Bắc Ninh", "count": 600, "percent": 0.6 },

  { "name": "Quảng Ninh", "count": 600, "percent": 0.6 },
  { "name": "Đắk Lắk", "count": 500, "percent": 0.5 },
  { "name": "Lâm Đồng", "count": 400, "percent": 0.4 },
  { "name": "Thừa Thiên - Huế", "count": 500, "percent": 0.5 },
  { "name": "Long An", "count": 500, "percent": 0.5 },
  { "name": "An Giang", "count": 500, "percent": 0.5 },
  { "name": "Hậu Giang", "count": 400, "percent": 0.4 },
  { "name": "Tiền Giang", "count": 500, "percent": 0.5 },
  { "name": "Sóc Trăng", "count": 400, "percent": 0.4 },
  { "name": "Cà Mau", "count": 400, "percent": 0.4 },
  { "name": "Kiên Giang", "count": 600, "percent": 0.6 },
  { "name": "Trà Vinh", "count": 400, "percent": 0.4 },
  { "name": "Vĩnh Long", "count": 500, "percent": 0.5 },
  { "name": "Đồng Tháp", "count": 500, "percent": 0.5 },
  { "name": "Bến Tre", "count": 500, "percent": 0.5 },
  { "name": "Nghệ An", "count": 500, "percent": 0.5 },
  { "name": "Hà Tĩnh", "count": 400, "percent": 0.4 },
  { "name": "Quảng Bình", "count": 500, "percent": 0.5 },
  { "name": "Quảng Trị", "count": 500, "percent": 0.5 },
  { "name": "Gia Lai", "count": 500, "percent": 0.5 },
  { "name": "Kon Tum", "count": 400, "percent": 0.4 },
  { "name": "Thanh Hóa", "count": 600, "percent": 0.6 },
  { "name": "Lào Cai", "count": 500, "percent": 0.5 },
  { "name": "Sơn La", "count": 400, "percent": 0.4 },
  { "name": "Tuyên Quang", "count": 400, "percent": 0.4 },
  { "name": "Cao Bằng", "count": 400, "percent": 0.4 },
  { "name": "Lai Châu", "count": 400, "percent": 0.4 },
  { "name": "Yên Bái", "count": 400, "percent": 0.4 },
  { "name": "Hòa Bình", "count": 500, "percent": 0.5 },
  { "name": "Bắc Kạn", "count": 400, "percent": 0.4 },
  { "name": "Vĩnh Phúc", "count": 600, "percent": 0.6 },
  { "name": "Phú Thọ", "count": 500, "percent": 0.5 },
  { "name": "Ninh Bình", "count": 500, "percent": 0.5 },
  { "name": "Quảng Nam", "count": 600, "percent": 0.6 },
  { "name": "Hà Giang", "count": 400, "percent": 0.4 },
  { "name": "Bắc Cạn", "count": 400, "percent": 0.4 },
  { "name": "Thái Nguyên", "count": 600, "percent": 0.6 },
  { "name": "Nam Định", "count": 500, "percent": 0.5 },
  { "name": "Lạng Sơn", "count": 400, "percent": 0.4 },
  { "name": "Tây Ninh", "count": 500, "percent": 0.5 },
  { "name": "Bình Thuận", "count": 500, "percent": 0.5 },
  { "name": "Bắc Liêu", "count": 500, "percent": 0.5 },
  { "name": "Bà Rịa - Vũng Tàu", "count": 500, "percent": 0.5 },
  { "name": "Ninh Thuận", "count": 500, "percent": 0.35 },
  { "name": "Khánh Hòa", "count": 500, "percent": 0.2 },
  { "name": "Đăk Nông", "count": 500, "percent": 0.3 },
  { "name": "Bình Phước", "count": 500, "percent": 0.15 },
  { "name": "Đồng Nai", "count": 500, "percent": 0.25 },
  { "name": "Bình Dương", "count": 500, "percent": 0.3 },
  { "name": "Bạc Liêu", "count": 500, "percent": 0.15 },
  { "name": "Quảng Ngãi", "count": 500, "percent": 0.25 },
  { "name": "Thái Bình", "count": 500, "percent": 0.3 },
  { "name": "Hà Nam", "count": 500, "percent": 0.15 },
  { "name": "Hưng Yên", "count": 500, "percent": 0.25 },
  { "name": "Điện Biên", "count": 500, "percent": 0.25 },
];



const colorScale = scaleLinear()
  .domain([0, 1]) // 0% đến 100%
  .range(['#FFFF00', '#FF0000']);

const splitDataIntoRows = (data, rowSize) => {
  const rows = [];
  for (let i = 0; i < data.length; i += rowSize) {
    rows.push(data.slice(i, i + rowSize));
  }
  return rows;
};

// Chia bookingData thành các rows
const rows = splitDataIntoRows(bookingData, 23);
console.log(rows);

function Aboutus() {
  const [hoveredProvince, setHoveredProvince] = useState(null); // Lưu tên tỉnh khi hover
  const [bookingProvinceCurrent, setBookingProvinceCurrent] = useState(null);

  return (
    <div className='chart_map_api'>
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
                <tr key={indexs} className={hoveredProvince === province.name ? "active" : ""}>
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
                const bookingDataEntry = bookingData.find(data => data.name === provinceName);
                const bookingRate = bookingDataEntry ? bookingDataEntry.percent : 0;
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

                        default: { outline: "none" },
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
    </div>
  );
}

export default Aboutus;
