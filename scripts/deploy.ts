import hre from 'hardhat';
const { ethers, upgrades } = hre;
import fs from 'fs';
import { BigNumber } from '@ethersproject/bignumber';
import { keccak256, toUtf8Bytes } from 'ethers';

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying with the account: ${deployer.address}`);

  const LukasFactory = await ethers.getContractFactory('LukasV1');

  const deployOptions: any = {
    initializer: 'initialize',
    kind: 'uups',
    gasLimit: 10000000n,
  };
  const proxy = await upgrades.deployProxy(
    LukasFactory,
    [deployer.address],
    deployOptions,
  );

  const proxyAddress = await proxy.getAddress();
  console.log(`Proxy deployed at: ${proxyAddress}`);

  await new Promise((resolve) => setTimeout(resolve, 30000));

  const slot = BigNumber.from(
    keccak256(toUtf8Bytes('eip1967.proxy.implementation')),
  ).sub(1);
  const implSlotValue = await ethers.provider.getStorage(
    proxyAddress,
    slot.toHexString(),
  );
  console.log('Implementation slot value:', implSlotValue);

  const implementationAddress =
    await upgrades.erc1967.getImplementationAddress(proxyAddress);
  const proxyAdminAddress =
    await upgrades.erc1967.getAdminAddress(proxyAddress);

  console.log(`Implementation deployed at: ${implementationAddress}`);
  console.log(`Proxy admin address: ${proxyAdminAddress}`);

  const deploymentData = {
    CONTRACT_NAME: 'Lukas',
    PROXY_ADDRESS: proxyAddress,
    IMPLEMENTATION_ADDRESS: implementationAddress,
    PROXY_ADMIN_ADDRESS: proxyAdminAddress,
  };

  fs.writeFileSync('deployment.json', JSON.stringify(deploymentData, null, 2));
  console.log('Deployment data saved in deployment.json');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error during deployment:', error);
    process.exit(1);
  });
