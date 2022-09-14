import { useEffect, useRef, useState } from "react";
import API_CLIENT from "../api/axios_client";

function AddExpenseModal(props) {
  const closeRef = useRef();
  const [name, setName] = useState();
  const [amount, setAmount] = useState();
  const [updateId, setUpdateId] = useState();

  const addExpense = async () => {
    if (!updateId) {
      await API_CLIENT.post('/add-expense', {
        name: name,
        amount: amount,
        date: getDate()
      });
    } else {
      await API_CLIENT.patch('/update-expense', {
        name: name,
        amount: amount,
        date: props.selectedUpdateExpense.date,
        id: updateId
      });
    }

    props.getUserDetails();
    closeRef.current.click();
    setUpdateId(null);
  }

  const getDate = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    return today;
  }

  useEffect(() => {
    if (props.selectedUpdateExpense) {
      setName(props.selectedUpdateExpense.name);
      setUpdateId(props.selectedUpdateExpense.id);
      setAmount(props.selectedUpdateExpense.amount);
    }
  }, [])

  return (
    <div class="modal fade" id="AddExpenseModal" tabindex="-1" role="dialog" aria-labelledby="AddExpenseModal" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="AddExpenseModal">{updateId ? "Update Expense" : "Add new expense"}</h5>
            <button type="button" class="close" data-dismiss="modal" onClick={(e) => props.toggleshowExpenseModal(false)} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <input value={name} onChange={(e) => setName(e.target.value)} className="form-control mt-2" type={'text'} placeholder="Add name"></input>
            <input value={amount} onChange={(e) => setAmount(e.target.value)} className="form-control mt-2" type={'number'} placeholder="Add amount"></input>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onClick={(e) => props.toggleshowExpenseModal(false)} ref={closeRef} data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" onClick={addExpense}>Save changes</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddExpenseModal;