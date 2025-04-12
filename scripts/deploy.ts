import { viem } from "hardhat";
import { encodeFunctionData } from "viem";

async function main() {
    const impl = await viem.deployContract("LukasV1");
    console.log("Implementation:", impl.address);

    const initializeData = encodeFunctionData({
        abi: impl.abi,
        functionName: "initialize",
        args: [process.env.LKS_WALLET]
    });

    console.log("initializeData:", initializeData);

    const proxyAdmin = await viem.deployContract("ProxyAdmin");
    console.log("ProxyAdmin:", proxyAdmin.address);

    const proxy = await viem.deployContract("TransparentUpgradeableProxy", [
        impl.address,
        proxyAdmin.address,
        initializeData
    ]);
    console.log("Proxy:", proxy.address);
}

main().catch(console.error);
