import { useEffect, useState } from "react";
import API_CLIENT from "../api/axios_client";
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer, Cell, Bar } from 'recharts';

const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// Refrence:  https://recharts.org/en-US/examples
function InvestmentChart(props) {
  const [investments, setInvestments] = useState([])

  const getUserDetails = () => {
    API_CLIENT.get('/get-complete-fin-detail').then((res) => {
      const investment = res.data.body.Investements.Investements;
      const p = []
      investment.forEach(element => {
        const data = {}
        data["amount"] = element.amount
        data["name"] = element.type;
        p.push(data)
      });
      setInvestments(p)
    });
  }

  useEffect(() => {
    getUserDetails();
  }, [])

  return (
    <div className="mx-auto">
      <PieChart width={400} height={400}>
        <Pie
          data={investments}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="amount"
        >
          {investments.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} ></Cell>
          ))}
        </Pie>
        <Legend />
      </PieChart>

    </div>
  )

}

export default InvestmentChart;