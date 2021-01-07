import Link from "next/link";
import {useEffect, useState} from 'react'
import {Squeeze as Hamburger} from 'hamburger-react'

export default function Header() {
    const [isOpen, setIsOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        setIsMobile(window.innerWidth < 768)
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                setIsMobile(false)

                if (!isOpen) {
                    setIsOpen(false)
                }
            } else {
                setIsMobile(true)
            }
        })
    }, [])

    return (
        <>
            <header>
                <div
                    className={'p-4 flex justify-between items-center shadow-md'}
                >
                    <div>
                        <Link href={'/'}>
                            <a className={'cursor-default md:cursor-pointer'}>
                                <h1 className={'text-2xl uppercase font-bold'}>
                                    panchanok
                                </h1>
                            </a>
                        </Link>
                    </div>
                    <span className={'--inner'}>
                       <Hamburger
                           toggled={isOpen}
                           toggle={() => setIsOpen(!isOpen)}
                           size={25}
                           rounded
                       />
                    </span>
                    <nav>
                        <ul className={'flex items-center flex-col py-6 md:py-0 md:flex-row'}>
                            {
                                isMobile &&
                                <span className={'--outer'}>
                                   <Hamburger
                                       toggled={isOpen}
                                       toggle={() => setIsOpen(!isOpen)}
                                       size={25}
                                       rounded
                                   />
                                </span>
                            }
                            <Link href={'/'}>
                                <a className={'cursor-default md:cursor-pointer'}>
                                    <li className={'px-4 py-2 my-3 mx-2 md:my-0  hover:text-yellow-400'}>
                                        หน้าแรก
                                    </li>
                                </a>
                            </Link>
                            <Link href={'/p/new'}>
                                <a className={'cursor-default md:cursor-pointer'}>
                                    <li className={'px-4 py-2 mx-2 my-3 md:my-0 hover:text-yellow-400'}>

                                        สร้างโพสต์
                                    </li>
                                </a>
                            </Link>
                        </ul>
                    </nav>
                </div>
            </header>
            <div className={isOpen ? 'modal --active' : 'modal'} onClick={() => setIsOpen(false)}></div>

            <style jsx global>{`
              .modal {
                display: none;
                transition: background-color .2s;
              }

              .modal.--active {
                display: block;
                position: absolute;
                inset: 0;
                background-color: rgba(0, 0, 0, .4);
                z-index: 1;
                user-select: none;
              }

              #__next {
                width: 100%;
                position: absolute;
                left: ${isOpen ? `-250px` : '0'};
                transition: .5s;
                overflow-x: hidden;
              }

              header > div {
                min-height: 70px;
                max-height: 70px;
              }

              span.--inner {
                display: none;
              }

              @media (max-width: 768px) {
                span div {
                  cursor: default!important;
                }
              
                nav {
                  height: 100%;
                  width: ${isOpen ? '250px' : '0'};
                  position: fixed;
                  z-index: 2;
                  top: 0;
                  right: 0;
                  background-color: #fff;
                  overflow: hidden;
                  transition: 0.5s;
                  padding-top: 60px;
                }

                span.--inner {
                  display: block;
                  ${isOpen ? `
                   position: absolute;
                   top: 11px;
                   right: -220px;
                   z-index: 5;
                  ` : ''}
                }
                
                span.--outer {
                  position: fixed;
                  top: 11px;
                  right: 20px;
                  opacity: ${isOpen ? 1 : 0};
                  transition: opacity .2s;
                }

                ul a li {
                  font-size: 160%;
                  opacity: ${isOpen ? 1 : 0};
                  transition: opacity .3s;
                  word-break: keep-all;
                  text-wrap: normal;
                  display: block;
                }

              }


            `}</style>
        </>
    )
}
