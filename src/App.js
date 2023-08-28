import { Route, Routes } from 'react-router-dom';
import Men from './Pages/Men';
import Women from './Pages/Women';
import Kids from './Pages/Kids';
import Accessories from './Pages/Accessories';
import Homepage from './Pages/Homepage';
import LogIn from './Pages/LogIn';
import OtpVerification from './Pages/OtpVerification';
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
import AdminCustomers from './Pages/AdminCustomers';
import LoginFindEmail from './Pages/LoginFindEmail';
import LoginChangePassword from './Pages/LoginChangePassword';



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

      {/* Routes for Logged as Customer */}

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

      {/* Routes for Logged as Admin */}

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
          <Route path='customers' Component={AdminCustomers}/>
          <Route path='settings' Component={AdminSettings}/>
        </Route>
      )}

      {/* Routes for not logged users */}

      {isAdmin || isCustomer? null : (
        <>
          <Route path='login'>
            <Route path='' Component={LogIn} />
            <Route path='find-email' Component={LoginFindEmail} />
            <Route path='change-password' Component={LoginChangePassword} />
          </Route>
          <Route path='/signup' Component={SignUp} />
          <Route path='/verify' Component={OtpVerification} />
        </>
      )}
      <Route path="*" Component={PageNotFound} />
    </Routes>   
  );
}

export default App;
