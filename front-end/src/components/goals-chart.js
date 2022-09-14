import { useEffect, useState } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import API_CLIENT from '../api/axios_client';

// https://recharts.org/en-US/examples
function GoalsChart(props) {
  const [graphData, setGraphData] = useState([]);

  const getUserDetails = () => {
    API_CLIENT.get('/get-complete-fin-detail').then((res) => {
      const goals = res.data.body.Goals.Goals;
      let graphData =[]

      goals.forEach(element => {
        graphData.push({
          name: element.name,
          Current: element.current_val,
          Target: element.target
        })
      });
      console.log("called")
      setGraphData(graphData);
    });
  }

  useEffect(() => {
    getUserDetails();
  }, [])

  return (
    <div className='mx-auto'>
      <BarChart
        width={900}
        height={300}
        data={graphData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Current" stackId="a" fill="#8884d8" />
        <Bar dataKey="Target" stackId="a" fill="#82ca9d" />
      </BarChart>
    </div>
  )
}

export default GoalsChart;