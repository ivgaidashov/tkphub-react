import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "../atoms/ModalAtoms";
import httpClient from "../utils/ApiRequests";
import {ClientEgrulList, ClientDifferenceEgrulList, idTitleList} from '../Interfaces'
import Pagination from '../components/Pagination'
import uuid from 'react-uuid';
import EgrulWindows from '../components/EgrulWindows'
import EgrulAddress from "../components/EgrulAddress";
import Spinner from "../components/Spinner";
import EgrulQuestions from "../components/EgrulQuestions";


const Egrul = () => {

    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)
    const [loadingDifferences, setLoadingDifferences] = useState(false)

    const [module, setModule] = useState<boolean>(false);
    const [moduleAddresses, setModuleAddresses] = useState<boolean>(false);
    const [moduleQuestions, setModuleQuestions] = useState<boolean>(false);

    const [user, setUser] = useRecoilState(userState);
    const [clients, setClients] = useState<ClientEgrulList>();
    const [clientDifferences, setClientDifferences] = useState<ClientDifferenceEgrulList>()
    const [clientAddresses, setClientAddresses] = useState<idTitleList>()
    const [clientCorrectAddress, setCorrectAddress] = useState<string | undefined>()
    const [addressTypes, setAddressTypes] = useState<idTitleList>()

    const [clickedClient, setClickedClient] = useState<number | null>(null)

    const [pages, setPages] = useState(1)
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [myClientsOnly, setMyClientsOnly] = useState(false)
    const recordsPerPage = 20;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const numbers = [...Array(pages + 1).keys()].slice(1);


    const prevPage = () => {
        if (currentPage !== 1) {
          setCurrentPage(currentPage - 1);
        }
      };
    
      const changeCurPage = (n: number) => {
        setCurrentPage(n);
      };
    
      const nextPage = () => {
        if (currentPage !== pages) {
          setCurrentPage(currentPage + 1);
        }
      };

      const get_client_data = async (firstrows:number, perpage:number, likeQuery:string) => {
        setLoading(true)
        try {
            const resp = await httpClient.post(
              `//${process.env.REACT_APP_BACKEND}:${process.env.REACT_APP_BACKENDPORT}/get_clients_w_diff`,
              {data: [firstrows, perpage], searchQuery: likeQuery, myClients: myClientsOnly}
            );
            setClients(resp.data.clients);
            console.log(firstrows)
            console.log(perpage)
            console.log(resp.data.clients)
            console.log(resp.data.count)
            setPages(Math.ceil(resp.data.count / recordsPerPage))
            setLoading(false)
          } catch (error) {
            console.log(error);
            console.log("Не удалось получить список клиентов :с");
          }
      }

      
    useEffect(() => {
        (async () => {
          try {
            const resp = await httpClient.post(
              `//${process.env.REACT_APP_BACKEND}:${process.env.REACT_APP_BACKENDPORT}/@me`,
              {
                page: 5,
              }
            );
            setUser(resp.data?.login_id);
            get_client_data((currentPage-1)*recordsPerPage, recordsPerPage, '')
            
            } catch (error) {
                console.log("Not authenticated");
                console.log(error)
                navigate("/");
              }
          
            })();
          }, []);

          useEffect(() => {
            (async () => {
              try {
                const resp = await httpClient.post(
                  `//${process.env.REACT_APP_BACKEND}:${process.env.REACT_APP_BACKENDPORT}/get_address_types`,
                );
                console.log(resp.data)
                setAddressTypes(resp.data);
                
                } catch (error) {
                    console.log("Не удалось получить типы адресов :с");
                    console.log(error)
                  }
              
                })();
              }, []);

    useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
    (async () => {
        setCurrentPage(1)
        get_client_data(0, recordsPerPage, searchTerm)
        })();
    }, 300)

    return () => clearTimeout(delayDebounceFn)
    }, [searchTerm])

    useEffect(() => {
        (async () => {
            console.log('currentPage')
            window.scrollTo({
              top: 0,
             
            });
            get_client_data((currentPage-1)*recordsPerPage, recordsPerPage, searchTerm)
        })();
    }, [currentPage])

    useEffect(() => {
      (async () => {
          console.log('clicked the only filter')
          get_client_data((currentPage-1)*recordsPerPage, recordsPerPage, searchTerm)
      })();
  }, [myClientsOnly])

    const handleMainInfoClick = async (icusnum: number) =>
    {
        setClickedClient(icusnum)
        setLoadingDifferences(true)
        setModule(true)
        try {
            const resp = await httpClient.post(
              `//${process.env.REACT_APP_BACKEND}:${process.env.REACT_APP_BACKENDPORT}/get_detailed_egrul_info`,
              {icusnum}
            );
            setClientDifferences(resp.data)
            setLoadingDifferences(false)

          } catch (error) {
            console.log(error);
            console.log("Не удалось получить данные по клиенту :с");
          }
    }

    const handleAddressesClick = async (icusnum: number) =>
    {
        setClickedClient(icusnum)
        setLoadingDifferences(true)
        setModuleAddresses(true)
        try {
            const resp = await httpClient.post(
              `//${process.env.REACT_APP_BACKEND}:${process.env.REACT_APP_BACKENDPORT}/get_client_addr`,
              {icusnum}
            );
            setClientAddresses(resp.data?.client_addresses)
            setCorrectAddress(resp.data?.correct_address);
            console.log(resp.data)
            setLoadingDifferences(false)

          } catch (error) {
            console.log(error);
            console.log("Не удалось получить адреса по клиенту :с");
          }
    }

    const handleCheckbox = () => {
      setMyClientsOnly(prevState => !prevState)
    }

    const handleFAQClick = () => {
      setModuleQuestions(true);
    }

    return (
        <div className="h-full min-h-screen pb-10 ">
            <div className="flex items-center mt-8 mb-4">
               <div><button className="customButtonNoWdt py-1 px-2" onClick={() => handleFAQClick()}>Ответы на вопросы</button> </div>
            </div>
            <div className='flex-1  h-12 border rounded-lg border-color-primary '>
                <input 
                onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
                className='w-full h-full customInputField bg-[#f6f7fb] text-xl' placeholder='Поиск по номеру или наименованию клиента'>
                </input>
            </div>
            <div className="flex items-center mt-2 mb-4">
              <input id="default-checkbox" type="checkbox" value="" onChange={handleCheckbox} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
              <label htmlFor ="default-checkbox" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Показывать только клиентов, открытых под моей учётной записью</label>
            </div>
            {loading == false && ( clients?.length ? <div className="my-4">{clients?.map((client, key) => (
              <div  className= { `h-24 mb-3 flex items-center justify-between px-4 rounded-lg hover:bg-[#E6E6FA] text-xl text-color-dark-variant hover:text-color-dark transition-all ${key % 2 ? 'bg-[#f6f7fb]' : 'bg-[#fbfbfd]'} shadow-sm` } key={uuid()}>
                <div className="flex gap-4" key={uuid()}><div className="italic" key={uuid()}>
                {client.icusnum}
                </div>
                <div key={uuid()}>
                {client.title.length > 70 ? client.title.slice(0, 70)+'...' : client.title}
                </div>
                </div>
                <div className="flex content-center gap-2 " key={uuid()}>
                    <button className="customButtonTransparent text-sm w-fit py-1 px-2" key={uuid()} onClick={() => handleMainInfoClick(client.icusnum)}>Основные сведения</button>
                    <button className="customButtonTransparent text-sm w-fit py-1 px-2" key={uuid()} onClick={() => handleAddressesClick(client.icusnum)}>Адрес</button>
                </div>
                </div>
              )
              )}
              <Pagination numbers={numbers} currentPage={currentPage} pages={pages} prevPage={prevPage} nextPage={nextPage} changeCurPage={changeCurPage} />
              </div> : <div className="flex justify-center align-middle mt-8 text-lg">Упс, клиенты не найдены &#128532;</div> )}

              {loading == true && <div className="flex justify-center align-middle mt-8"><Spinner /></div>}

              {module && (<EgrulWindows setModule={setModule} loadingDifference={loadingDifferences} clientDifferences={clientDifferences} icusnum={clickedClient}/> )}
              {moduleAddresses && (<EgrulAddress setModule={setModuleAddresses} loadingAddresses={loadingDifferences} addressTypes={addressTypes} clientCorrectAddress={clientCorrectAddress} addressPayload={clientAddresses} icusnum={clickedClient}/> )}
              {moduleQuestions && (<EgrulQuestions setModule={setModuleQuestions}/> )}

        </div>
     );
    };
    
export default Egrul;