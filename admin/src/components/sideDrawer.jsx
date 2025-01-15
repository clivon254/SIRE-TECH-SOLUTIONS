

import React, { useContext } from 'react'
import { StoreContext } from '../context/store'
import {MdClose} from "react-icons/md"
import SideBar from './SideBar'

export default function SideDrawer() {

 const {openSidebar,setOpenSidebar} = useContext(StoreContext)

  return (

    <div className={`w-full h-full fixed top-0 bg-black/50 backdrop-blur-sm duration-200 ease-in lg:hidden overflow-y-hidden ${openSidebar ? "left-0" : "left-[-100%]" }`}>

        <div className="absolute left-0 w-[70%] h-full bg-white">

            <div className="flex justify-end p-2">

                <span className="cursor-pointer">

                    <MdClose size={32} onClick={() => setOpenSidebar(false)}/>

                </span>

            </div>

            <SideBar/>

        </div>

    </div>

  )

}
