import useForm from "../hooks/useFormHook";
import { ToastContainer, toast } from 'react-toastify';
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";

//  Ref: https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/
function SignUp(props) {
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  };

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    // e.preventDefault();

    try {
      try {
        await Auth.signUp({
          username: values.email,
          password: values.password,
          attributes: {
            email: values.email,
            name: values.firstName,
            given_name: values.lastName
          },
        });
        toast.success("Success fully signed up")
        navigate("/confirmation");
      } catch (error) {
        console.error(error);
        toast.error(error)
      }
    } catch (err) {
      toast.error(err);
    }
  };

  const {
    values,
    changeHandler,
    errors,
    touched,
    submitHandler
  } = useForm({ initialValues: initialValues, validations: [], onSubmit: onSubmit });


  return (
    <div id="Signup" className="mt-5">
      <div className="mt-3 border bg-white p-3 rounded w-50 mx-auto">
        <h3 className="text-center">Registration</h3>


        <div className="col-md-12 mt-4">
          <div className="form-group">
            <input value={values.firstName} onChange={changeHandler} name="firstName" type="text" className="form-control" placeholder="First Name" />
            <small>Your first name</small>
          </div>

          <div className="form-group mt-3">
            <input type="text" value={values.lastName} name="lastName" onChange={changeHandler} className="form-control" placeholder="Last Name" />
            <small>Your last name</small>
          </div>

          <div className="form-group mt-3">
            <input value={values.email} onChange={changeHandler} name="email" type="email" className="form-control" placeholder="Enter Your email" />
            <small>Your email address</small>
          </div>

          <div className="form-group mt-3">
            <input value={values.password} onChange={changeHandler} name="password" type="password" className="form-control" placeholder="Password" />
            <small>Passowd with atleast 8 characters, 1 special char, 1 digit and 1 uppercase</small>
          </div>

          <button type="submit" className="btn btn-primary signup-btn mt-5" onClick={submitHandler}>Sign up</button>

        </div>
      </div>
    </div>
  )
}

export default SignUp;
