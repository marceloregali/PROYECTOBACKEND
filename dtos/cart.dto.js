class CartDTO {
  constructor(cart) {
    this.id = cart._id;
    this.userId = cart.userId;
    this.products = cart.products.map((product) => ({
      productId: product.product._id,
      name: product.product.name,
      price: product.product.price,
      quantity: product.quantity,
    }));
  }
}

export default CartDTO;
