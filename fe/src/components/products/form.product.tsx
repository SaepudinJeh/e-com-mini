import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useFetchWithAuth from '../../services/hooks/use_fetch_auth.hook';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type ProductFormType = {
  id?: number;
  name?: string;
  description?: string;
  price?: number;
  image?: string;
}

function ProductForm({ id, name, description, price, image }: ProductFormType) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ProductFormType>({ id, name, description, price, image });

  const { setIsFetching, loading, status } = useFetchWithAuth({
    path: '/products',
    options: {
      method: "POST",
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
        setFormData(values);
        setIsFetching(true);
      } catch (error) {
        console.error('Error:', error);
      }
    },
  });

  useMemo(() => {
    if (status === 201) {
      navigate('/');
    }
  }, [status]);

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
      
      <Button variant="primary" disabled={loading} type="submit">{loading ? "Saving..." : "Create"}</Button>
    </Form>
  );
}

export default ProductForm;
