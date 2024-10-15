import {
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useState } from "react";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  const toast = useToast();
  const onSubmitHandler = async (data: any) => {
    try {
      setLoading(true);
      const login = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      if (login) {
        navigate("/");
      }
    } catch (error: any) {
      setLoading(false);
      toast({
        title: "Failed to Login",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
    reset();
  };
  return (
    <main className="flex items-center justify-between min-h-screen">
      <Container marginTop={"6"}>
        <Text fontSize={"3xl"} as={"b"}>
          Login to your account
        </Text>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input type="text" {...register("email")} />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input type="text" {...register("password")} />
          </FormControl>
          <Button
            marginTop={"4"}
            type="submit"
            className="w-full disabled:cursor-not-allowed disabled:opacity-50"
            disabled={loading}
          >
            Login
          </Button>
        </form>
        <Text marginTop={"4"} className="text-center">
          or
        </Text>
        <Button
          marginTop={"4"}
          className="w-full disabled:cursor-not-allowed disabled:opacity-50"
          disabled={true}
        >
          <img src="./google_logo.svg" className="w-4 h-4 mr-2" />
          Login with Google
        </Button>
        <Text marginTop={"4"} className="text-center">
          Dont have an account? <Link to="/signup">Signup</Link>
        </Text>
      </Container>
    </main>
  );
}
