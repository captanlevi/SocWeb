import { ChangeEventHandler } from "react"

export default function InputComponent ({placeholder, onChange, value} : {placeholder : string, onChange : ChangeEventHandler<HTMLInputElement>, value : string }){
    return (
        <div className="rounded-lg">
            <input name = "my input" className="text-xl text-black font-semibold rounded-xl border mb-4 focus:shadow-xxl text-center
             border-gray-200 focus:outline-none focus:ring-pink-500 focus:border-pink-500 bg-yellow-300 placeholder:text-pink-500" 
             placeholder= {placeholder} onChange={onChange} value={value}
             />
        </div>

    )


}