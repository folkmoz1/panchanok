import Link from "next/link";

let styles = {
    bmBurgerButton: {
        position: 'fixed',
        width: '36px',
        height: '30px',
        left: '36px',
        top: '36px'
    },
    bmBurgerBars: {
        background: '#373a47'
    },
    bmBurgerBarsHover: {
        background: '#a90000'
    },
    bmCrossButton: {
        height: '24px',
        width: '24px'
    },
    bmCross: {
        background: '#bdc3c7'
    },
    bmMenuWrap: {
        position: 'fixed',
        height: '100%'
    },
    bmMenu: {
        background: '#373a47',
        padding: '2.5em 1.5em 0',
        fontSize: '1.15em'
    },
    bmMorphShape: {
        fill: '#373a47'
    },
    bmItemList: {
        color: '#b8b7ad',
        padding: '0.8em'
    },
    bmItem: {
        display: 'inline-block'
    },
    bmOverlay: {
        background: 'rgba(0, 0, 0, 0.3)'
    }
}

export default function Header() {


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
                    <nav className={'d-none md:block'}>
                        <ul className={'flex items-center'}>
                            <Link href={'/'}>
                                <a>
                                    <li className={'px-4 py-2 mx-2 md:cursor-pointer hover:text-yellow-400'}>
                                    หน้าแรก
                                    </li>
                                </a>
                            </Link>
                            <Link href={'/p/new'}>
                                <a>
                                    <li className={'px-4 py-2 mx-2 md:cursor-pointer hover:text-yellow-400'}>

                                    สร้างโพสต์
                                    </li>
                                </a>
                            </Link>
                        </ul>
                    </nav>
                </div>
            </header>
        </>
    )
}
