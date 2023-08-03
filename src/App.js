import { Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Men from './Pages/Men';
import Footer from './Components/Footer';
import Women from './Pages/Women';
import Kids from './Pages/Kids';
import Accessories from './Pages/Accessories';


function App() {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path='products'>
          <Route path='men' Component={Men}/>
          <Route path='women' Component={Women}/>
          <Route path='kids' Component={Kids}/>
          <Route path='accessories' Component={Accessories}/>
          <Route path=':productID' Component={Footer}/>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
