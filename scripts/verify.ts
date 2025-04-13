import { run } from 'hardhat';
import fs from 'fs';
import path from 'path';

async function main() {
  const filePath = path.join(__dirname, '..', 'deployment.json');
  if (!fs.existsSync(filePath)) {
    console.error('Deployment file not found at', filePath);
    process.exit(1);
  }

  const deploymentData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const implementationAddress = deploymentData.IMPLEMENTATION_ADDRESS;

  console.log(
    'Verifying implementation contract at address:',
    implementationAddress,
  );

  try {
    await run('verify:verify', {
      address: implementationAddress,
    });
    console.log('Verification successful!');
  } catch (error) {
    console.error('Verification failed:', error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script encountered an error:', error);
    process.exit(1);
  });
