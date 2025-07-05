
import { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';

function MyChart({ allUsersRegisterdDateArray, allUsersArray }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const displayStatus = window.innerWidth < 460 ? "" : 'New Users per Day';
    const datetimeStatus = window.innerWidth < 800 ? 'datetime' : "category";

    var options = {
      series: [
        {
          name: 'Users',
          data: allUsersArray
        },
      ],
      title: {
        text: displayStatus,
        align: 'left',
        left: 4,
        style: {
          fontSize: '21px',
          color: '#1f293d',
        },
      },
      chart: {
        height: 320,
        type: 'area',
        zoom: {
          enabled: true
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 4,
        curve: "smooth",
        dashArray: 6
      },
      xaxis: {
        type: datetimeStatus,
        categories: allUsersRegisterdDateArray,
        reversed: true,
      },

      // Add class name to title
      colors: ['#9242e6'],

      grid: {
        show: true,
        borderColor: "#e0e0e0"
      },

      markers: {
        display: false,
        size: 4,
        colors: ['#6540b2'],
        strokeColors: '#fff',
        strokeWidth: 2,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.4,
          stops: [0, 100]
        }
      }
    };


    const chart = new ApexCharts(chartRef.current, options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [allUsersRegisterdDateArray, allUsersArray]);

  return (
    <div id="chart" ref={chartRef} />
  );
}

export default MyChart;
