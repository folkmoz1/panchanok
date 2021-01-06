import Link from "next/link";

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
                    <nav>
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
