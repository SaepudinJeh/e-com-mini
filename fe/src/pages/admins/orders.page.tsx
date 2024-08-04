import { Badge, Container } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { useEffect } from 'react';
import { TransactionDataType } from '../../libs/types/transaction.type';
import useFetchWithAuth from '../../services/hooks/use_fetch_auth.hook';
import formatToIDR from '../../libs/utils/format_idr.util';

export default function OrdersPageAdmin() {
    const menuTable = ["Order ID", "Total Amount", "Status", "User", "Email"];

    const { setIsFetching, data } = useFetchWithAuth<TransactionDataType>({
        path: `/user/orders`,
        options: {
            method: "GET"
        }
    });

    useEffect(() => {
        setIsFetching(true)
    }, [])

    return (
        <Container style={{ maxWidth: "750px" }}>
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
                    {data?.data?.map((val, idx) => (
                        <tr key={idx}>
                            <td>{idx += 1}</td>
                            <td>{val?.orderId}</td>
                            <td>{formatToIDR(val?.gross_amount)}</td>
                            <td><Badge bg={val?.status === "capture" ? "success": "warning"}>{val?.status === "capture" ? "completed" : val?.status}</Badge></td>
                            <td>{val?.customer_name}</td>
                            <td>{val?.customer_email}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}