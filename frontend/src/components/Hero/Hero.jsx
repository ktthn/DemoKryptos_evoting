
import { vote2 } from "../../assets/icons/index"
import { Link } from "react-router-dom"
import { useContext } from "react"
import AuthContext from '../../context/AutoContext'

export default function Hero() {
      let {user} = useContext(AuthContext)
    return(
        <>
                <section className="mb-40">
                <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 h-screen text-white overflow-hidden">
                <div className="absolute inset-0">
                    <img src={vote2} alt="Background Image" className="object-cover object-center w-full h-full" />
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                </div>
                
                <div className="relative z-10 flex flex-col justify-center items-center h-full text-center">
                    <h1 className="text-5xl font-bold leading-tight mb-4">Time to Vote</h1>
                    <p className="text-lg text-gray-300 mb-8">Join millions in shaping the future from the comfort of your home. <br />Vote securely, quickly, and easily online.</p>
                    {user? (<Link to="/election" className="bg-indigo-500 text-white hover:bg-indigo-600 py-2 px-6 rounded-full text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">Vote Now</Link>) : (<Link to="/auth" className="bg-indigo-500 text-white hover:bg-indigo-600 py-2 px-6 rounded-full text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">Vote Now</Link>)}
                </div>
                </div>
                
                </section>
        </>
    )
}