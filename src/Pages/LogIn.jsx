import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import logo from '../assets/logo-full.png';
import { useState } from 'react';
import Alert from '@mui/material/Alert';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { login, setCart, setCustomerID } from '../Redux/userInfo';
import MyBackdrop from '../Components/MyBackdrop';


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      Copyright © Clothify Store {new Date().getFullYear()}.
    </Typography>
  );
}

export default function LogIn() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [credentialsInvalidError, setCredentialsInvalidError] = useState(false);
  const [backDropOpen, setBackDropOpen] = useState(false);
  const [emailFieldEmptyError, setEmailFieldEmptyError] = useState(false);
  const [passwordFieldEmptyError, setPasswordFieldEmptyError] = useState(false);
  const [remember, setRemember] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useLocation().state?.cart;
  const fromCart = useLocation().state?.fromCart;
  const {backendAddress} = useSelector(state => state.backendInfo);
  const {isCustomer, isAdmin} = useSelector(state => state.userInfo);

  const setServerCart = async (cart, customerID, jwt) => {
    setBackDropOpen(true);
    const response = await fetch(`${backendAddress}/customer/cart/set/${customerID}`,{  
      method: 'Post',
      body: JSON.stringify(cart),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${jwt}`,
      }
    })
    setBackDropOpen(false);
    return response;
  }

  const loginClicked = () =>{

    setCredentialsInvalidError(false);
    setEmailFieldEmptyError(false);
    setPasswordFieldEmptyError(false);
    if(email === "" || password === ""){
      if(email === ""){setEmailFieldEmptyError(true);}
      if(password === ""){setPasswordFieldEmptyError(true);}
      return;
    }

    setBackDropOpen(true);
    fetch(`${backendAddress}/authenticate`,{
      method: 'POST',
      body: JSON.stringify({
        email: email,
        password: password
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      }
    })
      .then(res => res.json())
      .then(data => {
        setBackDropOpen(false);

        if(data.success){
          dispatch(login({isCustomer: data.customer, jwt: data.jwt, remember: remember}));

          if(data.customer){
            loadCustomerDetails(data.jwt);
            navigate("/", {replace: true});
          }else{
            navigate("/admin/dashboard", {replace: true}); 
          }
          
          return;
        }

        if(data.credentialsValid){
          navigate("/verify", {state: {email:email, password:password}})
        }

        setCredentialsInvalidError(!data.credentialsValid);    
      });   
  }

  const loadCustomerDetails = (jwt) =>{
    setBackDropOpen(true)
    fetch(`${backendAddress}/customer/email`,{  
      method: 'POST',
      body: JSON.stringify({
        email: email,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${jwt}`,
      }
    })
    .then(res => res.json())
    .then(async data => {
      setBackDropOpen(false);
      Cookies.set('customerID',data.customerID, {expires: 7});
      dispatch(setCustomerID(data.customerID));

      if(fromCart){
        let tempCart = [...data.cart]
        cart.forEach(cartItem => {
          tempCart.push(cartItem);
        });
        await setServerCart(tempCart, data.customerID, jwt);
        dispatch(setCart(tempCart));
        return;
      }

      dispatch(setCart(data.cart));
    })
  }


  return (
    <>
      {isAdmin || isCustomer ? null : (
        <>   
          <Grid container component="main" sx={{ height: '100vh'}}>
            <CssBaseline />
            
            <Grid
              item
              lg={8}
              sx={{
                backgroundImage: `url(${logo})`,
                backgroundRepeat: 'no-repeat',
                backgroundColor: (t) =>
                  t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
    
            
            <Grid item xs={12} lg={4} component={Paper} elevation={6} square >
              <Box
                sx={{
                  my: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
                className='xl:mx-12 sm:mx-[20%] mx-4 '
              >
                <Avatar sx={{ m: 1, bgcolor: '#000000' }}>
                  <LockOutlinedIcon className='text-[#00C2BE]' />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Log In
                </Typography>
                {
                  credentialsInvalidError ? (
                    <Alert severity="error" className='w-full mt-4'>
                      Incorrect email or password
                    </Alert>
                  ): null
                }
                <Box component="form" noValidate sx={{ mt: 1 }}>
                  <TextField
                    error={emailFieldEmptyError ? true : false}
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    onChange={(e) => setEmail(e.target.value)}
                    
                  />
                  <TextField
                    error={passwordFieldEmptyError ? true : false}
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <FormControlLabel
                    control={<Checkbox value="remember" color="default" defaultChecked onChange={e => setRemember(e.target.checked)}/>}
                    label="Remember me"
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, backgroundColor:"#262626", ":hover":{backgroundColor:'#000000'} }}
                    onClick={loginClicked}
                  >
                    Log In
                  </Button>
                  <Grid container>
                    <Grid item xs>
                    <Link to="find-email" className='text-[#1976D2] underline text-sm underline-["red"]'> 
                        Forgot password?
                      </Link>
                    </Grid>
                    <Grid item>
                      <Link to="/signup" className='text-[#1976D2] underline text-sm underline-["red"]'> 
                        {"Don't have an account? Sign Up"}
                      </Link>
                    </Grid>
                  </Grid>
                  <Copyright sx={{ mt: 5 }} />
                </Box>
              </Box>
            </Grid>
          </Grid>
    
          <MyBackdrop backDropOpen={backDropOpen} />
        </>  
      )}
    </>
  );
}
