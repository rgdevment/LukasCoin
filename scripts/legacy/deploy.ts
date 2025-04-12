import {viem} from 'hardhat';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
    const initialAdmin = process.env.LKS_WALLET;
    const lukas = await viem.deployContract(process.env.CONTRACT_NAME!, [
        initialAdmin,
    ]);
    console.log(`✅ LKS deployed to: ${lukas.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
