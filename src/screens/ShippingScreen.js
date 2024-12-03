import React, { useContext, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";
import CheckoutSteps from "../components/CheckoutSteps";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function ShippingScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;
  useEffect(() => {
    if (!userInfo) {
      navigate("/signin?redirect=/shipping");
    }
  }, [userInfo, navigate]);

  // const submitHandler = (e) => {
  //   e.preventDefault();
  //   ctxDispatch({
  //     type: "SAVE_SHIPPING_ADDRESS",
  //     payload: {
  //       fullName,
  //       address,
  //       city,
  //       postalCode,
  //       country,
  //     },
  //   });
  //   localStorage.setItem(
  //     "shippingAddress",
  //     JSON.stringify({
  //       fullName,
  //       address,
  //       city,
  //       postalCode,
  //       country,
  //     })
  //   );
  //   navigate("/payment");
  // };
  const formik = useFormik({
    initialValues: {
      fullName: shippingAddress.fullName || "",
      address: shippingAddress.address || "",
      city: shippingAddress.city || "",
      postalCode: shippingAddress.postalCode || "",
      country: shippingAddress.country || "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .required("Full Name is required")
        .min(3, "Full Name must be at least 3 characters"),
      address: Yup.string()
        .required("Address is required")
        .min(5, "Address must be at least 5 characters"),
      city: Yup.string()
        .required("City is required")
        .min(2, "City must be at least 2 characters"),
      postalCode: Yup.string()
        .required("Postal Code is required")
        .matches(/^\d+$/, "Postal Code must be numeric"),
      country: Yup.string()
        .required("Country is required")
        .min(2, "Country must be at least 2 characters"),
    }),
    onSubmit: (values) => {
      ctxDispatch({
        type: "SAVE_SHIPPING_ADDRESS",
        payload: values,
      });
      localStorage.setItem("shippingAddress", JSON.stringify(values));
      navigate("/payment");
    },
  });
  return (
    <div>
      <Helmet>
        <title>Shipping Address</title>
      </Helmet>
      <CheckoutSteps step1 step2></CheckoutSteps>
      <div className="container small-container">
        <h1 className="my-3">Shipping Address</h1>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3" controlId="fullName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.fullName && formik.errors.fullName}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.fullName}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.address && formik.errors.address}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.address}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              name="city"
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.city && formik.errors.city}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.city}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="postalCode">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              type="text"
              name="postalCode"
              value={formik.values.postalCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.postalCode && formik.errors.postalCode}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.postalCode}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="country">
            <Form.Label>Country</Form.Label>
            <Form.Control
              type="text"
              name="country"
              value={formik.values.country}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.country && formik.errors.country}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.country}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="mb-3">
            <Button
              variant="primary"
              type="submit"
              disabled={!formik.isValid || !formik.dirty}
            >
              Continue
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
