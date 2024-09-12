const socket = io();

//  actualiza la lista de productos
socket.on("updateProducts", (products) => {
  const productsList = document.getElementById("products-list");
  // Limpia la lista actual
  productsList.innerHTML = "";

  products.forEach((product) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${product.name} - ${product.price}`;
    productsList.appendChild(listItem);
  });
});
