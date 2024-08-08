import { Container } from 'react-bootstrap'
import './App.scss'
import Header from './components/Header'
import TableUsers from './components/TableUsers'
import Home from './components/Home'
import Login from './components/Login'
import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router-dom"
import { UserContext } from './context/UserContext.tsx'
import { useContext, useEffect } from 'react'

function App() {
  const { user, loginContext } = useContext(UserContext);
  console.log("User>>", user);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      loginContext(localStorage.getItem("email"));
    }
  }, [])
  return (
    <>
      <div>
        <Header />
        <Container>
          <Routes>
            <Route path='/users' element={<TableUsers />}></Route>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/' element={<Home />}></Route>
          </Routes>
        </Container>
      </div>

      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  )
}

export default App
