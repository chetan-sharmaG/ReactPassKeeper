import React from 'react'

const Navbar = () => {
 
  return (
    <nav className='h-[6vh]  text-white items-center flex justify-between px-10'>
      <div className='logo font-bold '>
        <span className=' text-yellow-500 text-xl first-letter:text-black'>Pass</span>
        <span className='text-orange-300 text-xl'>Keeper</span>
      </div>
      <div className='flex gap-10'>
       
        <button className='flex gap-1 mt-1 items-center text-black hover:bg-green-100  bg-green-500 rounded-full w-fit px-2'><img width={35} src='Icons/github.png' alt='github logo' /><span className='font-bold  '>Github</span></button>

      </div>
    </nav>
  )
}

export default Navbar
