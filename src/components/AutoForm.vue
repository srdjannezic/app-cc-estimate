<!-- Main ESTIMATE form holder holds every step and component of estimate form -->
<template>
 	<div id="scroll-app">
 		<div class="starting-form step-1 form-auto">
 			<div class="input-group">
	 			<label for="">Moving from</label>
	 			<div class="input-wrapper" :class="reqFrom ? 'red': ''">
	 				<vue-google-autocomplete :id="mapOne" classname="form-control" :placeholder="isMobile() ? 'From: Address, city, or zip' : 'Address, city, or zip'" v-on:placechanged="getAddressFrom" v-model="addressFrom" :types="types" country="us"></vue-google-autocomplete>
 					<i class="icon-location"></i>
	 			</div>
	 			<div class="form-dropdown" v-show="visible">
	 				<div class="options">
	 					<ul>
	 						<li></li>
	 					</ul>
	 				</div>
	 			</div>
 			</div>
 			<div class="input-group">
	 			<label for="">Moving to</label>
	 			<div class="input-wrapper" :class="reqTo ? 'red': ''">
	 				<vue-google-autocomplete :id="mapTwo" classname="form-control" :placeholder="isMobile() ? 'To: Address, city, or zip' : 'Address, city, or zip'" v-on:placechanged="getAddressTo" v-model="addressTo" :types="types" country="us"></vue-google-autocomplete>
 					<i class="icon-location"></i>
	 			</div>
 			</div>
 			<div class="input-group" :class="reqDate ? 'red': ''">
	 			<label for="">Moving Date</label>
	 			<div class="input-wrapper input-wrapper--datepicker">

			<datepicker
				:placeholder="isMobile() ? 'Moving Date' : 'Select Date'"
				:disabled-dates="disabledDates"
				@selected="dateHandler"
				v-model="dateSelf"
			/>
	 				<i class="icon-calendar"></i>
	 			</div>
 			</div>
 			<div class="input-group how-many">
	 			<label for="">How many</label>
	 			<div class="input-wrapper select-wrapper cars-num">
	 				<span class="decrease" @click="decrease">-</span>
	 				<input type="number" placeholder="0" v-model="carsQuantity">
	 				<span class="increase" @click="increase">+</span>

	 			</div>
 			</div>
 			<button class="btn-submit" @click="startQuote">get a quote</button>
 			<button class="btn-submit btn-submit-fromCar" @click="nextButtonHandler">Next</button>
 		</div>

 	</div>
</template>

<script>
	import axios from 'axios';
	import { dataBus } from '../main';
  import pathsMixin from "../mixins/paths";
  import { ESTIMATE_FORM } from "../constants/localStorage";

 	export default {
    mixins: [pathsMixin],
	 		data() {
 			return {
 				visible: false,
 				locations: '' ,
 				showItemPicker: false,
 				startFromHome: '',
 				showCarPicker: false,
 				showReview: false,
 				//-- data form
 				addressFrom: '',
 				addressTo: '',
 				dateSelf: dataBus.date,
 				carsQuantity: '',
 				reqFrom: false,
 				reqTo: false,
 				reqDate: false,
 				types: 'geocode',
		        disabledDates: {
		          to: new Date(new Date().setDate(new Date().getDate()-1))// Disable all dates after specific date
		        },
 			};
 		},

 		created() {
 			dataBus.$on();
 			this.startFromHome = dataBus.startFromHome;
 			this.mapOne = dataBus.mapOne;
 			this.mapTwo = dataBus.mapTwo;

 			this.addressFrom = dataBus.moveFrom;
 			this.addressTo = dataBus.moveTo;

 			this.carsQuantity = dataBus.carsQuantity;
 		},
 		methods: {
 			toggleVisible() {
 				this.visible = !this.visible;
 			},
 			itemClicked(index) {
 			},
      		dateHandler(date) {
 				this.reqDate = false;
 				this.dateSelf = date;
        		dataBus.date = this.dateSelf;
 			},
 			getAddressFrom(addressData, placeResultData, id) {
		        this.addressFrom = placeResultData.formatted_address;
		        dataBus.moveFrom = this.addressFrom;
		        dataBus.fromPostal = addressData.place_code;
            dataBus.from_place_id = placeResultData.place_id;

		        this.reqFrom = false;
		    },
		    getAddressTo(addressData, placeResultData, id) {
		        this.addressTo = placeResultData.formatted_address;
		        dataBus.moveTo = this.addressTo;
		        dataBus.toPostal = addressData.place_code;
            dataBus.to_place_id = placeResultData.place_id;

		        this.reqTo = false;
		    },
      validation() {
        let startSteps = true;
        if(this.addressFrom == '') {
          this.reqFrom = true;
          startSteps = false;
        }
        if(this.addressTo == '') {
          this.reqTo = true;
          startSteps = false;
        }
        if(this.dateSelf === '') {
          this.reqDate = true;
          startSteps = false;
        }

        return startSteps;
      },
      startQuote() {
        if(this.validation()) {
          localStorage.setItem(ESTIMATE_FORM, JSON.stringify({
            startFromHome: false,
            moveFrom: this.addressFrom,
            moveTo: this.addressTo,
            date: this.dateSelf,
            from_place_id: dataBus.from_place_id,
            to_place_id: dataBus.to_place_id,
            carsQuantity: this.carsQuantity,
          }));

          window.location.href = this.paths.MY_DETAILS;
        }
      },
      nextButtonHandler() {
        if(this.validation()) {
          dataBus.moveFrom = this.addressFrom;
          dataBus.moveTo = this.addressTo;
          dataBus.date = this.dateSelf;
          dataBus.startFromHome = false;
          dataBus.carsQuantity = this.carsQuantity;

          this.$router.push({ path: this.paths.MY_DETAILS });
        }
      },
 			increase() {
 				if(this.carsQuantity > -1) {
 					this.carsQuantity++;
 				}
 				else {
 					return;
 				}

 			},
 			decrease() {
 				if(this.carsQuantity > 0) {
 					this.carsQuantity--;
 				}
 				else {
 					return;
 				}

 			},

			isMobile(){
				if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
				 	return true;
				}
				else {
				 	return false;
				}
			}
 		}
 	}
</script>

<style lang="scss">


</style>
