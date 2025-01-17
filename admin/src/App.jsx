

import React, { useContext } from 'react'
import {BrowserRouter ,Routes,Route,Navigate, Outlet} from "react-router-dom"
import { Toaster } from "sonner"
import {useSelector} from "react-redux"
import Dashboard from './page/Dashboard'
import Login from './page/Login'
import Register from './page/register'
import Forgotpassword from './page/Forgotpassword'
import { StoreContext } from './context/store'
import Resetpassword from './page/Resetpassword'
import Header from './components/Header'
import Profile from './page/Profile'
import SideBar from './components/SideBar'
import Projects from './page/Projects'
import Services from './page/Services'
import Task from './page/Task'
import Invoices from './page/Invoices'
import Clients from './page/Clients'
import PossibleClients from './page/PossibleClients'
import AddClients from './page/AddClients'
import UpdateClients from './page/UpdateClients'
import ClientPage from './page/ClientPage'
import Delete from './components/Delete'
import AddService from './page/AddService'
import UpdateService from './page/UpdateService'
import AddProject from './page/AddProject'
import UpdateProject from './page/UpdateProject'
import AddTask from './page/AddTask'
import UpdateTask from './page/UpdateTask'




const LayOut = () => {

  const currentUser = useSelector(state => state.user)

  const {token} = useContext(StoreContext)

  return(

    currentUser && token ?

    <div className="w-full h-screen flex ">

      {/* sidebar */}
      <div className="px-3 hidden lg:block w-1/5">

          <SideBar/>

      </div>

      <div className="w-full lg:w-4/5">

        <Header/>

        <Outlet/>

      </div>

    </div>

    :

    <Navigate to="/login"/>

  )

}


export default function App() {

  const {openDelete} = useContext(StoreContext)

  return (

      <BrowserRouter>

        <Toaster richColors/>

        <main className="">

          <Routes>

              <Route element={<LayOut/>}>

                  <Route path="/" element={<Dashboard/>}/>

                  <Route path="/profile" element={<Profile/>}/>

                  <Route path="/projects" element={<Projects/>}/>

                  <Route path="/update-project/:projectId" element={<UpdateProject/>}/>

                  <Route path="/add-project" element={<AddProject/>}/>

                  <Route path="/services" element={<Services/>}/>

                  <Route path="/add-service" element={<AddService/>}/>

                  <Route path="/update-service/:serviceId" element={<UpdateService/>}/>

                  <Route path="/tasks" element={<Task/>}/>

                  <Route path="/add-task" element={<AddTask/>}/>

                  <Route path="/update-task/:taskId" element={<UpdateTask/>}/>

                  <Route path="/invoices" element={<Invoices/>}/>

                  <Route path="/clients" element={<Clients/>}/>

                  <Route path="/possible-clients" element={<PossibleClients/>}/>

                  <Route path="/add-client" element={<AddClients/>}/>

                  <Route path="/update-client/:clientId" element={<UpdateClients/>}/>

                  <Route path="/client/:clientId" element={<ClientPage/>}/>

              </Route>

              <Route path="/login" element={<Login/>}/>

              <Route path="/register" element={<Register/>}/>

              <Route path="/forgot-password" element={<Forgotpassword/>}/>

              <Route path="/reset-password/:token" element={<Resetpassword/>}/>

          </Routes>

          
        </main>

      

      </BrowserRouter>
  )

}
