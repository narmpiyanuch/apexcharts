import { useState, useEffect } from 'react'
import axios from 'axios';
import Chart from 'react-apexcharts';
import './App.css'

function App() {
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        type: 'bar',
        stacked: true,
        stackType: '100%',
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: [],
        tooltip: {
          enabled: true,
        },
      },
      yaxis: {
        title: {
          text: 'Runtime (%)'
        },
      },

      colors: ['#1FB5AE', '#E0776A'],
    },
    series: [
      {
        name: 'Uptime',
        data: [],
      },
      {
        name: 'Downtime',
        data: [],
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('./data/mockUptime.json');
        const jsonData = await response.data;

        const date = jsonData.map(item => {
          const date = new Date(item.date);
          const formattedDate = `${date.getDate()} ${date.toLocaleString('en-us', { month: 'short' })} ${date.getFullYear()}`;
          return formattedDate;
        });


        const uptimeData = jsonData.map(item => {
          return (item.uptime_minutes / (item.uptime_minutes + item.downtime_minutes) * 100).toFixed(2)
        });
        console.log(uptimeData)
        const downtimeData = jsonData.map(item => {
          return (item.downtime_minutes / (item.uptime_minutes + item.downtime_minutes) * 100).toFixed(2)
        });

        setChartData(prevState => ({
          ...prevState,
          options: {
            ...prevState.options,
            xaxis: {
              ...prevState.options.xaxis,
              categories: date,
            },
          },
          series: [
            {
              ...prevState.series[0],
              data: uptimeData,
            },
            {
              ...prevState.series[1],
              data: downtimeData,
            },
          ],
        }));
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  console.log(chartData)
  return (
    <div>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={400}
        width={1200}
      />
    </div>
  );
}


export default App