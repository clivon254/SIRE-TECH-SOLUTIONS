

import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../context/store'
import {IoMdAdd} from "react-icons/io"
import {Link} from "react-router-dom"
import { Table, TableBody } from 'flowbite-react'
import { FaEdit, FaTrashAlt } from 'react-icons/fa'
import Delete from '../components/Delete'
import axios from 'axios'
import { toast } from 'sonner'
import Error from '../components/Error'



export default function Projects() {

  const {url,token,projects,projectsLoading ,projectsError,fetchProjects,openDelete,setOpenDelete,setProjects} = useContext(StoreContext)
  
  const [project ,setproject] = useState({})

  const [projectToDelete , setProjectToDelete] = useState("")

  const [fetchProjectLoading , setFetchProjectLoading] = useState(false)

  const [fetchProjectError , setFetchProjectError] = useState(false)

  const [loader , setLoader]  = useState([{},{},{},{},{}])

  // fetchProject
  const fetchProject = async () => {

    try
    {
      setFetchProjectLoading(true)

      setFetchProjectError(false)

      const res = await axios.get(url + `/api/project/get-project/${projectToDelete}`)

      if(res.data.success)
      {
        setFetchProjectLoading(false)

        setproject(res.data.project)
      }

    }
    catch(error)
    {
      setFetchProjectLoading(false)

      setFetchProjectError(true)

      console.log(error.message)
    }

  }

  // handleDelete
  const handleDelete = async () => {

    try
    {

      const res = await axios.delete(url + `/api/project/delete-project/${projectToDelete}`,{headers:{token}})

      if(res.data.success)
      {

        setProjects((prev) => 
            prev.filter((project) => project._id !== projectToDelete)
        )

        toast.error(`${project.title} is delete`)

        setOpenDelete(false)

        fetchProjects()
      } 

    }
    catch(error)
    {
      console.log(error.message)
    }

  }

  useEffect(() => {

    fetchProject()

  },[projectToDelete])


  return (

    <>

        <section className="section space-y-6">

          {/* heaader */}
          <div className="flex flex-col gap-y-3 sm:flex-row sm:justify-between sm:items-center">

            {/* title */}
            <div className="">

              <h2 className="title2 text-primary">Projects</h2>

              <h4 className="text-xs md:text-sm 2xl:text-xl text-slate-600">Project that are in our custody</h4>

            </div>

            {/* add */}
            <button className="btn rounded-md">

              <Link to="/add-project" className="flex items-center gap-x-3">

                  <IoMdAdd size={24}/> Project

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


              <input 
                type="date" 
                className="w-full px-3 py-2 rounded-md hidden md:block" 
                placeholder="start date"
              />

              <input 
                type="date" 
                className="w-full px-3 py-2 rounded-md hidden md:block" 
                placeholder="due date "
              />

              {/* button */}
              <button className="btn3 w-full rounded-md">
                search
              </button>

          </div>
          
          {/* projects */}
          <div className="tabler">

            <Table>

              <Table.Head>

                <Table.HeadCell></Table.HeadCell>

                <Table.HeadCell>Title</Table.HeadCell>

                <Table.HeadCell>status</Table.HeadCell>

                <Table.HeadCell>start </Table.HeadCell>

                <Table.HeadCell>Due</Table.HeadCell>

                <Table.HeadCell>Actions</Table.HeadCell>

              </Table.Head>

              {!projectsLoading && !projectsError && (

                <>

                  {projects.length < 1 ? 
                   (
                    <Table.Body>

                      <Table.Row>

                        <Table.Cell colSpan={6} className="text-center text-xl">
                          There are no projects yet
                        </Table.Cell>
                        
                      </Table.Row>

                    </Table.Body>
                   ):
                   (
                    <>
                      {projects.map((project,index) => (

                        <Table.Body>

                          <Table.Row>

                             <Table.Cell>
                                {index + 1}
                             </Table.Cell>

                              <Table.Cell>{project.title}</Table.Cell>

                              <Table.Cell className="">{project.status}</Table.Cell>

                              <Table.Cell>
                                {project.startDate.toLocaleString()}
                              </Table.Cell>
                              
                              <Table.Cell>
                                {project.dueDate.toLocaleString()}
                              </Table.Cell>

                              <Table.Cell>

                                <div className="flex gap-x-2 items-center">

                                  <span className="text-blue ">

                                    <Link to={`/update-project/${project._id}`}>

                                      <FaEdit size={24}/>

                                    </Link>

                                  </span>

                                  <span className="cursor-pointer text-primary">

                                    <FaTrashAlt 
                                        size={24}
                                        onClick={() => {
                                          setProjectToDelete(project._id)
                                          setOpenDelete(true)
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
                  }

                </>

              )}

              {projectsLoading && !projectsError && (

                <>
                    {loader.map((loader,index) => (

                        <Table.Body>

                          <Table.Row>

                             <Table.Cell>
                               <span className="loading h-5 w-4 rounded-md"/>
                             </Table.Cell>

                              <Table.Cell>
                                <span className="loading h-5 w-20 rounded-md"/>
                              </Table.Cell>

                              <Table.Cell className="">
                                <span className="loading h-5 w-6 rounded-md"/>
                              </Table.Cell>

                              <Table.Cell>
                                <span className="loading h-5 w-8 rounded-full"/>
                              </Table.Cell>
                              
                              <Table.Cell>
                               <span className="loading h-5 w-8 rounded-full"/>
                              </Table.Cell>

                              <Table.Cell>

                                <div className="flex gap-x-2 items-center">

                                  <span className="loading h-5 w-5 rounded-full"/>

                                  <span className="loading h-5 w-4 rounded-full"/>

                                </div>

                              </Table.Cell>

                          </Table.Row>

                        </Table.Body>

                    ))}
                </>

              )}

              {projectsError && (

                <TableBody>

                  <Table.Row>

                    <Table.Cell>

                      <Error retry={fetchProjects}/>

                    </Table.Cell>

                  </Table.Row>

                </TableBody>
              )}

            </Table>

          </div>

        </section>
        
        {openDelete && (
          
          <Delete handleDelete={handleDelete} product={"project"} item={project?.title}/>

        )}

    </>

  )
  
}
