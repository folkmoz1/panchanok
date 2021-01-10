import Link from "next/link";
import {useState, useEffect} from 'react'
import {Squeeze as Hamburger} from 'hamburger-react'
import {useAuth} from "../../context/AuthContext";
import Image from 'next/image'
import useResize from "../../hooks/useResize";
import Popover from '@material-ui/core/Popover'
import Divider from '@material-ui/core/Divider'

const WithoutAuthLink = ({ setIsOpen }) => (
    <>
        <li className={'my-3 mx-2 md:my-0 '} onClick={() => setIsOpen(false)}>
            <Link href={'/u/login'}>
                <a className={'px-4 py-2 text-1r rounded cursor-default   md:cursor-pointer'}>
                    SIGN IN
                </a>
            </Link>
        </li>

        <li className={'my-3 mx-2 md:my-0 '} onClick={() => setIsOpen(false)}>
            <Link href={'/u/register'}>
                <a className={'px-4 font-medium text-1r py-2 border rounded  border-green-400 text-white bg-green-400 cursor-default md:cursor-pointer'}>
                    SIGN UP
                </a>
            </Link>
        </li>
    </>
)

const WithAuthLink = ({ setIsOpen, setLoading, loading, handleLogout, setAnchorEl, avatarClick }) => {

    return (
        <>
            <li className={'cursor-default my-3 mx-2 md:my-2 md:cursor-pointer md:py-2 md:px-4'}
                onClick={() => {
                    setIsOpen(false)
                    setAnchorEl(null)
                }}>
                <Link href={'/'}>
                    <a className={'px-4 py-2 cursor-default hover:text-yellow-400 md:cursor-pointer md:w-full'}>
                        หน้าแรก
                    </a>
                </Link>
            </li>

            <li
                className={'my-3 mx-2 md:my-2 md:py-2 md:px-4'}
                onClick={() => {
                setIsOpen(false)
                setAnchorEl(null)
            }}>
                <Link href={'/p/new'}>
                    <a className={'px-4 py-2 cursor-default hover:text-yellow-400 md:cursor-pointer md:w-full'}>
                        สร้างโพสต์
                    </a>
                </Link>
            </li>
            <Divider variant={"middle"}/>
            <li className={'mt-8 mb-3 mx-2 md:my-2 md:py-2 md:px-4 md:w-full'}>
                <a
                    onClick={() => {
                        setLoading(true)
                        handleLogout(setLoading, setIsOpen, setAnchorEl)
                    }}
                    className={'px-4 text-1r py-2 cursor-default text-white border-red-600 border bg-red-600  md:cursor-pointer md:w-full'}>
                    {
                        loading ? 'กำลังออก..' : 'ออกจากระบบ'
                    }
                </a>
            </li>
        </>
    )
}

export default function Header() {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)


    const { isMobile } = useResize()
    const {isLoggedIn, handleLogout, me} = useAuth()

    const open = Boolean(anchorEl)
    const id = open ? 'avatar-popup' : undefined

    const avatarClick = (e) => {
        if (isMobile) {
            setAnchorEl(null)
            setIsOpen(true)
        } else {
            setIsOpen(false)
            setAnchorEl(e.currentTarget)
        }
    }

    useEffect(() => {
        if (!isMobile && isOpen) {
            setIsOpen(false)
        } else {
            setAnchorEl(null)
        }
    },[isMobile])

    return (
        <>
            <header>
                <div
                    className={'p-4 flex justify-between items-center shadow-md bg-white md:px-8'}
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

                            {
                                isLoggedIn && me ? (
                                    <>
                                        <div
                                            aria-describedby={id}
                                            className={'avatar'} onClick={avatarClick}>
                                            <Image
                                                src={me.image}
                                                width={35}
                                                height={35}
                                                objectFit={"cover"}
                                                alt={me.firstName + ' ' + me.lastName}
                                                loading={"eager"}
                                            />
                                        </div>
                                        {
                                            isMobile &&
                                            <>
                                                <WithAuthLink
                                                    setIsOpen={setIsOpen}
                                                    loading={loading}
                                                    setLoading={setLoading}
                                                    handleLogout={handleLogout}
                                                    setAnchorEl={setAnchorEl}
                                                    avatarClick={avatarClick}
                                                />
                                            </>
                                        }
                                    </>
                                ) : (
                                    <WithoutAuthLink  setIsOpen={setIsOpen}/>
                                )
                            }
                        </ul>
                    </nav>
                </div>
            </header>
            {
                isMobile &&
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

                        {
                            isLoggedIn && me ? (
                                <>
                                    <div
                                        aria-describedby={id}
                                        className={'avatar'} onClick={avatarClick}>
                                        <Image
                                            src={me.image}
                                            width={35}
                                            height={35}
                                            objectFit={"cover"}
                                            alt={me.firstName + ' ' + me.lastName}
                                            loading={"eager"}
                                        />
                                    </div>
                                    {
                                        isMobile &&
                                        <>
                                            <WithAuthLink
                                                setIsOpen={setIsOpen}
                                                loading={loading}
                                                setLoading={setLoading}
                                                handleLogout={handleLogout}
                                                setAnchorEl={setAnchorEl}
                                                avatarClick={avatarClick}
                                            />
                                        </>
                                    }
                                </>
                            ) : (
                                <WithoutAuthLink  setIsOpen={setIsOpen}/>
                            )
                        }
                    </ul>
                </nav>
            }
            {
                me &&
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <ul className={'overflow-hidden'} style={{width: 200}}>
                        <WithAuthLink
                            setIsOpen={setIsOpen}
                            loading={loading}
                            setLoading={setLoading}
                            handleLogout={handleLogout}
                            setAnchorEl={setAnchorEl}
                            avatarClick={avatarClick}
                        />
                    </ul>
                </Popover>
            }
            {
                isMobile &&
                <div className={isOpen ? 'modal --active' : 'modal'} onClick={() => setIsOpen(false)}></div>
            }

            <style jsx global>{`
              .avatar {
                position: relative;
                border-radius: 50%;
                width: 35px;
                height: 35px;
                overflow: hidden;
                cursor: pointer;
              }

              header {
                width: 100%;
                z-index: 1560;
              }
    
              .modal {
                display: none;
                transition: background-color .2s;
              }

              .modal.--active {
                display: block;
                width: 100%;
                height: 100%;
                position: fixed;
                inset: 0;
                background-color: rgba(0, 0, 0, .4);
                z-index: 1666;
                user-select: none;
              }

              #__next {
                //padding-top: 70px;
                width: 100%;
                height: 100%;
                position: absolute;
                left: ${isOpen ? `-250px` : '0'};
                transition: .5s;
                overflow-x: hidden;
                ${isOpen ? `overflow-y: hidden;` : ''}
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
                  width: 250px;
                  right: ${isOpen ? '0' : '-250px'};
                  position: fixed;
                  z-index: 1999;
                  top: 0;
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

                li a {
                  font-size: 160%;
                  opacity: ${isOpen ? 1 : 0};
                  transition: .3s;
                  display: block;
                }

              }


            `}</style>
        </>
    )
}
