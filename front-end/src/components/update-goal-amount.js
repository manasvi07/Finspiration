import { useEffect, useRef, useState } from "react";
import API_CLIENT from "../api/axios_client";

function UpdateGoalAmount(props) {
  const closeRef = useRef();
  const [goalName, setGoalName] = useState();
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (props.goal) {
      setGoalName(props.goal.name);
    }
  })

  const addAmount = async () => {
    await API_CLIENT.patch('/update-goal', {
      name: goalName,
      amount: parseInt(amount)
    })
    closeRef.current.click();
    props.getUserDetails();

  }

  return (
    <div class="modal fade" id="UpdateGoalModal" tabindex="-1" role="dialog" aria-labelledby="UpdateGoalModal" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="UpdateGoalModal">Add savings for your {goalName} Goal.</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <input value={amount} onChange={e => setAmount(e.target.value)} className="form-control mt-2" type={'number'} placeholder="Add amount"></input>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" ref={closeRef} data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" onClick={addAmount}>Save changes</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdateGoalAmount;