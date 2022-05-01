<template>
  <div>
    <router-view v-if="$route.meta.keepAlive" v-slot="{ Component }">
      <transition name="router-fade" mode="out-in">
        <keep-alive>
          <component :is="Component"></component>
        </keep-alive>
      </transition>
    </router-view>
    <router-view v-if="!$route.meta.keepAlive" v-slot="{ Component }">
      <transition name="router-fade" mode="out-in">
        <component :is="Component"></component>
      </transition
    ></router-view>
    <svg-icon></svg-icon>
  </div>
</template>

<script>
import svgIcon from './components/common/svg';
export default {
  components: {
    svgIcon,
  },
};
</script>

<style lang="scss">
@import './style/common';
.router-fade-enter-active,
.router-fade-leave-active {
  transition: opacity 0.3s;
}
.router-fade-enter,
.router-fade-leave-active {
  opacity: 0;
}
</style>
