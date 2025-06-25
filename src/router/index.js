import { createRouter, createWebHistory } from "vue-router";
// import Dashboard from "../views/Dashboard.vue";
// import Tables from "../views/Tables.vue";
// import Billing from "../views/Billing.vue";
// import VirtualReality from "../views/VirtualReality.vue";
// import RTL from "../views/Rtl.vue";
// import Profile from "../views/Profile.vue";
import Signup from "../views/Signup.vue";
import Signin from "../views/Signin.vue";
import UserLayout from "../layout/UserLayout.vue";
import AdminLayout from "../layout/AdminLayout.vue";
const routes = [
  {
    path: "/",
    component: UserLayout,
    children: [
      { path: "", name: "Home", component: () => import("@/views/user/Home.vue") },
      { path: "/rooms", name: "Rooms", component: () => import("@/views/user/UserRoom.vue") },
      {
  path: '/profile',
  name: 'UserProfile',
  component: () => import('@/views/user/userProfile.vue')
},
      { path: "/contact", name: "Contact", component: () => import("@/views/user/ContactForm.vue") },

      {
  path: '/booking/:id/detail',
  name: 'BookingDetail',
  component: () => import('@/views/user/BookingDetail.vue'),
},
      {
  path: "/bookings/history",
  name: "BookingHistory",
  component: () => import("@/views/user/BookingHistory.vue"),
},
      {
  path: '/room/:id',
  name: 'RoomDetail',
  component: () => import('@/views/user/RoomDetail.vue'),
},
      { path: "/about", name: "About", component: () => import("@/views/user/AboutUs.vue") },
      { path: "/booking/:bookingId/payment", name: "uploadPayment", component: () => import("@/views/user/UploadPayment.vue") },
    ],
  },
  {
  path: "/admin",
  component: AdminLayout,
  children: [
    { path: "rooms", name: "RoomManager", component: () => import("@/views/admin/RoomManager.vue") },
    { path: 'floors', name: 'FloorManager', component: () => import('@/views/admin/FloorManager.vue') },
    { path: 'services', name: 'ServiceManager', component: () => import('@/views/admin/ServiceManager.vue') },
    { path: 'revenue', name: 'RevenueStats', component: () => import('@/views/admin/RevenueStats.vue') },
    { path: 'roomType', name: 'roomType', component: () => import('@/views/admin/RoomType.vue') },
    { path: 'bookings', name: 'BookingManager', component: () => import('@/views/admin/AdminBookingList.vue') },
    { path: 'bookings/:id', name: 'AdminBookingDetail', component: () => import('@/views/admin/AdminBookingDetail.vue') },
    { path: 'bookings/:id/edit', name: 'AdminBookingEdit', component: () => import('@/views/admin/AdminBookingEdit.vue') },
    {
  path: 'bookings/pending',
  name: 'PendingBookingManager',
  component: () => import('@/views/admin/AdminPendingBookings.vue')
},
    { path: 'user/', name: 'UserList', component: () => import('@/views/admin/AdminUserList.vue') },
    {
  path: 'reviews',
  name: 'AdminReviewList',
  component: () => import('@/views/admin/AdminReviewList.vue')
    }

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
console.log('Routes:', routes);
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
  
});
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (to.path.startsWith("/admin")) {
    if (!user || !user.roles?.includes("admin")) {
      return next("/signin");
    }
  }

  next();
});
export default router;
