import { createRouter, createWebHistory } from "vue-router";


import Signup from "../views/Signup.vue";
import Signin from "../views/Signin.vue";
import axios from '@/config';
import UserLayout from "../layout/UserLayout.vue";
import AdminLayout from "../layout/AdminLayout.vue";

const routes = [
  {
    path: "/",
    component: UserLayout,
    children: [
      { path: "", name: "Home", component: () => import("@/views/user/Home.vue") },
      { path: "rooms", name: "Rooms", component: () => import("@/views/user/UserRoom.vue") },
      { path: "profile", name: "UserProfile", component: () => import("@/views/user/userProfile.vue") },
      { path: "contact", name: "Contact", component: () => import("@/views/user/ContactForm.vue") },
      { path: "booking/:id/detail", name: "BookingDetail", component: () => import("@/views/user/BookingDetail.vue") },
      { path: "bookings/history", name: "BookingHistory", component: () => import("@/views/user/BookingHistory.vue") },
      { path: "room/:id", name: "RoomDetail", component: () => import("@/views/user/RoomDetail.vue") },
      { path: "about", name: "About", component: () => import("@/views/user/AboutUs.vue") },
      { path: "booking/:bookingId/payment", name: "uploadPayment", component: () => import("@/views/user/UploadPayment.vue") },
    ],
  },
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAdmin: true },
    children: [
      { path: "rooms", name: "RoomManager", component: () => import("@/views/admin/RoomManager.vue"), meta: { requiresAdmin: true } },
      { path: "floors", name: "FloorManager", component: () => import("@/views/admin/FloorManager.vue"), meta: { requiresAdmin: true } },
      { path: "services", name: "ServiceManager", component: () => import("@/views/admin/ServiceManager.vue"), meta: { requiresAdmin: true } },
      { path: "revenue", name: "RevenueStats", component: () => import("@/views/admin/RevenueStats.vue"), meta: { requiresAdmin: true } },
      { path: "roomType", name: "roomType", component: () => import("@/views/admin/RoomType.vue"), meta: { requiresAdmin: true } },
      { path: "bookings", name: "BookingManager", component: () => import("@/views/admin/AdminBookingList.vue"), meta: { requiresAdmin: true } },
      { path: "bookings/:id", name: "AdminBookingDetail", component: () => import("@/views/admin/AdminBookingDetail.vue"), meta: { requiresAdmin: true } },
      { path: "bookings/:id/edit", name: "AdminBookingEdit", component: () => import("@/views/admin/AdminBookingEdit.vue"), meta: { requiresAdmin: true } },
      { path: "bookings/pending", name: "PendingBookingManager", component: () => import("@/views/admin/AdminPendingBookings.vue"), meta: { requiresAdmin: true } },
      { path: "user", name: "UserList", component: () => import("@/views/admin/AdminUserList.vue"), meta: { requiresAdmin: true } },
      { path: "reviews", name: "AdminReviewList", component: () => import("@/views/admin/AdminReviewList.vue"), meta: { requiresAdmin: true } },
    ],
  },
  {
    path: "/signin",
    name: "Signin",
    component: Signin,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem("accessToken");
      console.log("âjaja",token)

  if (to.path.startsWith("/admin")) {
    if (!token) {
      localStorage.clear();

      return next("/signin");
    }

    try {
      const res = await axios.get("/user", {
        headers: {
          Authorization: `Bearer ${token}` // lấy ra tt của user đn hiện tại
        },
      });

      const roles = res.data.roles?.map(r => r.roleName) || [];
      console.log("ssssss",roles)
      if (!roles.includes("admin")) {
        localStorage.clear();
        return next("/signin");
      }

      next();
    } catch (err) {
      console.error("Không lấy được thông tin user:", err);
      return next("/signin");
    }
  } else {
    next();
  }
});
export default router;