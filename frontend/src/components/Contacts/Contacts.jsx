
export default function Contacts() {
    return(
        <>
<section className="bg-white flex flex-wrap justify-between items-center mx-auto max-w-screen-xl font-['Montserrat']">
    <div className="container px-6 py-12 mx-auto">
        <div className="text-center">
            <h1 className="mt-2 text-2xl font-semibold text-gray-800 md:text-3xl">Get in touch</h1>
            <div className="h-2 w-44 bg-indigo-500 mb-9 rounded-xl mx-auto"></div>
            <p className="mt-3 text-gray-500 ">Our friendly team is always here to chat.</p>
        </div>

        <div className="grid grid-cols-1 gap-12 mt-10 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center justify-center text-center">
                <span className="p-3 text-indigo-600 rounded-full bg-blue-100/80 ">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                </span>

                <h2 className="mt-4 text-lg font-medium text-gray-800 ">Email</h2>
                <p className="mt-2 text-gray-500 ">Our friendly team is here to help.</p>
                <p className="mt-2 text-gray-500 ">Zeynep Galymzhankyzy.</p>
                <a href="mailto:youremail@gmail.com" className="mt-2 text-indigo-600 cursor-pointer ">212174@astanait.edu.kz</a>

                <p className="mt-2 text-gray-500 ">Ildar Rinatov.</p>
                <a href="mailto:youremail@gmail.com" className="mt-2 text-indigo-600 cursor-pointer ">212256@astanait.edu.kz</a>


                <p className="mt-2 text-gray-500 ">Aygerim Karibekova.</p>
                <a href="mailto:youremail@gmail.com" className="mt-2 text-indigo-600 cursor-pointer ">212349@astanait.edu.kz</a>

            </div>

            <div className="flex flex-col items-center justify-center text-center">
                <span className="p-3 text-indigo-600 rounded-full bg-blue-100/80">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                </span>
                
                <h2 className="mt-4 text-lg font-medium text-gray-800 ">Location</h2>
                <p className="mt-2 text-gray-500 ">Come say hello at our team in real life.</p>
                <p className="mt-2 text-indigo-600 ">Astana IT University</p>
                <p className="mt-2 text-indigo-600 ">Astana, Kazakhstan</p>

            </div>

            <div className="flex flex-col items-center justify-center text-center">
                <span className="p-3 text-indigo-600 rounded-full bg-blue-100/80 ">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                </span>
                
                <h2 className="mt-4 text-lg font-medium text-gray-800 ">Phone</h2>
                <p className="mt-2 text-gray-500 ">Mon-Fri from 10am to 5pm.</p>
                <a href="tel:+7707707777" className="mt-2 text-indigo-600 cursor-pointer">+7 (708) 814 8757</a>
            </div>
        </div>
    </div>
</section>
        </>
    )
}