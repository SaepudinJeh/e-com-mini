import { Button, Stack } from "react-bootstrap";
import TableProduct from "../../components/products/table.product";
import { useNavigate } from "react-router-dom";

export default function ProductPageAdmin() {
    const navigate = useNavigate();

    return (
        <div className="w-full">
            <Stack direction="horizontal">
                <Button onClick={() => navigate('/admin/product-create')} className="ms-auto" variant="danger">Create Product</Button>
            </Stack>
            <TableProduct />
        </div>
    )
}