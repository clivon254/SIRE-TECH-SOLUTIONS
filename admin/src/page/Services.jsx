

import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {IoMdAdd} from "react-icons/io"
import { StoreContext } from '../context/store'
import { Table } from 'flowbite-react'
import { FaEye } from 'react-icons/fa6'
import { FaEdit, FaTrashAlt } from 'react-icons/fa'
import axios from 'axios'
import { toast } from 'sonner'
import Error from '../components/Error'
import Delete from '../components/Delete'


export default function Services() {


  const {url,token,services,servicesLoading,servicesError,setOpenDelete,fetchServices,setServices,openDelete} = useContext(StoreContext)

  const [serviceToDelete , setServiceToDelete] = useState("")

  const [service ,setService] = useState({})

  const [fetchServiceLoading , setFetchServiceLoading] = useState(false)

  const [fetchServiceError , setFetchServiceError] = useState(false)

  const [loader , setLoader] = useState([{},{},{},{},{}])

  // fetchService
  const fetchService = async () => {

    try
    {
      setFetchServiceLoading(true)

      setFetchServiceError(false)

      const res = await axios.get(url + `/api/service/get-service/${serviceToDelete}`)

      if(res.data.success)
      {
        setFetchServiceLoading(false)

        setService(res.data.service)
      }

    }
    catch(error)
    {
      setFetchServiceLoading(false)

      setFetchServiceError(true)

      console.log(error.message)
    }

  }

  // handleDelete
  const handleDelete = async () => {

    try
    {

      const res = await axios.delete(url +  `/api/service/delete-service/${serviceToDelete}`,{headers:{token}})

      if(res.data.success)
      {
        
        setServices((prev) => 
            prev.filter((service) => service._id !== serviceToDelete)
        )

        toast.error(`${service.title} is delete`)

        setOpenDelete(false)

        fetchServices()
      }

    }
    catch(error)
    {
      console.log(error.message)
    }

  }

  useEffect(() => {

    fetchService()


  },[serviceToDelete])

  return (

    <>

      <section className="section space-y-6">

        {/* heaader */}
        <div className="flex flex-col gap-y-3 sm:flex-row sm:justify-between sm:items-center">

          {/* title */}
          <div className="">

            <h2 className="title2 text-primary">services</h2>

            <h4 className="text-xs md:text-sm 2xl:text-xl text-slate-600">Different services offered to the clients</h4>

          </div>

          {/* add */}
          <button className="btn rounded-md">

            <Link to="/add-service" className="flex items-center gap-x-3">

                <IoMdAdd size={24}/> Add Service

            </Link>

          </button>

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

              <option value="" >Select by category</option>

            </select>

            {/* button */}
            <button className="btn3 w-full rounded-md">
              search
            </button>

        </div>

        {/* services */}
        <div className="tabler">

          <Table>

            <Table.Head>

              <Table.HeadCell></Table.HeadCell>

              <Table.HeadCell>image</Table.HeadCell>

              <Table.HeadCell>title</Table.HeadCell>

              <Table.HeadCell>category</Table.HeadCell>

              <Table.HeadCell>actions</Table.HeadCell>

            </Table.Head>

            {!servicesLoading && !servicesError && (

                <>

                  {services.length > 0  ? (

                    <>
                      {services.map((service,index) => (

                        <Table.Body>

                          <Table.Row>

                            <Table.Cell>{index +1 }.</Table.Cell>

                            <Table.Cell>

                              <div className="h-20 w-20">

                                <img 
                                  src={service?.image} 
                                  alt="" 
                                  className="" 
                                />

                              </div>

                            </Table.Cell>

                            <Table.Cell>
                              {service?.title}
                            </Table.Cell>

                            <Table.Cell>
                              {service?.category}
                            </Table.Cell>

                            <Table.Cell>

                              <div className="flex items-center gap-x-2">

                                <span className="cursor-pointer text-blue">

                                  <Link to={`/update-service/${service._id}`}>

                                    <FaEdit size={24}/>

                                  </Link>

                                </span>

                                <span className="cursor-pointer text-primary">
                                  <FaTrashAlt 
                                    size={24}
                                    onClick={() => {

                                      setOpenDelete(true)

                                      setServiceToDelete(service._id)

                                    }}
                                  />
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

                      <Table.Row >

                        <Table.Cell colSpan={5} className="text-center text-xl font-semibold">
                          There are services yet
                        </Table.Cell>
                        
                      </Table.Row>

                    </Table.Body>
                  )}

                </>

            )}

            {servicesLoading && !servicesError && (

                <>

                  {loader.map(() => (

                      <Table.Body>

                        <Table.Row>

                        <Table.Cell>

                          <span className="block loading w-4 h-6 rounded-md"/>

                        </Table.Cell>

                        <Table.Cell>

                          <div className="h-12 w-12 rounded-md loading"/>

                        </Table.Cell>

                        <Table.Cell>
                            <span className="block loading w-12 h-6 rounded-md"/>
                        </Table.Cell>

                        <Table.Cell>
                            <span className="block loading w-12 h-6 rounded-md"/>
                        </Table.Cell>

                        <Table.Cell>

                          <div className="flex items-center gap-x-2">

                            <span className="block loading w-6 h-6 rounded-full"/>

                            <span className="block loading w-6 h-6 rounded-full"/>

                          </div>

                        </Table.Cell>

                        </Table.Row>

                     </Table.Body>

                  ))} 
                
                </>
            )}

            {servicesError && (

              <Table.Body>

                <Table.Row>

                  <Table.Cell colSpan={5} className="">

                    <Error retry={fetchServices}/>

                  </Table.Cell>

                </Table.Row>

              </Table.Body>

            )}
            
          </Table>

        </div>

      </section>
      
      {openDelete && (

        <Delete handleDelete={handleDelete} product={"service"} item={service.title}/>
        
      )}

    </>

  )
  
}
