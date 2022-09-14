import { useRef, useState } from "react";
import API_CLIENT from "../api/axios_client";

function AddInvestMentModal(props) {
  const [amount, setAmount] = useState(0);
  const [name, setName] = useState('TFSA');
  const closeRef = useRef();

  const addInvestment = async () => {
    let total = parseInt(amount);

    if (props.Investements) {
      const sameInvestMents = props.Investements.filter(item => item.type == name);
      // console.log(sameInvestMents, props.Investements, name)

      sameInvestMents.forEach(item => {
        total += parseInt(item.amount)
      })

      if (!sameInvestMents.length) {
        await API_CLIENT.post('/add-new-investment', {
          name: name,
          amount: total
        })
      } else {
        await API_CLIENT.patch('/update-investment', {
          name: name,
          amount: total
        });
      }
    } else {
      await API_CLIENT.patch('/update-investment', {
        name: name,
        amount: total
      });
    }
    props.getUserDetails();
    closeRef.current.click();
  }
  return (
    <div class="modal fade" id="AddInvestmentModal" tabindex="-1" role="dialog" aria-labelledby="AddInvestmentModal" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="AddInvestmentModal">Add Investment</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <input className="form-control" type={'number'} onChange={e => setAmount(e.target.value)} placeholder="add amount" min={'0'}></input>
            <select class="form-select mt-2" onChange={e => { setName(e.target.value) }} aria-label="Default select example">
              <option selected value="TFSA">TFSA</option>
              <option value="RRSP">RRSP</option>
            </select>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal" ref={closeRef}>Close</button>
            <button type="button" class="btn btn-primary" onClick={addInvestment}>Save changes</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddInvestMentModal;