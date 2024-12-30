import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";
import Navbar from "@/components/Navbar";
import image from "../assets/Group 1.png";
import { useAccount } from "wagmi";
import { video } from "@/DummyData/videosData";
import { useNavigate } from "react-router-dom";
import "../utils/loader.css"
import { useEthersSigner } from "@/utils/providerChange";
import { useEffect, useState } from "react";
import { Contract } from "ethers";
import { contractAbi, contractAddress } from "@/utils/NeoXContractDetails";


const AdminHome = () => {

  const connectedAcc = useAccount();
  const navigate = useNavigate();

  const [allPosters, setAllPosters] = useState<any>()

  
  const signer = useEthersSigner({chainId: connectedAcc.chainId})

  useEffect(() => {
    const contractSigned = new Contract(contractAddress, contractAbi, signer);
    if(contractSigned && signer){
      contractSigned.getAllPosters().then((posters) => {setAllPosters(posters); console.log(posters)})
    }
  }, [signer])

    return (
      <div className="w-full flex flex-col">
        <Navbar />
        <div className="flex flex-col gap-y-10 w-full justify-center items-center text-center">
          <div className="w-full flex justify-center items-center relative">
            <img className="w-full max-w-[1840px] h-[59vh]" src={image} alt="" />
            <div className="absolute bottom-[-20px] z-20 flex-col flex gap-y-1 left-[50%] translate-x-[-50%]">
              <h1 className="font-hanalei text-6xl flex justify-center items-center gap-x-3 text-white">
                WELCOME <span className="text-[#1ff000] text-3xl">{connectedAcc.address?.slice(0, 7) + "...." + connectedAcc.address?.slice(-7)}</span>
              </h1>
              <p className="text-white happy-monkey-regular text-2xl">
                Upload a video?
              </p>
              <div className="flex justify-center gap-x-2">
                <button className="font-hanalei text-3xl bg-[#1EFF00] px-3 py-1 rounded" onClick={() => navigate('/addmovie')}>
                  Upload
                </button>
              </div>
            </div>
            <div className="absolute bottom-[-12px] z-10 left-[50%] rounded-full translate-x-[-50%] w-[280px] blur-[80px] h-[70px] bg-pink-500">hi this is dev</div>
          </div>
          <div className="px-10 w-10/12 max-w-[1600px] flex flex-col gap-y-2">
            <div className="flex justify-between text-xl">
              <h2 className="font-hanalei text-3xl text-[#1EFF00]">RENTED MOVIES</h2>
              <button className="font-hanalei text-2xl bg-[#1EFF00] py-1 px-3 rounded">
                MORE
              </button>
            </div>
            <div className="grid grid-cols-5 w-full gap-5 mt-5">
              {
                allPosters?.map((video: video | any, index: number) => {
                  return (
                    <MovieCard key={index} video={video} />
                  )
                })
              }
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  // }
}

export default AdminHome;