import { Col, Container, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import useFetchWithAuth from '../services/hooks/use_fetch_auth.hook';
import { ProductDataType, ProductType } from '../libs/types/product.type';
import { useEffect, useState } from 'react';
import formatToIDR from '../libs/utils/format_idr.util';
import ModalCart from '../components/modals/cart.modal';

export default function ProductPage() {
    const { loading, data, setIsFetching } = useFetchWithAuth<ProductDataType>({
        path: 'products'
    });

    const [isModalCart, setIsModalCart] = useState<boolean>(false);
    const [product, setProduct] = useState<ProductType | null>()

    useEffect(() => setIsFetching(true), []);

    const handleProduct = (data: ProductType): void => {
      setIsModalCart(true);
      setProduct(data)
    }

    return (
        <Container>
            { loading ? (
                <Col>Loading ...</Col>
            ) : (
                <Row>
                    { data?.data?.map(res => (
                        <Col key={res.id} xs={12} sm={6} lg={4} className="mb-4">
                            <CardComponent name={res.name} description={res.description} price={res?.price} image={res.image} setCart={handleProduct} id={res?.id} />
                        </Col>
                    ))}
                </Row>
            ) }

        <ModalCart show={isModalCart} setShow={setIsModalCart} product={product || null}  />
        </Container>
    )
}

function CardComponent(data: CardProps) {
  const { setCart, ...dataProduct } = data
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={ data?.image ? `http://localhost:3001/${data.image}` : 'holder.js/100px180' } style={{ height: "250px", objectFit: "cover" }} />
      <Card.Body>
        <Card.Title>{data?.name}</Card.Title>
        <Card.Text>
          {formatToIDR(data?.price)}
        </Card.Text>
        <Card.Text>
          {data?.description}
        </Card.Text>
        <Button onClick={() => setCart(dataProduct)} variant="primary">Cart</Button>
      </Card.Body>
    </Card>
  );
}

type CardProps = {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    setCart: (data: ProductType) => void
}