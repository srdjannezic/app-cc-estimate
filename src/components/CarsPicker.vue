<template>
	<div class="cars-picker-wrapper step-4" id="step-modal">
		<base-layout>
		<!-- steps show bar -->
		<header class="steps-show-bar" id="steps">
			<div class="container">
				<ul>
					<!--step 1-->
					<li class="step-num-1 passed"><router-link :to="paths.MY_MOVING_PLAN"><span>1</span><i>My <em>move </em>plan</i></router-link></li>
					<!--step 2-->
					<li class="step-num-2 passed"><router-link :to="paths.MY_DETAILS"><span>2</span><i><em>My </em>details</i></router-link></li>
					<!--step 3-->
					<li class="step-num-3 passed" v-if="startFromHome"><router-link :to="paths.MY_INVENTORY"><span>3</span><i><em>Select </em>your items</i></router-link></li>
					<li class="step-num-3 active" v-if="!startFromHome"><router-link :to="paths.MY_CAR"><span>3</span><i><em>Car </em>details</i></router-link></li>
					<!--step 4-->
					<li class="step-num-4 active" v-if="startFromHome"><router-link to="#"><span>4</span><i><em>Moving your </em>car<em>?</em></i></router-link></li>
					<li class="step-num-4" v-if="!startFromHome"><router-link to="#"><span>4</span><i><em>Include</em> your home<em>?</em></i></router-link></li>
					<!--step 5-->
					<li class="step-num-5"><router-link to="#"><span>5</span><i><em>Review and </em>finish</i></router-link></li>
				</ul>
			</div>
		</header>
		<main class="main-panel">
			<div class="container">
				<!--start from home-->
				<h2 class="step__title" v-if="startFromHome">Need to move your car/automobile?</h2>
				<!--start from cars-->
				<h2 class="step__title" v-if="!startFromHome">What kind of car are you moving?</h2>
				<!--Skip step or cleaar ALL-->
				<div class="clear-note">
					<div class="inner-wrapper">
						<p>If you wish to add one or more car please click on add car button. You can delete added car. Also you can skip this step.</p>
					</div>
					<div class="btn-wrapper">
						<button class="btn-default btn-clear b-grey" @click="triggerClear()" :disabled="!carsBox.length"><span>Clear all cars</span></button>
						<!-- btn skip if start from house -->
						<router-link :to="paths.REVIEW_AND_FINISH"><button class="btn-default btn-skip b-white" v-if="startFromHome"><span>Skip this</span></button></router-link>
						<!-- btn skip if start from house -->
						<router-link :to="paths.MY_INVENTORY"><button class="btn-default btn-skip b-white" v-if="!startFromHome"><span>Skip this</span></button></router-link>
					</div>
					<div class="icon-info"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></div>
				</div>
				<!-- CARS ADD FORM -->
				<section class="add-cars-wrapper">
					<div class="addCar-box" v-for="(car, index) in carsBox" :class="checkRed">
						<h3 class="addCar-box__title">Car number {{ index + 1 }} <i class="icon-close" @click="removeCarInput(index)"></i></h3>
						<!-- select box -->
						<div class="select-box car-maker" v-on:click="startSelectMaker($event, index)">
							<div class="select-box__label" :class="car.maker=='Car Maker' ? 'red' : ''"><span>{{ car.maker }}</span><i class="icon-arrow-down" :class="showMakerOptions === index ? 'active': ''"></i></div>
							<div class="select-box__options" v-if="showMakerOptions === index">
								<ul>
									<li class="select__option" v-for="maker in makerOptions" @click="chooseMaker(maker, index)">{{ maker.name }}</li>
								</ul>
							</div>
						</div>
						<!-- select box -->
						<div class="select-box car-model" v-on:click="startSelectModel($event, index)">
							<div class="select-box__label" :class="car.model=='Car Model' ? 'red' : ''"><span>{{ car.model }}</span><i class="icon-arrow-down" :class="showModelOptions === index ? 'active': ''"></i></div>
							<div class="select-box__options" v-if="showModelOptions === index">
								<ul>
									<li class="select__option" v-for="(model, indexM) in carsBox[index].models" @click="chooseModel(model, index, indexM)">{{ model.model.title }}</li>
								</ul>
							</div>
						</div>
						<!-- select box -->
						<div class="select-box car-year" v-on:click="startSelectYear($event,index)">
							<div class="select-box__label" :class="car.year=='Car Year' ? 'red' : ''"><span>{{ car.year }}</span><i class="icon-arrow-down" :class="showYearOptions === index ? 'active': ''"></i></div>
							<div class="select-box__options" v-if="showYearOptions === index">
								<ul>
									<li class="select__option" v-for="year in yearOptions" @click="chooseYear(year, index)">{{ year.year }}</li>
								</ul>
							</div>
						</div>
					</div>
					<p v-if="warrning" class="warrning-msg">Select all required fieds.</p>
					<!-- add more cars -->
					<div class="btn-wrapper">
						<button class="btn-default b-grey" @click="appendCarInput()"><span><i>+</i>Add car</span></button>
					</div>
				</section>
				<!-- back if you start from home -->
				<button class="btn-default btn-back b-white" v-if="startFromHome" @click="back"><span>Go Back</span></button>
				<!-- back if you start from cars -->
				<button class="btn-default btn-back b-white" @click="back" v-if="!startFromHome"><span>Go Back</span></button>
				<!-- next if you start from home -->
				<button class="btn-default btn-next" @click="submitCarsH($event)" v-if="startFromHome" :disabled="!carsBox.length"><span>Next</span></button>
				<!-- next if you start from cars -->
				<button class="btn-default btn-next" @click="submitCarsC($event)" v-if="!startFromHome" :disabled="!carsBox.length"><span>Next</span></button>
			</div>
			<app-footer></app-footer>
		</main>
		</base-layout>
	</div>
</template>
<script>
	import { dataBus } from '../main';
	import axios from 'axios';
  import pathsMixin from "../mixins/paths";
	export default {
    mixins: [pathsMixin],
		data() {
			return {
				carsApi: '{ "maker": "Car Maker", "model": "Car Model", "year": "Car Year", "models": [] }',
				carsBox: [],
				makerOptions: [],
				yearOptions: [],
				showMakerOptions: null,
				showModelOptions: null,
				showYearOptions: null,
				checkRed: '',
				warrning: false,
				startFromHome: '',
				carsQuantity: ''
			}
		},
		methods: {
			appendCarInput() {
				let carPattern = JSON.parse(this.carsApi);

				this.carsBox.push(carPattern);
				this.checkRed = '';

		    },
		    removeCarInput(index) {
		    	this.carsBox.splice(index, 1);
		    },
		    back() {
		    	if(this.startFromHome) {
		    		this.$router.push({ path: this.paths.MY_INVENTORY });
		    	}
		    	else {
		    		this.$router.push({ path: this.paths.MY_DETAILS });
		    	}
		    },
		    startSelectMaker(event, index) {
	    		event.currentTarget
				.classList.toggle('showOptions');
				if(this.showMakerOptions == null) {
					this.showMakerOptions = index;
				}
				else {
					this.showMakerOptions = null;
				}

				this.showYearOptions = null;
				this.showModelOptions = null;
		    },
		    startSelectModel(event, index) {

		    	if(this.carsBox[index].models.length) {
		    		event.currentTarget
					.classList.toggle('showOptions');
					if(this.showModelOptions == null) {
						this.showModelOptions = index;
					}
					else {
						this.showModelOptions = null;
					}
					this.showYearOptions = null;
					this.showMakerOptions = null;
		    	}

		    },
		    triggerClear() {
		    	this.carsBox = [];
		    	dataBus.userCars = [];
		    },
 			startSelectYear(event, index) {
	    		event.currentTarget
				.classList.toggle('showOptions');
				if(this.showYearOptions == null) {
					this.showYearOptions = index;
				}
				else {
					this.showYearOptions = null;
				}
				this.showModelOptions = null;
				this.showMakerOptions = null;
		    },
		    chooseMaker(maker, index) {
		    	let getMaker = maker.name;
		    	// let getModel = maker.models.model.title;
		    	let getCarBox = this.carsBox[index];
		    	getCarBox.maker = getMaker;
		    	getCarBox.models = maker.models;
		    	getCarBox.model = 'Car Model';
		    	this.warrning = false;

		    },
		    chooseModel(model, index, indexM) {
		    	let getModel = model.model.title;
		    	let getCarBox = this.carsBox[index];
		    	getCarBox.model = getModel;
		    	this.warrning = false;
		    },
		    chooseYear(year, index) {
		    	let getYear = year.year;
		    	let getCarBox = this.carsBox[index];
		    	getCarBox.year = getYear;
		    	this.warrning = false;
		    },
		    submitCarsH(event) {
		    	let allowNext = true;
		    	this.checkRed = 'checkRed';
		    	this.carsBox.forEach(function(car, index){
		    		if(car.maker == 'Car Maker') {
		    			allowNext = false;
		    			return false;
		    		}
		    		if(car.model == 'Car Model') {
		    			allowNext = false;
		    			return false;
		    		}
		    		if(car.year == 'Car Year') {
		    			allowNext = false;
		    			return false;
		    		}
		    	});
		    	this.warrning = true;
		    	if(allowNext == true) {
			    	this.$router.push({ path: this.paths.REVIEW_AND_FINISH });
		    		dataBus.userCars = this.carsBox;
		    		this.warrning = false;
		    	}
		    },
		    submitCarsC(event) {
		    	let allowNext = true;
		    	this.checkRed = 'checkRed';
		    	this.carsBox.forEach(function(car, index){
		    		if(car.maker == 'Car Maker') {
		    			allowNext = false;
		    			return false;
		    		}
		    		if(car.model == 'Car Model') {
		    			allowNext = false;
		    			return false;
		    		}
		    		if(car.year == 'Car Year') {
		    			allowNext = false;
		    			return false;
		    		}
		    	});
	    		this.warrning = true;
		    	if(allowNext == true) {
			    	this.$router.push({ path: this.paths.MY_INVENTORY });
		    		dataBus.userCars = this.carsBox;
		    		this.warrning = false;
		    	}

		    }
		},
		created() {

			this.startFromHome = dataBus.startFromHome;
			this.carsQuantity = dataBus.carsQuantity;

		    if (this.carsQuantity > 0 && !dataBus.userCars.length) {
		    	for(let i = 0; i < this.carsQuantity; i++) {
		    		this.appendCarInput()
		    	}
		    }
		    else {
		    	this.carsBox = dataBus.userCars;
		    }

			this.makerOptions = dataBus.globalCars;
			//--Create year list
			let temp_years = [];
		    var currentYear = new Date().getFullYear(), years = [];
		    let startYear = 1960;
		    while ( currentYear >= startYear ) {
		        temp_years.push({ year: currentYear-- });
		    }
		    this.yearOptions = temp_years;
		    //--send all cars to data bus

		}

	}
</script>

