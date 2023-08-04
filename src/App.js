import { Route, Routes } from 'react-router-dom';
import Men from './Pages/Men';
import Women from './Pages/Women';
import Kids from './Pages/Kids';
import Accessories from './Pages/Accessories';
import Homepage from './Pages/Homepage';
import LogIn from './Pages/LogIn';
import VerifyOTP from './Pages/OtpVerification';
import SignUp from './Pages/SignUp';


function App() {
  return (
    <Routes>
      <Route path='/' Component={Homepage} />
      <Route path='products'>
        <Route path='men' Component={Men}/>
        <Route path='women' Component={Women}/>
        <Route path='kids' Component={Kids}/>
        <Route path='accessories' Component={Accessories}/>
        <Route path=':productID' />
      </Route>
      <Route path='/login' Component={LogIn} />
      <Route path='/signup' Component={SignUp} />
      <Route path='/verify' Component={VerifyOTP} />
    </Routes>   
  );
}

export default App;
