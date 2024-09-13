const socket = io();

socket.on("updateProducts", (products) => {
  const productsList = document.getElementById("products-list");
  productsList.innerHTML = "";

  products.forEach((product) => {
    const li = document.createElement("li");
    li.textContent = `${product.title} - $${product.price}`;
    productsList.appendChild(li);
  });
});
