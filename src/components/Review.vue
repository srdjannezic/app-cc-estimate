<template>
	<div class="review-page step-5" id="step-modal">
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
					<li class="step-num-3 passed" v-if="!startFromHome"><router-link :to="paths.MY_CAR"><span>3</span><i><em>Car </em>details</i></router-link></li>
					<!--step 4-->
					<li class="step-num-4 passed" v-if="startFromHome"><router-link :to="paths.MY_CAR"><span>4</span><i><em>Moving your </em>car<em>?</em></i></router-link></li>
					<li class="step-num-4 passed" v-if="!startFromHome"><router-link :to="paths.MY_INVENTORY"><span>4</span><i><em>Include</em> your home<em>?</em></i></router-link></li>
					<!--step 5-->
					<li class="step-num-5 active"><router-link :to="paths.REVIEW_AND_FINISH"><span>5</span><i><em>Review and </em>finish</i></router-link></li>

				</ul>
			</div>
		</header>
		<main class="main-panel">
			<div class="container">
				<h2 class="step__title">Review your request</h2>
				<section class="review">
					<div class="review__top">
						<div class="top-box">
							<h3>General details</h3>
							<ul class="list-data">
								<li><span>From: </span>{{ this.from}}</li>
								<li><span>To: </span>{{ this.to}}</li>
								<li><span>Date: </span>{{ formatDateForPreview(this.dateSelf) }}</li>
							</ul>
						</div>
						<div class="top-box right">
							<h3>Your details</h3>
							<ul class="list-data">
								<li><span>Name: </span>{{ this.name }} {{this.lastName}}</li>
								<li><span>Email: </span>{{this.email }}</li>
								<li><span>Phone: </span>{{ this.phone }}</li>
							</ul>
						</div>
					</div>
					<div class="review__home" v-if="reviewData.length">
						<h2>Home</h2>
						<div class="list-all">
							<article class="rooms-review">
								<div class="room" v-for="(defaultroom,index) in reviewData" >
									<h3>{{ defaultroom.room_info.name }} ({{ defaultroom.room_items.length  }})</h3>
									<div class="room__item" v-for="(item,indexIt) in  defaultroom.room_items">
										<p><span class="num">{{ indexIt + 1 }}</span>{{ item.name }} {{ !item.id ? `(${item.width}x${item.height}x${item.depth} in)` : '' }} <i class="sum">{{ item.quantity }} <span v-if="item.quantity > 1">Pcs</span><span v-if="item.quantity <= 1">Pc</span></i> </p>
										<p class="room__item__note">{{ item.note }}</p>
									</div>
								</div>
							</article>
						</div>
					</div>
					<div class="review__home" v-if="package.vehicles.length">
						<h2>Cars</h2>
						<div class="list-all">
							<article class="cars-review">
								<div class="car" v-for="(car,index) in package.vehicles" >
									<div class="room__item">
										<p><span class="num">{{ index + 1 }}</span>{{ car.maker }}, {{car.model}}, {{car.year}} </p>

									</div>
								</div>
							</article>
						</div>
					</div>
					<div class="check-wraper">
						<p><input type="checkbox" id="checkReview" checked ref="agreeSelected"><label for="checkReview">Agree to be contacted via text, email or phone.</label> <a href="/privacy-policy"><span class="details">Details</span></a></p>
					</div>

					<router-link :to="paths.MY_MOVING_PLAN"><button class="btn-default btn-back b-white"><span>Edit</span></button></router-link>
					<button class="btn-default btn-next" @click="submitRequest()"><span>Finish</span></button>
				</section>
			</div>
			<app-footer></app-footer>
		</main>
		</base-layout>
	</div>
</template>
<script>
	import axios from 'axios';
	import { dataBus } from '../main';

  // Utils
  import {
    formatDateForPreview,
    formatDateForFinalApi,
  } from '../utils/dates';
  import pathsMixin from "../mixins/paths";
  import {
    MOVING_TYPE_AUTO,
    MOVING_TYPE_HOME,
  } from "../constants/movingTypes";

	export default {
    mixins: [pathsMixin],
		data() {
			return {
				reviewData: '',
				name: '',
				lastName: '',
				email: '',
				phone: '',
				from: '',
				to:'',

				dateSelf: dataBus.date,
				package: {
					first_name: "",
					last_name: "",
					move_size_id: dataBus.userHomeSize.id,
					move_date: formatDateForFinalApi(dataBus.date),
					email: "",
					phone: "",
					//pickup_zip: "",
					//delivery_zip: "",
					rooms: [],
					vehicles: [],
					//startFromHome: '',
					from_place_id:'',
					to_place_id:'',
          movingType: dataBus.startFromHome === '' ? null : (dataBus.startFromHome ? MOVING_TYPE_HOME : MOVING_TYPE_AUTO),
				}
			}
		},
		methods: {
      formatDateForPreview,
      formatDateForFinalApi,
			submitRequest() {
				//--SEND
				if(this.$refs.agreeSelected.checked == true) {
				    //do something
				    const url = '/api/post';
					axios.post(url, {
					  data: this.package, // look ma, no JSON.stringify()!
					})
					.then(function(response) {

						window.location.href = '/estimate/success';
					})
					.catch(errors => {
						console.log(errors);
						// react on errors.
						window.location.href = '/estimate/error';
					})
					return;
				}

			}
		},
		created() {
			this.startFromHome = dataBus.startFromHome;
			this.reviewData = dataBus.displayRooms;

			this.name = dataBus.userName;
			this.lastName = dataBus.userLastName;
			this.email = dataBus.userEmail;
			this.phone = dataBus.userPhone;
			this.from = dataBus.moveFrom;
			this.to = dataBus.moveTo;
			this.package.from_place_id = dataBus.from_place_id;
			this.package.to_place_id = dataBus.to_place_id;
			//Collect all data
			this.package.first_name = this.name;
			this.package.last_name = dataBus.userLastName;
			this.package.email = dataBus.userEmail;
			this.package.phone = dataBus.userPhone;

			//this.package.pickup_zip = dataBus.fromPostal;
			//this.package.delivery_zip = dataBus.toPostal;

		    //this.package.vehicle
			//this.package.rooms = this.reviewData;
			// if(this.package.pickup_zip == undefined){
			// 	this.package.pickup_zip = '10000';
			// }

			// if(this.package.delivery_zip == undefined){
			// 	this.package.delivery_zip = '10000';
			// }
			// if(this.startFromHome == true) {
			let $that = this;
			this.reviewData.forEach(function(room, index){
			  const roomId = room.room_info.id;

				let itemArray = [];
				room.room_items.forEach(function(item, index) {

				  const additionalCustomItemData = {
            name: item.name,
            width: +item.width,
            height: +item.height,
            depth: +item.depth,
          };

					itemArray[index] = {
            lead_room_id: roomId,
            id: item.id || 0,
            quantity: item.quantity,
            note: item.note || null,
          };

					if (!item.id) {
            itemArray[index] = {
              ...itemArray[index],
              ...additionalCustomItemData,
            }
					}

				});

				$that.package.rooms[index] = { 'id': roomId, 'name': room.room_info.name, 'items': itemArray };

			});
			// }

			if(dataBus.userCars[0] && dataBus.userCars[0].maker != 'Car Maker'){
				dataBus.userCars.forEach(function(vehicle, index){

					$that.package.vehicles[index] = { 'maker': vehicle.maker, 'model': vehicle.model, 'year': vehicle.year, 'trailer':1, 'operable':1,'loaded':0, 'type':'1' }
				});
			}
		}
	}
</script>
