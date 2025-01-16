

import React from 'react'
import { Link } from 'react-router-dom'
import { IoMdAdd } from "react-icons/io";
import { MdSearch } from 'react-icons/md';


export default function PossibleClients() {
  

  return (

    
    <section className="section space-y-6"> 

        {/* header */}
        <div className="">

          {/* clients */}
          <div className="flex flex-col gap-y-3 sm:flex-row sm:justify-between sm:items-center">

              <div className="space-y-1">

                  <h2 className="title2 text-primary">Possible Clients</h2>

                  <h4 className="text-xs md:text-sm 2xl:text-xl text-slate-600">Detailed information about the potential clients</h4>

              </div>

              <button className="btn rounded-md ">

                <Link to="/possible-clients" className="flex items-center gap-x-3">

                   <IoMdAdd size={24}/> Add possible clients

                </Link>

              </button>

          </div>

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

          {/* button */}
          <button className="btn3 w-full rounded-md">
            search
          </button>

        </div>

        {/* client */}
        <div className="tabler">

          <table className="w-full">

            <thead>

              <th></th>

              <th></th>

              <th>name</th>

              <th>email</th>

              <th>phone</th>

              <th>actions</th>

            </thead>

            <tbody>

              <tr></tr>

              <tr></tr>

              <tr></tr>

              <tr></tr>

              <tr></tr>

              <tr></tr>
            </tbody>

          </table>

        </div>

    </section>

  )
}
