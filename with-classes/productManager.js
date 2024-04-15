const fs = require("fs");

class ProductManager {
  // Establece la ruta al archivo JSON e inicializa un array vacío para los productos.
  constructor(pathFile) {
    this.pathFile = pathFile;
    this.products = [];
  }

  // LOAD PRODUCTS
  // Carga de forma asíncrona los productos desde el archivo JSON en el array products.
  async loadProducts() {
    try {
      const productJson = await fs.promises.readFile(this.pathFile, "utf-8");
      if (productJson) {
        this.products = JSON.parse(productJson);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    }
  }

  // SAVE PRODUCTS
  // Guarda de forma asíncrona el estado actual de los productos de vuelta al archivo JSON.
  async saveProducts() {
    try {
      await fs.promises.writeFile(this.pathFile, JSON.stringify(this.products));
    } catch (error) {
      console.error("Error saving products:", error);
    }
  }

  // ADD PRODUCTS
  // Agrega un nuevo producto al array products y lo guarda en el archivo. Verifica los campos requeridos y si ya existe un producto con el mismo código.
  async addProduct(title, description, price, thumbnail, code, stock = 0) {
    const newProduct = {
      id: this.products.length + 1,
      title,
      description,
      price: parseFloat(price),
      thumbnail,
      code,
      stock,
    };

    if (Object.values(newProduct).includes(undefined)) {
      console.log("All fields are required.");
      return;
    }

    const productExists = this.products.find((product) => product.code === code);

    if (productExists) {
      console.log(`Product ${title} with code ${code} already exists.`);
      return;
    }

    this.products.push(newProduct);
    await this.saveProducts();
  }

  // GET PRODUCTS
  // Obtiene todos los productos desde el array de products despúes de cargar los productos desde el archivo.
  async getProducts() {
    await this.loadProducts();
    console.log(this.products);
    return this.products;
  }

  // GET PRODUCT BY ID
  // Obtiene un producto por su ID desde el array products después de cargar los productos desde el archivo.
  async getProductById(id) {
    await this.loadProducts();

    const product = this.products.find((product) => product.id === id);

    if (!product) {
      console.log(`Product with ID ${id} not found.`);
      return;
    }

    console.log(product);
    return product;
  }

  // UPDATE PRODUCT BY ID
  // Actualiza un producto existente con nuevos datos, identificado por su ID. Guarda los cambios en el archivo.
  async updateProduct(id, dataProduct) {  
    await this.loadProducts();

    const index = this.products.findIndex((product) => product.id === id);

    if (index === -1) {
      console.log(`Product with ID ${id} not found.`);
      return;
    }

    this.products[index] = {
      ...this.products[index],
      ...dataProduct
    };

    await this.saveProducts();
    console.log(`Product with ID ${id} updated successfully.`);
  }

  // DELETE PRODUCT BY ID
  async deleteProduct(id) {
    await this.loadProducts();

    const index = this.products.findIndex((product) => product.id === id);

    if (index === -1) {
      console.log(`Product with ID ${id} not found.`);
      return;
    }

    this.products.splice(index, 1);
    await this.saveProducts();
    console.log(`Product with ID ${id} deleted successfully.`);
  }
}

// TESTING PROCESS:
const productManager = new ProductManager("./data/product.json");

(async () => {
  await productManager.addProduct("Nike Pegasus 40 SE", "Men's running shoes", "129.99", "https://example.com/image.jpg");
  await productManager.addProduct("Nike Quest 5", "Men's running shoes", "76.99", "https://example.com/image.jpg", "NQ5", 15);
  await productManager.addProduct("Nike Quest 5", "Men's running shoes", "76.99", "https://example.com/image.jpg", "NQ5", 15);
  await productManager.addProduct("Jordan Stay Loyal 2", "Men's Jordan shoes", "116.99", "https://example.com/image.jpg", "JSL2", 10);
  await productManager.addProduct("Nike Quest 6", "Men's running shoes", "96.99", "https://example.com/image.jpg", "NQ6", 18);

  await productManager.getProducts();

  await productManager.getProductById(1);

  await productManager.updateProduct(3, { title: "Nike Quest 10" });

  await productManager.deleteProduct(3);
})();
