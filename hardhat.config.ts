import {HardhatUserConfig} from 'hardhat/config';
import "@typechain/hardhat";
import '@nomicfoundation/hardhat-viem';
import '@nomicfoundation/hardhat-verify';
import {config as dotenvConfig} from 'dotenv';

dotenvConfig();

const config: HardhatUserConfig = {
    solidity: {
        version: '0.8.28',
        settings: {optimizer: {enabled: true, runs: 200}},
    },
    paths: {
        sources: "./contracts",
        artifacts: "./artifacts",
        cache: "./cache",
        tests: "./test"
    },
    typechain: {
        outDir: "typechain-types",
        target: "ethers-v6",
        alwaysGenerateOverloads: true
    },
    networks: {
        polygonPos: {
            url: 'https://polygon-rpc.com',
            chainId: 137,
            accounts: [process.env.LKS_PRIVATE_KEY!],
        },
        amoy: {
            url: 'https://rpc-amoy.polygon.technology/',
            chainId: 80002,
            accounts: [process.env.LKS_PRIVATE_KEY!],
        },
    },
    etherscan: {
        apiKey: {
            polygon: process.env.POLYGONSCAN_API_KEY!,
            polygonAmoy: process.env.POLYGONSCAN_API_KEY!,
        },
    },
};

export default config;
