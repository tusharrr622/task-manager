import { Route, Routes } from 'react-router-dom';
import './stylesheets/App.css';
import Register from './components/Register';
import Login from './components/Login';
import Tasks from './components/Tasks';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Register />}>
        </Route>
        <Route path='/login' element={<Login />} />
        <Route path='/tasks' element={<Tasks />} />
      </Routes>
    </>
  );
}

export default App;
