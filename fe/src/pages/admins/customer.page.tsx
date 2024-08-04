import Table from 'react-bootstrap/Table';
import useFetchWithAuth from '../../services/hooks/use_fetch_auth.hook';
import { useEffect } from 'react';
import { UsersDataType } from '../../libs/types/users.type';

export default function CustomersPageAdmin() {
    const menuTable = ["User ID", "Username", "Email", "Role", "CreatedAt"];

    const { setIsFetching, data } = useFetchWithAuth<UsersDataType>({
        path: `/user`,
        options: {
            method: "GET"
        }
    });

    useEffect(() => {
        setIsFetching(true)
    }, [])

    return (
        <Table responsive>
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
                        <td>{val?.id}</td>
                        <td>{val?.username}</td>
                        <td>{val?.email}</td>
                        <td>{val?.role}</td>
                        <td>{val?.createdAt && new Date(val?.createdAt)?.toLocaleDateString()}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}