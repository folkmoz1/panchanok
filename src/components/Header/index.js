import Link from "next/link";

export default function Header() {


    return (
        <>
            <header>
                <div
                    className={'p-4 flex justify-between items-center shadow-md'}
                >
                    <div>
                        <h1 className={'text-2xl uppercase font-bold md:cursor-pointer'}>
                            panchanok
                        </h1>
                    </div>
                    <nav>
                        <ul className={'flex items-center'}>
                            <li className={'px-4 py-2 mx-2 md:cursor-pointer hover:text-yellow-400'}>
                                <Link href={'/'}>
                                    <a>
                                        หน้าแรก
                                    </a>
                                </Link>
                            </li>
                            <li className={'px-4 py-2 mx-2 md:cursor-pointer hover:text-yellow-400'}>
                                <Link href={'/post/new'}>
                                    <a>
                                        สร้างโพสต์
                                    </a>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
        </>
    )
}
