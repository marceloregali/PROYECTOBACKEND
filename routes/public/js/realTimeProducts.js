const socket = io();

// Actualizar la lista de productos cuando llegue el evento 'updateProducts'
socket.on("updateProducts", (products) => {
  const productsList = document.getElementById("products-list");
  productsList.innerHTML = ""; // Limpiar la lista existente

  products.forEach((product) => {
    const li = document.createElement("li");
    li.textContent = `${product.title} - $${product.price}`; // Agregar el nombre y precio del producto
    productsList.appendChild(li); // Añadir el producto a la lista
  });
});

// Formulario para agregar un producto
const productForm = document.getElementById("add-product-form");
productForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

  const title = document.getElementById("title").value; // Obtener el título del formulario
  const price = document.getElementById("price").value; // Obtener el precio del formulario

  // Emitir el evento 'addProduct' con los datos del producto
  socket.emit("addProduct", { title, price });

  // Limpiar el formulario después de agregar el producto
  productForm.reset();
});
