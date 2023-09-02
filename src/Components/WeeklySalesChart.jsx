import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import MyBackdrop from './MyBackdrop';

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
  );
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' ,
      },
    },
    scales: {
      x: {
        grid: {
          color: '#1E1E1E', 
        },
        ticks: {
          color: 'rgb(209 213 219)', 
        },
      },
      y: {
        grid: {
          color: '#1E1E1E', 
        },
        ticks: {
          color: 'rgb(209 213 219)',
        },
      },
    },
  };
  

export default function WeeklySalesChart() {

  const {backendAddress} = useSelector(state => state.backendInfo);
  const {jwt} = useSelector(state => state.userInfo);
  const [orderCountList, setOrderCountList] = useState([]); 
  const [dateList, setDateList] = useState([]);  
  const [backDropOpen, setBackDropOpen] = useState(false);

  const data = {
    labels: dateList,
    datasets: [
      {
        fill: true,
        label: 'Orders',
        data: orderCountList,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };
  
  const loadOrderCountList = () => {
    setBackDropOpen(true);
    fetch(`${backendAddress}/order/week`, {
        headers: {
            'Authorization': `Bearer ${jwt}`,
        },
    })
      .then(res => res.json())
      .then(data => {
        setBackDropOpen(false);
        setOrderCountList(data.orderCountList);
        setDateList(data.dateList)
      })
  }

  useEffect(() => {
    loadOrderCountList();
  }, []);

  return (
    <>
      <Line options={options} data={data} />
      <MyBackdrop backDropOpen={backDropOpen} />
    </>
  )
}
