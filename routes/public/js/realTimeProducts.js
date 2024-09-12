const socket = io();

socket.on("updateProducts", (products) => {
  const productsList = document.getElementById("products-list");
  productsList.innerHTML = ""; // Limpia la lista actual

  products.forEach((product) => {
    const li = document.createElement("li");
    li.textContent = `${product.name} - ${product.price}`;
    productsList.appendChild(li);
  });
});
