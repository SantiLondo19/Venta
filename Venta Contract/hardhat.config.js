require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ganache");

require("dotenv").config();

module.exports = {
  solidity: "0.8.17",
  networks: {
    localganache: {
      url: process.env.PROVIDER_URL,
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  }
};