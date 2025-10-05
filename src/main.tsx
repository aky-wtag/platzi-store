import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./core/store/store.ts";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar.tsx";
import Products from "./pages/products/products.tsx";
import Product from "./components/product.tsx";
import ProductForm from "./components/productForm.tsx";
import Categories from "./pages/categories/category.tsx";
import CategoryForm from "./components/categoryForm.tsx";
import Category from "./components/category.tsx";
import LoginPage from "./pages/auth/LoginPage.tsx";
import Cart from "./pages/cart/cart.tsx";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product-detail/:id" element={<Product />} />
        <Route path="/product-detail/:id/edit" element={<ProductForm />} />
        <Route path="/product/create" element={<ProductForm />} />

        <Route path="/categories" element={<Categories />} />
        <Route path="/category-detail/:id" element={<Category />} />
        <Route path="/category-detail/:id/edit" element={<CategoryForm />} />
        <Route path="/category/create" element={<CategoryForm />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);
