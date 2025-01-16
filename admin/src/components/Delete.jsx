
import React, { useContext } from 'react'
import { HiExclamationCircle } from "react-icons/hi"
import { StoreContext } from '../context/store'

export default function Delete({product,item,handleDelete}) {

  const {openDelete,setOpenDelete} = useContext(StoreContext)

  return (

    <div className="w-full h-full flexCenter fixed top-0 left bg-black/50 backdrop-blur-sm">

        <div className="space-y-5 p-4 w-[80%] lg:w-[40%] 2xl:w-[30%] mx-auto shadow-md bg-white transition-all duration-500 ease-in rounded-md">

            <HiExclamationCircle size={50} className="mx-auto"/>

            <h2 className="text-center font-semibold">
                Are you sure you want to delete {product} , {item}
            </h2>

            <div className="flex justify-around items-center ">

                <button 
                    className="btn rounded-md"
                    onClick={() => handleDelete()}
                >
                    Yes , I'm Sure
                </button>

                <button 
                    className="btn2 rounded-md"
                    onClick={() => setOpenDelete(false)}
                >
                    No ,Cancel
                </button>

            </div>

        </div>
        
    </div>

  )

}
