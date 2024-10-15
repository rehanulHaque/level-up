import {
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  const toast = useToast();
  const onSubmitHandler = async (data: any) => {
    setLoading(true);

    try {
      setLoading(true);
      const user = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      await sendEmailVerification(user.user);
      const userCurr = auth.currentUser;
      if (userCurr) {
        await updateProfile(userCurr, {
          displayName: data.name,
        });
      }
      if (user) {
        toast({
          title: "Account Created",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Failed to create account",
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
          Create an account
        </Text>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input type="text" {...register("name")} />
          </FormControl>
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
            Sign up
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
          Sign up with Google
        </Button>
        <Text marginTop={"4"} className="text-center">
          Already have an account? <Link to="/login">Login</Link>
        </Text>
      </Container>
    </main>
  );
}
