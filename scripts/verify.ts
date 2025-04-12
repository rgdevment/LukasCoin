import {run} from 'hardhat';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
    await run('verify:verify', {
        address: process.env.CONTRACT_ADDRESS!,
        constructorArguments: [process.env.LKS_WALLET!],
        contract: `contracts/${process.env.CONTRACT_NAME}.sol:${process.env.CONTRACT_NAME}`,
    });
    console.log('✅ Verificado en Polygonscan');
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
