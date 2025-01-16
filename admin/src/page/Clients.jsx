

import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { IoMdAdd } from "react-icons/io";
import { MdDelete, MdEdit, MdSearch } from 'react-icons/md';
import { StoreContext } from '../context/store';
import { FaEye } from 'react-icons/fa6';
import { getInitials } from '../utlis';
import { Table } from 'flowbite-react';
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Delete from '../components/Delete';
import axios from 'axios';
import { toast } from 'sonner';


export default function Clients() {
  
  const {url,clients,clientsLoading,clientsError,setOpenDelete,token,setClients,openDelete,setClientQuery,fetchClients} = useContext(StoreContext)

  const [loader ,setLoader] = useState([{},{},{},{},{}])

  const [client ,setClient] = useState({})
  
  const [fetchClientLoading , setFetchClientLoading] = useState(false)
  
  const [fetchClientError , setFetchClientError] = useState(false)

  const [clientToDelete , setClientToDelete] = useState("")

  const location = useLocation()

  // fetchClient
  const fetchClient = async () => {

      try
      {
          setFetchClientLoading(true)

          setFetchClientError(false)

          const res = await axios.get(url + `/api/client/get-client/${clientToDelete}`)

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

        const res = await axios.delete(url + `/api/client/delete-client/${clientToDelete}`,{headers:{token}})

        if(res.data.success)
        {
            setClients((prev) =>
                prev.filter((client) => client._id !== clientToDelete)
            )

            setOpenDelete(false)

            toast.error(`${client.name} delete successfully `)
        }

    }
    catch(error)
    {
        console.log(error.message)
    }

  }

  useEffect(() => {

    fetchClient()
    
  },[clientToDelete])


  console.log(location.pathname)

  useEffect(() => {
    
    setClientQuery(true)

      if(location.pathname === '/clients')
      {
        setClientQuery(true)

        fetchClients()
      }
  
  },[location.pathname === "/clients"])

  useEffect(() =>{
  
      setClientQuery(true)

      fetchClients()
      
  },[])


  return (

    <>

      <section className="section space-y-6"> 

          {/* header */}
          <div className="">

            {/* clients */}
            <div className="flex flex-col gap-y-3 sm:flex-row sm:justify-between sm:items-center">

                {/* title */}
                <div className="space-y-1">

                    <h2 className="title2 text-primary">Clients</h2>

                    <h4 className="text-xs md:text-sm 2xl:text-xl text-slate-600">Detailed information about the clients</h4>

                </div>

                <button className="btn rounded-md ">

                  <Link to="/add-client" className="flex items-center gap-x-3">

                    <IoMdAdd size={24}/> Add possible clients

                  </Link>

                </button>

            </div>

          </div>

          {/* search */}
          <div className="flex justify-between items-center gap-x-5">

            {/* input */}
            <div className="relative w-full">

              <input 
                type="text" 
                className="w-full px-3 py-2 rounded-md" 
                placeholder='search by email,name,phone'
              />

            </div>

            {/* email */}
            <select name="" id="" className="w-full px-3 py-2 rounded-md hidden md:block">

              <option value="" >Select by email</option>

            </select>

            {/* button */}
            <button className="btn3 w-full rounded-md">
              search
            </button>

          </div>

          {/* client */}
          <div className="tabler">


            <Table>

              <Table.Head>

                <Table.HeadCell></Table.HeadCell>

                <Table.HeadCell></Table.HeadCell>

                <Table.HeadCell>name</Table.HeadCell>

                <Table.HeadCell>email</Table.HeadCell>

                <Table.HeadCell>phone</Table.HeadCell>

                <Table.HeadCell>actions</Table.HeadCell>

              </Table.Head>
                

              {!clientsLoading && !clientsError && (

                <>

                  {clients.length > 0 ? (

                      <>
                      
                        {clients.map((client,index) => (

                            <Table.Body key={index} className="">

                              <Table.Row>

                                <Table.Cell>{index+1}.</Table.Cell>

                                <Table.Cell className="">

                                  <div className="h-10 w-10 bg-red-50 text-primary flexCenter rounded-full text-xl font-bold">
                                      {getInitials(client.name)}
                                  </div>
                                
                                </Table.Cell>

                                <Table.Cell className="">{client.name}</Table.Cell>

                                <Table.Cell className="">{client.email}</Table.Cell>

                                <Table.Cell className="">{client.phone}</Table.Cell>

                                <Table.Cell className="">

                                  <div className="flex items-center gap-x-1">

                                    <span className="cursor-pointer">

                                      <Link to={`/client/${client._id}`}>

                                        <FaEye className="text-blue/70" size={20}/>

                                      </Link>

                                    </span>

                                    <span className="cursor-pointer">

                                      <Link to={`/update-client/${client._id}`}>

                                        <FaEdit className="text-primary/60" size={20}/>

                                      </Link>

                                    </span>

                                    <span 
                                      className="cursor-pointer" 
                                      onClick={() => {
                                          setOpenDelete(true)
                                          setClientToDelete(client._id)
                                      }}
                                    >
                                      <FaTrashAlt className="text-primary/70" size={20}/>
                                    </span>

                                  </div>

                                </Table.Cell>

                              </Table.Row>

                            </Table.Body>

                        ))}

                      </>

                  )
                  :
                  (
                    <Table.Body>
                      
                      <Table.Row>

                          <Table.Cell colSpan={5} className="text-center text-xl">The are no Clients yet</Table.Cell>
                      
                      </Table.Row>

                    </Table.Body>
                  )}
              </>

              )}

              {clientsLoading && !clientsError && (

                  <>

                    {loader.map(((load,index) => (

                      <Table.Body key={index} className="">

                        <Table.Row>

                          <Table.Cell>{index+1}.</Table.Cell>

                          <Table.Cell className="">
                              <div className="rounded-full h-10 w-10 loading"/>
                          </Table.Cell>

                          <Table.Cell className="">
                            <span className="loading h-6 w-24 rounded-md"/>
                          </Table.Cell>

                          <Table.Cell className="">
                              <span className="loading h-6 w-32 rounded-md"/>
                          </Table.Cell>

                          <Table.Cell className="">
                            <span className="loading h-6 w-24 rounded-md"/> 
                          </Table.Cell>

                          <Table.Cell className="">

                            <div className="flex items-center gap-x-1">

                              <span className="loading h-8 w-8 rounded-full"/>

                              <span className="loading h-8 w-8 rounded-full"/>

                              <span className="loading h-8 w-8 rounded-full"/>

                            </div>

                          </Table.Cell>

                        </Table.Row>

                      </Table.Body>

                    )))}

                  </>

              )}


            </Table>

          </div>

      </section>

      {openDelete && (

        <Delete handleDelete={handleDelete} product={"client"} item={client?.name}/>

      )}

    </>

  )
}
