import { Button, Image, Stack } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { useNavigate } from 'react-router-dom';
import useFetchWithAuth from '../../services/hooks/use_fetch_auth.hook';
import { ProductDataType, ProductType } from '../../libs/types/product.type';
import { useEffect, useMemo, useState } from 'react';

export default function TableProduct() {
    const menuTable = ["Name", "Description", "Price", "Image", "createdAt", "Actions"];

    const navigate = useNavigate();

    const [idProduct, setIdProduct] = useState<number | null>(null);
    const [dataProduct, setDataProduct] = useState<ProductType[]>([])

    const { setIsFetching, data, loading } = useFetchWithAuth<ProductDataType>({
        path: "/products",
        options: {
            method: "GET"
        }
    })
    const { setIsFetching: setIsFetchingDelete } = useFetchWithAuth({
        path: `/products/${idProduct}`,
        options: {
            method: "DELETE"
        }
    })

    useEffect(() => {setIsFetching(true)}, []);
    useMemo(() => {
        if(data) setDataProduct(data.data)
    }, [data])

    const handleDelete = (id: number) => {
        setIdProduct(() => id)
        setIsFetchingDelete(true)
        setDataProduct((val) => val.filter(res => res.id !== id))
    }
    
    return (
        <Table responsive striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    {menuTable.map((val, index) => (
                        <th key={index}>{val}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                { loading ? (<tr><td>Loading....</td></tr>) : (
                <>
                    { dataProduct?.map((val, idx) => (
                        <tr key={idx}>
                            <td>{idx += 1 }</td>
                            <td>{val.name}</td>
                            <td>{val.description}</td>
                            <td>{val.price}</td>
                            <td><Image src={`http://localhost:3001/${val?.image}`} rounded style={{ width: "80px" }} /></td>
                            <td>{val?.createdAt && new Date(val?.createdAt)?.toLocaleDateString()}</td>
                            <td>
                                <Stack direction='horizontal' gap={3}>
                                    <Button onClick={() => navigate(`/admin/product-update/${val.id}`)} variant="primary">Edit</Button>
                                    <Button onClick={() => handleDelete(val?.id)} variant="danger">Delete</Button>
                                </Stack>
                            </td>
                        </tr>
                    )) }
                </>
                ) }
            </tbody>
        </Table>
    );
}