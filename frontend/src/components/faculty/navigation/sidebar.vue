<template>
  <!-- Mobile Floating Hamburger -->
  <button
    @click="toggleSidebar"
    :class="{ hidden: isExpanded }"
    class="md:hidden fixed top-3 left-4 z-[1001] bg-blue-900 text-white p-1.5 rounded-xl shadow-lg hover:bg-blue-800 transition-all"
  >
    <icon name="burger" />
  </button>
  <div class="scale-wrapper">
    <div class="bg-blue-900 w-screen h-screen flex">
      <!-- Sidebar -->
      <div
        :class="[
          isMobile
            ? isExpanded
              ? 'translate-x-0 w-64'
              : '-translate-x-full w-64'
            : isExpanded
            ? 'w-64'
            : 'w-16',
        ]"
        class="h-full fixed left-0 top-0 bg-blue-900 text-white p-3 transition-all duration-300 ease-in-out z-[1000]"
      >
        <!-- Toggle Sidebar -->
        <div @click="toggleSidebar" class="justify-end flex">
          <icon
            :name="'burger'"
            class="cursor-pointer"
            :class="{ 'flex justify-center items-center w-full ': !isExpanded }"
          />
        </div>

        <!-- Logo and user info -->
        <div class="flex flex-col items-center justify-center w-full">
          <img
            src="../../../assets/img/st-logo.png"
            alt="Logo"
            :class="{
              'w-16 rounded-full border-white border ': isExpanded,
              hidden: !isExpanded,
            }"
          />
          <p
            :class="{
              'text-sm font-medium mt-2': isExpanded,
              hidden: !isExpanded,
            }"
          >
            {{ user.first_name }}
          </p>
          <p
            :class="{
              'text-[12px] font-medium tracking-wider': isExpanded,
              hidden: !isExpanded,
            }"
          >
            {{ user.email }}
          </p>
        </div>

        <div v-if="isExpanded" class="w-full h-0.5 bg-[#fbfbfb] mt-4"></div>

        <!-- Dynamic Menu -->
        <div class="flex flex-col mt-6 gap-2 tracking-wide text-[12px] w-full">
          <template v-for="section in menuSections" :key="section.title">
            <!-- Section Title -->
            <div v-if="isExpanded" class="text-md text-white text-left mt-2">
              {{ section.title }}
            </div>

            <!-- Items -->
            <div v-for="item in section.items" :key="item.name" class="w-full">
              <!-- Normal Menu -->
              <router-link
                v-if="!item.children"
                :to="item.route"
                @click="handleDashboardClick"
                class="flex items-center w-full gap-5 p-2 rounded-md transition-all duration-200"
                :class="[
                  $route.path.startsWith(item.route)
                    ? 'bg-white text-blue-900'
                    : 'text-white hover:bg-white hover:text-gray-800',
                  !isExpanded ? 'justify-center' : 'justify-start',
                ]"
              >
                <icon :name="item.icon" />
                <span v-show="isExpanded">
                  {{ item.name }}
                </span>
              </router-link>

              <!-- Dropdown -->
              <div v-else>
                <div
                  @click="toggleDropdown(item.name)"
                  class="flex items-center justify-between w-full p-2 cursor-pointer transition-all duration-200"
                  :class="[
                    isDropdownOpen === item.name
                      ? `bg-white text-gray-800 ${
                          !isExpanded ? 'rounded-md' : 'rounded-t-md'
                        }`
                      : 'text-white hover:bg-white hover:text-gray-800 hover:rounded-md',
                  ]"
                >
                  <div
                    class="flex items-center"
                    :class="[
                      !isExpanded ? 'justify-center w-full' : 'justify-start gap-5',
                    ]"
                  >
                    <icon :name="item.icon" />
                    <span v-show="isExpanded">
                      {{ item.name }}
                    </span>
                  </div>

                  <icon
                    name="arrow-down"
                    v-show="isExpanded"
                    class="transition-transform"
                    :class="{
                      'rotate-180': isDropdownOpen === item.name,
                    }"
                  />
                </div>

                <transition name="slide">
                  <div v-show="isDropdownOpen === item.name && isExpanded">
                    <router-link
                      v-for="(sub, index) in item.children"
                      :key="sub.name"
                      :to="sub.route"
                      class="block w-full py-2 px-[60px] text-[12px] transition-all duration-200 text-left"
                      :class="[
                        $route.path.startsWith(sub.route)
                          ? 'bg-blue-300 text-blue-900'
                          : 'bg-white text-gray-800 hover:bg-gray-200',
                        index === item.children.length - 1 ? 'rounded-b-md' : '',
                      ]"
                    >
                      {{ sub.name }}
                    </router-link>
                  </div>
                </transition>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Main Content -->
      <div
        :class="{
          'ml-0': isMobile,
          'ml-16 pt-2 pb-0': !isMobile && !isExpanded,
          'ml-64 pt-2 pb-0': !isMobile && isExpanded,
        }"
        class="flex-grow transition-all duration-300 min-h-screen rounded-t-lg overflow-hidden"
      >
        <slot>
          <div class="bg-white w-auto h-full rounded-t-lg shadow mr-2">
            <adminTopbar />
            <div class="p-2">
              <router-view></router-view>
            </div>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import icon from "@/assets/icon.vue";
import adminTopbar from "../../../components/admin/navigation/topbar.vue";
import axios from "axios";
export default {
  name: "AdminSidebar",
  components: {
    icon,
    adminTopbar,
  },
  data() {
    return {
      isExpanded: false,
      isMobile: window.innerWidth < 768,
      isDropdownOpen: null,
      user: {},

      menuSections: [
        {
          title: "Home",
          items: [
            {
              name: "Dashboard",
              icon: "dashboard",
              route: "/admin-dashboard",
            },
          ],
        },
        {
          title: "Loads",
          items: [
            {
              name: "My Loading",
              icon: "general",
              route: "/faculty-loadings",
            },
          ],
        },
      ],
    };
  },
  watch: {
    "$route.path"(newPath) {
      this.expandDropdownForCurrentRoute(newPath);
    },
  },
  created() {
    this.expandDropdownForCurrentRoute(this.$route.path);
  },
  mounted() {
    this.fetchUser();

    window.addEventListener("resize", this.checkScreen);
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.checkScreen);
  },

  methods: {
    checkScreen() {
      this.isMobile = window.innerWidth < 768;
    },

    toggleSidebar() {
      this.isExpanded = !this.isExpanded;
    },
    toggleDropdown(name) {
      this.isExpanded = true;
      this.isDropdownOpen = this.isDropdownOpen === name ? null : name;
    },
    expandDropdownForCurrentRoute(path) {
      for (const section of this.menuSections) {
        for (const item of section.items) {
          if (item.children) {
            const found = item.children.find((child) => path.startsWith(child.route));

            if (found) {
              this.isExpanded = true;
              this.isDropdownOpen = item.name;
              return;
            }
          }
        }
      }
    },
    handleDashboardClick() {
      this.isDropdownOpen = null;
      this.isExpanded = false;
    },
    async fetchUser() {
      try {
        const response = await axios.get(process.env.VUE_APP_API_BASE_URL + "/auth/me", {
          withCredentials: true,
        });

        if (response.data) {
          this.user = response.data;
          console.log("Authenticated User:", this.user);
        } else {
          this.$router.push("/");
          location.reload();
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        this.$router.push("/");
      }
    },
  },
};
</script>

<style scoped>
/* Default: Large Laptop & Desktop */
html {
  font-size: 16px;
}

.scale-wrapper {
  transform-origin: top left;
  transform: scale(1); /* Default full size */
}

/* Medium Laptops (1366x768 to 1440px) */
@media (max-width: 1440px) and (min-width: 1280px) {
  html {
    font-size: 15px;
  }

  .scale-wrapper {
    transform: scale(1); /* Slightly smaller, keeps layout readable */
  }
}

/* Smaller Laptops (1024px to 1279px) */
@media (max-width: 1279px) and (min-width: 1024px) {
  html {
    font-size: 14px;
  }

  .scale-wrapper {
    transform: scale(0.94);
  }
}

/* Ensure content adjusts dynamically */
.transition-transform {
  transition: transform 0.1s ease;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.1s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
.slide-enter-to,
.slide-leave-from {
  transform: translateY(0);
  opacity: 1;
}
</style>
