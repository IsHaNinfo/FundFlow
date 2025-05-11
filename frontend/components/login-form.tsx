"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@/components/ui/error-message";
import { jwtDecode } from "jwt-decode"
import { customerApi } from "@/services/api"
interface DecodedToken {
    id: string
    email: string
    role: string
    iat: number
    exp: number
}
export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {

            const res = await customerApi.login({ email, password })
            const token = res.data.token;
            localStorage.setItem("token", token);
            await new Promise(resolve => setTimeout(resolve, 500));

            const decoded = jwtDecode<DecodedToken>(token);
            const userRole = decoded.role;
            await new Promise(resolve => setTimeout(resolve, 500));

            switch (userRole) {
                case 'admin':
                    router.push("/admin/dashboard");
                    break;
                case 'customer':
                    router.push("/customer/dashboard");
                    break;
                default:
                    setError("Invalid user role");
                    break;
            }
        } catch (err: any) {
            console.log(err)
            // More specific error handling
            if (err.response?.status === 401) {
                setError("Invalid email or password");
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Login failed. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                    <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6">
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                        <a
                                            href="#"
                                            className="ml-auto text-sm underline-offset-4 hover:underline"
                                        >
                                            Forgot your password?
                                        </a>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? "Logging in..." : "Login"}
                                </Button>
                                <ErrorMessage message={error} />
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </div>
        </div>
    );
}