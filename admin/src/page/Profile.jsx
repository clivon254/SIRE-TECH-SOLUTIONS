

import React, { useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { StoreContext } from '../context/store'
import { useNavigate } from 'react-router-dom'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from '../firebase'
import { signOutSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/user/userSlice'
import axios from 'axios'
import { toast } from 'sonner'
import { Alert } from 'flowbite-react'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


export default function Profile() {

  const {currentUser, loading ,error} = useSelector(state => state.user)

  const {url ,token} = useContext(StoreContext)

  const [formData , setFormData] = useState({})

  const [imageFile , setImageFile] = useState(null)

  const [imageFileUrl , setImageFileUrl] = useState(null)

  const [imageFileUploading , setImageFileUploading] = useState(false)

  const [imageFileUploadProgress , setImageFileUploadProgress] = useState(null)

  const [imageFileError , setImageFileError] = useState(null)
  
  const [updateUserError , setUpdateUserError] = useState(null)
  
  const filePickerRef = useRef()

  const dispatch = useDispatch()

  const navigate = useNavigate()

  console.log(loading)

  console.log(imageFileUploading)


  //handleImageChange
  const handleImageChange = (e) => {

    const file = e.target.files[0] 

    if(file)
    {
        setImageFile(file)

        setImageFileUrl(URL.createObjectURL(file))
    }
  }

  useEffect(() => {

    if(imageFile)
    {
        uploadImage()
    }

  },[imageFile])

  // uploadImage
  const uploadImage = () => {

    setImageFileUploading(true)

    setImageFileError(null)

    const storage = getStorage(app)

    const fileName = new Date().getTime() + imageFile.name 

    const storageRef = ref(storage , fileName)

    const uploadTask = uploadBytesResumable(storageRef , imageFile)

    uploadTask.on(
        'state_changed',
        (snapshot) => {

            const progress = (snapshot.bytesTransferred/snapshot.totalBytes) * 100

            setImageFileUploadProgress(progress.toFixed(0))

        },
        (error) => {

            setImageFileError('could not upload (File must be less than 5MB)')

            setImageFileUploading(false)

            setImageFile(null)

            setImageFileUrl(null)

            setImageFileUploadProgress(null)
        },
        () => {

            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {

                setImageFileUrl(downloadURL)

                setFormData({...formData, profilPicture:downloadURL})

                setImageFileUploading(false)
            })
        }
    )
  }

  // handleChange
  const handleChange = (e) => {

    setFormData({...formData ,[e.target.name]:e.target.value})

  }

  //   handleSubmit
  const handleSubmit = async (e) => {

    e.preventDefault()

    if(Object.keys(formData).length === 0)
    {
        setUpdateUserError('No change made')

        return
    }

    if(imageFileUploading)
    {
        setUpdateUserError("Please wait for the image to finish uploading")

        return
    }

    try
    {
        setUpdateUserError(null)

        dispatch(updateUserStart())

        const res  = await axios.put(url + `/api/user/update-user/${currentUser?._id}`,formData,{headers:{token}})

        if(res.data.success)
        {
            dispatch(updateUserSuccess(res.data.rest))

            toast.success("profile update successfully")
        }


    }
    catch(error)
    {
        if(error.response)
        {
            const errorMessage = error.response.data.message 

            dispatch(updateUserFailure(errorMessage))
        }
        else
        {
            dispatch(updateUserFailure(error.message))
        }
    }

  }

  //   handleSignOut
   const handleSignOut = () => {

    localStorage.removeItem("token")

    dispatch(signOutSuccess())

    toast.success("You have log out successfully")

    navigate('/login')

   }


  return (

    <section className="section max-w-2xl mx-auto space-y-10">

        <h1 className="title text-center">Profile</h1>


        <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">

            <input 
              type="file" 
              onChange={handleImageChange} 
              accept="image/*" 
              ref={filePickerRef} 
              hidden 
            />

            <div 
                className="relative h-32 w-32 self-center cursor-pointer shadow overflow-hidden rounded-full"
                onClick={() => filePickerRef.current.click()}
            >

                {imageFileUploadProgress && (

                        <CircularProgressbar
                            value={imageFileUploadProgress || 0}
                            text={`${imageFileUploadProgress}%`}
                            strokeWidth={5}
                            styles={{
                                root:{
                                    width:'100%',
                                    height:"100%",
                                    position:'absolute',
                                    top:0,
                                    left:0
                                },
                                path:{
                                    stroke:`rgba(62 ,152 , 199 ,${imageFileUploadProgress})`
                                }
                            }}
                        />
                )}

                <img 
                  src={imageFileUrl || currentUser?.profilePicture}
                  alt="user" 
                  className={`rounded-full w-full h-full object-cover border-8 border-primary/40
                    ${imageFileUploadProgress && imageFileUploadProgress < 100 && `opacity-${imageFileUploadProgress}`}`}
                />

            </div>

            {imageFileError && (

                <Alert color="failure">{imageFileError}</Alert>

            )}
            
            <input 
                type="text" 
                className="input"
                placeholder='username'
                name="username" 
                onChange={handleChange}
                defaultValue={currentUser?.username}
            />

            <input 
                type="email" 
                className="input "
                placeholder='email'
                name="email" 
                onChange={handleChange}
                defaultValue={currentUser?.email}
            />

            <input 
                type="password" 
                className="input text-sm"
                placeholder='******'
                name="username" 
                onChange={handleChange}
            />

            <button 
                className="btn"
                type="submit"
                disabled={loading || imageFileUploading}
            >
                {loading ? 
                    <div className="flexCenter gap-x-3">
                        <span className="load"/> Loading . . .
                    </div>
                 :
                 "update"
                }
            </button>

        </form>

        <div className="flex justify-between mt-5  text-primary text-xs">

            <span className="cursor-pointer">Delete Account</span>

            <span onClick={handleSignOut} className="cursor-pointer">
                Sign Out
            </span>

        </div>

        {updateUserError && (

            <Alert color="failure"> {updateUserError}</Alert>

        )}

        {error && (

            <Alert color="failure"> {error}</Alert>
            
        )}


    </section>

  )

}
