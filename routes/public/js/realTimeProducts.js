const socket = io();

//  actualizo la lista de los  productos
socket.on("updateProducts", (products) => {
  const productsList = document.getElementById("products-list");
  productsList.innerHTML = "";

  products.forEach((product) => {
    const li = document.createElement("li");
    li.textContent = `${product.title} - $${product.price}`;
    productsList.appendChild(li);
  });
});

//  formulario de los productos
const productForm = document.getElementById("add-product-form");
productForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;

  socket.emit("addProduct", { title, price });

  productForm.reset();
});
