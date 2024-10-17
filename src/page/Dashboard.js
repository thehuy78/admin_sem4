import React, { useEffect, useRef, useState } from 'react';
import LoadingPage from '../component/LoadingPage';
import Chart from 'chart.js/auto';
import '../style/Dashboard.scss';

export default function Dashboard() {
  const [isloading, setIsloading] = useState(true);
  const [maxValueBooking, setMaxValueBooking] = useState(30)
  const chartR_1_2Ref = useRef(null);
  const chartR_3Ref = useRef(null);

  const chartL_2Ref = useRef(null);


  useEffect(() => {
    setTimeout(() => {
      setIsloading(false);
    }, 500);
  }, []);

  //char_r_1_2
  useEffect(() => {
    const chartData = {
      labels: ['<16', '16-60', '>60'], // Labels for the legend
      datasets: [
        {
          label: 'Data Set', // General label for the dataset
          data: [300, 50, 100],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
          ],
          hoverOffset: 4,
        },
      ],
    }
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'left',
          labels: {
            boxWidth: 10,
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 10,
            font: {
              size: 12,
            },
          },
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              const labels = ['HS: 300', 'PH: 50', 'GV: 100']; // Custom hover labels
              return labels[tooltipItem.dataIndex];
            },
          },
        },
      },
    };
    const ctx = document.getElementById("char_r_1_2").getContext('2d');
    if (chartR_1_2Ref.current) {
      chartR_1_2Ref.current.destroy();
    }
    chartR_1_2Ref.current = new Chart(ctx, {
      type: "doughnut",
      data: chartData,
      options: chartOptions,
    });

    return () => {
      if (chartR_1_2Ref.current) {
        chartR_1_2Ref.current.destroy();
      }
    };
  }, []);

  //chart_r_3
  useEffect(() => {
    const ctx = document.getElementById('chart_r_3').getContext('2d');

    // Destroy the previous chart instance if it exists
    if (chartR_3Ref.current) {
      chartR_3Ref.current.destroy();
    }

    // Define the data for the chart
    const chartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Last Year',
          data: [30, 45, 50, 70, 60, 80, 90, 85, 75, 95, 100, 110], // Data for the current year
          backgroundColor: 'var(--cl_1)', // Blue color with transparency
          borderColor: 'rgba(106, 106, 106, 1)',
          borderWidth: 1,
        },
        {
          label: 'This Year',
          data: [40, 35, 55, 65, 75, 60, 85, 80, 70, 90, 95, 105], // Data for the last year
          backgroundColor: 'rgb(232, 242, 247)', // Red color with transparency
          borderColor: 'rgb(232, 242, 247)',
          borderWidth: 1,
        },
      ],
    };

    // Configure the chart options
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Months',
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Values',
          },
          // ticks: {
          //   stepSize: 10,
          // },
        },
      },
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.dataset.label}: ${context.raw}`;
            },
          },
        },
      },
    };

    // Create a new chart instance and store it in the ref
    chartR_3Ref.current = new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: chartOptions,
    });

    // Cleanup function to destroy the chart when the component unmounts
    return () => {
      if (chartR_3Ref.current) {
        chartR_3Ref.current.destroy();
      }
    };
  }, []);
  //chart_l_2
  useEffect(() => {
    const ctx = document.getElementById('chart_l_2').getContext('2d');

    // Destroy the previous chart instance if it exists
    if (chartL_2Ref.current) {
      chartL_2Ref.current.destroy();
    }

    // Create gradient for the line of Today
    const gradientToday = ctx.createLinearGradient(0, 0, 0, 400);
    gradientToday.addColorStop(0, 'rgba(54, 162, 235, 0.7)'); // Blue at the top
    gradientToday.addColorStop(0.5, 'rgba(54, 162, 235, 0)');   // Transparent at the bottom

    // Create gradient for the line of Yesterday
    const gradientYesterday = ctx.createLinearGradient(0, 0, 0, 400);
    gradientYesterday.addColorStop(0, 'rgba(255, 99, 132, 0.7)'); // Red at the top
    gradientYesterday.addColorStop(0.5, 'rgba(255, 99, 132, 0)');   // Transparent at the bottom

    // Define the data for the chart
    const chartData = {
      labels: [
        '0H', '1H', '2H', '3H', '4H', '5H', '6H', '7H',
        '8H', '9H', '10H', '11H', '12H', '13H', '14H', '15H',
        '16H', '17H', '18H', '19H', '20H', '21H', '22H', '23H'
      ],
      datasets: [
        {
          label: 'Today',
          data: [12, 19, 3, 5, 2, 3, 10, 15, 18, 20, 22, 25, 30, 28, 27, 29, 31, 35, 40, 38, 36, 32, 30, 25],
          backgroundColor: gradientToday,
          borderColor: 'rgba(54, 162, 235, 1)', // Blue line color
          borderWidth: 2,
          tension: 0.4, // Smooth curved lines
          fill: true, // Fill area under the line with gradient
          pointRadius: 0, // Hide points on the line
          pointHoverRadius: 0,
        },
        {
          label: 'Yesterday',
          data: [10, 15, 8, 12, 6, 9, 14, 18, 21, 24, 28, 26, 29, 25, 23, 27, 30, 32, 34, 30, 28, 24, 22, 20],
          backgroundColor: gradientYesterday,
          borderColor: 'rgba(255, 99, 132, 1)', // Red line color
          borderWidth: 2,
          tension: 0.4, // Smooth curved lines
          fill: true, // Fill area under the line with gradient
          pointRadius: 0, // Hide points on the line
          pointHoverRadius: 0,
        },
      ],
    };

    // Configure the chart options
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Hours of the Day',
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Values',
          },
        },
      },
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.dataset.label}: ${context.raw}`;
            },
          },
        },
      },
    };

    // Create a new chart instance and store it in the ref
    chartL_2Ref.current = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: chartOptions,
    });

    // Cleanup function to destroy the chart when the component unmounts
    return () => {
      if (chartL_2Ref.current) {
        chartL_2Ref.current.destroy();
      }
    };
  }, []);



  const CaculatorPer = (value) => {
    if (maxValueBooking) {
      return (value / maxValueBooking) * 100;
    }
    return 0;
  };

  return (
    <div className='dashboard_P'>
      <LoadingPage isloading={isloading} />
      <div className='left'>
        <div className='row_1'>
          <div className='item'>
            <p className='title'>Total balance</p>
            <p className='number'>875.098 VNĐ</p>
            <p className='per'>Tăng 1%</p>
          </div>
          <div className='item'>
            <p className='title'>Total balance</p>
            <p className='number'>875.098 VNĐ</p>
            <p className='per'>Tăng 1%</p>
          </div>
        </div>
        <div className='row_2'>
          <div className='item'>
            <div className='b_info'>
              <p>Booking</p>
              <div>Filter</div>
            </div>
            <canvas id="chart_l_2"></canvas>
          </div>
        </div>
        <div className='row_3'>
          <div className='item'></div>
          <div className='item'>
            <div className='b_info'>
              <p>Top Hospital</p>
              <p>Filter</p>
            </div>
            <div className='list_chart_item'>
              <div className='item_hospital'>
                <div className='info_hospital'>
                  <p>HCMU</p>
                  <p>10</p>
                </div>
                <div className='b_value'>
                  <p className='value' style={{ width: `${CaculatorPer(10)}%` }}></p>
                </div>
              </div>
              <div className='item_hospital'>
                <div className='info_hospital'>
                  <p>HNSG</p>
                  <p>20</p>
                </div>
                <div className='b_value'>
                  <p className='value' style={{ width: `${CaculatorPer(20)}%` }}></p>
                </div>
              </div>
              <div className='item_hospital'>
                <div className='info_hospital'>
                  <p>TVSH</p>
                  <p>8</p>
                </div>
                <div className='b_value'>
                  <p className='value' style={{ width: `${CaculatorPer(8)}%` }}></p>
                </div>
              </div>
              <div className='item_hospital'>
                <div className='info_hospital'>
                  <p>CMH</p>
                  <p>30</p>
                </div>
                <div className='b_value'>
                  <p className='value' style={{ width: `${CaculatorPer(30)}%` }}></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='right'>
        <div className='row_1'>
          <div className='item item_l'>
            <div className='b_info'>
              <p>Gender</p>
              <p>Filter</p>
            </div>
            <div className='list_chart_item'>
              <div className='item_gender'>
                <div className='info_gender'>
                  <p>Male</p>
                  <p>{CaculatorPer(10).toFixed(1)}%</p>
                </div>
                <div className='b_value'>
                  <p className='value' style={{ width: `${CaculatorPer(10)}%` }}></p>
                </div>
              </div>
              <div className='item_gender'>
                <div className='info_gender'>
                  <p>Female</p>
                  <p>{CaculatorPer(20).toFixed(1)}%</p>
                </div>
                <div className='b_value'>
                  <p className='value' style={{ width: `${CaculatorPer(20)}%` }}></p>
                </div>
              </div>

            </div>
          </div>
          <div className='item'>
            <div className='b_info'>
              <p>Old User</p>
              <div>Filter</div>
            </div>
            <div className='b_canvas'>
              <canvas id="char_r_1_2" style={{ height: "fit-content", width: "100%" }}></canvas>
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
        <div className='row_3'>
          <div className='item'>
            <div className='b_info'>
              <p>Booking</p>
              <div>Filter</div>
            </div>
            <canvas id="chart_r_3"></canvas>
          </div>
        </div>
      </div>
    </div >
  );
}
