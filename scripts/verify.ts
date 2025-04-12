import { run } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
    await run("verify:verify", {
        address: process.env.IMPLEMENTATION_ADDRESS!,
        constructorArguments: [],
        contract: "contracts/upgrades/LukasV1.sol:LukasV1",
    });

    await run("verify:verify", {
        address: process.env.PROXY_ADDRESS!,
        constructorArguments: [
            process.env.IMPLEMENTATION_ADDRESS!,
            process.env.PROXY_ADMIN_ADDRESS!,
            process.env.INITIALIZER_DATA!
        ],
        contract: "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol:TransparentUpgradeableProxy",
    });

    console.log("✅ Verificación completada en Polygonscan");
}

main().catch(console.error);
