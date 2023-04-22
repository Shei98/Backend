import { error } from "console";
import { promises as fs } from "fs";

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
    }

    async addProduct(productos) {
        // if (this.products.find((producto) => producto.code == product.code)) {
        //     return "Producto existente";
        // } else {
        //     const productsJSON = JSON.stringify(product);
        //     console.log(productsJSON);
        //     let newId;
        //     productsJSON.length === 0
        //         ? (newId = 1)
        //         : (newId = productsJSON[productsJSON.length - 1].id + 1);
        //     const newObj = { ...Object, id: newId };
        //     productsJSON.push(newObj);
        //     await this.writeFile(productsJSON);
        //     return newObj.id;
        // }

        const prod1 = { nombre: "Budin"}
        const addProduct = async (ruta) =>{
try{
    await fs.writeFile(ruta, JSON.stringify(productos))
    const contenido = await fs.readFile(ruta, 'utf-8')
    const aux = JSON.parse(contenido)
    aux.push(prod1)
    console.log(aux)
    await fs.writeFile(ruta, JSON.stringify(aux))
    let contenido1= await fs.readFile(ruta, 'utf-8')
    console.log(contenido1);;
}catch (error){
    return error
}
        }
    }

    async getProducts() {
        const products = await fs.readFile(this.path, "utf-8");
        const prods = JSON.parse(products);
        console.log(prods);
    }

    async getProductById(id) {
        const product = this.products.find((producto) => producto.id == id);

        if (product) {
            //Objeto o undefined
            return product;
        }

        return "Not Found";
    }

    async updateProduct(product) {
        const RUTA_ARCHIVO = "./info.txt";
        this.products.push(Product);
        const productos = [];
        const consultasTXT = async (ruta) => {
            await fs.writeFile(ruta, JSON.stringify(productos));
            let contenido = await fs.readFile(ruta, "utf-8");
            console.log(contenido);
            await fs.appendFile(ruta, "Producto actualizado");
            contenido = await fs.readFile(ruta, "utf-8");
            console.log(contenido);
        };

        consultasTXT(RUTA_ARCHIVO);
    }
    // if (fs.existsSync(this.RUTA_ARCHIVO)){
    //     let contenido = fs.readFileSync(RUTA_ARCHIVO, 'utf-8')
    //     console.log(contenido);
    //     fs.appendFileSync(RUTA_ARCHIVO, ` Nuevo producto `)
    // } else {
    //     fs.writeFileSync(RUTA_ARCHIVO, "")
    // }

    async deleteProduct() {
        const RUTA_ARCHIVO = "./info.txt";
        const consultasTXT = async (ruta) => {
            await fs.product.unlink(ruta);
            console.log("Borrado");
        };
    }
}

class Product {
    constructor(
        title = "",
        description = "",
        price = 0,
        thumbnail = "",
        code = "",
        stock = 0
    ) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.id = Product.incrementID();
    }

    static incrementID() {
        if (this.idIncrement) {
            this.idIncrement++;
        } else {
            this.idIncrement = 1;
        }
        return this.idIncrement;
    }
}

const product1 = new Product("Arroz", "Arroz", 150, "", "A123", 20);
const product2 = new Product("Fideos", "Fideos", 250, "", "F123", 10);
const product3 = new Product("Azucar", "Azucar", 320, "", "A456", 30);
const product4 = new Product("Te", "Te", 120, "", "T123", 40);
const product5 = new Product();

const productManager = new ProductManager("./info.txt");
productManager.addProduct(product1);
productManager.addProduct(product2);
console.log(productManager.addProduct(product1));
console.log(productManager.getProductById(2));
console.log(productManager.getProductById(5));

await productManager.getProducts();
