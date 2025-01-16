

import React, { useContext, useState } from 'react'
import { StoreContext } from '../context/store'
import axios from 'axios'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Alert } from 'flowbite-react'

export default function AddClients() {
    
    const {url,token,fetchClients} = useContext(StoreContext)

    const [formData ,setFormData] = useState({})

    const [loading, setLoading] = useState(false)

    const [error, setError] = useState(null)

    const navigate = useNavigate()


    console.log(formData)

    // handleChange
    const handleChange = (e) => {

        setFormData({...formData , [e.target.name]:e.target.value})

    }

    // handleSubmit
    const handleSubmit = async (e) => {

        e.preventDefault()

        try
        {
            setLoading(true)

            setError(null)

            const res = await axios.post(url + '/api/client/add-client',formData,{headers:{token}})

            if(res.data.success)
            {
                setLoading(false)

                toast.success(`${res.data.newClient.name} has been added`)

                navigate('/possible-clients')
                
                fetchClients()
            }

        }
        catch(error)
        {
            setLoading(false)

            if(error.response)
            {
                const errorMessage = error.response.data.message 

                setError(errorMessage)
            }
            else
            {
                setError(error.message)
            }

            console.log(error.message)
        }

    }

  return (

    <section className="section space-y-8">

        <h2 className="text-center title2">Add Client</h2>

        <form onSubmit={handleSubmit} className=" flex flex-col gap-y-4">

            {/* name */}
            <div className="flex flex-col gap-y-2">

                <label htmlFor="" className="label">Name</label>

                <input 
                    type="text" 
                    className="input" 
                    placeholder="enter clients name"
                    name="name"
                    onChange={handleChange}
                    value={formData.name}
                />

            </div>

            {/* email */}
            <div className="flex flex-col gap-y-2">

                <label htmlFor="" className="label">email</label>

                <input 
                    type="text" 
                    className="input" 
                    placeholder="name@example.com"
                    name="email"
                    onChange={handleChange}
                    value={formData.email}
                />

            </div>
            
            {/* phone */}
            <div className="flex flex-col gap-y-2">

                <label htmlFor="" className="label">Phone</label>

                <input 
                    type="text" 
                    className="input" 
                    placeholder="enter clients phone"
                    name="phone"
                    onChange={handleChange}
                    value={formData.phone}
                />

            </div>

            {/* whatsapp */}
            <div className="flex flex-col gap-y-2">

                <label htmlFor="" className="label">What app</label>

                <input 
                    type="text" 
                    className="input" 
                    placeholder="enter clients whats'app number( or put phone)"
                    name="whatsapp"
                    onChange={handleChange}
                    value={formData.whatsapp}
                />

            </div>


            {/*addinfo  */}
            <div className="flex flex-col gap-y-2">

                <label htmlFor="" className="label">Additional Infomation</label>

                <textarea 
                    type="text" 
                    className="input" 
                    placeholder="type here .. . ."
                    name="additionalInfo"
                    onChange={handleChange}
                    value={formData.additionalInfo}
                />

            </div>

            <button 
                className="btn"
                type="submit"
                disabled={loading}
            >
                {loading ? 
                    (
                        <div className="flexCenter gap-x-1">
                            <span className="load"/> Loading
                        </div>
                    )
                    :
                    "submit"
            }
            </button>

            {error && (

                <Alert color="failure">{error}</Alert>

            )}


        </form>

    </section>

  )
}
