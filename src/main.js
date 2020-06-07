import Vue from 'vue'
import MainForm from './components/Mainform.vue';
import AutoForm from './components/AutoForm.vue';
import AddItem from './components/AddItem.vue';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import BaseLayout from './components/BaseLayout.vue';

import Datepicker from 'vuejs-datepicker';
import SelectDropdown from './components/SelectDropdown.vue';
import VueGoogleAutocomplete from 'vue-google-autocomplete';
import VueScrollTo from 'vue-scrollto';

import Router from './router/routes.js';
import AppSteps from "./AppSteps";
import AppForm from "./AppForm";

Vue.component('app-mainform', MainForm);

Vue.component('app-autoform', AutoForm);

Vue.component('add-item', AddItem);

Vue.component('datepicker', Datepicker);

Vue.component('vue-google-autocomplete', VueGoogleAutocomplete);

Vue.component('custom-select', SelectDropdown);

Vue.component('app-form', AppForm);

Vue.component('app-steps', AppSteps);

Vue.component('app-header', Header);

Vue.component('app-footer', Footer);

Vue.component('base-layout', BaseLayout);


// default options
Vue.use(VueScrollTo);


export const dataBus = new Vue({
	data: {
		userName: '',
		userLastName: '',
		userEmail: '',
		userPhone: '',
		inventory: [],
		rooms: [],
		roomsToAdd: [],
		//-- move start form
		moveFrom: '',
		fromPostal: 10000,
		toPostal: 10000,
		moveTo: '',
    date: '',
		userHomeSize: { name: 'Home size', id: 0 },
		scrollControll: false,
		//--cars
		globalcarsApi: [],
		globalCars: [],
		globalOptions: [],
		userCars: [],
		startFromHome: '',
		carsQuantity: '',
		mapOne: 'map',
		mapTwo: 'map1',
		displayRooms: [],
		cleared: false,
		from_place_id: '',
		to_place_id: '',
	}
});

var cc = new Vue({
  el: '#cc-app',
  router: Router
});






