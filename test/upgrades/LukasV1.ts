import { ethers, upgrades } from "hardhat";
import { expect } from "chai";
import { LukasV1 } from "../../typechain-types";

describe("LukasV1", function () {
  let lukas: LukasV1;
  let deployer: any;
  let other: any;

  beforeEach(async function () {
    const signers = await ethers.getSigners();
    deployer = signers[0];
    other = signers[1];

    const LukasFactory = await ethers.getContractFactory("LukasV1", deployer);
    lukas = (await upgrades.deployProxy(
        LukasFactory,
        [await deployer.getAddress()],
        { initializer: "initialize" }
    )) as unknown as LukasV1;
  });

  it("should initialize with correct initial supply and assign roles", async function () {
    const initialSupply = ethers.parseEther("1000000"); // 1,000,000 tokens
    const deployerAddress = await deployer.getAddress();

    expect(await lukas.balanceOf(deployerAddress)).to.equal(initialSupply);

    const DEFAULT_ADMIN_ROLE = await lukas.DEFAULT_ADMIN_ROLE();
    const MINTER_ROLE = await lukas.MINTER_ROLE();
    const UPGRADER_ROLE = await lukas.UPGRADER_ROLE();

    expect(await lukas.hasRole(DEFAULT_ADMIN_ROLE, deployerAddress)).to.be.true;
    expect(await lukas.hasRole(MINTER_ROLE, deployerAddress)).to.be.true;
    expect(await lukas.hasRole(UPGRADER_ROLE, deployerAddress)).to.be.true;
  });

  it("should allow minting tokens and revert if MAX_SUPPLY is exceeded", async function () {
    const mintAmount = ethers.parseEther("50000");
    await lukas.mint(await other.getAddress(), mintAmount);
    expect(await lukas.balanceOf(await other.getAddress())).to.equal(mintAmount);

    const MAX_SUPPLY = ethers.parseEther("12000000");
    const currentSupply = await lukas.totalSupply();
    const remainingMint = MAX_SUPPLY - currentSupply;
    await lukas.mint(await other.getAddress(), remainingMint);
    expect(await lukas.totalSupply()).to.equal(MAX_SUPPLY);

    await expect(lukas.mint(await other.getAddress(), ethers.parseEther("1")))
        .to.be.rejectedWith("LKS: Exceeds max supply");
  });

  it("should allow users to burn their tokens", async function () {
    const deployerAddress = await deployer.getAddress();

    const burnAmount = ethers.parseEther("10000");
    await lukas.burn(burnAmount);

    const expectedBalance = ethers.parseEther("1000000") - (burnAmount);
    expect(await lukas.balanceOf(deployerAddress)).to.equal(expectedBalance);

    const approveAmount = ethers.parseEther("5000");
    await lukas.approve(await other.getAddress(), approveAmount);
    await lukas.connect(other).burnFrom(deployerAddress, approveAmount);
    const finalBalance = expectedBalance - (approveAmount);
    expect(await lukas.balanceOf(deployerAddress)).to.equal(finalBalance);
  });
});
