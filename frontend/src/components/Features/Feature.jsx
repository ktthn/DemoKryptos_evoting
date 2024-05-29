import { homomorphic } from "../../assets/icons/index"
import { useEffect } from "react"
import AOS from 'aos'
import 'aos/dist/aos.css'
export default function Feature() {
    useEffect(()=>{
        AOS.init({duration:1000})
    }, [])
    return(
        <>
          <section className=" flex flex-wrap justify-between items-center mx-auto max-w-screen-xl font-['Montserrat'] py-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative ">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-9">
                <div className="img-box">
                    <img src={homomorphic} alt="Features"
                        className="max-lg:mx-auto" />
                </div>
                <div className="lg:pl-[100px] flex items-center">
                    <div className="data w-full">
                        <h2
                            className="font-manrope font-bold text-4xl lg:text-5xl text-black max-lg:text-center relative">
                            Features of our system
                             </h2>
                            <div className="h-2 w-60 bg-indigo-500 mb-9 rounded-xl"></div>
                        <p className="font-normal text-xl leading-8 text-gray-500 max-lg:text-center max-w-2xl mx-auto">
                            The DemoKryptos e-voting platform utilizes Paillier's Partial Homomorphic Encryption (PHE) to ensure the security and privacy of digital votes. Homomorphic encryption allows computations to be performed on encrypted data without needing to decrypt it first. This means that votes remain encrypted throughout the entire voting process, from casting to counting.
                            In practical terms, when a vote is cast, it is encrypted using Paillier's PHE, which enables mathematical operations to be performed on the encrypted votes. The tallying of votes is done directly on this encrypted data, ensuring that the votes are never exposed in their original form. This method protects against data breaches and unauthorized access, maintaining the confidentiality and integrity of each vote.
                        </p>
                    </div>
                </div>
            </div>
        </div>







    </section>
       </>
    )
}
