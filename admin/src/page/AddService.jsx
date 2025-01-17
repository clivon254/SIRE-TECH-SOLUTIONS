

import React, { useContext, useState } from 'react'
import { StoreContext } from '../context/store'
import { useNavigate } from 'react-router-dom'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { toast } from 'sonner'
import { Alert } from 'flowbite-react'
import axios from "axios"

export default function AddService() {

    const {url,token,fetchServices} = useContext(StoreContext)

    const [formData,setFormData] = useState({})

    const [loading , setLoading] = useState(false)

    const [error , setError] = useState(false)

    const [file ,setFile] = useState(null)

    const [fileUploading ,setFileUploading] = useState(false)

    const [fileUploadProgress ,setfileUploadProgress] = useState(null)

    const [fileUploadError ,setFileUploadError] = useState(null)

    const navigate = useNavigate()

    console.log(formData)


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


        setfileUploadProgress(null)

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

            const res = await axios.post(url + "/api/service/add-service",formData,{headers:{token}})

            if(res.data.success)
            {
                setLoading(false)

                toast.success(`${res.data.newService.title} is not added`)

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


  return (
    
    <section className="section space-y-8 max-w-2xl mx-auto">

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

                <select className="input" name="category" onChange={handleChange}>

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
                    ("upload")
                }
            </button>

    
        </form>

    </section>

  )

}
