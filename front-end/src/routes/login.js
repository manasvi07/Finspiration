import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useForm from "../hooks/useFormHook";

// //  Ref: https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/
function Login(props) {
  const initialValues = {
    email: "",
    password: ""
  };

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    try {
      await Auth.signIn(values.email, values.password);
      navigate('/home')
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
    <div className="w-50 mx-auto border rounded p-3 mt-5">
      <h1> Login </h1>

      <div className="form-group mt-3">
        <input value={values.email} onChange={changeHandler} name="email" type="email" className="form-control" placeholder="Enter Your email" />
        <small>Your email address</small>
      </div>

      <div className="form-group mt-3">
        <input value={values.password} onChange={changeHandler} name="password" type="password" className="form-control" placeholder="Enter Your password" />
        <small>Your password</small>
      </div>

      <button type="submit" className="btn btn-primary signup-btn mt-5" onClick={submitHandler}>Login</button>
    </div>
  )
}

export default Login;