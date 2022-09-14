import { useEffect, useState } from "react";
import API_CLIENT from "../api/axios_client";
import ExpenseGraph from "../components/expense-graph";
import GoalsChart from "../components/goals-chart";
import Header from "../components/header";
import InvestmentChart from "../components/investment-chart";


function Visualization(props) {

  const [goals, setGoals] = useState([])

  const getUserDetails = () => {
    API_CLIENT.get('/get-complete-fin-detail').then((res) => {
      const goals = res.data.body.Goals.Goals;
      setGoals(goals);
    });
  }

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div className="border rounded col-md-12 row">
      <Header />
      <h2 className="text-center mt-2">Goals</h2>
      <div className="d-flex">
        <GoalsChart />
      </div>

      <h2 className="text-center mt-2">Investements</h2>
      <div className="text-center d-flex">
        <InvestmentChart />
      </div>

      <h2 className="text-center mt-2">Expenses</h2>
      <div className="d-flex">
        <ExpenseGraph />
      </div>
    </div>
  )
}

export default Visualization;