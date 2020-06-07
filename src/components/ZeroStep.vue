<!-- ZERO STEP from site you can start form here insted from hero -->
<template>
	<div class="zero-form step-0" id="step-modal">
		<base-layout>
		<!-- steps show bar -->
		<header class="steps-show-bar" id="steps">
			<div class="container">
				<ul>
					<li class="step-num-1 active"><span>1</span><i>My <em>move </em>plan</i></li>
				</ul>
			</div>
		</header>
		<main class="main-panel" id="main-panel">
			<div class="container">
				<h1 class="step__title">What are you moving?</h1>
				<div class="start-choose">
					<div class="start__house" :class="switchClassHome ? 'activeHome' : '' " @click="startAndClearHome" v-scroll-to="{ el: '#scroll-form', container: 'body' , duration: 800, offset: -160 }">
						<figure class="img-wrapper">
							<img src="/themes/cc/assets/images/move-house.png" alt="">
						</figure>
						<h3>Home</h3>
						<div class="icon-success"><span class="path1"></span><span class="path2"></span></div>
					</div>
					<div class="start__car" :class="switchClassCar ? 'activeCar' : '' " @click="startAndClearCar" v-scroll-to="{ el: '#scroll-form', container: 'body', duration: 800, offset: -160 }">
						<figure class="img-wrapper">
							<img src="/themes/cc/assets/images/move-car.svg" alt="">
						</figure>
						<h3>Car</h3>
						<div class="icon-success"><span class="path1"></span><span class="path2"></span></div>
					</div>
				</div>
			</div>
			<div class="alternative-form" id="scroll-form">
				<h2 class="step__title" v-if="showTitle">Choose locations, date and size.</h2>
					<app-mainform v-if="alternativeHomeForm" :class="alternativeHomeForm ? 'fromHome' : ''"></app-mainform>
    				<app-autoform v-if="alternativeAutoForm" :class="alternativeAutoForm ? 'fromCar' : ''"></app-autoform>
			</div>
			<app-footer></app-footer>
		</main>
		</base-layout>
	</div>
</template>
<script>
	import { dataBus } from '../main';
	export default {
		props: ['alternative'],
		data() {
			return {
				alternativeHomeForm: false,
				alternativeAutoForm: false,
				switchClassHome: false,
				switchClassCar: false,
				showTitle: false
			}
		},
		methods: {
			startHome() {
				this.switchClassHome = true;
				this.switchClassCar = false;
				this.alternativeHomeForm = true;
				this.alternativeAutoForm = false;
				this.showTitle = true;
				dataBus.startFromHome = true;
			},
			startAndClearHome() {
				this.startHome();
				dataBus.userCars = [];
			},
			startCar() {
				this.switchClassCar = true;
				this.switchClassHome = false;
				this.alternativeHomeForm = false;
				this.alternativeAutoForm = true;
				this.showTitle = true;
				dataBus.startFromHome = false;
			},
			startAndClearCar() {
				this.startCar();
				dataBus.userHomeSize = { name: 'Home size', id: 0 };
				dataBus.displayRooms = [];
			}
		},

		created() {
			dataBus.mapOne = 'map2',
			dataBus.mapTwo = 'map3'
		},
		mounted() {
			if (dataBus.startFromHome === true) {
				this.startHome()
			} else if(dataBus.startFromHome === false) {
				this.startCar()
			}
		}
	}
</script>
