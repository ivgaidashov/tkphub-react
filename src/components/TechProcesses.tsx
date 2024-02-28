import React from 'react'
import {idTitleList} from "../Interfaces"
import Modal from "../components/Modal";

type TechProcessesProps = {
    processes: idTitleList | null,
    setModules: React.Dispatch<React.SetStateAction<boolean>>,
}

const TechProcesses = ({processes, setModules}: TechProcessesProps) => {
  return (
    <div className='h-full'>
         <Modal setModules={setModules} height="h-fit" width="w-[600px]" paddingy="py-8">
            <div className='flex w-full h-[90%] justify-center items-center px-5 pt-5'>

<table className='border-separate border-spacing-1 '>
    <tbody className='text-md'>
        {processes && processes.map((pr) => (
            <tr className=' align-top' key={pr.id}>
            <td className=' align-top  text-center'>
            <p className='bg-color-warning text-color-info-light font-bold rounded-full px-2 py-1'>{pr.id}</p>
            </td>
            <td className='text-justify font-light text-color-dark hover:font-medium transition-all'>
            {pr.title}
            </td>
            </tr>
        ))}
    </tbody>
</table>

            </div>
            <div className='h-[10%] flex justify-center pb-5'>
            <button className='customButtonNoWdt h-fit shadow-lg' onClick={(e) => {setModules(false)}}>
                Ясно!
            </button>
            </div>
         </Modal>
    </div>
  )
}

export default TechProcesses