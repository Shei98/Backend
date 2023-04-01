class ProductManager {
  getProducts() {
    this.products = [];
  }


}

class Product {
  addProduct(title, description, price, thumbail, code, stock) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbail;
    this.code = code;
    this.stock = stock;

    try {
      let newId;
      Product.length === 0
        ? (newId = 1)
        : (newId = Product[Product.length - 1].id + 1);
      const newObj = { ...Product, id: newId };
      Product.push(newObj);
      return newObj.id;
    } catch (err) {
      console.log(err);
    }
  }

  getProductById() {
      try {
        const obj = Product.find((obj) => obj.id === Product);
        return obj ? obj : null;
      } catch (err) {
        console.log(err);
      }
  }

}

const product1 = new Product(
  "budin de banana",
  "budin de banana con extracto y fruta",
  "$400",
  "hattps://www.recetasgratis.net/receta-de-budin-de-banana-con-aceite-74758.html",
  "34A",
  12
);
const product2 = new Product(
  "budin de chocolate",
  "budin de chocolate con trozos de chocolate",
  "$500",
  "https://www.paulinacocina.net/budin-de-chocolate-con-sorpresa/6810",
  "12B",
  8
);
const product3 = new Product(
  "budin de vainilla",
  "budin sabroso de vainilla",
  "$350",
  "https://www.paulinacocina.net/budin-de-vainilla/26485",
  "43C",
  11
);

const productManager = new ProductManager();
productManager.getProducts.push(product1);
productManager.getProducts.push(product2);
productManager.getProducts.push(product3);
