"use client"
import { useState } from "react"
import { FaBeer } from 'react-icons/fa';
import IconRender from "@/components/icon";
import { getJSON, postJSON} from "../requests/httpJSONRequests";
import { AuthProvider, useAuthUser } from "../components/contexts/authContext";
import { useRouter } from 'next/navigation'
import { RiLogoutCircleLine } from "react-icons/ri";
import InputComponent from "../components/inputComponent";
import { checkZid } from "../commons";



export default function Page(){

    return(
        <AuthProvider>
            <Form/>
        </AuthProvider>
    )
       

}


 function Form(){


    const [zid, setZid] = useState('')
    const [password,setPassword] = useState<string>('')
    const api_url = process.env.NEXT_PUBLIC_API_URL
    const user = useAuthUser()
    const router = useRouter()


    const onClickSubmit = async () => {
        
        if(!checkZid(zid)){
            alert("Please fill zid as zYXXXX where Y > 0 and 0<= X <= 9")
            return
        }

        try{

            const sign_on_data = {"zid" : zid, "password" : password}
            const response = await postJSON(api_url + "/auth/login", {}, sign_on_data )
            if (response.ok){
                alert("logon successfully")
                router.push('/')
            }else{
                const error = await response.json()
                alert(error.detail)
            }

        }catch(err){
            console.error("Error during submission:", err);
            alert("Failed to submit. Please try again later.");
        }

    }


    const onClickLogout = async () => {

        const response = await getJSON(api_url + "/auth/logout", {})
        if (response.ok){
            alert("logged out")
            router.push("/")
        }else{
            const error = await response.json()
            alert(error.detail)
        }



    }

    if (user.id >= 0){
        return (
            <div className="w-screen flex justify-center items-center h-screen">
                <div onClick={onClickLogout}>
                    <IconRender icon = {<RiLogoutCircleLine fontSize={28}/>} normal = {false} text="logout"/>
                </div>

            </div>
        )
    }

    return (

        <div className="w-screen flex justify-center items-center h-screen">
        <div className="flex flex-col shadow-2xl rounded-lg bg-pink-900 items-center w-1/3">

            <div className="flex justify-center m-5 text-yellow-600 font-bold text-4xl relative top-0 pb-9"> Execs sign-on </div>
            
          
            <InputComponent placeholder="zid (with z)" onChange={ (e) => {setZid(e.target.value)}} value={zid}/>
            <InputComponent placeholder="Password" onChange={(e) => {setPassword(e.target.value)}} value= {password}/>

            <div className="flex justify-center pt-32">
                <div onClick={onClickSubmit}>
                <IconRender icon = {<FaBeer size={28}/>} text="Submit" normal= {false}/>
                </div>
            </div>
        </div>
        </div>
    )


}



