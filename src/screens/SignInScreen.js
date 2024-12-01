import { useContext, useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { Formik } from "formik";
import { object, string } from "yup";

export default function SignInScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const validationSchema = object({
    email: string()
      .email("Invalid email format.")
      .required("Email is required"),
    password: string().required("Password is required"),
  });
  const submitHandler = (e) => {
    e.preventDefault();
    // const user = data.users.find(
    //   (user) => user.email === email && user.password === password
    // );
    const user = {
      email: email,
      password: password,
    };
    if (user) {
      ctxDispatch({ type: "USER_SIGNIN", payload: user });
      localStorage.setItem("userInfo", JSON.stringify(user));
      navigate(redirect || "/shipping");
    } else {
      toast.error("Invalid email or password");
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);
  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <h1 className="mb-3">Sign In</h1>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={submitHandler}
      >
        {({ handleSubmit, handleChange, values, errors, touched }) => (
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                required
                onChange={(e) => setEmail(e.target.value)}
                isInvalid={touched.email && !!errors.email}
              ></Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                required
                onChange={(e) => setPassword(e.target.value)}
                isInvalid={touched.password && !!errors.password}
              ></Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
            <div className="mb-3">
              <Button type="submit">Sign In</Button>
            </div>
            <div className="mb-3">
              New Customer?{" "}
              <Link to={`/signup?redirect=${redirect}`}>
                Create Your Account
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </Container>
  );
}
