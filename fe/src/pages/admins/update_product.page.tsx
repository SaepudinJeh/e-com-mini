import { useNavigate, useParams } from "react-router-dom";
import useFetchWithAuth from "../../services/hooks/use_fetch_auth.hook";
import { ProductDetailType } from "../../libs/types/product.type";
import { useEffect, useMemo, useState } from "react";
import * as Yup from 'yup';
import { useFormik } from "formik";
import { Button, Form } from "react-bootstrap";

type ProductFormType = {
    id?: number;
    name?: string;
    description?: string;
    price?: number;
    image?: string;
}

export default function UpdateProductPageAdmin() {
    const { id } = useParams()

    const { setIsFetching, data } = useFetchWithAuth<ProductDetailType>({
        path: `/products/${id}`,
    })

    useEffect(() => setIsFetching(true), [])

    const navigate = useNavigate();

    const [formData, setFormData] = useState<ProductFormType>({});

    const { setIsFetching: startFetchingUpdate, loading, status } = useFetchWithAuth({
        path: '/products',
        options: {
            method: "PUT",
            data: formData
        }
    });

    const formik = useFormik({
        initialValues: {
            name: formData.name || '',
            description: formData.description || '',
            price: formData.price || 0,
            image: formData.image || '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
            description: Yup.string().required('Required'),
            price: Yup.number().required('Required').positive('Price must be a positive number'),
            image: Yup.string().url('Invalid URL').required('Required'),
        }),
        onSubmit: async (values) => {
            try {
                setFormData({...values, id: Number(id)});
                startFetchingUpdate(true);
            } catch (error) {
                console.error('Error:', error);
            }
        },
    });

    useMemo(() => {
        if (status === 200) {
            navigate('/');
        }
    }, [status]);

    useEffect(() => {
        if (id) {
            formik.setValues({ name: data?.data?.name || '', description: data?.data?.description || '', price: data?.data?.price || 0, image: data?.data?.image || '' });
        }
    }, [data?.data]);

    return (
        <Form style={{ maxWidth: "500px", margin: "auto" }} onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Name Product</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Name Product ...."
                    {...formik.getFieldProps('name')}
                    isInvalid={!!formik.errors.name && formik.touched.name}
                />
                <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Description</Form.Label>
                <Form.Control
                    as="textarea"
                    placeholder='Description Product ...'
                    rows={3}
                    {...formik.getFieldProps('description')}
                    isInvalid={!!formik.errors.description && formik.touched.description}
                />
                <Form.Control.Feedback type="invalid">{formik.errors.description}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="price">
                <Form.Label>Price</Form.Label>
                <Form.Control
                    type="number"
                    {...formik.getFieldProps('price')}
                    isInvalid={!!formik.errors.price && formik.touched.price}
                />
                <Form.Control.Feedback type="invalid">{formik.errors.price}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="image">
                <Form.Label>Image</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Image ...."
                    {...formik.getFieldProps('image')}
                    isInvalid={!!formik.errors.image && formik.touched.image}
                />
                <Form.Control.Feedback type="invalid">{formik.errors.image}</Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" disabled={loading} type="submit">{loading ? "Saving..." : "Update"}</Button>
        </Form>
    )
}
