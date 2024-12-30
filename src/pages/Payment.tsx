import MovieCheckout from "../components/MovieCheckoutCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useReadContract } from "wagmi";
import { useParams } from "react-router-dom";
import "../utils/loader.css"
import { contractAbi, contractAddress } from "@/utils/NeoXContractDetails";
interface posterData {
  movieId: number,
  name: string;
  description: string;
  ipfsHash: string;
  price: number;
}

const Payment = () => {

  const { id } = useParams();
  // const { address } = useAccount();


  const { data, isPending }: { data: posterData[] | undefined, isPending: boolean | undefined, isError: any } = useReadContract({
    abi: contractAbi,
    address: contractAddress,
    functionName: "getAllPosters",
    args: []
  })


  if (isPending) {
    return <div className="flex w-screen h-screen justify-center items-center">
      <div className="loader"></div>
    </div>
  }

  return (
    <div className="flex flex-col">
      <Navbar />
      <div className=" relative w-full flex">
        <img src={`https://black-rapid-ladybug-825.mypinata.cloud/ipfs/${(data as any[])[parseInt(id ? id : "0")].ipfsHash.replace("ipfs://", "")}`} className="w-full blur-3xl h-[80vh]" />
        <div className="absolute h-[80vh] w-full flex">
          <div className="w-3/5 h-full flex justify-center items-center">
            <img src={`https://black-rapid-ladybug-825.mypinata.cloud/ipfs/${(data as any[])[parseInt(id ? id : "0")].ipfsHash.replace("ipfs://", "")}`} alt="" className="object-cover rounded-xl h-full w-11/12 m-auto" />
          </div>
          <div className="w-2/5 flex justify-center items-center h-full">
            <div className="h-full flex items-center justify-center">
              <MovieCheckout
                title={data === undefined || id === undefined ? ("") : ((data as any[])[parseInt(id ? id : "0")].name)}
                gas={parseInt((data as any[])[parseInt(id ? id : "0")].price)}
                owner="0xb8B0C320ED4b7F9Fda8A2408F4C4044Bc5C8Bf41"
                description={data === undefined || id === undefined ? ("") : data[parseInt(id)].description}
                buyers={1230000}
                id={id === undefined ? (0) : (parseInt(id))}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <Footer />
      </div>
    </div>
  );
};

export default Payment;
