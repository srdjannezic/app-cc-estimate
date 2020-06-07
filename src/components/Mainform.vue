<!-- Main ESTIMATE form holder holds every step and component of estimate form -->
<template>
 	<div id="scroll-app">
 		<div class="starting-form step-1">
 			<div class="input-group">
	 			<label for="">Moving from</label>
	 			<div class="input-wrapper" :class="reqFrom ? 'red': ''">
	 				<vue-google-autocomplete :id="mapOne" classname="form-control" :placeholder="isMobile() ? 'From: Address, city, or zip' : 'Address, city, or zip'"  v-on:placechanged="getAddressFrom" v-model="addressFrom" :types="types" country="us"></vue-google-autocomplete>
	 				<i class="icon-location"></i>
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
 			<div class="input-group" :class="reqSize ? 'red': ''">
	 			<label for="">Home size</label>
	 			<div class="input-wrapper select-wrapper">
	 				<custom-select :options="homeSizeOptions" value-key="id" label-key="name" v-model="homeSize" @input="sizeSelect"></custom-select>
	 				<i class="icon-size"></i>
	 			</div>
 			</div>
 			<button class="btn-submit" @click="startQuote">get a quote</button>
 			<button class="btn-default btn-next btn-submit btn-submit-fromHome" @click="nextButtonHandler"><span>Next</span></button>
 		</div>
 	</div>
</template>

<script>
	import axios from 'axios';
	import { dataBus } from '../main';
  import pathsMixin from "../mixins/paths";
  import { ESTIMATE_FORM } from "../constants/localStorage";
  import { API_MOVE_SIZES } from "../constants/endpoints";

 	export default {
    mixins: [pathsMixin],
	 		data() {
 			return {
 				rooms: '',
 				inventory: '',
 				query: '',
 				visible: false,
 				locations: '' ,
 				showModal: false,
 				showItemPicker: false,
 				showCarPicker: false,
 				showReview: false,
 				startFromHome: '',
 				types: 'geocode',
 				//-- data form
 				addressFrom: '',
 				addressTo: '',
 				dateSelf: dataBus.date,
 				reqFrom: false,
 				reqTo: false,
 				reqDate: false,
 				reqSize: false,
 				checkedForm: true,
 				mapOne: '',
 				mapTwo: '',
        disabledDates: {
          to: new Date(new Date().setDate(new Date().getDate()-1))// Disable all dates after specific date
        },
 				homeSizeOptions: [],
        homeSize: '',
        selectedHomeSize: '',
 			};
 		},

 		methods: {
 			toggleVisible() {
 				this.visible = !this.visible;
 			},
 			dateHandler(date) {
 				this.reqDate = false;
 				this.dateSelf = date;
        dataBus.date = this.dateSelf;
 			},
 			sizeSelect(opt) {
 				this.reqSize = false;
 				this.homeSize = opt;
 				dataBus.userHomeSize = this.homeSize;
 				dataBus.displayRooms = [];
 				// dataBus.cleared = false;
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
        if(this.homeSize.name == 'Home size') {
          this.reqSize = true;
          startSteps = false;
        }

        return startSteps;
      },

      startQuote() {
        if(this.validation()) {
          localStorage.setItem(ESTIMATE_FORM, JSON.stringify({
            startFromHome: true,
            moveFrom: this.addressFrom,
            moveTo: this.addressTo,
            date: this.dateSelf,
            from_place_id: dataBus.from_place_id,
            to_place_id: dataBus.to_place_id,
            userHomeSize: this.homeSize,
          }));

          window.location.href = this.paths.MY_DETAILS;
        }
      },
      nextButtonHandler() {
        if(this.validation()) {
          dataBus.moveFrom = this.addressFrom;
          dataBus.moveTo = this.addressTo;
          dataBus.date = this.dateSelf;
          dataBus.userHomeSize = this.homeSize;
          dataBus.startFromHome = true;

          this.$router.push({ path: this.paths.MY_DETAILS });
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
		},
		created() {
 			dataBus.$on();
 			this.mapOne = dataBus.mapOne;
 			this.mapTwo = dataBus.mapTwo;
 			this.addressFrom = dataBus.moveFrom;
 			this.addressTo = dataBus.moveTo;

 			this.startFromHome = dataBus.startFromHome;
 			this.homeSize = dataBus.userHomeSize;

      axios.get(API_MOVE_SIZES)
        .then(
          (
            {
              data,
            }
          ) => this.homeSizeOptions = data
        )
        .catch(error => console.log( error ));
 		},
	}

</script>

<style lang="scss">


</style>
