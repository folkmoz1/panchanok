import {useState, useEffect} from 'react'
import Image from "next/image";
import NProgress from 'nprogress'
import Router from 'next/router'

export const fileToDataUri = (image) => {
    return new Promise((res) => {
        const reader = new FileReader();
        const {type, name, size} = image;
        reader.addEventListener("load", () => {
            res({
                src: reader.result,
                name: name,
                type,
                size: size
            });
        });
        reader.readAsDataURL(image);
    });
};

NProgress.configure({
    showSpinner: false,
    trickleRate: 0.1,
    trickleSpeed: 800
})

const Form = () => {
    const contentType = 'application/json'
    const [images, setImages] = useState([])
    const [previewImage, setPreviewImage] = useState( [])
    const [selectPreview, setSelectPreview] = useState(0)
    const [error, setError] = useState('')
    const [data, setData] = useState({
        author: '',
        desc: '',
        title: ''
    })
    const [uploaded, setUploaded] = useState([])

    const checkValue = images.length === 0 || !data.author || !data.desc || !data.title

    const onTextChange = ({target}) => {
        setData(
            prev => ({...prev, [target.name]: target.value})
        )
    }

    const handlePicture = async (e) => {
        if (previewImage.length >= 4 || images.length >= 4) {
            setError('maximum picture select.')
            return
        }

        const files = e.target.files


        if (files.length > 0 && files.length <= 4) {
            if (error) {
                setError('')
            }

            const newImagesPromise = []
            for (let i = 0; i < files.length; i++) {
                setImages(pic => [...pic, files[i]])
                newImagesPromise.push(fileToDataUri(files[i]))
            }

            const newImages = await Promise.all(newImagesPromise)
            setPreviewImage(prev => [...prev, ...newImages])
        } else {
            setError('maximum picture select.')
            return
        }
    }

    const deletePreviewImage = index => {
        if (error) setError('')
        setPreviewImage(previewImage.filter((img, i) => i !== index))
        setImages(images.filter((img, i) => i !== index))
        setSelectPreview(
            previewImage.length - 2 <= 0 ? 0 : previewImage.length - 2
        )
    }

    const submitForm = async (e) => {
        e.preventDefault()
        if (checkValue) return

        try {
            NProgress.start()
            await images.map(file => uploadImage(file))

        } catch (e) {
            NProgress.done()
            setError('อ๊ะ เกิดข้อผิดพลาด ลองใหม่อีกครั้งนะครับ!')
            console.log(e)
        }
    }

    const uploadImage = async (file) => {
        const data = new FormData()
        data.append('file', file)
        data.append('upload_preset', 'uploadImage')
        data.append('timestamp', `${Date.now()}`)

        const resp = await fetch('https://api.cloudinary.com/v1_1/panchanok/image/upload',{
            method: 'POST',
            body: data
        })

        const { public_id, url } = await resp.json()

        setUploaded(prev => [...prev, {public_id, url}])

        return
    }

    useEffect(() => {
        const uploadLength = uploaded.length

        const fetcher = async () => {
            try {
                const dataToJSON = {
                    author: data.author,
                    desc: data.desc,
                    title: data.title,
                    images: uploaded
                }

                const resp = await fetch('/api/posts',{
                    method: 'POST',
                    body: JSON.stringify(dataToJSON)
                })

                if (resp.status === 201) {
                    NProgress.done()
                    Router.push('/')
                }
            } catch (e) {
                NProgress.done
                setError('อ๊ะ เกิดข้อผิดพลาด ลองใหม่อีกครั้งนะครับ!')
                console.log(e)
            }
        }

        if ( uploadLength > 0 && uploadLength === previewImage.length ) {
            fetcher()
        }


    },[uploaded])

    return (
        <>
            <div className={'w-full flex items-center mb-8 flex-col md:mb-0 md:w-1/2'}>
                <>
                    {
                        previewImage.length !== 0 &&
                            <div className={'preview__contain'}>
                                <span
                                    onClick={() => deletePreviewImage(selectPreview)}
                                    className={'md:cursor-pointer absolute top-2 right-1 z-10 opacity-0'}>
                                        <svg height="20pt" viewBox="0 0 512 512" width="20pt" xmlns="http://www.w3.org/2000/svg"><path d="m256 0c-141.164062 0-256 114.835938-256 256s114.835938 256 256 256 256-114.835938 256-256-114.835938-256-256-256zm0 0" fill="#f44336"/><path d="m350.273438 320.105469c8.339843 8.34375 8.339843 21.824219 0 30.167969-4.160157 4.160156-9.621094 6.25-15.085938 6.25-5.460938 0-10.921875-2.089844-15.082031-6.25l-64.105469-64.109376-64.105469 64.109376c-4.160156 4.160156-9.621093 6.25-15.082031 6.25-5.464844 0-10.925781-2.089844-15.085938-6.25-8.339843-8.34375-8.339843-21.824219 0-30.167969l64.109376-64.105469-64.109376-64.105469c-8.339843-8.34375-8.339843-21.824219 0-30.167969 8.34375-8.339843 21.824219-8.339843 30.167969 0l64.105469 64.109376 64.105469-64.109376c8.34375-8.339843 21.824219-8.339843 30.167969 0 8.339843 8.34375 8.339843 21.824219 0 30.167969l-64.109376 64.105469zm0 0" fill="#fafafa"/></svg>
                                </span>
                                <Image src={previewImage[selectPreview]?.src} width={400} height={500} objectFit={"cover"}/>

                            </div>
                        }
                </>
                {
                    previewImage.length !== 0 &&
                    <div className={'flex flex-wrap mt-4 gap-4'}>
                        {
                            previewImage.map((img, index) => (
                                <span
                                    style={{maxHeight: 100}}
                                    className={`shadow-md md:cursor-pointer rounded overflow-hidden ${selectPreview === index && 'ring-4 ring-red-400'}`}
                                    key={img.name}
                                    onClick={() => setSelectPreview(index)}
                                >
                                <Image
                                    src={img.src}
                                    width={100}
                                    height={100
                                    } objectFit={"cover"}
                                />
                            </span>
                            ))
                        }
                    </div>

                }
            </div>
            <div className={'w-4/5 md:w-1/2 flex flex-col items-center h-full md:pt-32 md:pr-4'}>
                { error && <span className={'w-full p-4 border border-red-300 bg-red-200 text-red-600'} >{error}</span> }
                <form className={'w-full'} onSubmit={submitForm}>
                    <div className={'flex flex-col my-3 '}>
                        <label
                            htmlFor="author"
                            className={'mb-2'}
                        >Your name</label>
                        <input
                            onChange={onTextChange}
                            value={data.author}
                            name={'author'}
                            className={` shadow-sm px-4 py-2 rounded bg-gray-50  dark:bg-gray-700 ring-4 ${data.author ? 'ring-green-300' : 'ring-gray-100'} focus:ring-indigo-300`}
                        />
                    </div>
                    <div className={'flex flex-col mb-3 mt-5 '}>
                        <label
                            htmlFor="title"
                            className={'mb-2'}
                        >Title</label>
                        <input
                            onChange={onTextChange}
                            value={data.title}
                            name={'title'}
                            className={` shadow-sm px-4 py-2 rounded bg-gray-50  dark:bg-gray-700 ring-4 ${data.title ? 'ring-green-300' : 'ring-gray-100'} focus:ring-indigo-300 `}
                        />
                    </div>
                    <div className={'flex flex-col my-3 h-auto mt-8'}>
                        <label
                            htmlFor="desc"
                            className={'mb-2'}
                        >About this picture</label>
                        <textarea
                            onChange={onTextChange}
                            value={data.desc}
                            name={'desc'}
                            className={`h-auto px-4 py-2 rounded bg-gray-50  dark:bg-gray-700 ring-4 ${data.desc ? 'ring-green-300' : 'ring-gray-100'} focus:ring-indigo-300`}
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 mt-12 ">
                        <span className={' w-full button'}>
                            <input
                                multiple
                                type="file"
                                id={'upload-image'}
                                className={'d-none'}
                                onChange={handlePicture}
                            />
                            <label htmlFor={'upload-image'}>
                                <span
                                    type={"button"}
                                    className={`text-center md:cursor-pointer p-4  w-full text-xl text-white uppercase mx-auto ring-4 ring-gray-600 bg-gray-700 rounded hover:shadow-md `}
                                >
                                    Choose picture...
                                </span>
                            </label>
                        </span>
                        <button
                            type={"submit"}
                            className={'shadow-sm p-4  w-full text-xl text-white uppercase mx-auto ring-4 ring-purple-500 bg-purple-400 rounded '}
                            disabled={checkValue}
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Form
