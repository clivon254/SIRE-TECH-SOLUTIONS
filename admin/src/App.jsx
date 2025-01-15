

import React, { useContext } from 'react'
import {BrowserRouter ,Routes,Route,Navigate} from "react-router-dom"
import { Toaster } from "sonner"
import {useSelector} from "react-redux"
import Dashboard from './page/Dashboard'
import Login from './page/Login'
import Register from './page/register'
import Forgotpassword from './page/Forgotpassword'
import { StoreContext } from './context/store'




const LayOut = () => {

  const currentUser = useSelector(state => state.user)

  const {token} = useContext(StoreContext)

  return(

    currentUser?.isAdmin && token ?

    <div className=""></div>

    :

    <Navigate to="/login"/>

  )

}


export default function App() {

  return (

      <BrowserRouter>

        <Toaster richColors/>

        <main className="">

          <Routes>

              <Route element={<LayOut/>}>

                  <Route path="/" element={<Dashboard/>}/>
              
              </Route>

              <Route path="/login" element={<Login/>}/>

              <Route path="/register" element={<Register/>}/>

              <Route path="/forgot-password" element={<Forgotpassword/>}/>

              <Route path="/reset-password/:token" element={<Login/>}/>

          </Routes>
          
        </main>

      </BrowserRouter>
  )

}
