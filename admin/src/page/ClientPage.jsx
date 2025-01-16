



import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { StoreContext } from '../context/store'
import axios from "axios"
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { FaEdit } from 'react-icons/fa';
import { getInitials } from '../utlis';
import { MdAccessTime, MdOutlineMail, MdOutlineMailOutline } from 'react-icons/md';
import { LuPhone } from "react-icons/lu";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { FaCheck, FaRegMessage, FaTrash } from "react-icons/fa6";
import Delete from '../components/Delete';



export default function ClientPage() {

    const {url,setOpenDelete,openDelete,setClients,token} = useContext(StoreContext)

    const {clientId} = useParams()

    const [client ,setClient] = useState({})

    const [fetchClientLoading , setFetchClientLoading] = useState(false)

    const [fetchClientError , setFetchClientError] = useState(false)

    console.log(client)

    const navigate = useNavigate()

   

    const [actions , setActions] = useState([
        {
            icon:<LuPhone/>,
            label:"Call",
            bg:"blue"
        },
        {
            icon:<IoChatbubbleEllipsesOutline />,
            label:"WhatsApp",
            bg:"green"
        },
        {
            icon:<FaRegMessage />,
            label:"Message",
            bg:"purple"
        },
        {
            icon:<FaCheck/>,
            label:"Convert to Client",
            bg:"green"
        },
        {
            icon:<FaTrash/>,
            label:"Delete",
            bg:"primary"
        },
    ])


    // fetchClient
    const fetchClient = async () => {

        try
        {
            setFetchClientLoading(true)

            setFetchClientError(false)

            const res = await axios.get(url + `/api/client/get-client/${clientId}`)

            if(res.data.success)
            {
                setFetchClientLoading(false)

                setClient(res.data.client)
            }
        }
        catch(error)
        {
            setFetchClientLoading(false)

            setFetchClientError(true)
        }

    }

    // handleDelete
    const handleDelete = async () => {

        try
        {   
            console.log("Hello")

            const res = await axios.delete(url + `/api/client/delete-client/${clientId}`,{headers:{token}})

            if(res.data.success)
            {
                setClients((prev) =>
                    prev.filter((client) => client._id !== clientId)
                )

                setOpenDelete(false)

                navigate(-1)
            }

        }
        catch(error)
        {
            console.log(error.message)
        }

    }


    useEffect(() => {

        fetchClient()

    },[clientId])

  return (

    <>

            {!fetchClientLoading && !fetchClientError && (

                <section className="section space-y-10">
                    
                    {/* header */}
                    <div className="flex flex-col gap-y-3 sm:flex-row sm:justify-between sm:items-center">

                        {/* title */}
                        <div className="space-y-1">

                            <h1 className="title2 text-primary">Possible Client Details</h1>

                            <h4 className="text-xs md:text-sm 2xl:text-xl text-slate-600">Detailed information about the potential client</h4>

                        </div>

                        {/* action */}
                        <div className="flex items-center gap-x-2 ">

                            <button className="bg-yellow-400 text-white px-3 py-1 font-semibold rounded-md">

                                <Link to={`/update-client/${clientId}`} className="flex items-center gap-x-2">

                                    <FaEdit/> Edit

                                </Link>

                            </button>

                            <button className="flex items-center gap-x-2 bg-gray-500 text-white font-semibold px-3 py-1 rounded-md ">
                               <IoChevronBackCircleOutline /> Back 
                            </button>

                        </div>

                    </div>

                    {/* client */}
                    <div className="shadow-xl p-5 border border-slate-100 rounded-md grid grid-col-1 md:grid-cols-2 gap-y-8">

                        {/*left*/}
                        <div className="space-y-5">

                            {/* name */}
                            <div className="flex gap-x-3">

                                <span className="block h-16 w-16 rounded-full bg-red-50 text-primary flexCenter font-semibold text-2xl">{getInitials(client?.name)}</span>

                                <div className="">

                                    <span className="text-3xl block font-semibold">{client?.name}</span>

                                    <span className="text-slate-500 block text-xs lg:text-sm">{client?.status ? "Client" :"Possible Client"}</span>

                                </div>

                            </div>

                            {/* email */}
                            <div className="flex items-center gap-x-3">

                                <span className="text-primary">

                                     <MdOutlineMailOutline/>

                                </span>

                                <span className="text-slate-600 text-sm">{client?.email}</span>

                            </div>

                            {/*phone*/}
                            <div className="flex items-center gap-x-3">

                                <span className="text-primary">

                                    <LuPhone/>

                                </span>

                                <span className="text-slate-600 text-sm">{client?.phone}</span>

                            </div>

                        </div>
                        
                        {/* right */}
                        <div className="space-y-5">

                            <h2 className="text-xl font-semibold text-primary">Additional Information</h2>

                            <div className="text-sm flex items-center gap-x-2">

                                <span className="flex items-center gap-1 font-bold">
                                    <MdAccessTime/> WhatsApp : 
                                </span>

                                <span className="text-slate-600">
                                    {client?.whatsapp}
                                </span>

                            </div>

                            {/* notes */}
                            <div className="bg-gray-100 p-2 space-y-3 rounded-md">

                                <h3 className="text-primary text-sm font-semibold">Notes: </h3>

                                <p className="text-sm text-slate-700">
                                    {client?.additionalInfo}
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* action */}
                    <div className="w-full flex justify-around flex-wrap gap-y-2 text-white text-sm ld:text-base">

                        <button  
                            className={`bg-blue flex items-center  gap-x-3 border border-gray-200 px-4 py-2 rounded-md`}
                        >
                            <LuPhone/> Call
                        </button>

                        <button  
                            className={`bg-green flex items-center  gap-x-3 border border-gray-200 px-4 py-2 rounded-md`}
                        >
                            <IoChatbubbleEllipsesOutline/> WhatsApp
                        </button>

                        <button  
                            className={`bg-purple flex items-center  gap-x-3 border border-gray-200 px-4 py-2 rounded-md`}
                        >
                            <FaRegMessage/> Manage Interactions
                        </button>

                        <button  
                            className={`bg-green flex items-center  gap-x-3 border border-gray-200 px-4 py-2 rounded-md`}
                        >
                            <FaCheck/> Convert to Client
                        </button>

                        <button  
                            onClick={() => setOpenDelete(true)}
                            className={`bg-primary flex items-center  gap-x-3 border border-gray-200 px-4 py-2 rounded-md`}
                        >
                            <FaTrash/> Delete
                        </button>

                    </div>

                    {/* communication */}
                    <div className="space-y-3">

                        <div className="space-y-1">

                            <h2 className="text-primary/70 text-base font-semibold">SMS TEMPLATE </h2>

                            <p className="text-sm text-slate-500">Use Custom Message</p>

                        </div>

                        <div className="space-y-1">

                            <h2 className="text-primary/70 text-base font-semibold">PHONE NUMBER</h2>

                            <p className="text-sm text-slate-500">{client?.phone}</p>

                        </div>

                        <h2 className="text-sm">MESSAGE</h2>

                         
                    </div>

                </section>

            )}

            {openDelete && (

                <Delete handleDelete={handleDelete} product={"client"} item={client?.name}/>
          
            )}
    </>

  )

}
