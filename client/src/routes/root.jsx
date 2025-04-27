//import { useEffect } from "react"
import Footer from "../components/footer"
import { userContext } from "../utils/contexts"
import Navbar from "../components/navbar"
import { Outlet, useLoaderData } from "react-router-dom"
import { url } from '../utils/serverUrl'
import ObserverProvider from "../components/ObserverProvider"
//import { useCookies } from 'react-cookie'
export async function loader() {
    try {
        const token = localStorage.getItem('token') 
        const endpoint = token ? "/auth/jwt/status" : "/auth/login/status"
        const fetchHeader = token ?  {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }: {
                'Content-Type': 'application/json'
               
            }
        const req = await fetch(url + endpoint, {
            method: 'GET',
            credentials: 'include',
            mode: 'cors',
            headers: fetchHeader
        })
        const response = await req.json()
        if(response.error) return null
        return response
    } catch (error) {
        return {error: error.message}
    }
}
export default function Root() {
    const user = useLoaderData()
    
    //alert("user: "+ user)
    return (
        <ObserverProvider>
    <userContext.Provider value={user}>
        <Navbar user={user} />
        <Outlet />
        <Footer/>
    </userContext.Provider>
    </ObserverProvider>)
}