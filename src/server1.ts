import express, { Request, Response } from "express";
import { mockProducts } from "./mockProducts.js";
import { v4 as uuidv4 } from "uuid";

//Inicializar servidor Express con tipado explícito
const app = express();
const PORT = 3000; // Puerto en el que escuchará el servidor

//Para parsear JSON
app.use(express.json());

// Array de productos
let products = [...mockProducts];

//Obtener todos los productos
app.get("/products", (req: Request, res: Response) => {
  // Retorna los productos como JSON
  res.json(products);
});

//Obtener los productos por id--> las funciones tienen que ser void. 
app.get("/products/:id", (req: Request, res: Response) => {

  //const { id } = req.params
  const product = products.find((p) => p.id === req.params.id);
  if (!product){
    res.status(404).json({ message: "Producto no encontrado" })
    return
  }else{

    res.json(product);
  }
});

//Crear un nuevo producto
app.post("/products", (req: Request, res: Response) => {
  //Extrae del cuerpo (body) de la petición los campos necesarios.
  // Se espera recibir: name (string), price (number), stock (number), is_active (boolean).
  const { name, price, stock, is_active } = req.body;

  const newProduct = {
    id: uuidv4(), // Genera un ID único
    name,
    price,
    stock,
    is_active, // Estado activo/inactivo del producto.
    created_at: new Date(), // Fecha y hora actual cuando se crea el producto.
    updated_at: new Date(), // Fecha y hora actual (igual al crear el producto)
  };
  //Añado un nuevo producto
  products.push(newProduct);
  // devuelvo el estado de crear producto
  res.status(201).json(newProduct);
});

app.patch("/products/:id", (req: Request, res: Response) => {
  const { id } = req.params; // ID del producto a actualizar
  const productIndex = products.findIndex((p) => p.id === id); // Buscar producto en array

  // Si el producto no se encuentra, devolver un error 404
  if (productIndex === -1)
    return res.status(404).json({ message: "Producto no encontrado" });

  // Crear objeto actualizado combinando datos antiguos y nuevos enviados por el cliente
  const updatedProduct = {
    ...products[productIndex],
    ...req.body,
    updated_at: new Date(),
  };

  // Guarda el producto actualizado en el array
  products[productIndex] = updatedProduct;

  // Retorna producto actualizado al cliente
  res.json(updatedProduct);
});

//Eliminar un producto por su ID
app.delete("/products/:id", (req: Request, res: Response) => {
  // Obtenemos el ID del producto desde la URL
  const id = req.params.id;

  // Filtramos el array para eliminar el producto con el ID indicado
  const newProducts = products.filter((p) => p.id !== id);

  // Si la longitud del array no cambió, significa que no se encontró el producto
  if (newProducts.length === products.length) {
    return res
      .status(404)
      .json({ message: "Producto no encontrado para eliminar." });
  }

  // Actualizamos el array original con los productos restantes
  products = newProducts;

  // Retornamos un mensaje indicando éxito en la eliminación
  res.json({ message: "Producto eliminado con éxito." });
});




// Inicia el servidor Express escuchando en el puerto definido
app.listen(PORT, () =>
  console.log("¡Aplicación de ejemplo escuchando en el puerto 3000!")
);


//logger--> Morgan - Debug