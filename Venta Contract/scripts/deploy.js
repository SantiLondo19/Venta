const fs = require('fs');
require("dotenv").config();

async function main() {

  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Venta = await ethers.getContractFactory("Venta");
  const contract = await Venta.deploy();
  await contract.deployed();
  console.log("Contract deployed at:", contract.address);
  let config = `export const abiVentas = "${contract.address}" `;
  let data = JSON.stringify(config);
  fs.writeFileSync("../config.js", JSON.parse(data));

  fs.copyFile("./artifacts/contracts/Venta.sol/Venta.json", "../Venta.json", (err) => {
    if (err) {
      console.log("error ocurred: ", err);
    }
  })
}

main()
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
