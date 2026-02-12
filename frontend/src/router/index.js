import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import sidebar from "../components/admin/navigation/sidebar.vue";
import facultySidebar from "../components/faculty/navigation/sidebar.vue";
// import templates from "../components/admin/reusable/templates.vue";
import NotFound from "../views/404.vue";
const routes = [
  {
    path: "/",
    name: "login",
    component: LoginView,
  },
  {
    path: "/navigation",
    name: "navigation",
    component: sidebar,
    children: [
      {
        path: "/admin-dashboard",
        name: "admin-dashboard",
        component: () => import("@/components/admin/dashboard/dashboard.vue"),
        meta: { requiresAuth: true, role: "Admin" },
      },
      {
        path: "/instructor",
        name: "instructor",
        component: () => import("@/components/admin/records/instructor.vue"),
        meta: { requiresAuth: true, role: "Admin" },
      },
      {
        path: "/courses",
        name: "courses",
        component: () => import("@/components/admin/records/courses.vue"),
        meta: { requiresAuth: true, role: "Admin" },
        children: [],
      },
      {
        path: "/curriculum",
        name: "curriculum",
        component: () => import("@/components/admin/records/curriculum.vue"),
        meta: { requiresAuth: true, role: "Admin" },
        children: [],
      },

      {
        path: "/programs",
        name: "programs",
        component: () => import("@/components/admin/records/programs.vue"),
        meta: { requiresAuth: true, role: "Admin" },
        children: [],
      },
      {
        path: "/projects",
        name: "projects",
        component: () => import("@/components/admin/records/project.vue"),
        meta: { requiresAuth: true, role: "Admin" },
        children: [],
      },
      {
        path: "/rooms",
        name: "rooms",
        component: () => import("@/components/admin/records/rooms.vue"),
        meta: { requiresAuth: true, role: "Admin" },
        children: [],
      },
      {
        path: "/time",
        name: "time",
        component: () => import("@/components/admin/records/time.vue"),
        meta: { requiresAuth: true, role: "Admin" },
        children: [],
      },

      {
        path: "/schedulers",
        name: "schedulers",
        component: () => import("@/components/admin/records/schedulers.vue"),
        meta: { requiresAuth: true, role: "Admin" },
        children: [],
      },
      {
        path: "/classes",
        name: "classes",
        component: () => import("@/components/admin/records/classes.vue"),
        meta: { requiresAuth: true, role: "Admin" },
        children: [],
      },

      {
        path: "/bachelor-programs",
        name: "bachelor-programs",
        component: () =>
          import("@/components/admin/records/bachelor-programs.vue"),
        meta: { requiresAuth: true, role: "Admin" },
        children: [],
      },
      {
        path: "/master-programs",
        name: "master-programs",
        component: () =>
          import("@/components/admin/records/master-programs.vue"),
        meta: { requiresAuth: true, role: "Admin" },
        children: [],
      },

      {
        path: "/doctorate-programs",
        name: "doctorate-programs",
        component: () =>
          import("@/components/admin/records/doctorate-programs.vue"),
        meta: { requiresAuth: true, role: "Admin" },
        children: [],
      },
      {
        path: "/sections",
        name: "sections",
        component: () => import("@/components/admin/records/sections.vue"),
        meta: { requiresAuth: true, role: "Admin" },
        children: [],
      },
      {
        path: "/views",
        name: "views",
        component: () =>
          import("@/components/admin/records/view-schedules.vue"),
        meta: { requiresAuth: true, role: "Admin" },
        children: [],
      },
      {
        path: "/faculty-schedules",
        name: "faculty-schedules",
        component: () => import("@/components/admin/records/faculty-loads.vue"),
        meta: { requiresAuth: true, role: "Admin" },
      },
      {
        path: "/semester-settings",
        name: "semester-settings",
        component: () =>
          import("@/components/admin/records/semester-settings.vue"),
        meta: { requiresAuth: true, role: "Admin" },
      },
      {
        path: "/view-faculty-load/:id",
        name: "view-faculty-load",
        component: () =>
          import("@/components/admin/records/modals/view-faculty-loads.vue"),
        meta: { requiresAuth: true, role: "Admin" },
      },
      {
        path: "/course-offered",
        name: "course-offered",
        component: () =>
          import("@/components/admin/records/course-offered.vue"),
        meta: { requiresAuth: true, role: "Admin" },
      },
      {
        path: "/view-course-offered/:id",
        name: "view-course-offered",
        component: () =>
          import("@/components/admin/records/modals/view-course-offered.vue"),
        meta: { requiresAuth: true, role: "Admin" },
      },
      {
        path: "/view-pdf-faculty-loads/:id",
        name: "view-pdf-faculty-loads",
        component: () =>
          import(
            "@/components/admin/records/modals/view-pdf-faculty-loads.vue"
          ),
        meta: { requiresAuth: true, role: "Admin" },
      },
      // {
      //   path: "/view-program",
      //   name: "views-program",
      //   component: () =>
      //     import(
      //       "@/components/admin/records/tables/tables-views/table-view-programs.vue"
      //     ),
      //   children: [],
      // },
    ],
  },
  {
    path: "/faculty-navigation",
    name: "faculty-navigation",
    component: facultySidebar,
    children: [
      {
        path: "/faculty-dashboard",
        name: "faculty-dashboard",
        component: () => import("@/components/faculty/dashboard/dashboard.vue"),
        meta: { requiresAuth: true, role: "Faculty" },
      },
      {
        path: "/faculty-loadings",
        name: "faculty-loadings",
        component: () =>
          import("@/components//faculty/faculty-records/loads.vue"),
        meta: { requiresAuth: true, role: "Faculty" },
      },
      {
        path: "/view-pdf-faculty-loadings/:id",
        name: "view-pdf-faculty-loadings",
        component: () =>
          import(
            "@/components/faculty/faculty-records/modals/view-pdf-faculty-loadings.vue"
          ),
        meta: { requiresAuth: true, role: "Faculty" },
      },
    ],
  },
  // {
  //   path: "/faculty-loads",
  //   name: "faculty-loads",
  //   component: () =>
  //     import(
  //       "@/components/faculty/faculty-records/modals/view-faculty-loading.vue"
  //     ),
  //   meta: { requiresAuth: true, role: "Faculty" },
  // },

  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
// 🔒 Navigation Guard
router.beforeEach((to, from, next) => {
  const role = localStorage.getItem("role");

  if (to.meta.requiresAuth) {
    if (!role) return next({ name: "login" });

    // Role mismatch
    if (to.meta.role && to.meta.role !== role) {
      return next({ name: "NotFound" });
    }
  }

  next();
});

export default router;
