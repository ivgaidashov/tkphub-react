import React, {useEffect, useState} from 'react'

interface iProps {
    setModules: (value: boolean) => void
    children:  JSX.Element[],
    height: string,
    width: string,
    paddingy: string
  }

const Modal = ({ setModules,  children, height, width, paddingy} : iProps) => {
    

    return (
        <>
            <div className={`bg-bg-transparent-black h-full w-full z-0 fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 `} onClick={() => setModules(false)} />
            <div className={`fixed h-full top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 overflow-y-auto no-scrollbar ${paddingy} `}>
                <div className={`${width} ${height}  bg-color-white text-color-dark z-10 rounded-3xl p-5`}>
                    {children}
                </div>
            </div>
        </>
  )
}

export default Modal