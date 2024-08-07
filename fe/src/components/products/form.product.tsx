import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../libs/contexts/auth.context';

type ProductFormType = {
  id?: number;
  name?: string;
  description?: string;
  price?: number;
  image?: File | null;
};

const ProductForm: React.FC<ProductFormType> = () => {
  const authCtx = useContext(AuthContext)

  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if(!authCtx?.authData?.token) {
      navigate('/auth/login');
    }
  }, [navigate]);

  const formik = useFormik<ProductFormType>({
    initialValues: {
      name: '',
      description: '',
      price: undefined,
      image: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      description: Yup.string().required('Required'),
      price: Yup.number().required('Required').positive('Price must be a positive number'),
      image: Yup.mixed().required('Required'), // File input validation
    }),
    onSubmit: async (values: ProductFormType) => {
      try {
        const formData = new FormData();
        formData.append('name', values.name || '');
        formData.append('description', values.description || '');
        formData.append('price', values.price?.toString() || '');
        if (values.image) {
          formData.append('image', values.image);
        }

        setLoading(true);

        await axios.post('http://localhost:3001/products', formData, {
          headers: {
            'Authorization': `Bearer ${authCtx?.authData?.token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        navigate('/');
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          if (status === 401 || status === 403) {
            authCtx?.logout()
            navigate('/auth/login');
          } else {
            console.error('Error:', error.message);
          }
        } else {
          console.error('Unexpected Error:', error);
        }
      } finally {
        setLoading(false);
      }
    },
  });

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
      
      <Button variant="primary" disabled={loading} type="submit">{loading ? "Saving..." : "Create"}</Button>
    </Form>
  );
}

export default ProductForm;
