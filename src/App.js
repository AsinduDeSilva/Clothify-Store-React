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
import Checkout from './Pages/Checkout';
import Profile from './Pages/Profile';
import UpdateProfile from './Pages/UpdateProfile';
import ChangePassword from './Pages/ChangePassword';
import Orders from './Pages/Orders';
import Latest from './Pages/Latest';
import AdminProducts from './Pages/AdminProducts';
import AddProduct from './Pages/AddProduct';
import UpdateProduct from './Pages/UpdateProduct';
import { useSelector } from 'react-redux';
import AdminDashboard from './Pages/AdminDashboard';
import AdminOrders from './Pages/AdminOrders';
import AdminOrderDetails from './Pages/AdminOrderDetails';
import AdminSettings from './Pages/AdminSettings';



function App() {

  const {isAdmin, isCustomer} = useSelector(state => state.userInfo);

  return (
    <Routes>
      <Route path='/' Component={Homepage} />
      <Route path='products'>
        <Route path='men' Component={Men}/>
        <Route path='women' Component={Women}/>
        <Route path='kids' Component={Kids}/>
        <Route path='latest' Component={Latest}/>
        {/* <Route path='accessories' Component={Accessories}/> */}
        <Route path=':productID' Component={AddToCart}/>
      </Route>
      <Route path='/cart' Component={Cart}/>
      {!isCustomer ? null : (
        <>
          <Route path='/checkout' Component={Checkout} />
          <Route path='/orders' Component={Orders} />
          <Route path='profile'>
            <Route path='overview' Component={Profile}/>
            <Route path='update' Component={UpdateProfile}/>
            <Route path='change-password' Component={ChangePassword}/>
          </Route>
        </>
      )}
      {!isAdmin ? null : (
        <Route path='admin'>
          <Route path='dashboard' Component={AdminDashboard}/>
          <Route path='products'>
            <Route path='' Component={AdminProducts}/>
            <Route path='add' Component={AddProduct}/>
            <Route path='update' Component={UpdateProduct}/>
          </Route>
          <Route path='orders'>
            <Route path='' Component={AdminOrders}/>
            <Route path=':orderID' Component={AdminOrderDetails}/>
          </Route>
          <Route path='settings' Component={AdminSettings}/>
        </Route>
      )}
      <Route path='/login' Component={LogIn} />
      <Route path='/signup' Component={SignUp} />
      <Route path='/verify' Component={VerifyOTP} />
      <Route path="*" Component={PageNotFound} />
    </Routes>   
  );
}

export default App;
