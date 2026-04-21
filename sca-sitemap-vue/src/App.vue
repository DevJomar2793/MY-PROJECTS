<script setup>
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const excludedRoutes = ['Index', 'Login', 'Signup', 'ForgotPassword', 'ResetPassword'];

const applyTheme = () => {
  const theme = localStorage.getItem('theme') || 'light';
  const isExcluded = excludedRoutes.includes(route.name);
  
  if (theme === 'dark' && !isExcluded) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
};

onMounted(() => {
  applyTheme();
  // Listen for local storage changes or custom events
  window.addEventListener('theme-changed', applyTheme);
});

watch(() => route.name, () => {
  applyTheme();
});
</script>

<template>
  <router-view />
</template>
