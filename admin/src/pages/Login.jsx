import { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";

const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { setAToken, backendUrl } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      if (state === "Admin") {
        const { data } = await axios.post(backendUrl + "/api/admin/login", {
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("aToken", data.token);
          setAToken(data.token);
          toast.success("Logged in successfully");
          navigate("/admin-dashboard");
        } else {
          toast.error(data.message || "Login failed");
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/doctor/login", {
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("dToken", data.token);
          setDToken(data.token);
          navigate("/doctor-dashboard");
          toast.success("Logged in successfully");
        } else {
          toast.error(data.message || "Login failed");
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8 flex flex-col gap-4">
            {/* Title */}
            <p className="text-2xl font-semibold text-center text-gray-700">
              <span className="text-primary">{state}</span> Login
            </p>

            {/* Form */}
            <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-zinc-600">Email</label>
                <input
                  className="border border-[#DADADA] bg-[#F8F9FF] rounded-md w-full px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  type="email"
                  placeholder={`${state.toLowerCase()}@example.com`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-zinc-600">Password</label>
                <div className="relative">
                  <input
                    className="border border-[#DADADA] bg-[#F8F9FF] rounded-md w-full px-3 py-2.5 pr-10 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    tabIndex={-1}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 mt-1 rounded-md text-base font-medium text-white hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ backgroundColor: "#5f6FFF" }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            {/* Role switch */}
            {state === "Admin" ? (
              <p className="text-sm text-zinc-600">
                Doctor Login?{" "}
                <span
                  onClick={() => {
                    setState("Doctor");
                    setEmail("");
                    setPassword("");
                  }}
                  className="text-primary underline cursor-pointer hover:opacity-80"
                >
                  Click here
                </span>
              </p>
            ) : (
              <p className="text-sm text-zinc-600">
                Admin Login?{" "}
                <span
                  onClick={() => {
                    setState("Admin");
                    setEmail("");
                    setPassword("");
                  }}
                  className="text-primary underline cursor-pointer hover:opacity-80"
                >
                  Click here
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
