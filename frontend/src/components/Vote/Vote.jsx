import React from "react";
import { Link } from "react-router-dom";
import {woman, voteus, vote3, sign} from '../../assets/icons/index'
const Card = () => {
  return (
    <>
      <section className="bg-white flex flex-wrap justify-between items-center mx-auto max-w-screen-xl font-['Montserrat']  py-12">
        
            <div className="mx-auto max-w-screen-lg lg:text-center w-full">
                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">How to use our platform?</p>
              
                <div className="h-2 w-[460px] bg-indigo-500 mb-9 rounded-xl mx-auto mt-1"></div>
                <p className="mt-6 text-lg leading-8 text-gray-600 w-[720px] mx-auto mb-12">Participating in the e-voting process with our website is simple and secure. Follow these three easy steps to cast your vote:</p>
              </div>

            <div className="w-full px-4 lg:w-6/12">
                <div class="relative">
                  <div class="absolute inset-0 -translate-x-4 -translate-y-4 bg-red-200 rounded-lg transform "></div>
                  <div class="relative z-10 p-4 bg-white shadow-lg rounded-lg">
                      <img src={woman} alt="Image Description" class="rounded-lg mx-auto" width={500} height={400} />
                  </div>
                </div>
             </div>

            <div className="w-full  lg:w-1/2 xl:w-5/12 font-['Montserrat']">
                <h2 className="text-3xl font-bold text-dark sm:text-[40px]/[48px]">
                  Register and Verify
                </h2>
                <div className="h-2 w-[400px] bg-indigo-500 mb-9 rounded-xl"></div>
                <p className="mb-5 text-base text-body-color dark:text-dark-6">
                First, create your account on our platform by providing your personal information and a valid email address. Once registered, you will need to verify your identity to ensure the security and integrity of the voting process. This can be done using a government-issued ID or other verification methods provided by our system.
                </p>
              </div>

              <div className="mx-auto mt-36">
                <div className="flex flex-wrap items-center lg:flex-nowrap gap-24">
                    <div className="w-full px-4 lg:w-1/2 xl:w-5/12 font-['Montserrat']">
                        <h2 className="text-3xl font-bold text-dark sm:text-[40px]/[48px]">
                        Choose Your Election
                        </h2>
                        <div className="h-2 w-[450px] bg-indigo-500 mb-9 rounded-xl"></div>
                        <p className="mb-5 text-base text-body-color dark:text-dark-6">
                        After verifying your identity, log in to your account and browse the available elections. Select the election you wish to participate in and review the candidates and issues on the ballot.
                        </p>
                    </div>
                    <div className="w-full px-4 lg:w-6/12">
                        <div className="relative">
                            <div className="absolute inset-0 translate-x-4 -translate-y-4 bg-red-200 rounded-lg transform"></div>
                            <div className="relative z-10 p-4 bg-white shadow-lg rounded-lg">
                                <img src={sign} alt="Image Description" className="rounded-lg w-full h-[450px]" />
                            </div>
                        </div>
                    </div>
                </div>
             </div>
             <div className="mx-auto mt-36">
                <div className="flex flex-wrap items-center lg:flex-nowrap gap-24">
                <div className="w-full px-4 lg:w-6/12">
                <div class="relative">
                  <div class="absolute inset-0 -translate-x-4 -translate-y-4 bg-red-200 rounded-lg transform "></div>
                  <div class="relative z-10 p-4 bg-white shadow-lg rounded-lg">
                      <img src={vote3} alt="Image Description" class="rounded-lg mx-auto"/>
                  </div>
                </div>
             </div>

            <div className="w-full  lg:w-1/2 xl:w-5/12 font-['Montserrat']">
                <h2 className="text-3xl font-bold text-dark sm:text-[40px]/[48px]">
                  Cast Your Vote
                </h2>
                <div className="h-2 w-[400px] bg-indigo-500 mb-9 rounded-xl"></div>
                <p className="mb-5 text-base text-body-color dark:text-dark-6">
                Once you have selected your election, follow the on-screen instructions to cast your vote. Make sure to review your choices before submitting. After you submit your vote, you will receive a confirmation that your vote has been successfully recorded.
                </p>
              </div>
                </div>
             </div>
      </section>

      
    </>
  );
};
export default Card;