
import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";

const BarChart = ({ userDepositAmountArray, userDepositDateArray, userWithdrowAmountArray, userWithdrowDateArray }) => {
    const chartRef = useRef(null);


    const allDates = [...new Set([...userDepositDateArray, ...userWithdrowDateArray])].sort((a, b) => new Date(a) - new Date(b)).reverse();

    useEffect(() => {
        if (!chartRef.current) return;

        const depositData = allDates.map(date => {
            const index = userDepositDateArray.indexOf(date);
            return index !== -1 ? userDepositAmountArray[index] : 0;
        });

        const withdrawalData = allDates.map(date => {
            const index = userWithdrowDateArray.indexOf(date);
            return index !== -1 ? userWithdrowAmountArray[index] : 0;
        });

        const options = {
            chart: {
                type: 'bar',
                height: 350,
                toolbar: { show: false },
                animations: { enabled: false }
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '50%',
                    borderRadius: 5,
                }
            },
            dataLabels: { enabled: false },
            stroke: { show: true, width: 1, colors: ['transparent'] },
            xaxis: {
                categories: allDates,
                labels: { rotate: -45 },
            },
            yaxis: { title: { text: 'Amount' } },
            fill: { opacity: 1 },
            tooltip: {
                y: { formatter: (val) => `${val}` }
            },
            series: [
                // { name: "Deposit Amount", data: depositData, color: "#7b69ed96" },
                { name: "Deposit Amount", data: depositData, color: "#3ea06d9c" },

                // { name: "Withdrawal Amount", data: withdrawalData, color: "#fbb567ab" },
                { name: "Withdrawal Amount", data: withdrawalData, color: "#18a1c396" }
            ]
        };

        const chart = new ApexCharts(chartRef.current, options);
        chart.render();

        return () => chart.destroy();
    }, [userDepositAmountArray, userDepositDateArray, userWithdrowAmountArray, userWithdrowDateArray]);

    return (
        <div className="chart-container" style={{ width: "100%", height: "400px", overflowX: "auto", overflowY: "hidden", whiteSpace: "nowrap" }}>
            <div style={{ width: `${allDates.length > 15 ? allDates.length * 80 : 1700}px`, height: "100%" }}>
                <div ref={chartRef} style={{ width: "100%", height: "100%" }}></div>
            </div>
        </div>
    );
};

export default BarChart;
