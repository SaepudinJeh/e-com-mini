import { createBrowserRouter } from "react-router-dom";
import LayoutMenu from "../components/layouts/index.layout";
import ProductPageAdmin from "../pages/admins/product.page";
import CreateProductPageAdmin from "../pages/admins/create_product.page";
import UpdateProductPageAdmin from "../pages/admins/update_product.page";
import CustomersPageAdmin from "../pages/admins/customer.page";
import LoginPage from "../pages/auth/login.page";
import RegisterPage from "../pages/auth/register.page";
import ProtectedAdminRoute from "./protected_admin.route";
import ProtectedRoute from "./protected.route";
import Homepage from "../pages/homepage.page";
import CartPage from "../pages/cart.page";
import TransactionsPage from "../pages/transaction.page";
import OrdersPageAdmin from "../pages/admins/orders.page";

const router = createBrowserRouter([
    {
        path: '/',
        element: <LayoutMenu />,
        children: [
            {
                path: '/',
                element: <ProtectedRoute element={<Homepage />} /> 
            },
            {
                path: '/cart',
                element: <CartPage />
            },
            {
                path: 'transactions',
                element: <TransactionsPage />
            },
            // Admin
            {
                path: '/admin/product',
                element: <ProtectedAdminRoute element={<ProductPageAdmin />} /> 
            },
            {
                path: '/admin/product-create',
                element: <CreateProductPageAdmin />
            },
            {
                path: '/admin/product-update/:id',
                element: <UpdateProductPageAdmin />
            },
            {
                path: '/admin/customers',
                element: <CustomersPageAdmin />
            },
            {
                path: '/admin/orders',
                element: <OrdersPageAdmin />
            },
        ]
    },
    {
        path: '/auth/register',
        element: <RegisterPage />
    },
    {
        path: '/auth/login',
        element: <LoginPage />
    }
]);

export default router;