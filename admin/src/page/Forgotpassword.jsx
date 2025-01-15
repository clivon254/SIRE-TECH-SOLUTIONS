

import React, { useContext, useState } from 'react'
import { StoreContext } from '../context/store'
import LOGIN from "../assets/SIRELOGO.png"
import { Alert } from 'flowbite-react'
import axios from 'axios'
import {toast} from "sonner"

export default function Forgotpassword() {
  
  const {url} = useContext(StoreContext)

  const [loading ,setLoading] = useState(false)

  const [error ,setError] = useState(null)

  const [success , setSuccess] = useState(null)

  const [formData ,  setFormData] = useState({})


  // handleSubmit
  const handleSubmit = async (e) => {

      e.preventDefault()

      try
      {
        setLoading(true)

        setError(null)

        setSuccess(null)

        const res = await axios.post(url + "/api/auth/forgot-password",formData)

        if(res.data.success)
        {
          setLoading(false)

          setSuccess(res.data.message)

          toast.success("link sent to your email")
        }

      }
      catch(error)
      {
        if(error.response)
        {
          const errorMessage = error.response.data.message 

          setError(errorMessage)

          setSuccess(null)

          setLoading(false)
        }
        else
        {
          setError(error.message)

          setSuccess(null)

          setLoading(false)
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

          <h1 className="title2">Forgot Password</h1>

          <p className="text-center text-sm text-slate-500 px-5">Enter you registered email account and a link will be sent to your account to rest the password</p>

        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-y-3 px-5">

          {/* email */}
          <div className="flex flex-col gap-y-2">

            <label htmlFor="" className="label">email</label>

            <input 
              type="email" 
              className="input"
              placeholder='name@example'
              value={formData.email}
              onChange={(e) => setFormData({...formData , email:e.target.value})}
             />


          </div>

          <button 
            className="btn"
            type='submit'
            disabled={loading}
          >
            {loading ? 
              (
                <div className="flexCenter gap-x-3">

                  <span className="load"/> loading .... 

                </div>
              ) 
              : 
              ("submit")
            }
          </button>

        {error && (

          <Alert color="failure">{error}</Alert>

        )}

        {success && (

          <Alert color="success">{success}</Alert>

        )}

        </form>

      </div>

    </div>

  )
}
