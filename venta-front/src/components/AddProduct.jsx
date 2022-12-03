import { Button } from "@chakra-ui/react";
import { useState } from "react";
import "./producto.css";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

export const AddProduct = () => {
  const [product, setProduct] = useState({
    productId: "",
    seller: "",
    price: "",
    token: "",
    stock: "",
  });
  const onChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProduct({
      productId: "",
      seller: "",
      price: "",
      token: "",
      stock: "",
    });
    write?.();
  };

  const { config } = usePrepareContractWrite({
    address: "0x21D6a1AFB21D1030EDde3d9ce527055761a18352w",
    abi: [
      {
        name: "submitProduct",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
          {
            internalType: "uint256",
            name: "productId",
            type: "uint256",
          },
          {
            internalType: "address payable",
            name: "seller",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "token",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "stock",
            type: "uint256",
          },
        ],
        outputs: [],
      },
    ],
    functionName: "submitProduct",
    args: [
      parseInt[product.productId],
      product.seller,
      parseInt[product.price],
      product.token,
      parseInt[product.stock],
    ],
  });
  const { data, write } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })


  return (
    <div className="contenedor">
      <h1 className="titulo">Agregar Producto</h1>
      <div className="formulario">
        <form onSubmit={handleSubmit}>
          <label>
            Id:
            <input
              type="text"
              name="productId"
              onChange={onChange}
              value={product.productId}
            />
          </label>
          <label>
            Dirección vendedor:
            <input
              type="text"
              name="seller"
              onChange={onChange}
              value={product.seller}
            />
          </label>
          <label>
            Precio en Wei:
            <input
              type="text"
              name="price"
              onChange={onChange}
              value={product.price}
            />
          </label>
          <label>
            Dirección del token:
            <input
              type="text"
              name="token"
              onChange={onChange}
              value={product.token}
            />
          </label>
          <label>
            Cantidad del producto:
            <input
              type="text"
              name="stock"
              onChange={onChange}
              value={product.stock}
            />
          </label>
          <Button color="black" bg="ButtonShadow" type="submit">
            Agregar Producto
          </Button>
        </form>
      </div>
    </div>
  );
};
