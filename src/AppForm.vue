<template>
  <div class="estimate-wrapper">

    <div class="home-start">
      <div class="tab-wrapper" :class="switchClass" v-if="!showZero">
        <div class="btn-tab-house btn-tab"  @click="switchHome()"><span>Home</span></div>
        <div class="btn-tab-car btn-tab" @click="switchAuto()"><span>Auto</span></div>
      </div>
      <app-mainform v-if="showHomeForm" />
      <app-autoform v-if="showAutoForm" />
    </div>
  </div>
</template>

<script>
  import { dataBus } from './main';
  import { ESTIMATE_FORM } from "./constants/localStorage";

  export default {
    data() {
      return {
        showHomeForm: true,
        showAutoForm: false,
        switchClass: '',
        showZero: false,
        alternative: false,
        scrollControll: false
      }
    },
    methods: {
      switchHome() {
        this.showHomeForm = true;
        this.showAutoForm = false;
        this.switchClass = 'active-home';
        dataBus.startFromHome = true;
        dataBus.userCars = [];
      },
      switchAuto() {
        this.showHomeForm = false;
        this.showAutoForm = true;
        this.switchClass = 'active-car';
        dataBus.userHomeSize = { name: 'Home size', id: 0 };
        dataBus.displayRooms = [];
      },
    },
    mounted() {
      if (localStorage.getItem(ESTIMATE_FORM)) localStorage.removeItem(ESTIMATE_FORM);
    }
  }
</script>

<style lang="scss">
  @import "./scss/style.scss";
</style>