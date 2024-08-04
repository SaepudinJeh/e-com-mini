import { useParams } from "react-router-dom";
import ProductForm from "../../components/products/form.product";
import useFetchWithAuth from "../../services/hooks/use_fetch_auth.hook";
import { ProductDetailType } from "../../libs/types/product.type";
import { useEffect } from "react";

export default function UpdateProductPageAdmin() {
    const { id } = useParams()
    
    const { setIsFetching, data } = useFetchWithAuth<ProductDetailType>({
        path: `/products/${id}`,
    })

    useEffect(() => setIsFetching(true), [])
    

    return <ProductForm 
        id={data?.data?.id}
        name={data?.data?.name}
        description={data?.data?.description}
        price={data?.data?.price}
        image={data?.data?.image}
    />
}