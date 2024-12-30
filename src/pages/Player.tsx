import Video from "../components/Video";
import Navbar from "../components/Navbar";
import MovieInfo from "../components/MovieInfo";
import { video } from "@/DummyData/videosData";
import MovieCard from "@/components/MovieCard";
import { useAccount, useReadContracts } from "wagmi";
import { contractAddress, contractAbi } from "@/utils/NeoXContractDetails";
import * as cryptojs from 'crypto-js';
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../utils/loader.css"

const Player = () => {

  const { address } = useAccount();
  const navigate = useNavigate();
  let { id } = useParams();


  const [decryptedVideoUrl, setDecryptedVideoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const password = import.meta.env.VITE_REACT_MOVIE_PASSWORD;

  const { data, isPending, isError } = useReadContracts({
    contracts: [
      {
        abi: contractAbi,
        address: contractAddress,
        args: [id],
        functionName: "getMovie"
      },
      {
        abi: contractAbi,
        address: contractAddress,
        args: [id],
        functionName: "getPoster"
      },
      {
        abi: contractAbi,
        address: contractAddress,
        functionName: "getAllPosters",
        args: [],
      },
      {
        abi: contractAbi,
        address: contractAddress,
        functionName: "ownsMovie",
        args: [address, id]
      }
    ]
  });

  const decryptAndFetchFile = async (ipfsHash: string, userPassword: string) => {
    try {
      setStatus("Fetching Encrypted Movie ...");
      const response = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash.replace("ipfs://", "")}`);

      if (!response.ok) {
        throw new Error('Failed to fetch encrypted file');
      }

      const encryptedContent = await response.text();
      const decryptedBase64 = cryptojs.AES.decrypt(
        encryptedContent,
        userPassword
      ).toString(cryptojs.enc.Utf8);
      const binaryString = atob(decryptedBase64);
      const bytes = new Uint8Array(binaryString.length);

      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const decryptedBlob = new Blob([bytes], { type: 'video/mp4' });
      const videoUrl = URL.createObjectURL(decryptedBlob);

      setDecryptedVideoUrl(videoUrl);
      setStatus("Video decrypted successfully");
      setError(null);

      return videoUrl;
    } catch (error) {
      console.error('Decryption error:', error);
      setStatus("");
      setError('Failed to decrypt video. Please check your network connection.');
      return null;
    }
  };

  if (!isPending) {
    if ((data as any[])[3].result === false) {
      navigate(`/payment/${id}`)
    }
  }

  useEffect(() => {

    if (!isPending && !decryptedVideoUrl && data && (data as any[])[0]?.result?.ipfsHash) {
      const ipfsHash = (data as any[])[0].result.ipfsHash;

      decryptAndFetchFile(ipfsHash, password);
    }
  }, [isPending, decryptedVideoUrl, data]);

  if (isPending) {
    return <div className="flex w-screen h-screen justify-center items-center">
      <div className="loader"></div>
    </div>
  }

  if (isError || error) {
    return (
      <div className="text-red-500 text-center text-2xl">
        {error || "An error occurred while loading the video"}
      </div>
    );
  }

  return (
    <div className="w-full h-full pb-10">
      <Navbar />
      <div className="flex flex-col gap-y-12 justify-center items-center">
        <div className="flex flex-col w-full relative items-center bg-[#292929] md:min-h-[1200px] sm:min-h-[1300px] min-h-[1200px] lg:min-h-[1400px] h-[140vh]">
          <img src={`https://black-rapid-ladybug-825.mypinata.cloud/ipfs/${(data as any[])[1].result.ipfsHash.replace("ipfs://", "")}`} className="w-full absolute blur-3xl h-[90vh]" alt="Background Blur" />
          <div className="flex pt-10 gap-y-6 flex-col absolute top-0 w-full justify-center items-center">
            <div className="flex gap-x-2 text-white justify-center items-center">
              <span className="font-hanalei md:text-4xl sm:text-2xl text-xl">{(data as any[])[1].result.name}</span>
              <div className="border border-[#1EFF00] rounded-full px-3 py-1">
                <span className="font-hanalei sm:text-xl text-md">Owner:</span>
                <span className="font-hanalei sm:text-xl text-md">0xb8B0C320ED4b7F9Fda8A2408F4C4044Bc5C8Bf41</span>
              </div>
            </div>
              {decryptedVideoUrl ? (
                <Video link={decryptedVideoUrl} />
              ) : (
                <div className="text-white">
                  {status || "Decryting Secure Video"}
                </div>
              )}
              {/* {status && <p className="text-white mt-2">{status}</p>}
              {error && <p className="text-red-500 mt-2">{error}</p>} */}
            <div className="w-full justify-center items-center flex bottom-[0] font-hanalei">
              <MovieInfo
                title={(data as any[])[1].result.name}
                owner="0x5D8c93Ccf0C1FEB3b93B6b5D3d4eFFe08c2aF3f2"
                amount={(data as any[])[1].result.price.toString()}
                imdbRating="8.8/10"
                description={(data as any[])[1].result.description}
                posterUrl={`https://black-rapid-ladybug-825.mypinata.cloud/ipfs/${(data as any[])[1].result.ipfsHash.replace("ipfs://", "")}`}
                id={`${id}`}
              />
            </div>
          </div>
        </div>
        <div className="px-10 w-10/12 max-w-[1600px] flex flex-col gap-y-2">
          <div className="flex justify-between text-xl">
            <h2 className="font-hanalei text-3xl text-[#1EFF00]">Movies to Rent</h2>
          </div>
          <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 w-full gap-5">
            {
              (data as any[])[2].result.map((video: video | any, index: number) => {
                return (
                  <MovieCard key={index} video={video} />
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;