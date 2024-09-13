const socket = io(); // Conéctate al servidor de WebSocket

// Escucha el evento 'updateProducts' emitido por el servidor
socket.on("updateProducts", (products) => {
  const productsList = document.getElementById("products-list");
  productsList.innerHTML = ""; // Limpia la lista actual

  // Itera sobre los productos y agrega cada uno a la lista
  products.forEach((product) => {
    const li = document.createElement("li");
    li.textContent = `${product.title} - $${product.price}`; // Asegúrate de que las propiedades coincidan con las del objeto producto
    productsList.appendChild(li);
  });
});
