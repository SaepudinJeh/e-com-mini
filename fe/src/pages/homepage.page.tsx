import { useContext } from "react";
import { AuthContext } from "../libs/contexts/auth.context";
import ProductPageAdmin from "./admins/product.page";
import ProductPage from "./product.page";

export default function Homepage() {
    const authCtx = useContext(AuthContext);
    
    if(authCtx?.authData?.user?.role === "admin") {
        return <ProductPageAdmin />
    }

    return <ProductPage />
}