import { defineChain } from "viem";

export const NeoX = /*#__PURE__*/ defineChain({
  id: 12_227_332,
  name: 'Neo Testnet',
  nativeCurrency: { name: 'Neo Gas', symbol: 'Gas', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://neoxt4seed1.ngd.network']
    },
  },
  blockExplorers: {
    default: {
      name: 'Etherscan',
      url: 'https://xt4scan.ngd.network/'
    },
  },
  testnet: true,
})
