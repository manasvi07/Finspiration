import { useEffect, useState } from "react";
import API_CLIENT from "../api/axios_client";
import Header from "../components/header";
import Avatar from 'react-avatar';
import { Auth } from "aws-amplify";
import AddSalaryModal from "../components/add-salary-modal";
import AddGoalModal from "../components/add-goal";
import AddInvestMentModal from "../components/add-investment-modal";
import AddBudgetModal from "../components/add-budget-modal";
import AddExpenseModal from "../components/add-expense-modal";
import UpdateGoalAmount from "../components/update-goal-amount";

//  Ref: https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/
function Home(props) {
  const [showExpenseModal, toggleshowExpenseModal] = useState(false);

  const [userDetails, setUserDetails] = useState();
  const [cognitoDetails, setCognitoDetails] = useState({});
  const [totalMonthlyBudget, setTotalMonthlyBudget] = useState();
  const [totalMonthlyExpense, setTotalMonthlyExpense] = useState();
  const [salary, setSalary] = useState();

  const [selectedUpdateExpense, setSelectedUpdateExpense] = useState();
  const [selectedUpdateGoal, setSelectedUpdateGoal] = useState([]);
  const [totalGoals, setTotalGoals] = useState(0);
  const [totalSavedGoals, setTotalSavedGoals] = useState(0);

  const getUserDetails = () => {
    API_CLIENT.get('/get-complete-fin-detail').then((res) => {
      setUserDetails(res.data.body);

      const budgets = res.data.body.Budget.Budget;
      let totalMonthlyBudget = 0;
      budgets.forEach(item => {
        totalMonthlyBudget += item.amount;
      })

      let totalMonthlyExpense = 0;
      const expenses = res.data.body.Expenses.Expenses;
      expenses.forEach(item => {
        totalMonthlyExpense += parseInt(item.amount);
      })

      let totalGoals = 0;
      let totalSavedForGoals = 0;
      const goals = res.data.body.Goals.Goals;
      goals.forEach(item => {
        totalGoals += parseInt(item.target);
        totalSavedForGoals += parseInt(item.current_val);
      });

      setTotalMonthlyExpense(totalMonthlyExpense);
      setTotalMonthlyBudget(totalMonthlyBudget);
      setTotalGoals(totalGoals);
      setTotalSavedGoals(totalSavedForGoals);
      setSalary(res.data.body.Monthly_Salary);
    });
  }

  useEffect(() => {
    getUserDetails();
    Auth.currentUserInfo().then(res => {
      setCognitoDetails({
        "name": res.attributes.name,
        "last_name": res.attributes.given_name,
        "user_id": res.attributes.sub,
        "email": res.attributes.email
      })
    })
  }, []);

  return (
    <div className="border rounded col-md-12 row">
      <Header />
      <AddSalaryModal setSalary={setSalary} />
      <AddInvestMentModal getUserDetails={getUserDetails} Investements={userDetails?.Investements?.Investements} />
      <AddBudgetModal getUserDetails={getUserDetails} />
      <AddGoalModal getUserDetails={getUserDetails} />
      <UpdateGoalAmount goal={selectedUpdateGoal} getUserDetails={getUserDetails} />

      {
        showExpenseModal &&
        <AddExpenseModal
          getUserDetails={getUserDetails}
          toggleshowExpenseModal={toggleshowExpenseModal}
          selectedUpdateExpense={selectedUpdateExpense}
          setSelectedUpdateExpense={setSelectedUpdateExpense} />
      }

      <div className="col-md-6 mt-3 border p-3">
        <Avatar name={`${cognitoDetails.name} ${cognitoDetails.last_name}`} size={100} />
        <strong className="mt-2"><p className="mt-2">Hello {cognitoDetails.name} {cognitoDetails.last_name} </p></strong>
        <strong>
          <p>Your monthly income is {salary}$
            &nbsp;<a className="link" data-toggle="modal" data-target="#AddSalaryModal">edit</a>
          </p>
        </strong>

        <div class="accordion" id="accordionExample">
          <div class="card">
            <div class="card-header" id="headingOne" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
              <h5 class="mb-0">
                Goals   ({totalSavedGoals}$/{totalGoals}$)
              </h5>
            </div>

            <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
              <div class="card-body">
                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Goal name</th>
                      <th scope="col">Catagory</th>
                      <th scope="col">Target</th>
                      <th scope="col">Currently savded</th>
                      <th scope="col">Remaining time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      userDetails && userDetails.Goals && userDetails.Goals.Goals.map((item, index) => {
                        return (
                          <tr data-toggle="modal" data-target="#UpdateGoalModal" onClick={(e) => setSelectedUpdateGoal(item)}>
                            <th scope="row">{index + 1}</th>
                            <td>{item.name}</td>
                            <td>{item.category}</td>
                            <td>{item.target}$</td>
                            <td>{item.current_val}$</td>
                            <td>{item.duration} Months</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="card mt-3">
            <div class="card-header" id="headingThree" data-toggle="collapse" data-target="#collapseThree" aria-expanded="true" aria-controls="collapseThree">
              <h5 class="mb-0">
                Monthly Budget ({totalMonthlyBudget}$)
              </h5>
            </div>

            <div id="collapseThree" class="collapse hide" aria-labelledby="headingThree" data-parent="#accordionExample">
              <div class="card-body">
                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">name</th>
                      <th scope="col">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      userDetails && userDetails.Budget && userDetails.Budget.Budget.map((item, index) => {
                        return (
                          <tr>
                            <th scope="row">{index + 1}</th>
                            <td>{item.item}</td>
                            <td>{item.amount}$</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="card mt-3">
            <div class="card-header" id="headingTwo" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
              <h5 class="mb-0">
                Investments
              </h5>
            </div>

            <div id="collapseTwo" class="collapse hide" aria-labelledby="headingTwo" data-parent="#accordionExample">
              <div class="card-body">
                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">name</th>
                      <th scope="col">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      userDetails && userDetails.Investements && userDetails.Investements.Investements.map((item, index) => {
                        return (
                          <tr>
                            <th scope="row">{index + 1}</th>
                            <td>{item.type}</td>
                            <td>{item.amount}$</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="card mt-3">
            <div class="card-header" id="headingFour" data-toggle="collapse" data-target="#collapseFour" aria-expanded="true" aria-controls="collapseFour">
              <h5 class="mb-0">
                This month expenses ({totalMonthlyExpense}$)
              </h5>
            </div>

            <div id="collapseFour" class="collapse hide" aria-labelledby="headingFour" data-parent="#accordionExample">
              <div class="card-body">
                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Name</th>
                      <th scope="col">Amount</th>
                      <th scope="col">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      userDetails && userDetails.Expenses && userDetails.Expenses.Expenses.map((item, index) => {
                        return (
                          <tr className="cursor-pointer" data-toggle="modal" data-target="#AddExpenseModal" onClick={(e) => { setSelectedUpdateExpense(item); toggleshowExpenseModal(true) }}>
                            <th scope="row">{index + 1}</th>
                            <td>{item.name}</td>
                            <td>{item.amount}$</td>
                            <td>{item.date}</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-6 mt-3 border p-3 row" style={{ marginLeft: '0px' }}>
        <button className="btn btn-primary m-2" data-toggle="modal" data-target="#AddGoalModal">+ Add New Goal</button>
        <button className="btn btn-primary m-2" data-toggle="modal" data-target="#AddBudgetModal">+ Add New Budget</button>
        <button className="btn btn-primary m-2" data-toggle="modal" data-target="#AddInvestmentModal">+ Add New Investment</button>
        <button onClick={(e) => { setSelectedUpdateExpense(null); toggleshowExpenseModal(true) }} className="btn btn-primary m-2" data-toggle="modal" data-target="#AddExpenseModal">+ Add New Expense</button>
      </div>
    </div>
  );
}

export default Home;