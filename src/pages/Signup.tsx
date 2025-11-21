import {
  Button,
  FormControl,
  FormLabel,
  Input,
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
    <main className="app-container pt-28">
      <div className="max-w-md mx-auto card">
        <h2 className="text-2xl font-semibold mb-2">Create an account</h2>
        <p className="muted mb-4">Join and start building your streak</p>
        <form onSubmit={handleSubmit(onSubmitHandler)} className="flex flex-col gap-3">
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
            <Input type="password" {...register("password")} />
          </FormControl>
          <Button
            marginTop={"4"}
            type="submit"
            className="w-full disabled:cursor-not-allowed disabled:opacity-50 btn-accent"
            disabled={loading}
          >
            Sign up
          </Button>
        </form>
        <div className="text-center my-4 muted">or</div>
        <Button className="w-full disabled:cursor-not-allowed disabled:opacity-50" disabled={true}>
          <img src="./google_logo.svg" className="w-4 h-4 mr-2" />
          Sign up with Google
        </Button>
        <p className="text-center mt-4 muted">Already have an account? <Link to="/login" className="accent">Login</Link></p>
      </div>
    </main>
  );
}
