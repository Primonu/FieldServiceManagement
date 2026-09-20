import { useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import API from "../../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      await API.post(`/user_auth/forgetPassword/${encodeURIComponent(email.trim()) }`);
      setMessage("If this email is registered, a password reset link has been sent to your email");
      setEmail("");
    } catch (err: any) {
      console.error("Forget password error:",err);
      if(err.response?.status === 403){
        setError("Request was blocked by the server");
      }else{
        setError("Unable to send reset link");
      }
      }finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="hero-panel min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "#f5f7fa",
        fontFamily: "Inter, Arial, sans-serif",
        padding: "24px",
      }}
    >
      <div
        className="Card1 card border-0 shadow"
        style={{
          width: "100%",
          maxWidth: "460px",
          borderRadius: "12px",
        }}
      >
        <div className="card-body p-4 p-md-5">
          {/* Keystone Logo */}
          <div className="text-center mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center mb-3"
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                background: "#082b64",
                color: "#fff",
                fontSize: "25px",
              }}
            >
              <i className="bi bi-boxes"></i>
            </div>

            <h2
              className="mb-2 fw-bold"
              style={{ color: "#111a2d" }}
            >
              Forgot Password?
            </h2>

            <p
              className="mb-0"
              style={{
                color: "#687083",
                fontSize: "14px",
                lineHeight: "1.6",
              }}
            >
              Enter your registered email address and we'll send you a
              password reset link.
            </p>
          </div>
          {message &&(
            <div className="alert alert-success">{message}</div>
          )}
          {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="form-label fw-semibold"
                  style={{ color: "#283246", fontSize: "14px" }}
                >
                  EMAIL ADDRESS
                </label>

                <div className="position-relative">
                  <i
                    className="bi bi-envelope position-absolute"
                    style={{
                      left: "16px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#929aaa",
                      zIndex: 2,
                    }}
                  ></i>

                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    autoComplete="email"
                    style={{
                      height: "54px",
                      paddingLeft: "46px",
                      borderColor: "#d7dce5",
                      borderRadius: "7px",
                    }}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn w-100 text-white fw-semibold"
                disabled={loading}
                style={{
                  height: "54px",
                  borderRadius: "6px",
                  background: "#082b64",
                  borderColor: "#082b64",
                }}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      aria-hidden="true"
                    ></span>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <i className="bi bi-arrow-right ms-2"></i>
                  </>
                )}
              </button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  className="btn btn-link text-decoration-none"
                  style={{ color: "#23559d", fontSize: "14px" }}
                  onClick={() => window.history.back()}
                >
                  <i className="bi bi-arrow-left me-1"></i>
                  Back to Sign In
                </button>
              </div>
            </form>
        </div>
      </div>
    </div>
  );
}