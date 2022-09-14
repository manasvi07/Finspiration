import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useForm from "../hooks/useFormHook";

// //  Ref: https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/
function ConfirmPin(props) {
  const initialValues = {
    email: "",
    pin: ""
  };

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    try {
      await Auth.confirmSignUp(values.email, values.pin);
      toast.success("Verified Successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }
  }

  const {
    values,
    changeHandler,
    errors,
    touched,
    submitHandler
  } = useForm({ initialValues: initialValues, validations: [], onSubmit: onSubmit });

  return (
    <div className="w-50 mx-auto border rounded p-3">
      <h1> Confrim pin</h1>

      <div className="form-group mt-3">
        <input value={values.email} onChange={changeHandler} name="email" type="email" className="form-control" placeholder="Enter Your email" />
        <small>Your email address</small>
      </div>

      <div className="form-group mt-3">
        <input value={values.pin} onChange={changeHandler} name="pin" type="text" className="form-control" placeholder="Enter Your pin" />
        <small>pin received on email address</small>
      </div>

      <button type="submit" className="btn btn-primary signup-btn mt-5" onClick={submitHandler}>Verify</button>
    </div>
  )
}

export default ConfirmPin;