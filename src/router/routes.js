import Vue from 'vue';
import VueRouter from 'vue-router';
import ZeroStep from '../components/ZeroStep.vue';
import PersonalData from '../components/PersonalData.vue';
import ItemsPicker from '../components/ItemsPicker.vue';
import CarsPicker from '../components/CarsPicker.vue';
import Review from '../components/Review.vue';
import paths from "../constants/paths";

Vue.use(VueRouter);

const router = new VueRouter({
	mode: 'history',
	routes: [
		{
			path: paths.MY_MOVING_PLAN,
			name: "ZeroStep",
			component: ZeroStep,
			props: true
		},
		{
			path: paths.MY_DETAILS,
			name: "PersonalData",
			component: PersonalData,
			props: true
		},
		{
			path: paths.MY_INVENTORY,
			name: "ItemsPicker",
			component: ItemsPicker,
			props: true
		},
		{
			path: paths.MY_CAR,
			name: "CarsPicker",
			component: CarsPicker,
			props: true
		},
		{
			path: paths.REVIEW_AND_FINISH,
			name: "Review",
			component: Review,
			props: true
		}
	],
	linkActiveClass: 'active',
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
});

export default router
