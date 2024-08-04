import { useContext, useEffect, useMemo } from 'react';
import { Nav } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { AuthContext } from '../../libs/contexts/auth.context';
import { CartDataType } from '../../libs/types/cart.type';
import { useCart } from '../../libs/contexts/cart.context';
import useFetchWithAuth from '../../services/hooks/use_fetch_auth.hook';

export default function NavbarCustom() {
    const authCtx = useContext(AuthContext);
    const { dispatch, state } = useCart()

    const isAdmin = authCtx?.authData?.user?.role === "admin";

    const { setIsFetching, data } = useFetchWithAuth<CartDataType>({
        path: "/carts",
        options: {
            method: "GET"
        }
    })

    useEffect(() => {
        if(!isAdmin) {
            setIsFetching(true)
        }
    }, [isAdmin])

    useMemo(() => {
        if(data) dispatch({ type: "ADD_CARTS", carts: data?.data })
    }, [data])

    return (
        <Navbar bg="light" expand="lg" fixed='top'>
            <Container>
                <Navbar.Brand href="/">MyProduct</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        { isAdmin ? (
                            <>
                                <Nav.Link href="/admin/product">Products</Nav.Link>
                                <Nav.Link href="/admin/customers">Customers</Nav.Link>
                                <Nav.Link href="/admin/orders">Transactions</Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link href="/">Products</Nav.Link>
                                <Nav.Link href="/cart">
                                    Cart
                                    {state?.length > 0 && (
                                        <span style={{ marginLeft: "5px", color: "green" }}>
                                            ({state?.length})
                                        </span>
                                    )}
                                </Nav.Link>
                                <Nav.Link href="/transactions">Transactions</Nav.Link>
                            </>
                        )}
                    </Nav>
                    <Navbar.Text>
                        { authCtx?.authData?.user?.email }
                    </Navbar.Text>
                    <Navbar.Text onClick={() => authCtx?.logout()} style={{ marginLeft: "10px", cursor: "pointer" }}>
                        Logout
                    </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
