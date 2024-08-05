// src/LoginPage.tsx
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Container, Form, InputGroup, Stack } from 'react-bootstrap';
import { AuthContext } from '../../libs/contexts/auth.context';

const LoginPage: React.FC = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const [error, setError] = useState<string>('');

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      setError('');

      try {
        const response = await axios.post('http://localhost:3001/auth/login', values);

        const { token, user } = response.data.data;

        if (token && user) {
          authCtx?.login({ token, user });
          navigate('/');
        } else {
          setError('Failed to get token or user from response');
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <Container style={{ width: '100%', height: '100vh', margin: "auto" }}>
      <Form style={{ maxWidth: '450px', margin: '100px auto' }} onSubmit={formik.handleSubmit}>
        <h2 style={{ textAlign: 'center', margin: '30px 0' }}>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <InputGroup className="mb-3">
          <Form.Control
            name="email"
            placeholder="Email"
            aria-label="Email"
            aria-describedby="basic-addon1"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.email && !!formik.errors.email}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.email}
          </Form.Control.Feedback>
        </InputGroup>
        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            name="password"
            type="password"
            placeholder="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.password && !!formik.errors.password}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.password}
          </Form.Control.Feedback>
        </Form.Group>

        <Stack direction='vertical' gap={1}>
          <Button style={{ marginTop: '20px' }} variant="primary" type="submit">
            Login
          </Button>

          <Button onClick={() => navigate('/auth/register')} variant="outline-dark">Register Account</Button>
        </Stack>
      </Form>
    </Container>
  );
};

export default LoginPage;
