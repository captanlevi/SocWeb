import { useContext, createContext, useEffect, useState } from "react";
import {getJSON} from "@/app/requests/httpJSONRequests"


const AuthContext = createContext({id : -1});
export const useAuthUser = () => useContext(AuthContext);


export const AuthProvider = ({children} : {children : React.ReactNode}) => {

    const api_url = process.env.NEXT_PUBLIC_API_URL
    const [userInfo, setUserInfo] = useState({id : -1})

    useEffect(

        () => {
            const getUser = async () => {
                try{
                const response = await getJSON(api_url + "/auth/is_logged_in",{})
                if (response.ok){
                    const response_data = await response.json()
                    console.log("setting user as", response_data)
                    setUserInfo(response_data)
                }else{
                    console.log("user not logged in")
                    setUserInfo({id:-2})
                }
                }catch(exception){
                    console.log(exception)
                }
            }

            getUser()
        }, []
    )


    return (
        <AuthContext.Provider value={userInfo}>
            {children}
        </AuthContext.Provider>
    )


    
}

