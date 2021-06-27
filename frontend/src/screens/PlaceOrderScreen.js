import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Message from "../components/Message";
import CheckoutSteps from "../components/CheckoutSteps";
import { createOrder } from "../actions/orderActions";

const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  cart.shippingPrice = addDecimals(Number(cart.itemsPrice > 100 ? 0 : 100));
  cart.taxPrice = Number(
    addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)))
  );
  cart.totalPrice =
    Number(cart.shippingPrice) +
    Number(cart.taxPrice) +
    Number(cart.itemsPrice);

  const orderDetails = useSelector((state) => state.createOrder);
  const { error, success, order } = orderDetails;

  const placeOrderHandler = (e) => {
    e.preventDefault();
    console.log("place order");
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        subtotal: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
    );
  };

  useEffect(() => {
    if (success) {
      history.push(`/order/${order._id}`);
    }
  }, [history, order, success]);

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row className="py-3">
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                Address:
                <b>
                  {shippingAddress.address} {shippingAddress.city}{" "}
                  {shippingAddress.country} {shippingAddress.postalCode}
                </b>
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                Payment Method:
                <b> {cart.paymentMethod}</b>
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Cart Items</h2>
              <ListGroup variant="flush">
                {cart.cartItems.length < 0 ? (
                  <Message message="Your cart is empty" variant="danger" />
                ) : (
                  cart.cartItems.map((item, index) => {
                    return (
                      <ListGroup.Item key={index}>
                        <Row>
                          <Col md={1}>
                            <Image src={item.image} rounded fluid />
                          </Col>
                          <Col md={6}>
                            <Link to={`/product/${item.product}`}>
                              {item.name}
                            </Link>
                          </Col>
                          <Col md={5}>
                            <p>
                              {item.qty} * &#8377;{item.price}: &#8377;
                              <b>{item.qty * item.price}</b>
                            </p>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    );
                  })
                )}
              </ListGroup>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              {error && <Message variant="danger" message={error} />}
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>{cart.cartItems.length}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Subtotal</Col>
                  <Col>&#8377;{cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping Price</Col>
                  <Col>&#8377;{cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax Price</Col>
                  <Col>&#8377;{cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total </Col>
                  <Col>&#8377;{cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card>

          <Button
            type="submit"
            onClick={placeOrderHandler}
            variant="primary"
            className="my-3 btn-block"
          >
            Place order
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
