import { viem } from "hardhat";
import { encodeFunctionData } from "viem";
import {config as dotenvConfig} from 'dotenv';

dotenvConfig();

async function main() {
    const proxyAdmin = await viem.deployContract("ProxyAdmin");
    console.log(`ProxyAdmin: ${proxyAdmin.address}`);

    const impl = await viem.deployContract("LukasV1");
    console.log(`Implementation: ${impl.address}`);

    const initializeData = encodeFunctionData({
        abi: impl.abi,
        functionName: "initialize",
        args: [process.env.LKS_WALLET as `0x${string}`]
    });

    console.log("initializeData:", initializeData);

    const proxy = await viem.deployContract("TransparentUpgradeableProxy", [
        impl.address,
        proxyAdmin.address,
        initializeData
    ]);

    console.log(`Proxy: ${proxy.address}`);
}

main().catch(console.error);
