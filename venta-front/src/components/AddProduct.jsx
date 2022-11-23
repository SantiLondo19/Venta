import { Button } from "@chakra-ui/react";
import { useState } from "react";
import "./producto.css";


export const AddProduct = ({submitProduct}) => {
  const [product, setProduct] = useState({
    id: "",
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
      id: "",
      seller: "",
      price: "",
      token: "",
      stock: "",
    });
    submitProduct(product);
  };

  return (
    <div className="contenedor">
      <h1 className="titulo">Agregar Producto</h1>
      <div className="formulario">
        <form onSubmit={handleSubmit}>
          <label>
            Id:
            <input
              type="text"
              name="id"
              onChange={onChange}
              value={product.id}
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
