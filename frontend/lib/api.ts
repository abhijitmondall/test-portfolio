import axios from "axios";

// Use the live backend URL by default when NEXT_PUBLIC_API_URL isn't set
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://test-portfolio-dusky.vercel.app/api";

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Auth interceptor
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("admin_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(err);
  },
);

// ─── API functions ───────────────────────────────────────────
export const profileApi = {
  get: () => api.get("/profile").then((r) => r.data.data),
  update: (data: unknown) => api.put("/profile", data).then((r) => r.data.data),
};

export const projectsApi = {
  getAll: (params?: Record<string, string>) =>
    api.get("/projects", { params }).then((r) => r.data.data),
  getOne: (slug: string) =>
    api.get(`/projects/${slug}`).then((r) => r.data.data),
  create: (data: unknown) =>
    api.post("/projects", data).then((r) => r.data.data),
  update: (id: string, data: unknown) =>
    api.put(`/projects/${id}`, data).then((r) => r.data.data),
  delete: (id: string) => api.delete(`/projects/${id}`).then((r) => r.data),
};

export const experienceApi = {
  getAll: () => api.get("/experiences").then((r) => r.data.data),
  create: (data: unknown) =>
    api.post("/experiences", data).then((r) => r.data.data),
  update: (id: string, data: unknown) =>
    api.put(`/experiences/${id}`, data).then((r) => r.data.data),
  delete: (id: string) => api.delete(`/experiences/${id}`).then((r) => r.data),
};

export const educationApi = {
  getAll: () => api.get("/education").then((r) => r.data.data),
  create: (data: unknown) =>
    api.post("/education", data).then((r) => r.data.data),
  update: (id: string, data: unknown) =>
    api.put(`/education/${id}`, data).then((r) => r.data.data),
  delete: (id: string) => api.delete(`/education/${id}`).then((r) => r.data),
};

export const skillsApi = {
  getAll: () => api.get("/skills").then((r) => r.data.data),
  createCategory: (data: unknown) =>
    api.post("/skills/categories", data).then((r) => r.data.data),
  updateCategory: (id: string, data: unknown) =>
    api.put(`/skills/categories/${id}`, data).then((r) => r.data.data),
  deleteCategory: (id: string) =>
    api.delete(`/skills/categories/${id}`).then((r) => r.data),
  create: (data: unknown) => api.post("/skills", data).then((r) => r.data.data),
  update: (id: string, data: unknown) =>
    api.put(`/skills/${id}`, data).then((r) => r.data.data),
  delete: (id: string) => api.delete(`/skills/${id}`).then((r) => r.data),
};

export const blogApi = {
  getAll: (params?: Record<string, string>) =>
    api.get("/blog", { params }).then((r) => r.data.data),
  getAllAdmin: () => api.get("/blog/admin/all").then((r) => r.data.data),
  getOne: (slug: string) => api.get(`/blog/${slug}`).then((r) => r.data.data),
  create: (data: unknown) => api.post("/blog", data).then((r) => r.data.data),
  update: (id: string, data: unknown) =>
    api.put(`/blog/${id}`, data).then((r) => r.data.data),
  delete: (id: string) => api.delete(`/blog/${id}`).then((r) => r.data),
};

export const messagesApi = {
  send: (data: unknown) => api.post("/messages", data).then((r) => r.data),
  getAll: (params?: Record<string, string>) =>
    api.get("/messages", { params }).then((r) => r.data.data),
  updateStatus: (id: string, status: string) =>
    api.patch(`/messages/${id}/status`, { status }).then((r) => r.data.data),
  delete: (id: string) => api.delete(`/messages/${id}`).then((r) => r.data),
};

export const socialApi = {
  getAll: () => api.get("/social").then((r) => r.data.data),
  create: (data: unknown) => api.post("/social", data).then((r) => r.data.data),
  update: (id: string, data: unknown) =>
    api.put(`/social/${id}`, data).then((r) => r.data.data),
  delete: (id: string) => api.delete(`/social/${id}`).then((r) => r.data),
};

export const settingsApi = {
  get: () => api.get("/settings").then((r) => r.data.data),
  update: (data: Record<string, string>) =>
    api.put("/settings", data).then((r) => r.data),
};

export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }).then((r) => r.data.data),
  me: () => api.get("/auth/me").then((r) => r.data.data),
  changePassword: (data: unknown) =>
    api.patch("/auth/change-password", data).then((r) => r.data),
};

export const uploadApi = {
  image: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return api
      .post("/upload/image", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data.data);
  },
};
