import express from "express";
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
app.get("/products", (req, res) => {
    // Retorna los productos como JSON
    res.json(products);
});
app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product)
        return res.status(404).json({ message: 'Producto no encontrado' });
    return res.json(product);
});
//Crear un nuevo producto
app.post("/products", (req, res) => {
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
app.patch("/products/:id", (req, res) => {
    const { id } = req.params;
    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex === -1)
        return res.status(404).json({ message: "Producto no encontrado" });
    const updatedProduct = {
        ...products[productIndex],
        ...req.body,
        updated_at: new Date(),
    };
    products[productIndex] = updatedProduct;
    res.json(updatedProduct);
});
app.listen(PORT, () => console.log("¡Aplicación de ejemplo escuchando en el puerto 3000!"));
