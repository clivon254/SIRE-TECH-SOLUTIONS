


import React, { useContext, useState } from 'react'
import LOGIN from "../assets/SIRELOGO.png"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { signInFailure, signInStart } from '../redux/user/userSlice'
import axios from "axios"
import { StoreContext } from '../context/store'


export default function Login() {

  const {loading,error} = useSelector(state => state.user)

  const {} = useContext(  StoreContext)

  const [formData ,setFormData] = useState({})

  const dispatch = useDispatch()

  const navigate = useNavigate()

  console.log(formData)

  // onChange
  const onChange = (e) => {

    setFormData({...formData , [e.target.name]:e.target.value})

  }

  // handleSubmit
  const handleSubmit = async (e) => {

    e.preventDefault()

    dispatch(signInStart())

    try
    {

      const res = await axios.post()


    }
    catch(error)
    {

      if(error.response)
      {
        const errorMessage = error.response.data.message 

        dispatch(signInFailure(errorMessage))
      }
      else
      {
        dispatch(signInFailure(error.response))
      }

    }

  }

  return (

    <div className="w-full flex items-center justify-center min-h-screen">

        <div className="flex flex-col w-full gap-y-5">

          {/* header */}
          <div className="flex flex-col items-center gap-y-5">

            <img 
              src={LOGIN} 
              alt="" 
              className=" h-20 w-60" 
            />

            <h1 className="">Sign in</h1>

          </div>

          {/* form */}
          <div className="">

            <form onSubmit={handleSubmit} className="flex flex-col gap-y-5 max-w-xl px-5">

              {/* email */}
              <div className="flex flex-col gap-y-2">

               <label htmlFor="" className="">Email</label>

               <input 
                  type="email" 
                  className="" 
                  value={formData.email}
                  onChange={onChange}
                  name="email"
                  placeholder='name@example.com'
               />

              </div>

              {/* password */}
             <div className="flex flex-col gap-y-2">

               <label htmlFor="" className="">Password</label>

               <input 
                  type="password" 
                  className="" 
                  value={formData.password}
                  onChange={onChange}
                  name="password"
                  placeholder='*********'
               />

              </div>

              <div className="flex items-center justify-between">

                <span className="">forgot password?</span>

                <span className="">Already have an account</span>

              </div>

              {/* button */}
              <button 
                className=""
                disabled={loading}
                type="submit"
              >
                {loading ? 'Loading...' : 'Sign in'}
              </button>

            </form>

          </div>

        </div>

    </div>
    
  )

}
