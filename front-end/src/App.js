import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PrivateRoute, PublicRoute } from './routes/route-auth';
import Login from './routes/login';
import SignUp from './routes/signup';
import ConfirmPin from './routes/confirm-pin';
import Home from './routes/home';
import Amplify from 'aws-amplify';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Visualization from './routes/visualization';

Amplify.configure({
  aws_cognito_region: "us-east-1",
  aws_user_pools_id: "us-east-1_bC5q77fwk",
  aws_user_pools_web_client_id: "4lkdo84m3ko27535ntvupmuhvi",
});

function App() {
  return (
    <div className="App container ">
      <ToastContainer />
      <div>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<PublicRoute restrictedToPublicOnly={true} />}>
              <Route path='/' element={<Login />}></Route>
              <Route path='/login' element={<Login />}></Route>
              <Route path='/signup' element={<SignUp />}></Route>
              <Route path='/confirmation' element={<ConfirmPin />}></Route>
            </Route>
          </Routes>

          <Routes>
            <Route path='/' element={<PrivateRoute />}>
              <Route path='/home' element={<Home />}></Route>
              <Route path='/visualization' element={<Visualization/>}></Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
