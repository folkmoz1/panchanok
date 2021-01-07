import Form from "../../components/Form";
import withAuth from "../../hocs/withAuth";


export default withAuth( function New() {

    return (
        <>
            <div className={'max-w-screen-lg h-auto md:h-3/4  mx-auto'}>
                <div className="py-8 h-full flex flex-col items-center md:flex-row md:justify-center">
                    <Form />
                </div>
            </div>
        </>
    )
}, '/u/login')
