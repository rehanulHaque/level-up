import {
  Button,
  FormControl,
  FormLabel,
  Input,
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
    <main className="app-container pt-28">
      <div className="max-w-md mx-auto card">
        <h2 className="text-2xl font-semibold mb-2">Login to your account</h2>
        <p className="muted mb-4">Welcome back — continue your progress</p>
        <form onSubmit={handleSubmit(onSubmitHandler)} className="flex flex-col gap-3">
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input type="text" {...register("email")} />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input type="password" {...register("password")} />
          </FormControl>
          <Button
            marginTop={"4"}
            type="submit"
            className="w-full disabled:cursor-not-allowed disabled:opacity-50 btn-accent"
            disabled={loading}
          >
            Login
          </Button>
        </form>
        <div className="text-center my-4 muted">or</div>
        <Button className="w-full disabled:cursor-not-allowed disabled:opacity-50" disabled={true}>
          <img src="./google_logo.svg" className="w-4 h-4 mr-2" />
          Login with Google
        </Button>
        <p className="text-center mt-4 muted">Dont have an account? <Link to="/signup" className="accent">Signup</Link></p>
      </div>
    </main>
  );
}
