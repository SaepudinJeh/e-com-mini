import { Button, Container, Image, Row, Stack } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { useEffect, useState } from 'react';
import useFetchWithAuth from '../services/hooks/use_fetch_auth.hook';
import formatToIDR from '../libs/utils/format_idr.util';
import ModalCart from '../components/modals/cart.modal';
import { ProductType } from '../libs/types/product.type';
import { useCart } from '../libs/contexts/cart.context';
import { ResponeCheckoutType } from '../libs/types/checkout_res.type';

export default function CartPage() {
    const { state, dispatch } = useCart()

    const menuTable = ["Product", "price", "Image", "quantity", "Total", "Actions"];
    const [idCart, setIdCart] = useState<number | null>();
    const [isModalCart, setIsModalCart] = useState<boolean>(false);
    const [product, setProduct] = useState<ProductType | null>();
    const [quantityProduct, setQuantityProduct] = useState<number>();

    const { setIsFetching: setIsFetchingDelete } = useFetchWithAuth({
        path: `/carts/${idCart}`,
        options: {
            method: "DELETE"
        }
    })

    // checkout
    const { setIsFetching: setIsFetchingCheckout, loading: loadingCheckout, data: dataCheckout } = useFetchWithAuth<ResponeCheckoutType>({
        path: `/transactions/checkout`,
        options: {
            method: "POST"
        }
    })

    useEffect(() => {
        if (dataCheckout?.data) {
            window.location.replace(dataCheckout?.data?.redirect_url)
        }
    }, [dataCheckout])

    // Handlers
    const handleDelete = (id: number) => {
        setIdCart(() => id)
        setIsFetchingDelete(true)
        dispatch({ type: "REMOVE_FROM_CART", productId: id })
    }

    const handleEditCart = ({ product, quantity }: { product: ProductType, quantity: number }) => {
        setIsModalCart(true)
        setProduct(product);
        setQuantityProduct(quantity)
    }

    const handleCheckout = () => {
        setIsFetchingCheckout(true)
    }

    const total = state?.reduce((acc, curr) => {
        const productPrice = curr.product.price;
        const productQuantity = curr.quantity;
        const itemTotal = productPrice * productQuantity;
        return acc + itemTotal;
    }, 0);

    return (
        <Container style={{ maxWidth: "750px" }}>
            {state?.length > 0 ? (
                <>
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
                            {state?.map((val, idx) => (
                                <tr key={idx}>
                                    <td>{idx += 1}</td>
                                    <td>{val?.product?.name}</td>
                                    <td>{val?.product?.price}</td>
                                    <td><Image src={`http://localhost:3001/${val?.product?.image}`} rounded style={{ width: "80px" }} /></td>
                                    <td>{val?.quantity}</td>
                                    <td>{formatToIDR(val?.product?.price * val?.quantity)}</td>
                                    <td>
                                        <Stack direction='horizontal' gap={1}>
                                            <Button variant="primary" onClick={() => handleEditCart({ product: val?.product, quantity: val?.quantity })}>Edit</Button>
                                            <Button onClick={() => handleDelete(val?.id)} variant="danger">Delete</Button>
                                        </Stack>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <Row>
                        <h1>Total: {formatToIDR(Number(total ?? 0))}</h1>
                    </Row>
                    <Row style={{ marginTop: "20px" }}>
                        <Button onClick={handleCheckout} disabled={loadingCheckout} variant="success" size="lg">
                            {loadingCheckout ? "Procesing..." : "Checkout"}
                        </Button>
                    </Row>
                </>
            ) : (
                <div>Data Empty</div>
            )}

            <ModalCart show={isModalCart} setShow={setIsModalCart} product={product || null} quantityProduct={quantityProduct} />
        </Container>
    );
}