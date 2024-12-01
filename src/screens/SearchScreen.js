import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Rating from "../components/Rating";
import MessageBox from "../components/MessageBox";
import Button from "react-bootstrap/esm/Button";
import Product from "../components/Product";
import data from "../data";

const prices = [
  { name: "$1 to $50", value: "1-50" },
  { name: "$51 to $200", value: "51-200" },
  { name: "$201 to $1000", value: "201-1000" },
];

export const ratings = [
  {
    name: "4stars & up",
    rating: 4,
  },
  {
    name: "3stars & up",
    rating: 3,
  },
  {
    name: "2stars & up",
    rating: 2,
  },
  {
    name: "1stars & up",
    rating: 1,
  },
];

export default function SearchScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search); // /search?category=Shirts
  const category = sp.get("category") || "all";
  const query = sp.get("query") || "all";
  const price = sp.get("price") || "all";
  const rating = sp.get("rating") || "all";
  const order = sp.get("order") || "newest";
  const page = sp.get("page") || 1;

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [countProducts, setCountProducts] = useState(0);
  const [pages, setPages] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      let products = [...data.products];

      if (category && category !== "all") {
        products = products.filter((product) => product.category === category);
      }

      if (query && query !== "all") {
        products = products.filter(
          (product) =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase())
        );
      }

      if (price && price !== "all") {
        const [minPrice, maxPrice] = price.split("-").map(Number);
        products = products.filter(
          (product) => product.price >= minPrice && product.price <= maxPrice
        );
      }

      if (rating && rating !== "all") {
        products = products.filter(
          (product) => product.rating >= Number(rating)
        );
      }

      if (order === "lowest") {
        products.sort((a, b) => a.price - b.price);
      } else if (order === "highest") {
        products.sort((a, b) => b.price - a.price);
      } else if (order === "toprated") {
        products.sort((a, b) => b.rating - a.rating);
      }

      setFilteredProducts(products);
      setCountProducts(products.length);
      setPages(Math.ceil(products.length / 10));
    };

    fetchData();
  }, [category, query, price, rating, order]);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = [
          ...new Set(data.products.map((product) => product.category)),
        ];
        setCategories(categoryData);
      } catch (error) {
        toast.error("No categories found");
      }
    };
    fetchCategories();
  }, []);

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;
    const searchParams = new URLSearchParams({
      category: filterCategory,
      query: filterQuery,
      price: filterPrice,
      rating: filterRating,
      order: sortOrder,
      page: filterPage,
    });

    return `/search?${searchParams.toString()}`;
  };

  return (
    <div>
      <Helmet>
        <title>Search Products</title>
      </Helmet>
      <Row>
        <Col md={3}>
          <h3>Department</h3>
          <div>
            <ul>
              <li>
                <Link
                  className={"all" === category ? "text-bold" : ""}
                  to={getFilterUrl({ category: "all" })}
                >
                  Any
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c}>
                  <Link
                    className={c === category ? "text-bold" : ""}
                    to={getFilterUrl({ category: c })}
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Price</h3>
            <ul>
              <li>
                {" "}
                <Link
                  className={"all" === price ? "text-bold" : ""}
                  to={getFilterUrl({ price: "all" })}
                >
                  Any
                </Link>
              </li>
              {prices.map((p) => (
                <li key={p.value}>
                  <Link
                    className={p.value === price ? "text-bold" : ""}
                    to={getFilterUrl({ price: p.value })}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Avg. Customer Review</h3>
            <ul>
              {ratings.map((r) => (
                <li key={r.name}>
                  <Link
                    className={`${r.rating}` === `${rating}` ? "text-bold" : ""}
                    to={getFilterUrl({ rating: r.rating })}
                  >
                    <Rating caption={" & up"} rating={r.rating}></Rating>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  className={rating === "all" ? "text-bold" : ""}
                  to={getFilterUrl({ rating: "all" })}
                >
                  <Rating caption={" & up"} rating={0}></Rating>
                </Link>
              </li>
            </ul>
          </div>
        </Col>
        <Col md={9}>
          <>
            <Row className="justify-content-between mb-3">
              <Col md={6}>
                <div>
                  {countProducts === 0 ? "No" : countProducts}
                  {query !== "all" && ":" + query}
                  {category !== "all" && ":" + category}
                  {price !== "all" && ":" + price}
                  {rating !== "all" && ":" + rating + " & up"}
                  {query !== "all" ||
                  category !== "all" ||
                  rating !== "all" ||
                  price !== "all" ? (
                    <Button variant="light" onClick={() => navigate("/search")}>
                      <i className="fas fa-times-circle"></i>
                    </Button>
                  ) : null}
                </div>
              </Col>
              <Col className="text-end">
                Sort by{" "}
                <select
                  value={order}
                  onChange={(e) => {
                    navigate(getFilterUrl({ order: e.target.value }));
                  }}
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="lowest">Price:Low to High</option>
                  <option value="highest">Price:high to Low</option>
                  <option value="toprated">Avg. Customer Reviews</option>
                </select>
              </Col>
            </Row>
            {filteredProducts.length === 0 && (
              <MessageBox variant="danger">No Products Found</MessageBox>
            )}
            <Row>
              {filteredProducts.map((product) => (
                <Col sm={6} lg={4} className="mb-3" key={product._id}>
                  <Product product={product}></Product>
                </Col>
              ))}
            </Row>
            <div>
              {[...Array(pages).keys()].map((x) => (
                <Link
                  key={x + 1}
                  className="mx-1"
                  to={getFilterUrl({ page: x + 1 })}
                >
                  <Button
                    className={Number(page) === x + 1 ? "text-bold" : ""}
                    variant="light"
                  >
                    {x + 1}
                  </Button>
                </Link>
              ))}
            </div>
          </>
        </Col>
      </Row>
    </div>
  );
}
