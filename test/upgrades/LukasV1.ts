import { ethers, upgrades } from 'hardhat';
import { expect } from 'chai';
import { LukasV1 } from '../../typechain-types';

describe('LukasV1', function () {
  let lukas: LukasV1;
  let deployer: any;
  let other: any;
  let other2: any;

  beforeEach(async function () {
    const signers = await ethers.getSigners();
    deployer = signers[0];
    other = signers[1];
    other2 = signers[2];

    const LukasFactory = await ethers.getContractFactory('LukasV1', deployer);
    lukas = (await upgrades.deployProxy(
      LukasFactory,
      [await deployer.getAddress()],
      { initializer: 'initialize' },
    )) as unknown as LukasV1;
  });

  it('should allow minting tokens and revert if MAX_SUPPLY is exceeded', async function () {
    const mintAmount = ethers.parseEther('50000');
    await lukas.mint(await other.getAddress(), mintAmount);
    expect(await lukas.balanceOf(await other.getAddress())).to.equal(
      mintAmount,
    );

    const MAX_SUPPLY = ethers.parseEther('42000000');
    const remainingMint = MAX_SUPPLY - (await lukas.totalSupply());
    await lukas.mint(await other.getAddress(), remainingMint);
    expect(await lukas.totalSupply()).to.equal(MAX_SUPPLY);

    await (
      expect(
        lukas.mint(await other.getAddress(), ethers.parseEther('1')),
      ) as any
    ).to.be.rejectedWith('LKS: Exceeds max supply');
  });

  it('should allow pausing and unpausing transfers', async function () {
    await lukas.transfer(await other.getAddress(), ethers.parseEther('100'));
    expect(await lukas.balanceOf(await other.getAddress())).to.equal(
      ethers.parseEther('100'),
    );

    await lukas.pause();

    await (
      expect(
        lukas.transfer(await other2.getAddress(), ethers.parseEther('50')),
      ) as any
    ).to.be.rejectedWith('LKS: Transfers paused');

    await lukas.unpause();
    await lukas.transfer(await other2.getAddress(), ethers.parseEther('50'));
    expect(await lukas.balanceOf(await other2.getAddress())).to.equal(
      ethers.parseEther('50'),
    );
  });

  it('should return 18 decimals', async function () {
    expect(await lukas.decimals()).to.equal(18n);
  });
});
