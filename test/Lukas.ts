import {expect, use} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {viem} from 'hardhat';
import {parseEther} from 'viem';

use(chaiAsPromised);

describe('Lukas Token (LKS)', () => {
    let lukas: any;
    let admin: any;
    let user: any;
    let anotherAccount: any;

    before(async () => {
        [admin, user, anotherAccount] = await viem.getWalletClients();
    });

    beforeEach(async () => {
        lukas = await viem.deployContract('Lukas', [admin.account.address]);
    });

    it('Should have correct initial setup', async () => {
        expect(await lukas.read.name()).to.equal('Lukas');
        expect(await lukas.read.symbol()).to.equal('LKS');
        expect(await lukas.read.decimals()).to.equal(18);
    });

    it('Should mint initial supply to admin', async () => {
        const balance = await lukas.read.balanceOf([admin.account.address]);
        expect(balance).to.equal(parseEther('1200000'));
    });

    it('Should allow minting up to max supply', async () => {
        const amount = parseEther('10800000');
        await lukas.write.mint([user.account.address, amount]);

        const totalSupply = await lukas.read.totalSupply();
        expect(totalSupply).to.equal(parseEther('12000000'));
    });

    it('Should prevent exceeding max supply', async () => {
        const excessiveAmount = parseEther('12900001');
        await expect(
            lukas.write.mint([user.account.address, excessiveAmount]),
        ).to.be.rejectedWith('Exceeds max supply');
    });

    it('Should allow token transfers', async () => {
        const transferAmount = parseEther('1000');
        await lukas.write.transfer([user.account.address, transferAmount]);

        const userBalance = await lukas.read.balanceOf([user.account.address]);
        expect(userBalance).to.equal(transferAmount);
    });

    it('Should allow burning tokens', async () => {
        const burnAmount = parseEther('500');
        await lukas.write.burn([burnAmount]);

        const totalSupply = await lukas.read.totalSupply();
        expect(totalSupply).to.equal(parseEther('1199500'));
    });

    it('Should prevent non-minters from minting', async () => {
        await expect(
            lukas.write.mint([user.account.address, parseEther('100')], {
                account: user.account.address,
            }),
        ).to.be.rejectedWith('AccessControlUnauthorizedAccount');
    });

    it('Should transfer MINTER_ROLE correctly', async () => {
        const MINTER_ROLE = await lukas.read.MINTER_ROLE();

        await lukas.write.grantRole([MINTER_ROLE, anotherAccount.account.address]);

        await lukas.write.mint(
            [anotherAccount.account.address, parseEther('1000')],
            {account: anotherAccount.account.address},
        );

        const balance = await lukas.read.balanceOf([
            anotherAccount.account.address,
        ]);
        expect(balance).to.equal(parseEther('1000'));
    });
});
