import { Outlet } from "react-router-dom";
import NavbarCustom from "../globals/navbar.gobal";
import { Container } from "react-bootstrap";

export default function LayoutMenu() {
    return (
        <Container className="w-full">
            <NavbarCustom />
            <div style={{ marginTop: "100px" }}>
                <Outlet />
            </div>
        </Container>
    )
}