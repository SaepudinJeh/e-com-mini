import { Dispatch, useEffect, useMemo, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import formatToIDR from '../../libs/utils/format_idr.util';
import { ProductType } from '../../libs/types/product.type';
import useFetchWithAuth from '../../services/hooks/use_fetch_auth.hook';
import { useCart } from '../../libs/contexts/cart.context';
import { CartItemType } from '../../libs/types/cart.type';

type ModalCartProp = { show: boolean, product: ProductType | null, setShow: Dispatch<React.SetStateAction<boolean>>, quantityProduct?: number }

export default function ModalCart({ show, setShow, product, quantityProduct }: ModalCartProp) {
    const { dispatch } = useCart()

    const [quantity, setQuantity] = useState<number>(0);

    const { setIsFetching, data } = useFetchWithAuth<CartItemType>({
        path: "carts",
        options: {
            method: "POST",
            data: {
                productId: product?.id,
                quantity
            }
        }
    })

    const handleSaveCart = () => {
        setIsFetching(true)
        setShow(false)
    }

    useMemo(() => {
        if(quantityProduct) setQuantity(quantityProduct)
    }, [quantityProduct])

    useEffect(() => {
        if(data) dispatch({ type: "ADD_TO_CART", carts: data?.data })
    }, [data])

    return (
        <>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Product: {product?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.quantity">
                            <Form.Label>Total Quantity</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Quantity"
                                autoFocus
                                value={quantity}
                                onChange={(val) => setQuantity(Number(val?.target?.value))}
                            />
                        </Form.Group>
                    </Form>
                    <div>Total : {formatToIDR(Number(product?.price ?? 0) * Number(quantity))}</div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Close
                    </Button>
                    <Button onClick={handleSaveCart} variant="primary">
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}