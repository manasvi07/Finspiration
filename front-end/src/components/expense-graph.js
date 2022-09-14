import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import API_CLIENT from '../api/axios_client';

// https://recharts.org/en-US/examples
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    console.log(payload)
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label} : ${payload[0].value}$`}</p>
        <p className="intro">{payload[0].payload.name}</p>
      </div>
    );
  }
  return null;
};

function ExpenseGraph(props) {

  const [graphData, setGraphData] = useState([]);

  const getUserDetails = () => {
    API_CLIENT.get('/get-complete-fin-detail').then((res) => {
      const expenses = res.data.body.Expenses.Expenses;
      setGraphData(expenses);
    });
  }

  useEffect(() => {
    getUserDetails();
  }, [])

  return (
    <div className='mx-auto mt-3'>
      <LineChart
        width={800}
        height={300}
        data={graphData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis dataKey="amount" />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </div>
  )
}

export default ExpenseGraph;