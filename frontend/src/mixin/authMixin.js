// src/mixins/authMixin.js
import axios from "axios";
import { toast } from "vue3-toastify";
export default {
  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
      errorMessage: "",
    };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    async login() {
      if (!this.email || !this.password) {
        toast.warning("Email and password are required.");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:8000/auth/login",
          {
            email: this.email,
            password: this.password,
          },
          { withCredentials: true }
        );
        const role = response.data.role;
        localStorage.setItem("role", role);

        if (role === "Admin") {
          this.$router.push("/admin-dashboard");
        } else if (role === "Faculty") {
          this.$router.push("/faculty-dashboard");
        } else {
          toast.warning("Unknown role. Redirect canceled.");
        }
      } catch (error) {
        toast.error("Login failed. Please check your credentials.");
      }
    },
  },
};
