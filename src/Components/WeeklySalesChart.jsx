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
  };

  const currentTime = new Date();
  const currentOffset = currentTime.getTimezoneOffset();
  const ISTOffset = 330;  
  const ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);  
  
  const labels = [];
  
  for(let i = 7; i > 0; i--){
    labels.push(ISTTime.getMonth() + "/" + (ISTTime.getDate() - i));
  }

export default function WeeklySalesChart() {

  const {backendAddress} = useSelector(state => state.backendInfo);
  const {jwt} = useSelector(state => state.userInfo);
  const [orderCountList, setOrderCountList] = useState([]);  
  const [backDropOpen, setBackDropOpen] = useState(false);

  const data = {
    labels,
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
        setOrderCountList(data);
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
