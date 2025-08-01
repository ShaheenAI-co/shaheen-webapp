import React from 'react'
import { Search, Bell, User } from 'lucide-react'
import NotificationBtn from './NotificationBtn'
import SrcInput from './SrcInput'
import ProfileBtn from './ProfileBtn'

const Topbar = () => {
  return (
    <div className='flex justify-between items-center gap-4 py-6 px-8 bg-[#0C0C0C] border-b border-[#272729]'>
        <div>
          <h1 className='text-2xl font-bold'>Dashboard</h1>
        </div>
        
        <div className='flex items-center gap-6'>

          <SrcInput />

          <div className='flex items-center gap-4'>

            <NotificationBtn  />
            <ProfileBtn />
          </div>

         
          
        </div>
    </div>
  )
}

export default Topbar