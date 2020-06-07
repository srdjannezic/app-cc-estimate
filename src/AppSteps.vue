<template>
  <router-view />
</template>

<script>
    import axios from 'axios';
    import { dataBus } from './main';
    import { ESTIMATE_FORM } from "./constants/localStorage";

    export default {
       created() {
         if (localStorage.getItem(ESTIMATE_FORM)) {
           const estimateFormInitData = JSON.parse(localStorage.getItem(ESTIMATE_FORM));

           Object.entries(estimateFormInitData).map(item => {
             if (dataBus.hasOwnProperty(item[0])) {
               if (item[0] === 'date') {
                 dataBus[item[0]] = new Date(item[1]);
               } else {
                 dataBus[item[0]] = item[1];
               }
             }
           });
         }

            let requestCars = "https://crosscountrymovers.com/api/cars";

            axios.get(requestCars)
            .then(response => {
                dataBus.globalcarsApi = response.data;
                let that = this;

                dataBus.globalcarsApi.forEach(function(maker, index) {

                    dataBus.globalCars.push({ name: maker.make.title, models: maker.make.models  });
                    dataBus.globalOptions.push({ name : maker.make.title });

                });
            })
            .catch(errors => {
                // react on errors.
                console.log(errors)
            })

        },

      mounted() {
        if (localStorage.getItem(ESTIMATE_FORM)) localStorage.removeItem(ESTIMATE_FORM);
      }
    }
</script>

<style lang="scss">
    @import "./scss/style.scss";
</style>
