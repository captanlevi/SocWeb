"use client"

import { FaHome } from "react-icons/fa";
import { PiSignInFill } from "react-icons/pi";
import { FaDatabase } from "react-icons/fa";
import { TbBeer } from "react-icons/tb";
import Link from 'next/link'

import IconRender from "@/components/icon";
export default function Sidebar(){
    return (
        <div className="fixed bg-purple-800 left-0 w-15 h-screen">
              <Link href= "/">
              <IconRender icon = {<FaHome size={28}/>} text="Home" normal = {false}/>
              </Link>
              <Link href= "/signon">
               <IconRender icon = {<PiSignInFill size={28}/>} text="Signon" normal = {false}/>
              </Link>
              <Link href= "/events">
              <IconRender icon = {<TbBeer size={28}/>} text="Events" normal = {false}/>
              </Link>
              <Link href= "/members">
              <IconRender icon = {<FaDatabase size={28}/>} text="Data" normal = {false}/>
              </Link>
            
             

        </div>
    )
}

