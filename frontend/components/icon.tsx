import { ReactNode } from "react"

export default function IconRender ({icon,text,normal} : {icon : ReactNode, text : string, normal : boolean}) {
    return (
        <div className= {normal ? 'normal-icon' : 'sidebar-icon group'}>
            {icon}
            <span className='sidebar-text group-hover:scale-100'> {text} </span>
        </div> 
    )
}