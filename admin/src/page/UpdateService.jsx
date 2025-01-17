

import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../context/store'
import { useNavigate, useParams } from 'react-router-dom'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { toast } from 'sonner'
import { Alert } from 'flowbite-react'
import axios from "axios"
import Loading from '../components/Loading'
import Error from '../components/Error'

export default function UpdateService() {

    const {url,token,fetchServices} = useContext(StoreContext)

    const [formData,setFormData] = useState({})

    const [loading , setLoading] = useState(false)

    const [error , setError] = useState(false)

    const [file ,setFile] = useState(null)

    const [fileUploading ,setFileUploading] = useState(false)

    const [fileUploadProgress ,setfileUploadProgress] = useState(null)

    const [fileUploadError ,setFileUploadError] = useState(null)

    const navigate = useNavigate()

    const {serviceId} = useParams()

    
    const [fetchServiceLoading , setFetchServiceLoading] = useState(false)

    const [fetchServiceError , setFetchServiceError] = useState(false)

    // fetchService
  const fetchService = async () => {

    try
    {
      setFetchServiceLoading(true)

      setFetchServiceError(false)

      const res = await axios.get(url + `/api/service/get-service/${serviceId}`)

      if(res.data.success)
      {
        setFetchServiceLoading(false)

        setFormData(res.data.service)
      }

    }
    catch(error)
    {
      setFetchServiceLoading(false)

      setFetchServiceError(true)

      console.log(error.message)
    }

  }

    // handleChange
    const handleChange = (e) => {

        setFormData({...formData ,[e.target.name]:e.target.value})

    }

    // handleImageUpload
    const handleImageUpload = async  () => {

        if(!file)
        {
            setFileUploadError('Please select an image')

            return
        }


        setFileUploadError(null)

        try
        {


            const storage = getStorage(app)

            const fileName = new Date().getTime() + "-" + file.name 

            const storageRef = ref(storage , fileName)

            const uploadTask = uploadBytesResumable(storageRef, file)

            uploadTask.on(
                'state_changed',
                (snapshot) => {

                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100

                    setfileUploadProgress(progress.toFixed(0))
                        
                },
                (error) => {

                    setFileUploadError('Image upload failed')

                    setFileUploading(false)

                    setfileUploadProgress(null)
                    
                },
                () => {

                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {

                        setfileUploadProgress(null)

                        setFileUploading(false)

                        setFormData({...formData, image:downloadURL})

                    })
                }

            )

       
        }
        catch(error)
        {
            console.log(error.message)

            setFileUploading(false)

            setfileUploadProgress(null)

            setFileUploadError('Image Upload Failed')

        }

    }

    // handleSubmit
    const handleSubmit = async (e) => {

        e.preventDefault()

        try
        {
            setLoading(true)

            setError(false)

            const res = await axios.put(url + `/api/service/update-service/${serviceId}`,formData,{headers:{token}})

            if(res.data.success)
            {
                setLoading(false)

                toast.success(`${res.data.updatedService.title} is updated`)

                navigate('/services')

                fetchServices()
            }

        }
        catch(error)
        {
            setLoading(false)

            setError(true)

            console.log(error.message)
        }

    }

    useEffect(() => {

        fetchService()

    },[serviceId])


  return (
    
    <>

        {!fetchServiceLoading && ! fetchServiceError && (

        
            <section className="section space-y-6">

                <h2 className="title2 text-center">Add Service</h2>

                <form onSubmit={handleSubmit} className=" flex flex-col gap-y-5">
                    
                    {/* title */}
                    <div className="flex flex-col gap-y-2">

                        <label htmlFor="" className="label">Title</label>

                        <input 
                            type="text" 
                            className="input" 
                            name="title"
                            placeholder='Title'
                            onChange={handleChange}
                            value={formData.title}
                        />
                        
                    </div>

                    {/* category */}
                    <div className="flex flex-col gap-y-2">

                        <label htmlFor="" className="label">Category</label>

                        <select className="input" name="category" onChange={handleChange} value={formData.category}>

                            <option value="" >Select cateory</option>

                            <option value="website" >website</option>

                            <option value="app" >app</option>

                        </select>
                        
                    </div>

                    {/* description */}
                    <div className="flex flex-col gap-y-2">

                        <label htmlFor="" className="label">Description</label>

                        <textarea 
                            name="description" 
                            placeholder="type here ......"
                            className="input"
                            value={formData?.description}
                            onChange={handleChange}
                        />

                    </div>

                    {/* image */}
                    <div className="flex flex-col gap-y-1">

                        <input 
                            type="file" 
                            className="input border" 
                            onChange={(e) => setFile(e.target.files[0])}
                        />

                        {formData?.image && (

                            <div className="h-[400px] w-full">

                                <img 
                                    src={formData?.image} 
                                    alt="" 
                                    className="h-full w-full"
                                />

                            </div>
                        )}

                        <button 
                            type="button"
                            className="btn2 rounded-full"
                            onClick={handleImageUpload}
                            disabled={fileUploading}
                        >
                            {fileUploading ? 
                            (
                                <div className="flexCenter gap-x-3">

                                    <span className="load"/> {fileUploadProgress} % uploading 

                                </div>
                            ) 
                            : 
                            ("upload")}
                        </button>

                        {fileUploadError && (

                            <Alert color="failure">{fileUploadError}</Alert>
                        )}

                    </div>

                    {/* button */}
                    <button 
                        className="btn"
                        type="submit"
                        disabled={loading || fileUploading}
                    >
                        {loading ? 
                            (
                                <div className="flecCenter gap-x-4">

                                    <span className="load"/> Loading . . . .

                                </div>
                            ) 
                            : 
                            ("update service")
                        }
                    </button>

            
                </form>

            </section>

        )}

        {!fetchServiceError && fetchServiceLoading && (

            <Loading />

        )}

        {fetchServiceError && (

            <Error retry={fetchService}/>

        )}
    </>

  )

}
