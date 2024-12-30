import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { contractAbi, contractAddress } from "@/utils/NeoXContractDetails";
import { useEffect, useState } from "react";
import { useEthersSigner } from "@/utils/providerChange";
import { Contract } from "ethers";

const Navbar = () => {

  const [isAdmin, setIsAdmin] = useState<boolean>()

  const connectedAcc = useAccount()
  
  const signer = useEthersSigner({chainId: connectedAcc.chainId})

  useEffect(() => {
    const contractSigned = new Contract(contractAddress, contractAbi, signer);
    if(contractSigned && signer){
      contractSigned.checkAdmin().then((data) => {setIsAdmin(data); console.log(data)})
    }
  }, [signer])

    return (
      <div className="flex flex-wrap justify-between font-hanalei bg-[#3B3B3B] text-white p-8 ">
        <div className="text-4xl text-[#1ff000]">
          {
            isAdmin === true ? (<Link to="/home">Web3TV</Link>) : (<Link to="/">Web3TV</Link>)
          }
        </div>
        <div className="flex gap-5 flex-wrap px-5 items-center text-xl">
          <ul className="flex gap-10 px-10">
            <Link to='/home'><li>Home</li></Link>
            {
              isAdmin === true ? (<Link to='/AdminHome'><li>AdminPage</li></Link>) : (<></>)
            }
            <Link to='/player'><li>Player</li></Link>
          </ul>
          <ConnectButton
            chainStatus="icon"
            showBalance={false}
            accountStatus="address"
          />
        </div>
      </div>
    );
  // }
};

export default Navbar;
