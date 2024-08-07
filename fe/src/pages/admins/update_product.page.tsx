import { useNavigate, useParams } from "react-router-dom";
import useFetchWithAuth from "../../services/hooks/use_fetch_auth.hook";
import { ProductDetailType } from "../../libs/types/product.type";
import { useContext, useEffect, useMemo, useState } from "react";
import * as Yup from 'yup';
import { useFormik } from "formik";
import { Button, Form } from "react-bootstrap";
import axios from 'axios'; // Import axios for file uploads
import { AuthContext } from "../../libs/contexts/auth.context";

export default function UpdateProductPageAdmin() {
    const authCtx = useContext(AuthContext)

    const { id } = useParams();

    const { setIsFetching, data } = useFetchWithAuth<ProductDetailType>({
        path: `/products/${id}`,
    });

    useEffect(() => setIsFetching(true), []);

    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            price: 0,
            image: null,
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
            description: Yup.string().required('Required'),
            price: Yup.number().required('Required').positive('Price must be a positive number'),
            image: Yup.mixed().required('Required'), // File input validation
        }),
        onSubmit: async (values) => {
            try {
                const formData = new FormData();
                formData.append('id', id || '')
                formData.append('name', values.name || '');
                formData.append('description', values.description || '');
                formData.append('price', values.price?.toString() || '');
                if (values.image) {
                    formData.append('image', values.image);
                }

                setLoading(true);

                await axios.put(`http://localhost:3001/products`, formData, {
                    headers: {
                        'Authorization': `Bearer ${authCtx?.authData?.token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                    data: formData
                });

                navigate('/');
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        },
    });

    useMemo(() => {
        if (data?.data) {
            formik.setValues({
                name: data.data.name || '',
                description: data.data.description || '',
                price: data.data.price || 0,
                image: null, // Reset image field
            });
        }
    }, [data?.data]);

    useEffect(() => {
        if (id) {
            formik.setValues({
                name: data?.data?.name || '',
                description: data?.data?.description || '',
                price: data?.data?.price || 0,
                image: null,
            });
        }
    }, [data?.data, id]);

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
                    type="file"
                    accept="image/*" // Limit to image files
                    onChange={(event) => {
                        const target = event.currentTarget as HTMLInputElement;
                        if (target.files) {
                            formik.setFieldValue('image', target.files[0]);
                        }
                    }}
                    isInvalid={!!formik.errors.image && formik.touched.image}
                />
                <Form.Control.Feedback type="invalid">{formik.errors.image}</Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" disabled={loading} type="submit">
                {loading ? "Saving..." : "Update"}
            </Button>
        </Form>
    );
}
