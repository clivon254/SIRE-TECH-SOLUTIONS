


import React, { useContext, useEffect, useState,Fragment } from 'react'
import { StoreContext } from '../context/store'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from "@headlessui/react"
import{ BsChevronBarExpand,BsCheck } from "react-icons/bs"
import clsx from "clsx"
import { Alert } from 'flowbite-react'
import Loading from '../components/Loading'
import Error from '../components/Error'


export default function UpdateProject() {

    const {url,token,fetchProjects,clients} = useContext(StoreContext)

    const [formData ,setFormData] = useState({})

    const [loading ,setLoading] = useState(false)

    const [error ,setError] = useState(false)

    const [file ,setFile] = useState(null)

    const [fileUploading ,setFileUploading] = useState(false)

    const [fileUploadProgress ,setFileUploadProgress] = useState(null)

    const [fileUploadError ,setFileUploadError] = useState(null)

    const [tools ,setTools] = useState([
        "Node","React","MongoDdb","PHP","Python"
    ])

    const [selected ,setSelected] = useState([])

    const navigate = useNavigate()

    const {projectId} = useParams()

    const [fetchProjectLoading , setFetchProjectLoading] = useState(false)

    const [fetchProjectError , setFetchProjectError] = useState(false)

    // fetchProject
    const fetchProject = async () => {

        try
        {
            setFetchProjectLoading(true)

            setFetchProjectError(false)

            const res = await axios.get(url + `/api/project/get-project/${projectId}`)

            if(res.data.success)
            {
                setFetchProjectLoading(false)

                setFormData(res.data.project)
            }

            }
            catch(error)
            {
                setFetchProjectLoading(false)

                setFetchProjectError(true)

                console.log(error.message)
            }

    }

    // handleSelect
    const handleSelectChange  = (el) => {

        setSelected(el)

        setFormData({...formData , tools : el})

    }

    // handleImageUpload
    const handleImageUpload = () => {

        if(!file)
        {
            setFileUploadError('please upload an image')

            return
        }

        setFileUploadProgress(null)

        setFileUploadError(null)

        setFileUploading(true)

        try
        {
            const storage = getStorage(app)

            const fileName = new Date().getTime() + "-" + file.name 

            const storageRef = ref(storage , fileName)

            const uploadTask = uploadBytesResumable(storageRef, file)

            uploadTask.on(
                'state_changed',
                (snapshot) => {

                    const progress = (snapshot.bytesTransferred/snapshot.totalBytes) * 100

                    setFileUploadProgress(progress.toFixed(0))
                },
                (error) => {

                    setFileUploadProgress(null)

                    setFileUploading(false)
                    
                    setFileUploadError("Image failed to upload")
                
                },
                () => {

                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {

                        setFileUploading(false)

                        setFileUploadProgress(null)

                        setFileUploadError(null)

                        setFormData({...formData , image: downloadURL})
                    })
                }
            )

        }
        catch(error)
        {
            setFileUploadError(error.message)

            setFileUploadProgress(null)

            setFileUploading(false)
        }

    }

    // handleChange
    const handleChange = (e) => {

        setFormData({...formData ,[e.target.name]:e.target.value})

    }

    // handleSubmit
    const handleSubmit = async (e) => {

        e.preventDefault()

        try
        {
            setLoading(true)

            setError(false)

            const res = await axios.post(url + "/api/project/add-project",formData,{headers:{token}})

            if(res.data.success)
            {
                setLoading(false)

                navigate(-1)

                fetchProjects()

                toast.success(`${newProject.title} is Added`)
            }

        }
        catch(error)
        {
            console.log(error.message)

            setError(true)

            setLoading(false)
        }

    }

    useEffect(() => {

        if(formData?.tools?.length < 1)
        {
           tools && setSelected([tools[0]])
        }
        else
        {
            setSelected(formData?.tools)
        }

    },[])

    useEffect(() => {

        fetchProject()

    },[projectId])

  return (

    <>

        {!fetchProjectLoading && !fetchProjectError && (

            <section className="section space-y-8 max-w-2xl mx-auto ">

                <h2 className="title2 text-center">Update Project</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-y-5">

                    {/* title */}
                    <div className="flex flex-col gap-y-1">

                        <label className="label">Title</label>

                        <input 
                            type="text" 
                            className="input" 
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                        />

                    </div>

                    {/* description */}
                    <div className="flex flex-col gap-y-1">

                        <label className="label">Description</label>

                        <textarea 
                            type="text" 
                            className="input" 
                            placeholder='type here . . . . '
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />

                    </div>
                    
                    {/* url */}
                    <div className="flex flex-col gap-y-1">

                        <label className="label">Url</label>

                        <input
                            type="text" 
                            className="input" 
                            placeholder='www.domain '
                            name="url"
                            value={formData.url}
                            onChange={handleChange}
                        />

                    </div>

                    {/* Dates*/}
                    <div className="fw-full flex flex-col gap-y-3 md:flex-between gap-x-2">

                        <div className="flex flex-col gap-y-1">

                            <label className="label">Start Date</label>

                            <input 
                                type="date" 
                                className="input" 
                                placeholder='www.domain '
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                            />

                        </div>

                        <div className="flex flex-col gap-y-1">

                            <label className="label">Due Date</label>

                            <input
                                type="date" 
                                className="input" 
                                placeholder='www.domain '
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                            />

                        </div>

                    </div>

                    {/* client */}
                    <div className="">

                        <select 
                            className="input w-full" 
                            name="client "
                            onChange={handleChange}
                        >

                            <option value="">Select Client</option>

                            {clients.map((client,index) => (

                                <option 
                                    key={index} 
                                    value={client._id}
                                >
                                    {client.name}
                                </option>

                            ))}
                        </select>

                    </div>

                    {/* tools */}
                    <div className="">

                        <label className="">Tools</label>

                        <Listbox
                            value={selected}
                            onChange={(el) => handleSelectChange(el)}
                            multiple
                        >

                            <div className="relative mt-1">

                                <ListboxButton className="relative w-full cursor-default rounded bg-transparent pl-3 pr-3 text-left px-3 py-2.5 2xl:py-3 border border-slate-500 sm:text-sm">

                                    <span className="block truncate ">
                                        {selected?.map((tool) => tool).join(",")}
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
                                        {tools?.map((tool,index) => (

                                            <ListboxOption
                                                key={index}
                                                className={({active}) => 
                                                    `relative cursor-default select-none py-2 pl-10 pr-4
                                                ${active ? "bg-red-100 text-primary" : "text-gray-900"}`
                                                }
                                                value={tool}
                                            >
                                                {({selected}) => (

                                                    <>

                                                        <div className={clsx(
                                                            "flex items-center gap-2 truncate",
                                                            selected ? "font-medium": "font-normal"
                                                        )}>
                                                            <span className="">{tool}</span>
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

                    {/* image */}
                    <div className="flex flex-col gap-y-2">
                        
                        <input 
                            type="file"
                            className="input" 
                            onChange={(e) => setFile(e.target.files[0])}
                        />

                        {formData?.image && (

                            <div className="h-[300px] w-full">

                                <img 
                                    src={formData?.image} 
                                    alt="" 
                                    className="" 
                                />

                            </div>

                        )}

                        {fileUploadError && (

                            <Alert color="failure">{fileUploadError}</Alert>

                        )}

                        <button 
                            className="btn2 rounded-full"
                            onClick={() => handleImageUpload()}
                            type="button"
                        >
                            {fileUploading ?
                                (
                                    <div className="flexCenter gap-x-4">

                                        <span className="load"/> {fileUploadProgress} % uploaded
                                    </div>
                                ) 
                                : 
                                ("upload")
                            }

                        </button>

                    </div>

                    {/* button */}
                    <button 
                        className="btn"
                        type="submit"
                        disabled={loading || fileUploading}
                    >
                        {loading ? 
                            (
                                <div className="flexCenter">

                                    <span className="load"/> Loading . . . 

                                </div>
                            ) 
                            : 
                            ("Add project")
                        }
                    </button>

                </form>


            </section>

        )}

        {fetchProjectLoading && !fetchProjectError && (

            <Loading/>

        )}


        {fetchProjectError && (

            <Error retry={fetchProject}/>

        )}



    </>

  )

}
