import React from 'react'
import uuid from 'react-uuid';

type PaginationProps = {
    numbers: number[];
    currentPage: number;
    pages: number;
    prevPage: () => void;
    nextPage: () => void;
    changeCurPage: (n: number) => void;
  };

const Pagination = ({numbers, currentPage, pages, prevPage, nextPage, changeCurPage}:PaginationProps) => {
  return (
    <nav className="w-full mt-5 ">
        <ul className="flex justify-center gap-2">
          <li className="customButtonTransparentNoWdt" onClick={prevPage} key={uuid()}>
            Назад
          </li>

            { numbers.length > 10 ? (
                <><li
                key={uuid()}
                className={
                  currentPage == 1
                    ? "customButtonNoWdt"
                    : "customButtonTransparentNoWdt"
                }
                onClick={() => changeCurPage(1)}
              >
                {1}
              </li>
              {currentPage != 1 && currentPage != 2 && currentPage != 3 &&  <li className="text-center px-2" key={uuid()}>. . .</li>}
              {numbers.map((number, key) => (
                (number == currentPage - 1 || number == currentPage || number == currentPage + 1 ) && number != 1 && number != pages ? <li
                key={uuid()}
                className={
                    currentPage == number
                    ? "customButtonNoWdt"
                    : "customButtonTransparentNoWdt"
                }
                onClick={() => changeCurPage(number)}
                >
                {number}
                </li> : <></>
          ))}
              {currentPage != pages  && currentPage != pages -1 && currentPage != pages -2 && <li className="text-center px-2" key={uuid()}>. . .</li>}
              <li
                key={uuid()}
                className={
                  currentPage == pages
                    ? "customButtonNoWdt"
                    : "customButtonTransparentNoWdt"
                }
                onClick={() => changeCurPage(pages)}
              >
                {pages}
              </li></>

            ) : ( numbers.map((number, key) => (
                
                <li
                  key={uuid()}
                  className={
                    currentPage == number
                      ? "customButtonNoWdt"
                      : "customButtonTransparentNoWdt"
                  }
                  onClick={() => changeCurPage(number)}
                >
                  {number} 
                </li>
              )) )
            }

          <li className="customButtonTransparentNoWdt" key={uuid()} onClick={nextPage}>
            Вперед
          </li>
        </ul>
      </nav>
  )
}

export default Pagination