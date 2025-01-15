import ProductRepository from "../repositories/product.repository.js";

class ProductService {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async createProduct(data) {
    try {
      return await this.productRepository.create(data);
    } catch (error) {
      throw new Error(`Error al crear el producto: ${error.message}`);
    }
  }

  async getProductById(id) {
    try {
      return await this.productRepository.findById(id);
    } catch (error) {
      throw new Error(`Error al obtener el producto por ID: ${error.message}`);
    }
  }

  async updateProduct(id, data) {
    try {
      return await this.productRepository.update(id, data);
    } catch (error) {
      throw new Error(`Error al actualizar el producto: ${error.message}`);
    }
  }

  async deleteProduct(id) {
    try {
      return await this.productRepository.delete(id);
    } catch (error) {
      throw new Error(`Error al eliminar el producto: ${error.message}`);
    }
  }

  async getAllProducts(query = {}) {
    try {
      return await this.productRepository.findAll(query);
    } catch (error) {
      throw new Error(`Error al obtener todos los productos: ${error.message}`);
    }
  }
}

export default new ProductService();
