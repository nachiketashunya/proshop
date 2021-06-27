import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormGroup, Form, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { register } from "../actions/userActions";

const RegisterScreen = ({ location, history }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();
  const redirect = location.search ? location.search.split("=")[1] : "/";

  const userRegisterInfo = useSelector((state) => state.userRegister);
  const { userInfo, error, loading } = userRegisterInfo;

  const isUserLoggedIn = localStorage.getItem("userInfo");

  useEffect(() => {
    if (userInfo || isUserLoggedIn) {
      history.push(redirect);
    }
  }, [redirect, history, userInfo, isUserLoggedIn]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Password didn't match");
    } else {
      setMessage("");
      dispatch(register(name, email, password));
    }
  };

  return (
    <FormContainer>
      <h1>Register</h1>
      {message && <Message variant="danger" message={message} />}
      {error && <Message variant="danger" message={error} />}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <FormGroup controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </FormGroup>
        <FormGroup controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </FormGroup>
        <FormGroup controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </FormGroup>
        <FormGroup controlId="confirm-password">
          <Form.Label>Confirm password</Form.Label>
          <Form.Control
            type="password"
            id="confirm-password"
            placeholder="Enter your confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </FormGroup>
        {/* <FormGroup>
          <Form.Label>Mobile</Form.Label>
          <Form.Control
            type="text"
            id="mobile"
            placeholder="Enter your mobile number"
          ></Form.Control>
        </FormGroup> */}

        <Button type="submit" variant="primary">
          Register
        </Button>
      </Form>

      <Row className="py-3">
        <Col>
          Existing Customer ?{" "}
          <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
            Login here
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
