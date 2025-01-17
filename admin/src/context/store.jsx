
import axios from "axios"
import { createContext, useEffect, useState } from "react"




export const StoreContext = createContext(null)




export default function StoreContextProvider(props)
{

    const url = "http://localhost:2000"

    const [token,setToken] = useState(localStorage.getItem("token"))

    const [openSidebar , setOpenSidebar] = useState(false)

    const [openDelete ,setOpenDelete] = useState(false)

    const [clients , setClients] = useState([])

    const [clientsLoading , setClientsLoading] = useState(false)

    const [clientsError , setClientsError] = useState(false)

    const [clientQuery ,setClientQuery] = useState(false)

    const [services ,setServices] = useState([])

    const [servicesLoading ,setServicesLoading] = useState(false)

    const [servicesError ,setServicesError] = useState(false)


    // fetch Client
    const fetchClients = async () => {

        try
        {
            setClientsLoading(true)

            setClientsError(false)

            const res = await axios.get(url + `/api/client/get-clients?query=${clientQuery}`,{headers:{token}})

            if(res.data.success)
            {
                setClientsLoading(false)

                setClients(res.data.clients)
            }

        }
        catch(error)
        {
            setClientsLoading(false)

            setClientsError(true)

            console.log(error.message)
        }

    }

    // fetchServices
    const fetchServices = async () => {

        try
        {
            setServicesLoading(true)

            setServicesError(false)

            const res = await axios.get(url + "/api/service/get-services")

            if(res.data.success)
            {
                setServicesLoading(false)

                setServices(res.data.services)
            }

        }
        catch(error)
        {
            setServicesLoading(false)

            setServicesError(true)
        }

    }


    useEffect (() => {

        if(localStorage.getItem("token"))
        {

            setToken(localStorage.getItem("token"))
        }

    },[token])

    useEffect(() => {

        fetchClients()

        fetchServices()

    },[])


    useEffect(() => {

        fetchClients()

    },[clientQuery])

    console.log(services)


    const contextValue = {
        url,
        token, setToken,
        openSidebar, setOpenSidebar,
        openDelete,setOpenDelete,
        clients,setClients,
        clientsLoading, setClientsLoading,
        clientsError,setClientsError,
        clientQuery,setClientQuery,
        fetchClients,
        services, setServices,
        servicesLoading, setServicesLoading,
        servicesError, setServicesError,
        fetchServices
    }

    return(

        <StoreContext.Provider value={contextValue}>

            {props.children}

        </StoreContext.Provider>
    )
}