const socket = io();

// Actualizo la lista de productos
socket.on("updateProducts", (products) => {
  const productsList = document.getElementById("products-list");
  // Limpio la lista actual de los productos
  productsList.innerHTML = "";

  products.forEach((product) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${product.title} - ${product.price}`;
    productsList.appendChild(listItem);
  });
});
