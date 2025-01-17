

import React, { Fragment, useContext, useEffect, useState } from 'react'
import { StoreContext } from '../context/store'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react'
import { BsChevronBarExpand ,BsCheck} from 'react-icons/bs'
import clsx from 'clsx'
import axios from 'axios'



export default function AddTask() { 

    const {url,token,fetchTasks,users,setUsers} = useContext(StoreContext)

    const [formData ,setFormData] = useState({})

    const [loading , setLoading] = useState(false)

    const [error ,setError] = useState(null)

    const navigate = useNavigate()

    const [selected , setSelected] = useState([])


    // handleChange
    const handleChange = (e) => {

        setFormData({...formData, [e.target.name]:e.target.value})

    }

    // handleSubmit
    const handleSubmit = async (e) => {

        e.preventDefault()

        try
        {
            setLoading(true)

            setError(null)

            const res = await axios.post(url + "/api/task/create-task",formData,{headers:{token}})

            if(res.data.success)
            {
                toast.success(`${res.data.task} is added successfully`)

                navigate(-1)

                fetchTasks()

                setLoading(false)
            }

        }
        catch(errror)
        {
            setError(errror.mesage)

            setLoading(false)

            console.log(error.message.data.message)
        }

    }

    // handleSelect
    const handleSelectChange  = (el) => {

        setSelected(el)

        setFormData({...formData , team : el})

    }

    useEffect(() => {
    
        if(formData?.team?.length < 1)
        {
            users && setSelected([users[0]])
        }
        else
        {
            setSelected(formData?.team)
        }
    
    },[])

    console.log(formData)

  return (

    <section className="section space-y-8 max-w-2xl mx-auto">

        <h2 className="title2 text-center">Add Task</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-y-5">
            
            {/* title */}
            <div className="flex flex-col gap-y-2">

                <label htmlFor="" className="label">Title</label>

                <input 
                    type="text" 
                    className="input"
                    placeholder='title'
                    name="title"
                    onChange={handleChange}
                    value={formData.title}
                />

            </div>

            {/* stage */}
            <div className="flex flex-col gap-y-2">

                <label  className="label">Stage</label>

                <select 
                    className="input"
                    name="stage"
                    onChange={handleChange}
                >

                    <option value="">Select stage</option>

                    <option value="in progress">in progress</option>

                    <option value="todo">todo</option>

                    <option value="completed">completed</option>

                </select>
            </div>
            
            {/* priority */}
            <div className="flex flex-col gap-y-2">

                <label  className="label">Priority</label>

                <select 
                    className="input"
                    name="priority"
                    onChange={handleChange}
                >

                    <option value="">Select stage</option>

                    <option value="high">high</option>

                    <option value="low">low</option>

                    <option value="medium">medium</option>

                    <option value="normal">normal</option>

                </select>
            </div>

            {/* date */}
            <div className="flex flex-col gap-y-2">

                <label className="label">Date</label>

                <input 
                   type="date" 
                   className="input" 
                   name="date"
                   onChange={handleChange}
                   value={formData.date}
                />


            </div>

            {/* team */}
            <div className="">
            
                <label className="">Team</label>
            
                <Listbox
                    value={selected}
                    onChange={(el) => handleSelectChange(el)}
                    multiple
                >

                    <div className="relative mt-1">

                        <ListboxButton className="relative w-full cursor-default rounded bg-transparent pl-3 pr-3 text-left px-3 py-2.5 2xl:py-3 border border-slate-500 sm:text-sm">

                            <span className="block truncate ">
                                {selected?.map((user) => user.username).join(",")}
                            </span>

                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <BsChevronBarExpand
                                    className="h-5 w-5 text-slate-500"
                                    aria-hidden="true" 
                                />
                            </span>

                        </ListboxButton>

                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >

                            <ListboxOptions className="z-50 absolute mt-1 max-h-60 w-full overflow-auto bg-white py-1 text-base shadow-lg ring-1 ring-black/50 focus:outline-none sm:text-sm">
                               
                                {users?.map((tool,index) => (

                                    <ListboxOption
                                        key={index}
                                        className={({active}) => 
                                            `relative cursor-default select-none py-2 pl-10 pr-4
                                            ${active ? "bg-red-100 text-primary" : "text-gray-900"}`
                                        }
                                        value={tool._id}
                                    >
                                        {({selected}) => (

                                            <>

                                                <div className={clsx(
                                                    "flex items-center gap-2 truncate",
                                                    selected ? "font-medium": "font-normal"
                                                )}>
                                                    <span className="">{tool.username}</span>
                                                </div>

                                                {selected ? 
                                                (
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                        <BsCheck className="h-5 w-5 " aria-hidden="true"/>
                                                    </span>
                                                ) 
                                                : (null)}

                                            </>

                                        )}
                                    </ListboxOption>

                                ))}

                            </ListboxOptions>

                        </Transition>

                    </div>

                </Listbox>
            
            </div>
            
            {/* button */}
            <button 
                className="btn"
                type="submit"
                disabled={handleSubmit}
            >
                {loading ? 
                (
                    <div className="flexCenter gap-x-3">

                        <span className="loading"/> Loading ...

                    </div>
                ) 
                : 
                ("Add Task")
            }
            </button>

        </form>

    </section>

  )

}
