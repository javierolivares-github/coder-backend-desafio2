const fs = require("fs");

let products = [];
let pathFile = "./data/product.json";

// ADD PRODUCT
// Función para agregar productos al listado de productos:
const addProduct = (title, description, price, thumbnail, code, stock) => {
  // Objeto que almacena los valores que entran por parametro (el id es auto incremental):
  const newProduct = {
    id: products.length + 1,
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
  };

  // Condición que determina si una matriz incluye valores no-definidos,si los incluye muestra un mensaje de error y detiene la ejecución de la función addProduct:
  if (Object.values(newProduct).includes(undefined)) {
    console.log("Todos los campos son obligatorios.");
    return;
  }

  // Constante que almacena el resultado del método find.
  // El método find retorna el valor del primer elemento de una matriz para el cual exista una coincidencia.
  const productExists = products.find((product) => product.code === code);

  // Si el producto existe retorna el siguiente mensaje, y detiene la ejecución de la función addProduct.
  if (productExists) {
    console.log(`El producto ${title} con el código ${code} ya existe.`);
    return;
  }

  // Anexa el nuevo producto a la matriz de productos.
  products.push(newProduct);

  // Crea el archivo product.json.
  // Escribe dentro de product.json el valor de la matriz de productos en formato de cadena.
  fs.promises.writeFile(pathFile, JSON.stringify(products));
}


// GET PRODUCTS
// Función que permite obtener todos los productos.
const getProducts = async () => {
  // Lee el archivo product.json. Guarda su valor en la constante productJson.
  const productJson = await fs.promises.readFile(pathFile, "utf-8");

  if (productJson) {
    // Convierte la constante productJson en un objeto de JS. Guarda su valor en la variable products.
    products = JSON.parse(productJson);
  }

  // Muestra en consola el valor de la variable products.
  console.log(products)

  // Retorna el valor de la variable products.
  return products;
};


// GET PRODUCTS BY ID
// Obtiene información de un producto individual por su ID.
const getProductById = async (id) => {
  // Invoca la función getProducts.
  await getProducts();

  // Retorna el valor del primer elemento de la matriz de productos para el cual exista una coincidencia de IDs. Guarda el resultado en una constante llamada producto.
  const product = products.find( product => product.id === id);

  // Si el resultado de la constante product es falso muestra un mensaje de error en consola y corta la ejecución de la función.
  if(!product) {
    console.log(`No se encontró el producto con el id ${id}`);
    return;
  }

  // Muestra en consola el valor de la constante producto.
  console.log(product);

  // Devuelve el valor de la constante producto y corta la ejecución de la función.
  return product;
};


// UPDATE PRODUCT
// Actualiza la información de un producto individual a través de su ID. El parametro 'id' acepta el numero de ID y el parametro dataProduct acepta un objeto con las propiedades a actualizar.
const updateProduct = async (id, dataProduct) => {
  // Invoca la función getProducts.
  await getProducts();

  // Retorna el indice de el primer elemento en la matriz de productos donde el predicado sea verdadero, y retorna -1 de otro modo. Guarda el valor de lo anterior en una constante llamada index.
  const index = products.findIndex( product => product.id === id );

  // Actualiza el valor de el producto por su indice.
  products[index] = {
    ...products[index],
    ...dataProduct
  }

  // Convierte a cadena la nueva matriz de productos. Sobreescribe el archivo product.json con el valor de la matriz de productos.
  await fs.promises.writeFile(pathFile, JSON.stringify(products));

  // Muestra un mensaje de exito en consola
  console.log(`El producto con el ${id} fue actualizado con exito.}`)
}


// DELETE PRODUCTS BY ID
// Función para eliminar productos de la matriz de productos por su ID.
const deleteProduct = async (id) => {
  // Invocar la función getProducts.
  await getProducts();

  // Retorna los elementos de la matriz que cumplan con la condición especificada en la función callback. Filtra todos los productos cuyo ID no coincida con el ID especificado por parametro. Reescribe el valor de la matriz de productos.
  products = products.filter( product => product.id !== id);

  // Elimina el archivo product.json.
  await fs.promises.unlink(pathFile)

  // Crea el archivo product.json. Escribe dentro de product.json el valor de la matriz de productos actualizada en formato de cadena.
  fs.promises.writeFile(pathFile, JSON.stringify(products));

  // Muestra un mensaje de exito en consola
  console.log(`El producto con el ${id} fue eliminado con exito.}`)
}


// TESTS

// ADDING PRODUCTS
addProduct("Nike Pegasus 40 SE", "Zapatillas running para hombre", "129.99", "https://nike-clone-javier-olivares.vercel.app/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdlh98tbyp%2Fimage%2Fupload%2Fv1685887708%2Fthumbnail_562cb1af16.webp&w=640&q=75", "NP40SE");
addProduct("Nike Quest 5", "Zapatillas running para hombre", "76.99", "https://nike-clone-javier-olivares.vercel.app/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdlh98tbyp%2Fimage%2Fupload%2Fv1685887884%2Fthumbnail_eff486a70c.webp&w=640&q=75", "NQ5", 15);
addProduct("Nike Quest 5", "Zapatillas running para hombre", "76.99", "https://nike-clone-javier-olivares.vercel.app/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdlh98tbyp%2Fimage%2Fupload%2Fv1685887884%2Fthumbnail_eff486a70c.webp&w=640&q=75", "NQ5", 15);
addProduct("Jordan Stay Loyal 2", "Zapatillas Jordan para hombre", "116.99", "https://nike-clone-javier-olivares.vercel.app/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdlh98tbyp%2Fimage%2Fupload%2Fv1685833073%2Fthumbnail_63c509e967.webp&w=640&q=75", "JSL2", 10);
addProduct("Nike Quest 6", "Zapatillas running para hombre", "96.99", "https://nike-clone-javier-olivares.vercel.app/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdlh98tbyp%2Fimage%2Fupload%2Fv1685887884%2Fthumbnail_eff486a70c.webp&w=640&q=75", "NQ6", 18);



// GETTING PRODUCTS
getProducts();


// GETTING ONE PRODUCT
getProductById(1);


// UPDATTING ONE PRODUCT
updateProduct(3, {title: "Nike Quest 10"});

// DELETING ONE PRODUCT
deleteProduct(3);


