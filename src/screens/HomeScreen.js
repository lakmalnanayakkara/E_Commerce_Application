import data from "../data";
import { Col, Row } from "react-bootstrap";
import Product from "../components/Product";
import { Helmet } from "react-helmet-async";
import MessageBox from "../components/MessageBox";

export default function HomeScreen() {
  return (
    <div>
      <Helmet>
        <title>amazona</title>
      </Helmet>
      <h1>Featured Products</h1>
      <div className="products">
        {data.products ? (
          <Row>
            {data.products.map((product) => (
              <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                <Product product={product}></Product>
              </Col>
            ))}
          </Row>
        ) : (
          <MessageBox variant="danger">Products Not Found</MessageBox>
        )}
      </div>
    </div>
  );
}
