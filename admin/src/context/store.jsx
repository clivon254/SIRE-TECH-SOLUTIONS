
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

    const [projects , setProjects] = useState([])

    const [projectsLoading , setProjectsLoading] = useState(false)

    const [projectsError , setProjectsError] = useState(false)


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

    // fetchProjects
    const fetchProjects = async () => {

        try
        {
            setProjectsLoading(true)

            setProjectsError(false)

            const res = await axios.get(url + "/api/project/get-projects")

            if(res.data.success)
            {
                setProjectsLoading(false)

                setProjects(res.data.projects)
            }

        }
        catch(error)
        {
            projectsError(true)

            projectsLoading(false)

            console.log(error.message)
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

        fetchProjects()

    },[])


    useEffect(() => {

        fetchClients()

    },[clientQuery])

    console.log(projects)


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
        fetchServices,
        projects,setProjects,
        projectsLoading, setProjectsLoading,
        projectsError, setProjectsError,
        fetchProjects
    }

    return(

        <StoreContext.Provider value={contextValue}>

            {props.children}

        </StoreContext.Provider>
    )
}