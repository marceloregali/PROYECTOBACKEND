export default class ProductRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    try {
      return await this.model.create(data);
    } catch (error) {
      throw new Error(`Error al crear el producto: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const product = await this.model.findById(id);
      if (!product) throw new Error("Producto no encontrado");
      return product;
    } catch (error) {
      throw new Error(`Error al obtener el producto por ID: ${error.message}`);
    }
  }

  async update(id, data) {
    try {
      const updatedProduct = await this.model.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!updatedProduct)
        throw new Error("Producto no encontrado para actualizar");
      return updatedProduct;
    } catch (error) {
      throw new Error(`Error al actualizar el producto: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const deletedProduct = await this.model.findByIdAndDelete(id);
      if (!deletedProduct)
        throw new Error("Producto no encontrado para eliminar");
      return deletedProduct;
    } catch (error) {
      throw new Error(`Error al eliminar el producto: ${error.message}`);
    }
  }

  async findAll(query = {}) {
    try {
      return await this.model.find(query);
    } catch (error) {
      throw new Error(`Error al obtener todos los productos: ${error.message}`);
    }
  }
}
