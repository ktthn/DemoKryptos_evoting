import { Link } from "react-router-dom";

export default function Footer() {
    return(
        <>
        

<footer>
    <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8 mx-auto max-w-screen-xl" />
    <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl font-['Montserrat'] mt-[-40px] md:py-8">   
        <div className="sm:flex sm:items-center sm:justify-between w-[570px]">
            <Link to="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                <span className="self-center text-xl font-medium whitespace-nowrap ">DemoKryptos</span>
            </Link>
        </div>
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 <Link to="/" className="hover:underline mr-4">DemoKryptos</Link> All Rights Reserved.</span>
    </div>
</footer>


        </>
    )
}