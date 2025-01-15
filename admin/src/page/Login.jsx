


import React, { useContext, useState } from 'react'
import LOGIN from "../assets/SIRELOGO.png"
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { signInFailure, signInStart, signInSuccess, signOutSuccess } from '../redux/user/userSlice'
import axios from "axios"
import { StoreContext } from '../context/store'
import { Alert } from "flowbite-react"
import {toast} from "sonner"

export default function Login() {

  const {loading,error} = useSelector(state => state.user)

  const {setToken,url} = useContext(StoreContext)

  const [formData ,setFormData] = useState({})

  const dispatch = useDispatch()

  const navigate = useNavigate()


  // onChange
  const onChange = (e) => {

    setFormData({...formData , [e.target.name]:e.target.value})

  }

  // handleSubmit
  const handleSubmit = async (e) => {

    e.preventDefault()

    try
    {

      dispatch(signInStart())

      const res = await axios.post(url + "/api/auth/login",formData)

        if(res.data.success)
        {

          dispatch(signInSuccess(res.data.rest))

          toast.success("You have login successfully")

          localStorage.setItem("token", res.data.token)

          setToken(res.data.token)

          navigate('/')

          setFormData({})

        }

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

    <div className="w-full min-h-screen flexCenter max-w-xl mx-auto">

        <div className="w-full flex flex-col gap-y-6">

          {/* header */}
          <div className="flex flex-col items-center gap-y-5">

            <img 
              src={LOGIN} 
              alt="" 
              className=" h-20 w-60" 
            />

            <h1 className="title2">Sign in</h1>

          </div>

          {/* form */}
          <div className="w-full flex flex-col gap-y-3 px-5">

            <form onSubmit={handleSubmit} className="flex flex-col gap-y-5 ">

              {/* email */}
              <div className="flex flex-col gap-y-2">

               <label htmlFor="" className="label">Email</label>

               <input 
                  type="email" 
                  className="input" 
                  value={formData.email}
                  onChange={onChange}
                  name="email"
                  placeholder='name@example.com'
               />

              </div>

              {/* password */}
             <div className="flex flex-col gap-y-2">

               <label htmlFor="" className="label">Password</label>

               <input 
                  type="password" 
                  className="input" 
                  value={formData.password}
                  onChange={onChange}
                  name="password"
                  placeholder='*********'
               />

              </div>

              <div className="flex items-center justify-between">

                <span className="text-sm font-semibold hover:text-primary">

                  <Link to="/forgot-password">
                    forgot password?
                  </Link>

                </span>
              </div>

              {/* button */}
              <button 
                className="btn"
                disabled={loading}
                type="submit"
              >
                {loading ? 

                  <div className="flexCenter gap-x-2">

                    <span className="load"/> loading ...

                  </div>
                 : 
                 'Sign in'
                 }
              </button>

              {error && (

                <Alert color="failure">{error}</Alert>

              )}

            </form>

          </div>

        </div>

    </div>
    
  )

}
