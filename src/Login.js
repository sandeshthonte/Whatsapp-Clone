import React from "react";
import styled from "styled-components";
import { auth, provider } from "./firebase";
import whatsapp from "./images/WhatsApp.png";

function Login(props) {
  const setUsers = props.setUsers;
  const signIn = () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        const newUser = {
          name: result.user.displayName,
          photo: result.user.photoURL,
        };

        console.log(newUser);
        setUsers(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <Container>
      <Content>
        <SlackImg src={whatsapp} alt="whatsapp" />
        <h1>Sign in Whatsapp</h1>
        <SignInButton onClick={() => signIn()}>
          Sign In With Google
        </SignInButton>
      </Content>
    </Container>
  );
}

export default Login;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  background: white;
  padding: 100px;
  box-shadow: 0 2px 3px rgb(0 0 0 / 12%), 0 1px 2px rgb(0 0 0 / 24%);
  border-radius: 5px;

  display: flex;
  flex-direction: column;
  // justify-content: center;
  align-items: center;
`;

const SlackImg = styled.img`
  height: 100px;
`;

const SignInButton = styled.button`
  margin-top: 50px;
  //  background-color: #0a8d48;
  color: black;
  border: none;
  height: 40px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
  outline: none;
`;
