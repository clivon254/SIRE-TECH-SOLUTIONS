

import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../context/store'
import { Link } from 'react-router-dom'
import {IoMdAdd} from "react-icons/io"
import { Table } from 'flowbite-react'
import Error from '../components/Error'
import clsx from "clsx"
import { BGS, formatDate, PRIOTITYSTYELS, TASK_TYPE } from '../utlis'
import { MdDelete, MdEdit, MdKeyboardArrowDown, MdKeyboardArrowUp, MdKeyboardDoubleArrowUp } from 'react-icons/md'
import { BiMessageAltDetail } from "react-icons/bi"
import { FaList } from 'react-icons/fa6'
import UserInfo from '../components/UserInfo'
import axios from 'axios'
import { toast } from 'sonner'
import Delete from '../components/Delete'
import { FaEdit, FaTrashAlt } from 'react-icons/fa'



const ICONS = {
  high : <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp/>,
  low:<MdKeyboardArrowDown/>
}


export default function Task() {

  const {url,token,tasks,setTasks,tasksLoading,tasksError,fetchTasks,openDelete,setOpenDelete} = useContext(StoreContext)


  const [taskToDelete ,setTaskToDelete] = useState("")

  const [loader ,setLoader] = useState([{},{},{},{}])

  const [task ,setTask] = useState({})

  const [fetchingTaskLoading , setFetchingTaskLoading] = useState(false)

  const [fetchingTaskError , setFetchingTaskError] = useState(false)


  // fetchTask
  const fetchTask = async () => {

    try
    {
      setFetchingTaskLoading(true)

      setFetchingTaskError(false)

      const res = await axios.get(url + `/api/task/get-task/${taskToDelete}`)

      if(res.data.success)
      {
        setTask(res.data.task)

        setFetchingTaskLoading(false)
      }

    }
    catch(error)
    {
      setFetchingTaskError(false)

      setFetchingTaskLoading(true)

      console.log(error.message)
    }

  }

  // handleDelete
  const handleDelete = async () => {

    try
    {
        const res = await axios.delete(url + `/api/task/delete-task/${taskToDelete}`)

        if(res.data.success)
        {

          setTasks((prev) => 
            prev.filter((task) => task._id !== taskToDelete)
          )

          toast.error(`${task.title} is deleted`)

          fetchTasks()

          setOpenDelete(false)

        }

    }
    catch(error)
    {
      console.log(error.message)
    }

  }

  useEffect(() => {

    fetchTask()

  },[taskToDelete])

  console.log(tasks)

  return (
    
    <>

      <section className="section space-y-6"> 

        {/* heaader */}
        <div className="flex flex-col gap-y-3 sm:flex-row sm:justify-between sm:items-center">

          {/* title */}
          <div className="">

            <h2 className="title2 text-primary">Tasks</h2>

            <h4 className="text-xs md:text-sm 2xl:text-xl text-slate-600">Tasks assigned to our team members</h4>

          </div>

          {/* add */}
          <button className="btn rounded-md">

            <Link to="/add-task" className="flex items-center gap-x-3">

                <IoMdAdd size={24}/> Add Task

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

              <option value="" >Select priority</option>

            </select>

            {/* button */}
            <button className="btn3 w-full rounded-md">
              search
            </button>

        </div>

        <div className="tabler">

          <Table>

            <Table.Head>

              <Table.HeadCell>Task Title</Table.HeadCell>

              <Table.HeadCell>Priority</Table.HeadCell>

              <Table.HeadCell>createdAt</Table.HeadCell>

              <Table.HeadCell>Team</Table.HeadCell>

              <Table.HeadCell></Table.HeadCell>

              <Table.HeadCell>Actions</Table.HeadCell>

            </Table.Head>
          
            {!tasksLoading && !tasksError && (

                <>

                  {tasks.length > 0 ? 
                    (

                      <>

                        {tasks.map((task,index) => (

                          <Table.Body key={index}>

                            <Table.Row>

                              <Table.Cell>

                                <div className="flex items-center gap-2">

                                  <div className={clsx("w-4 h-4 rounded-full",TASK_TYPE[task?.type])}/>

                                  <p className="w-full line-clamp-2 text-base text-black">{task?.title}</p>

                                </div>
                                
                              </Table.Cell>

                              <Table.Cell>

                                <div className="flex gap-1 items-center">

                                  <span className={clsx("text-lg", PRIOTITYSTYELS[task?.priority])}>
                                    {ICONS[task?.priority]}
                                  </span>

                                  <span className="capitalize line-clamp-1">
                                    {task?.priority}
                                  </span>

                                </div>

                              </Table.Cell>

                              <Table.Cell>
                                <span className="text-sm text-gray-600">
                                  {formatDate(new Date(task?.date))}
                                </span>
                              </Table.Cell>

                              <Table.Cell>

                                {task?.team?.map((m ,index) => (

                                  <div 
                                    className={clsx("w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",BGS[index % BGS?.length])}
                                    key={index}
                                  >
                                    {m.username}
                                  </div>

                                ))}

                                
                              </Table.Cell>

                              <Table.Cell>

                                <div className="flex items-center gap-x-3">

                                    {/* activities */}
                                  <div className="flex items-center gap-x-1">

                                    <BiMessageAltDetail size={20}/>

                                    <span className="">{task?.activities?.length}</span>

                                  </div>

                                    {/* subTask */}
                                  <div className="flex items-center gap-x-1">

                                    <FaList size={20}/>

                                    <span className="">0/{task?.subTasks?.length}</span>

                                  </div>

                                </div>

                              </Table.Cell>

                              <Table.Cell>
                                
                                <div className="flex items-center gap-x-2">

                                   <span className="text-blue cursor-pointer"> 

                                    <Link to={`/update-task/${task._id}`}>
                                       <FaEdit size={24}/>
                                    </Link>

                                   </span>

                                   <span className="text-primary cursor-pointer">
                                    <FaTrashAlt
                                      size={24}
                                      onClick={() => {

                                        setOpenDelete(true)

                                        setTaskToDelete(task._id)

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

                        <Table.Row>

                          <Table.Cell colSpan={5} className="text-center text-xl">
                            There are no tasks yet!
                          </Table.Cell>

                        </Table.Row>

                      </Table.Body>
                    )
                  }

                </>
            )}

            {tasksLoading && !tasksError && ( 

              <>
                  {loader.map((loder,index) => (

                    <Table.Body key={index}>

                        <Table.Row>

                          <Table.Cell>
                            <span className="h-6 w-24 rounded-md loading"/>
                          </Table.Cell>

                          <Table.Cell>
                            <span className="h-6 w-12 rounded-md loading"/>
                          </Table.Cell>

                          <Table.Cell>
                            <span className="h-6 w-20 rounded-md loading"/>
                          </Table.Cell>

                          <Table.Cell>
                            <span className="h-6 w-20 rounded-md loading"/>
                          </Table.Cell>

                          <Table.Cell>
                            
                            <div className="flex ">

                              <span className="h-8 w-8 rounded-full loading"/>

                              <span className="h-8 w-8 rounded-full loading"/>

                              <span className="h-8 w-8 rounded-full loading"/>

                            </div>

                          </Table.Cell>

                        </Table.Row>

                    </Table.Body>

                  ))}
              </>

            )}

            {tasksError && (

              <Table.Body>

                <Table.Row>

                  <Table.Cell colSpan={6} className="flexCenter">

                    <Error retry={fetchTasks}/>

                  </Table.Cell>

                </Table.Row>

              </Table.Body>
            )}

          </Table>

        </div>


      </section>

      {openDelete && (

        <Delete handleDelete={handleDelete} product={"task"} item={task.title}/>

      )}

    </>

  )

}
