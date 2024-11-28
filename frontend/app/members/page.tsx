"use client"
import { ChangeEvent, useEffect, useState } from "react"
import { getJSON, postJSON } from "../requests/httpJSONRequests"
import { MdAdd } from "react-icons/md";
import IconRender from "@/components/icon";
import { MdDelete } from "react-icons/md";
import { AuthProvider, useAuthUser } from "../components/contexts/authContext";
import { useRouter } from 'next/navigation'
import InputComponent from "../components/inputComponent";
import { FaBeer } from "react-icons/fa";
import { checkZid } from "../commons";
import { FaSearch } from "react-icons/fa";
import { text } from "stream/consumers";

export default function Page(){
    return(
        <AuthProvider>
            <Members/>
        </AuthProvider>
    )

}


function Members(){

    const [data,setData] = useState<Array<{id : number,name : string, zid : string}>>([])
    const [displayData, setDisplayData] = useState<Array<{id : number,name : string, zid : string}>>([])
    const [searchVal, setSearchVal] = useState<string>("")

    const [adding,setAdding] = useState<boolean>(false)
    const api_url = process.env.NEXT_PUBLIC_API_URL
    const user = useAuthUser()
    const router = useRouter()


    useEffect( () => {
        setDisplayData(data.filter((value) => {
            const lowerCaseSearch = searchVal.toLowerCase()
            return (searchVal === "" || value.name.toLowerCase().includes(lowerCaseSearch)  || value.zid.toLowerCase().includes(lowerCaseSearch))
        }))
    }, [searchVal,data]
    ) 

        

    
    const onDelete = async (delete_id : number) => {
        try{
        const response = (await getJSON(api_url + "/delete/" + String(delete_id), {}))
        if (response.ok)
            alert("deleted")
        else
            alert("Some thing went wrong try again")

        setData(data => data.filter(({id}) => id != delete_id))
        setDisplayData(displayData => displayData.filter(({id}) => id != delete_id))
        } catch(exception){
            alert("cannot do operation, please try later")
            console.log(exception)
        }

    }

    useEffect(() => {
        const getData = async () => {
            try{
            const response = (await getJSON(api_url + "/all/?limit=10", {}))
            const response_data = await response.json()
            if (response.ok){
                setData(response_data)
                setDisplayData(response_data)
            }
            }catch(exception){
                console.log(exception)
            }

        }
        getData()
    }, [])


    const setDataWrapper = (new_data : Array<{id : number,name : string, zid : string}>) => {
        setData(new_data)
    }
    useEffect(() => {
        console.log(user)
        if (user.id == -1)
            return
        if (user.id == -2) {
            router.push("/signon");
        }
    }, [user,router,api_url]);
    
    if (adding){
        return(
            <AddMember closeAdd={setAdding} oldData={data} setData={setDataWrapper}/>
        )
    }


    return(
        <div className="flex justify-center w-screen">
            <div className="mt-10 flex flex-col items-center">
                <div className="flex justify-center items-center mb-6">
                    <div className=" h-12 flex justify-center items-center">
                    <IconRender icon = {<FaSearch fontSize={20}/> } text="" normal={true}/>
                    </div>
                   <div className="h-12 flex justify-center items-center pt-4">
                     <InputComponent placeholder="" onChange={(e) => setSearchVal(e.target.value)} value={searchVal}/>
                   </div>
                
                </div>
                
            {displayData.map((val,index) => <RenderMember name= {val.name} zid= {val.zid} key={index} id={val.id} onDelete={onDelete}/> )} 

            <div onClick={() => setAdding(true)}>
                <IconRender icon = {<MdAdd fontSize={28}/>} text= "add" normal = {false}/>
            </div>

            </div>
           
        </div>
    )
}



function RenderMember({id, name, zid, onDelete }: {id : number, name: string; zid: string, onDelete : (delete_id : number) => void }) {

        return (
            <div className="flex items-center p-4 rounded-lg shadow-2xl bg-yellow-400 mb-4 hover:shadow-none">
              
                <div className="text-lg font-semibold text-gray-800 w-44 justify-start">{name}</div>
    
                <div className="text-lg text-black w-24 text-center">{zid}</div>
    
                <div className="flex justify-end pl-4" onClick={() => {onDelete(id)}}>
                    <IconRender icon={<MdDelete fontSize={18} />} text={"delete"} normal={true} />
                </div>
            </div>
        );
}


function AddMember({closeAdd, oldData ,setData} : {closeAdd : (value : boolean) => void, oldData : Array<{ id: number; name: string; zid: string; }>,
 setData : (value : Array<{ id: number; name: string; zid: string; }>) => void}){
    const api_url = process.env.NEXT_PUBLIC_API_URL
    const [name,setName] = useState<string>('')
    const [zid,setZid] = useState<string>('')
    const onClickSubmit = async () => {
        if(!checkZid(zid)){
            alert("Please fill zid as zYXXXX where Y > 0 and 0<= X <= 9")
            return
        }

        try{
           
            const sign_on_data = {"zid" : zid, "name" : name, "password" : "123456"}
            const response = await postJSON(api_url + "/add_member", {}, sign_on_data )
            const response_data = await response.json()
            if (response.ok){
                setData([...oldData,{id : response_data.id, zid : response_data.zid, name : response_data.name}])
               
            }else{
                const error = await response.json()
                alert(error.detail)
            }

        }catch(err){
            console.error("Error during submission:", err);
            alert("Failed to submit. Please try again later.");
        }

        finally{
            closeAdd(false)
        }
       
    }

    return (
        <div className="flex flex-col justify-center items-center pt-44">
            <div className="shadow-2xl rounded-lg p-11 pb-2">
            <InputComponent placeholder="Name" onChange={(e) => {setName(e.target.value)}} value= {name}/>
            <InputComponent placeholder="zid (with z)" onChange={ (e) => {setZid(e.target.value)}} value={zid}/>
            <div className="flex justify-center pt-10">
                <div onClick={onClickSubmit}>
                <IconRender icon = {<FaBeer size={28}/>} text="Submit" normal= {false}/>
                </div>
            </div>
            </div>
        </div>

    )

}
    