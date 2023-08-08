import { Route, Routes } from 'react-router-dom';
import Men from './Pages/Men';
import Women from './Pages/Women';
import Kids from './Pages/Kids';
import Accessories from './Pages/Accessories';
import Homepage from './Pages/Homepage';
import LogIn from './Pages/LogIn';
import VerifyOTP from './Pages/OtpVerification';
import SignUp from './Pages/SignUp';
import AddToCart from './Pages/AddToCart';
import PageNotFound from './Pages/PageNotFound';
import Cart from './Pages/ShoppingCart';


function App() {
  return (
    <Routes>
      <Route path='/' Component={Homepage} />
      <Route path='products'>
        <Route path='men' Component={Men}/>
        <Route path='women' Component={Women}/>
        <Route path='kids' Component={Kids}/>
        <Route path='accessories' Component={Accessories}/>
        <Route path=':productID' Component={AddToCart}/>
      </Route>
      <Route path='/cart' Component={Cart}/>
      <Route path='/login' Component={LogIn} />
      <Route path='/signup' Component={SignUp} />
      <Route path='/verify' Component={VerifyOTP} />
      <Route path="*" Component={PageNotFound} />
    </Routes>   
  );
}

export default App;
