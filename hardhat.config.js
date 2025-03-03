/** @type import('hardhat/config').HardhatUserConfig */

//const { network } = require('hardhat');

require("@nomiclabs/hardhat-waffle")

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      chainId: 31337,
    },
  },
};
