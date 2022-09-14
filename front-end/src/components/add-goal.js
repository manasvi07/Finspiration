import { useRef, useState } from "react"
import API_CLIENT from "../api/axios_client";


function AddGoalModal(props) {
  const closeRef = useRef();

  const [goalName, setGoalName] = useState();
  const [goalCatagory, setGoalCatagory] = useState();
  const [target, setTarget] = useState();
  const [months, setMonths] = useState();
  const [err, setErr] = useState();

  const addNewGoal = async () => {
    const res = await API_CLIENT.post('/add-goal', {
      name: goalName,
      category: goalCatagory,
      target: target,
      duration: months
    });
    props.getUserDetails();
    closeRef.current.click();
  }

  return (
    <div class="modal fade" id="AddGoalModal" tabindex="-1" role="dialog" aria-labelledby="AddGoalModal" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="AddGoalModal">Add new goal</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <input onChange={(e) => setGoalName(e.target.value)} className="form-control mt-2" type={'text'} placeholder="Add name"></input>
            <input onChange={e => setGoalCatagory(e.target.value)} className="form-control mt-2" type={'text'} placeholder="Add catagory"></input>
            <input onChange={e => setTarget(e.target.value)} className="form-control mt-2" type={'number'} placeholder="Add taget"></input>
            <input onChange={e => setMonths(e.target.value)} className="form-control mt-2" type={'number'} placeholder="Add Duration"></input>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" ref={closeRef} data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" onClick={addNewGoal}>Save changes</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddGoalModal;