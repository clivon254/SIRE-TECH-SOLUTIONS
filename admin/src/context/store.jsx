
import { createContext, useEffect, useState } from "react"




export const StoreContext = createContext(null)




export default function StoreContextProvider(props)
{

    const url = "http://localhost:2000"

    const [token,setToken] = useState(localStorage.getItem("token"))

    const [openSidebar , setOpenSidebar] = useState(false)


    useEffect (() => {

        if(localStorage.getItem("token"))
        {

            setToken(localStorage.getItem("token"))
        }

    },[token])

    const contextValue = {
        url,
        token, setToken,
        openSidebar, setOpenSidebar,
    }

    return(

        <StoreContext.Provider value={contextValue}>

            {props.children}

        </StoreContext.Provider>
    )
}