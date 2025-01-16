

import { Avatar, Dropdown } from 'flowbite-react'
import React, { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GrLogout } from "react-icons/gr";
import { Link, useNavigate } from 'react-router-dom';
import { signOutSuccess } from '../redux/user/userSlice';
import { GiHamburgerMenu } from "react-icons/gi";
import SideDrawer from './sideDrawer';
import { StoreContext } from '../context/store';



export default function Header() {

  const {currentUser} = useSelector(state => state.user)

  const {setOpenSidebar} = useContext(StoreContext)
  
  const dispatch = useDispatch()

  const navigate = useNavigate()

  // handleSignOut 
  const handleSignOut  = () => {

    localStorage.removeItem("token")

    dispatch(signOutSuccess())

    navigate('/login')
    
  }

  return (

    <>

        <header className="w-full p-2 py-5 shadow">

            <div className="flex items-center justify-between">
                
                <div className="flex items-center gap-x-3">

                    <GiHamburgerMenu 
                        size={24}
                        onClick={() => setOpenSidebar(true)}
                        className="cursor-pointer lg:hidden"
                    />

                    <h2 className="text-primary font-semibold">Welcome , {currentUser?.username}</h2>

                </div>

                <div className="">

                    <Dropdown 
                        inline
                        arrowIcon={false}
                        label={
                            <Avatar
                                alt="user"
                                img={currentUser?.profilePicture}
                                rounded
                            />
                        }
                    >
                        <Dropdown.Header>

                            <span className="block text-sm">{currentUser?.username}</span>

                            <span className="block text-sm">{currentUser?.email}</span>

                        </Dropdown.Header>

                        <Link to="/profile">
                            
                            <Dropdown.Item>Profile</Dropdown.Item>

                        </Link>

                        <Dropdown.Item 
                            className="flex items-center gap-x-3"
                            onClick={handleSignOut}
                        >
                            Logout <GrLogout size={20}/>
                        </Dropdown.Item>

                    </Dropdown>

                </div>

            </div>

        </header>

        <SideDrawer />

    </>

  )

}
