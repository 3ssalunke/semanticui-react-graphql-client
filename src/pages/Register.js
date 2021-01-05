import { useMutation } from "@apollo/client";
import React, { useContext, useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { AuthContext } from "../context/auth";
import { REGISTER_USER } from "../utils/graphql";

const Register = (props) => {
  const { login } = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
      login(userData);
      props.history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values,
  });

  const onSubmit = (e) => {
    e.preventDefault();
    addUser();
  };

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <Form.Input
          type="text"
          label="Username"
          placeholder="Username"
          name="username"
          value={values.username}
          error={errors.username}
          onChange={onChange}
        />
        <Form.Input
          type="email"
          label="Email"
          placeholder="Email"
          name="email"
          value={values.email}
          error={errors.email}
          onChange={onChange}
        />
        <Form.Input
          type="password"
          label="Password"
          placeholder="Password"
          name="password"
          value={values.password}
          error={errors.password}
          onChange={onChange}
        />
        <Form.Input
          type="password"
          label="Confirm Password"
          placeholder="Confirm Password"
          name="confirmPassword"
          value={values.confirmPassword}
          onChange={onChange}
        />
        <Button type="submit" primary>
          Register
        </Button>
      </Form>
      {/* {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value, i) => (
              <li key={i}>{value}</li>
            ))}
          </ul>
        </div>
      )} */}
    </div>
  );
};

export default Register;
