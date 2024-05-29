import { about } from "../../assets/icons/index"
import { useEffect } from "react"
import AOS from 'aos'
import 'aos/dist/aos.css'
export default function AboutUs() {
    useEffect(()=>{
        AOS.init({duration:1000})
    }, [])
    return(
        <>
          <section className=" flex flex-wrap justify-between items-center mx-auto max-w-screen-xl font-['Montserrat'] py-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative ">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-9">
                <div className="img-box">
                    <img src={about} alt="About Us tailwind page"
                        className="max-lg:mx-auto" />
                </div>
                <div className="lg:pl-[100px] flex items-center">
                    <div className="data w-full">
                        <h2
                            className="font-manrope font-bold text-4xl lg:text-5xl text-black max-lg:text-center relative">
                            About
                            Us </h2>
                            <div className="h-2 w-60 bg-indigo-500 mb-9 rounded-xl"></div>
                        <p className="font-normal text-xl leading-8 text-gray-500 max-lg:text-center max-w-2xl mx-auto">
                        "DemoKryptos" is an E-Voting system that combines democracy and encryption to provide secure online voting. The name "Demo-" comes from the Greek word for "people," emphasizing the democratic process, while "Kryptos" means "hidden," highlighting the importance of encryption and data security. The platform aims to ensure confidential and protected voting, supporting secure, transparent, and private electoral participation. DemoKryptos is dedicated to modernizing the voting experience by offering a secure, accessible, and user-friendly platform that enables global participation in the democratic process.
                        </p>
                    </div>
                </div>
            </div>
        </div>







    </section>
       </>
    )
}
