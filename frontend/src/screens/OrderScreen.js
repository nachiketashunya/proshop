import React, { useState, useEffect } from "react";
import { PayPalButton } from "react-paypal-button-v2";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getOrderDetails, payOrder } from "../actions/orderActions";
import axios from "axios";
import { ORDER_PAY_RESET } from "../constants/orderConstants";

const OrderScreen = ({ match }) => {
  const orderId = match.params.id;

  const dispatch = useDispatch();
  const [sdkReady, setSdkReady] = useState(false);

  const orderDetails = useSelector((state) => state.orderDetails);
  const { error, loading, order } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { success: successPay } = orderPay;

  useEffect(() => {
    const addPayPalScript = async () => {
      let { data: clientId } = await axios.get("/api/config/paypal");
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.type = "text/javascript";
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };

      document.head.appendChild(script);
    };

    if (!order || successPay || order._id !== orderId) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, order, successPay, orderId]);

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult);
    dispatch(payOrder(orderId, paymentResult));
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger" message={error} />
      ) : (
        <>
          <h1>
            Order <small className="order-id"> #{order._id} </small>
          </h1>
          <Row className="py-3">
            <Col md={8}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Shipping</h2>
                  <p>{order.user.name}</p>
                  <p>{order.user.email}</p>
                  <p>
                    Address:
                    <b>
                      {order.shippingAddress.address}{" "}
                      {order.shippingAddress.city}{" "}
                      {order.shippingAddress.country}{" "}
                      {order.shippingAddress.postalCode}
                    </b>
                  </p>
                  <p>
                    {order.isDelivered ? (
                      <Message
                        variant="success"
                        message={`Delivered at ${order.deliveredAt.toString()}`}
                      />
                    ) : (
                      <Message variant="danger" message="Not delivered" />
                    )}
                  </p>
                </ListGroup.Item>
                <ListGroup.Item>
                  <h2>Payment Method</h2>
                  <p>
                    Payment Method:
                    <b> {order.paymentMethod}</b>
                  </p>
                  <p>
                    {order.isPaid ? (
                      <Message
                        variant="success"
                        message={`Paid at ${order.paidAt.toString()}`}
                      />
                    ) : (
                      <Message variant="danger" message="Not paid" />
                    )}
                  </p>
                </ListGroup.Item>
                <ListGroup.Item>
                  <h2>Order Items</h2>
                  <ListGroup variant="flush">
                    {order.orderItems.length < 0 ? (
                      <Message message="Your order is empty" variant="danger" />
                    ) : (
                      order.orderItems.map((item, index) => {
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
                    <Row>
                      <Col>Items</Col>
                      <Col>{order.orderItems.length}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Subtotal</Col>
                      <Col>&#8377;{order.subtotal}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Shipping Price</Col>
                      <Col>&#8377;{order.shippingPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Tax Price</Col>
                      <Col>&#8377;{order.taxPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Total </Col>
                      <Col>&#8377;{order.totalPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    {!sdkReady ? (
                      <Loader />
                    ) : (
                      <PayPalButton
                        amount={order.totalPrice}
                        onSuccess={successPaymentHandler}
                      />
                    )}
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default OrderScreen;
