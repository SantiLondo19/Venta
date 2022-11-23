// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Venta is Ownable {

    mapping(uint => Product) public productMapping;
    mapping(uint => Ticket) public productTicketsMapping; //(productId, buyer, blockNumber, product.stock) => Ticket
    uint[] private productsIds;
    uint[] private ticketsIds;


    event ProductSubmitted(uint productId);
    event ProductPaid(uint productId, uint ticketId);
    event PayReleased(uint productId, uint tickerId);
    event ProductRefunded(uint productId, uint ticketId);
    event StockAdded(uint productId, uint stockAdded);
    event StockRemoved(uint productId, uint stockRemoved);


    struct Product {
        uint price; //In GWEI 
        address payable seller;
        address token; //Contract address
        bool enabled;
        uint stock;
    }

    struct Ticket {
        uint productId;
        Status status;
        address payable buyer;
        address tokenPaid; //Guarda la dirección del contrato
        uint pricePaid; //Guarda el precio pagado 
    }

    enum Status {
        WAITING,
        SOLD
    }

    ///Retorna los ids de los productos
    function getProductsIds() public view returns (uint[] memory) {
        return productsIds;
    }

    /// Devuelve los tickets 
    function getTicketsIds() public view returns (uint[] memory) {
        return ticketsIds;
    }


    ///Devuelve los tickets por id de producto
    function getTicketsIdsByProduct(uint productId) public view returns (uint[] memory) {
        uint count = 0;
        for (uint256 i = 0; i < ticketsIds.length; i++) {
            if (productTicketsMapping[ticketsIds[i]].productId == productId) {
                count++;
            }
        }

        uint index = 0;
        uint[] memory _ticketsIds = new uint[](count);
        for (uint256 i = 0; i < ticketsIds.length; i++) {
            if (productTicketsMapping[ticketsIds[i]].productId == productId) {
                _ticketsIds[index] = ticketsIds[i];
                index++;
            }
        }

        return _ticketsIds;
    }

    /// Regresa los tickets creados por el comprador
    function getTicketsIdsByAddress(address user) public view returns (uint[] memory) {
        uint count = 0;
        for (uint256 i = 0; i < ticketsIds.length; i++) {
            if (productTicketsMapping[ticketsIds[i]].buyer == user) {
                count++;
            }
        }

        uint index = 0;
        uint[] memory _ticketsIds = new uint[](count);
        for (uint256 i = 0; i < ticketsIds.length; i++) {
            if (productTicketsMapping[ticketsIds[i]].buyer == user) {
                _ticketsIds[index] = ticketsIds[i];
                index++;
            }
        }

        return _ticketsIds;
    }




    /// token Dirección del token
    /// stock unidades del producto
    // Crear producto
    function submitProduct(uint productId, address payable seller, uint price, address token, uint stock) public onlyOwner {
        require(productId != 0, "Ingrese un id mayor a 0");
        require(price != 0, "Ingrese un precio mayor a 0");
        require(seller != address(0), "Ingrese una direccion valida");
        require(stock != 0, "Ingrese un stock mayor a 0");
        require(productMapping[productId].seller == address(0), "Producto ya existe");
        Product memory product = Product(price, seller, token, true, stock);
        productMapping[productId] = product;
        productsIds.push(productId);
        emit ProductSubmitted(productId);
    }

    function payProduct(uint productId) public payable {
        Product memory product = productMapping[productId];
        require(product.seller != address(0), "Producto no existe");
        require(product.enabled, "El producto esta deshabilitado");
        require(product.stock != 0, "No hay stock del producto");
        require(msg.value == product.price * 2, "El valor ingresado no es el doble");
        if (product.token == address(0)) {
            require(msg.value == product.price, "!msg.value");
        }


        //Create ticket
        uint ticketId = uint(keccak256(abi.encode(productId, msg.sender, block.number, product.stock)));
        productTicketsMapping[ticketId] = Ticket(productId, Status.WAITING, payable(msg.sender), product.token, product.price);
        ticketsIds.push(ticketId);

        product.stock -= 1;
        productMapping[productId] = product;
        emit ProductPaid(productId, ticketId);
    }

    ///Release pay Envia dinero al vendedor
    ///ticketId Id del ticket a pagar
    function releasePay(uint ticketId) public onlyOwner {
       Ticket memory ticket = productTicketsMapping[ticketId];
        require(ticket.status == Status.WAITING, "El ticket ya fue pagado");
        require(ticket.buyer != address(0), "El ticket no existe");

        Product memory product = productMapping[ticket.productId];
        require(product.seller != address(0), "Producto no existe");
        require(product.enabled, "El producto esta deshabilitado");
        payable(ticket.buyer).transfer(ticket.pricePaid / 2);
        payable(product.seller).transfer(ticket.pricePaid);


        ticket.status = Status.SOLD;
        productTicketsMapping[ticketId] = ticket;
        emit PayReleased(ticket.productId, ticketId);
    }

    /// Reembolsa el producto (envía el dinero al comprador)
    /// ticketId El ticket devuelto en payProduct
    // Debe existir un método para abortar la compra, retornando los recursos al comprador
    function refundProduct(uint ticketId) public onlyOwner {
       Ticket memory ticket = productTicketsMapping[ticketId];
        require(ticket.status == Status.WAITING, "El ticket ya fue pagado");
        require(ticket.productId != 0, "El ticket no existe");

        payable(ticket.buyer).transfer(ticket.pricePaid);

        ticket.status = Status.SOLD;
        productTicketsMapping[ticketId] = ticket;
        emit ProductRefunded(ticket.productId, ticketId);
    }

    /// Añadir stock a un producto con el id y la cantidad a añadir
    function addStock(uint productId, uint stockToAdd) public onlyOwner {
        Product memory product = productMapping[productId];
        require(productId != 0, "Ingrese un id valido");
        require(stockToAdd != 0, "Ingrese un numero mayor a 0");
        require(product.seller != address(0), "Producto no existe");
        product.stock += stockToAdd;
        productMapping[productId] = product;
        emit StockAdded(productId, stockToAdd);
    }

    /// Quitar stock de un producto por id y la cantidad a remover
    function removeStock(uint productId, uint stockToRemove) public onlyOwner {
        Product memory product = productMapping[productId];
        require(productId != 0, "Ingrese un id valido");
        require(product.stock >= stockToRemove, "No hay stock suficiente");
                require(product.seller != address(0), "Producto no existe");
        product.stock -= stockToRemove;
        productMapping[productId] = product;
        emit StockRemoved(productId, stockToRemove);
    }
    
}
