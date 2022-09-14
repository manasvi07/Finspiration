import { useRef, useState } from "react";
import API_CLIENT from "../api/axios_client";

function AddBudgetModal(props) {
  const closeRef = useRef();
  const [name, setName] = useState();
  const [amount, setAmount] = useState();

  const addNewBudget = async () => {
    await API_CLIENT.post('/add-monthly-budget', {
      data: [{
        item: name,
        amount: amount
      }]
    })
    props.getUserDetails();
    closeRef.current.click();
  }

  return (
    <div class="modal fade" id="AddBudgetModal" tabindex="-1" role="dialog" aria-labelledby="AddBudgetModal" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="AddBudgetModal">Add new budget</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <input onChange={(e) => setName(e.target.value)} className="form-control mt-2" type={'text'} placeholder="Add name"></input>
            <input onChange={e => setAmount(e.target.value)} className="form-control mt-2" type={'number'} placeholder="Add amount"></input>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" ref={closeRef} data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" onClick={addNewBudget}>Save changes</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddBudgetModal;