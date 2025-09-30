import { useForm } from "react-hook-form";

type FormData = { email: string; password: string };
export default function LoginPage() {
  const { register, handleSubmit } = useForm<FormData>;
  const [login, {isLoading}]= useLogin
}
