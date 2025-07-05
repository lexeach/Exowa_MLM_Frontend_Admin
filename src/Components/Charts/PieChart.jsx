
import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';

const PieChart = React.memo(({ totalInvestment, totalReward, totalUsers, totalPartners, totalQualified, totalTopApproved }) => {

    const intTotalInvestment = parseInt(totalInvestment)
    const intTotalReward = parseInt(totalReward)
    console.log(intTotalReward, "totalreward")
    const intTotalUsers = parseInt(totalUsers)
    const intTotalQualified = parseInt(totalQualified)
    const intTotalApproved = parseInt(totalTopApproved)


    const chartRef = useRef(null);

    const data = [intTotalInvestment, intTotalReward, intTotalUsers, totalPartners, intTotalQualified, intTotalApproved]


    useEffect(() => {
        if (!chartRef.current) return;

        const chartWidth = window.innerWidth < 450 ? 250 : 380

        const options = {
            series: data,
            chart: {
                type: 'donut',
                width: chartWidth
            },
            labels: ['Total Investment', 'Total Reward', 'Total Users', 'Total Partners', 'Total Qualified Users', 'Total Top Approvel'],
            dataLabels: { enabled: true },
            legend: { position: 'top' },
            plotOptions: {
                pie: {
                    donut: {
                        labels: {
                            show: true,

                            name: {
                                show: true
                            },
                            value: {
                                show: true
                            }
                        }
                    }
                }
            }
        };

        const chart = new ApexCharts(chartRef.current, options);
        chart.render();

        return () => chart.destroy();
    }, [data]);

    return (

        <div ref={chartRef} ></div>

    );
})

export default PieChart;