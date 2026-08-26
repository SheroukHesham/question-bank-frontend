import { Button } from "@/ui/components/ui/button";
import { Input } from "@/ui/components/ui/input";
import { Label } from "@/ui/components/ui/label";
import { login } from "@/ui/features/userSlice";
import { loginSchema, type LoginFormValues } from "@/ui/validation";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Toaster } from "sonner";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
  });

  //todo: loading state, toast on failed login, reset form on successful login
  //todo: dispatch
  const onSubmit = (data: LoginFormValues) => {
    console.log(data);
    dispatch(login());
    navigate("/");

    // toast.error("Invalid email or password", {
    //   position: "top-center",
    //   style: { justifyContent: "center", color: "crimson", fontSize: "16px" },
    // });
  };

  return (
    <div className=" w-full flex  h-screen justify-center items-center">
      <div className="w-lg min-h-90 h-122.5 flex  items-center bg-white px-7 py-10 rounded-md ">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full h-full flex flex-col justify-between"
        >
          <div className="flex justify-center items-center w-full mb-10">
            <span className="font-semibold text-3xl  ">
              Login to Your Account
            </span>
          </div>

          <div className="flex flex-col justify-around h-full">
            <div className="flex flex-col gap-3">
              <Label className="text-lg">Email</Label>
              <Input
                {...register("email")}
                className={"bg-primary/5"}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="text-destructive text-sm font-semibold">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <Label className="text-lg">Password</Label>
              <Input
                {...register("password")}
                className={"bg-primary/5"}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-destructive text-sm font-semibold">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="w-full mt-10">
            <Button className="w-full">Login</Button>
          </div>
        </form>
      </div>
      <Toaster />
    </div>
  );
};

export default Login;
