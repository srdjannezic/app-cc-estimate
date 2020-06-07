<!-- Part of estimate form popup modal with main info input (name, last name, email, phone) -->
<template>
	<div class="modal-wrapper step-2" id="step-modal">
		<base-layout>
		<transition name="modal">
			<div class="modal-inner-wrapper">

				<!-- steps show bar -->
				<header class="steps-show-bar" id="steps">
					<div class="container">
						<ul>
							<!--step 1-->
							<li class="step-num-1 passed"><router-link :to="paths.MY_MOVING_PLAN"><span>1</span><i>My <em>move </em>plan</i></router-link></li>
							<!--step 2-->
							<li class="step-num-2 active"><router-link :to="paths.MY_DETAILS"><span>2</span><i><em>My </em>details</i></router-link></li>
							<!--step 3-->
							<li class="step-num-3" v-if="startFromHome"><router-link to="#"><span>3</span><i><em>Select </em>your items</i></router-link></li>
							<li class="step-num-3" v-if="!startFromHome"><router-link to="#"><span>3</span><i><em>Car </em>details</i></router-link></li>
							<!--step 4-->
							<li class="step-num-4" v-if="startFromHome"><router-link to="#"><span>4</span><i><em>Moving your </em>car<em>?</em></i></router-link></li>
							<li class="step-num-4" v-if="!startFromHome"><router-link to="#"><span>4</span><i><em>Include</em> your home<em>?</em></i></router-link></li>
							<li class="step-num-5"><router-link to="#"><span>5</span><i><em>Review and </em>finish</i></router-link></li>
						</ul>
					</div>
				</header>
				<main class="main-panel">
					<div class="info-data-container">
						<div class="info-data">

							<h2 class="step__title">Tell Us About Yourself</h2>
				 			<div class="input-wrapper" :class="nameClass">
				 				<input type="text" placeholder="Your Name*" v-model="inputName" id="name" @input="submitUserDetails">

				 			</div>
				 			<div class="input-wrapper" :class="lastClass">
				 				<input type="text" placeholder="Your Last Name*" v-model="inputLastName" id="lastname" @input="submitUserDetails">
				 			</div>
				 			<div class="input-wrapper" :class="mailClass">
				 				<input type="email" placeholder="Your Email*" v-model="inputEmail" id="mail" @input="submitUserDetails">

				 			</div>
				 			<div class="input-wrapper" :class="phoneClass">
				 				<input type="number" placeholder="Your Phone*" v-model="inputPhone" id="phone" @input="submitUserDetails">
				 			</div>
				 			<!-- errors -->
							<div class="input-errors" v-if="errors.length">
								<ul>
									<li>{{ errors[0] }}</li>
								</ul>
							</div>
						</div>

						<router-link :to="paths.MY_MOVING_PLAN"><button class="btn-default btn-back b-white"><span>Go Back</span></button></router-link>
						<button class="btn-default btn-next" @click="checkForm"><span>Next</span></button>
					</div>
					<app-footer></app-footer>
				</main>
			</div>

		  </transition>
		</base-layout>
	  </div>
</template>

<script>
	import { dataBus } from '../main';
  import pathsMixin from "../mixins/paths";

	export default {
	  mixins: [pathsMixin],
		data() {
			return {
				inputName: '',
				inputLastName: '',
				inputEmail: '',
				inputPhone: '',
				errors:[],
				nameClass: '',
				lastClass: '',
				mailClass: '',
				phoneClass: '',
				startFromHome: ''
			}
		},
		methods: {
			submitUserDetails() {
		        dataBus.userName = this.inputName;
		        dataBus.userLastName =  this.inputLastName;
		        dataBus.userEmail = this.inputEmail;
		        dataBus.userPhone = this.inputPhone;

		        this.nameClass = '';
				this.lastClass = '';
				this.mailClass = '';
				this.phoneClass = '';

		        // this.$emit('close');
			},
			checkForm(e) {
				this.errors = [];
				this.nameClass = '';
				this.lastClass = '';
				this.mailClass = '';
				this.phoneClass = '';
				if(!this.inputName) {
					this.errors.push("You must fill all required fields.");
					this.nameClass = 'red';
				}
				if(!this.inputLastName){
					this.errors.push("You must fill all required fields.");
					this.lastClass = 'red';
				}

				 if (!this.inputEmail) {
			        this.errors.push('You must fill all required fields..');
			        this.mailClass = 'red';
			      } else if (!this.validEmail(this.inputEmail)) {
			        this.errors.push('Valid email required.');
			        this.mailClass = 'red';
			      }
				if(!this.inputPhone){
					this.errors.push("You must fill all required fields.");
					this.phoneClass = 'red';
				}
				if(this.inputPhone.length !== 10) {
					this.errors.push("Please enter valid phone number. With max and min 10 digits.");
					this.phoneClass = 'red';
				}

				if(!this.errors.length) {
					this.submitUserDetails();
					if(this.startFromHome == true) {
						this.$router.push({ path: this.paths.MY_INVENTORY });
					}
					else {
						this.$router.push({ path: this.paths.MY_CAR });
					}

					this.phoneClass = 'red';
				}
				e.preventDefault();
			},
			validEmail: function (email) {
		      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		      return re.test(email);
		    }

		},
		created() {
			this.startFromHome = dataBus.startFromHome;
 			this.inputName = dataBus.userName;
 			this.inputLastName = dataBus.userLastName;
 			this.inputEmail = dataBus.userEmail;
 			this.inputPhone = dataBus.userPhone;
 		},
 		mounted() {
 			document.getElementById('name').value = dataBus.userName;
 			document.getElementById('lastname').value = dataBus.userLastName;
 			document.getElementById('mail').value = dataBus.userEmail;
 			document.getElementById('phone').value = dataBus.userPhone;
 		}
	}
</script>

<style lang="scss">



</style>
