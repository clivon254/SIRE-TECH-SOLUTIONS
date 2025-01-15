

import React, { useState } from 'react'
import LOGO from "../assets/SIRELOGO.png"
import { MdOutlineDashboard } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { AiOutlineUserAdd } from "react-icons/ai";
import { FaRegFile } from "react-icons/fa6";
import { VscSaveAll } from "react-icons/vsc";
import { VscServerEnvironment } from "react-icons/vsc";
import { MdOutlineTask } from "react-icons/md";
import { NavLink } from 'react-router-dom';


export default function SideBar() {

    const [NavLinks ,setNavLinks] = useState([
        {
            label:"Dashboard",
            icon:<MdOutlineDashboard />,
            path:"/"
        },
        {
            label:"Clients",
            icon:<FiUsers />,
            path:"/clients"
        },
        {
            label:"Possible Clients",
            icon:<AiOutlineUserAdd />,
            path:"/possible-clients"
        },
        {
            label:"Projects",
            icon:<FaRegFile />,
            path:"/projects"
        },
        {
            label:"Services",
            icon:<VscServerEnvironment />,
            path:"/services"
        },
        {
            label:"Invoices",
            icon:<VscSaveAll />,
            path:"/invoices"
        },
        {
            label:"Task",
            icon:<MdOutlineTask />,
            path:"/tasks"
        },
        
    ])

  return (

    <aside className="space-y-8">

        <div className="flexCenter mt-5">

            <img 
                src={LOGO} 
                alt="" 
                className="h-12 sm:16 w-32 sm:w-36 " 
            />

        </div>

        <div className="px-4">
            
            <nav className="">

                {NavLinks.map((nav,index) => (

                    <NavLink
                        key={index}
                        to={`${nav.path}`}
                        className={({isActive}) => isActive ? "active-nav-link":"active-nav"}
                    >

                        <span className="">{nav.icon}</span> {nav.label}

                    </NavLink>

                ))}

            </nav>

        </div>

    </aside>

  )

}
