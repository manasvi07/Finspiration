import { useRef, useState } from "react";
import API_CLIENT from "../api/axios_client";

function AddSalaryModal(props) {
  const [salary, setSalary] = useState(0);
  const closeRef = useRef();

  const addSalary = async () => {
    await API_CLIENT.post('/add-salary', { salary: salary });
    props.setSalary(salary);
    
    closeRef.current.click();
  }

  return (
    <div class="modal fade" id="AddSalaryModal" tabindex="-1" role="dialog" aria-labelledby="AddSalaryModal" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="AddSalaryModal">Update your salary</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <input onChange={(e) => setSalary(e.target.value)} className="form-control" type={'number'} placeholder="add salary" min={'0'}></input>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" ref={closeRef} data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" onClick={addSalary}>Save changes</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddSalaryModal;