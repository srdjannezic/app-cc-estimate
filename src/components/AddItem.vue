<template>
	<div class="addItem-modal" @click="$emit('closeAddItem')">
		<div class="ask-box">

			<div class="inner-wrapper">
				<h2>{{this.currentRoom.room_info.name}}</h2>
				<span class="close" @click="closeAddModel"><i class="icon-close"></i></span>
				<div class="input-wrapper">
					<input type="text" placeholder="Search for item..." v-model="query">
					<i class="icon-loupe"></i>
				</div>
				<h6>Items</h6>
				<div class="list-wrapper">

					<ul>
						<li v-for="({id,image,name,}) in matches" >
							<label :for="`item-${id}`">
							<div class="item-to-add" :class="isInventoryAdded(id)" @click.prevent="addToPrepared(id)">
									<figure class="img-holder">
										<img src="/themes/cc/assets/images/icon_armchair.png" alt="">
									</figure>
								<span><i :class="imgClass(image)"></i>{{ name }} <i class="plus">+</i><input type="checkbox" :id="'item-' + id"></span>
							</div>
							</label>
						</li>
					</ul>
				</div>
				<p>Feel free to add more than one item to your room. Click done when you finish. You can add custom item by typing it in the search box.</p>
				<div v-if="showCustomField" class="custom-field">
					<div class="inner-wrapper">
						<h2>Items</h2>
						<h3 class="custom-name">{{ query }}</h3>
						<div class="form-group">

							<div class="input-wrapper">
								<span>Width(in)*</span>
								<input
                  type="number"
                  placeholder="0"
                  v-model="itemWidth"
                  :class="this.reqItemWidth ? 'error' : ''"
                >
							</div>

							<div class="input-wrapper">
								<span>Height(in)*</span>
								<input
                  type="number"
                  placeholder="0"
                  v-model="itemHeight"
                  :class="this.reqItemHeight ? 'error' : ''"
                >
							</div>

							<div class="input-wrapper">
								<span>Depth(in)*</span>
								<input
                  type="number"
                  placeholder="0"
                  v-model="itemDepth"
                  :class="this.reqItemDepth ? 'error' : ''"
                >
							</div>

						</div>
						<i>In order to add this item, please insert item dimensions.</i>
						<p>Feel free to add more than one item to your room. Click done when you finish. You can add custom item by typing it in the search box.</p>
						<button class="btn-default btn-save" @click="saveCustomItem(index)"><span>Save</span></button>
					</div>
				</div>
			</div>
			<button class="btn-default btn-done" @click="addItem($emit)"><span>Done</span></button>
			</div>
	</div>
</template>
<script>
	import { dataBus } from '../main';
	export default {
		props: ['currentRoom'],
		data() {
			return {
				items: '',
				query: '',
				prepareItems: [],
				showCustomField: false,
				itemWidth: '',
				itemHeight: '',
				itemDepth: '',
				reqItemWidth: false,
				reqItemHeight: false,
				reqItemDepth: false,
				index: '',
				clickToggle: true
			}
		},
    created() {
			this.items = dataBus.inventory;
		},
    methods: {
			//-- Add this item in room
			addItem() {
 				let addInRoom = this.currentRoom.room_items;
 				let toAddPrepared = this.prepareItems;
 				toAddPrepared.forEach(function(it){
 					addInRoom.push(it);
 				});
 				this.$emit('close-modal')

 			},
 			closeAddModel() {
 				this.$emit('close-modal');
 			},
 			addToPrepared(itemId) {
				const singleItem = this.prepareItems.find(item => item.id === itemId);

				if (singleItem) return this.prepareItems = this.prepareItems.filter(item => item.id !== itemId);

				const {
					id,
					name,
					image,
				} = this.items.find(item => item.id === itemId);

				return this.prepareItems.push(
					{
						id: id,
						name: name,
						quantity: 1,
						image: image,
						note: ''
					}
				);
 			},
			isInventoryAdded(id) {
				if (this.prepareItems.some(item => item.id === id)) return 'checked';

				return '';
			},
 			saveCustomItem() {

        this.reqItemWidth = !this.itemWidth || !( this.itemWidth > 0 );
        this.reqItemHeight = !this.itemHeight || !( this.itemHeight > 0 );
        this.reqItemDepth = !this.itemDepth || !( this.itemDepth > 0 );

        if (
          this.reqItemWidth
          || this.reqItemHeight
          || this.reqItemDepth
        ) return;

 				let customItem = {
          name: this.query,
          quantity: 1,
          width: this.itemWidth,
          height: this.itemHeight,
          depth: this.itemDepth,
          image: null,
        };
 				let addInRoom = this.currentRoom.room_items;
 				addInRoom.push(customItem);
 				this.$emit('close-modal');
 			},
 			imgClass(cls) {
 				var iconImgName = cls;
 				if(iconImgName !== null) {
 					var iconClass = iconImgName.slice(0,-4);
 					return iconClass;
 				}
 				else {
 					return "";
 				}
 			},
		},
    computed: {
 			matches() {
 				let result =  this.items && this.items.filter((item) => item.name.toLowerCase().indexOf(this.query.toLowerCase()) > -1);
 				if(this.query == '') {
 					result = this.items;

 				}

 				this.showCustomField = !!( result && result.length === 0 );

 				return result;
 			},
 		}
	}
</script>
<style lang="scss">
.input-wrapper {
  .error {
    border: 1px solid red;
  }
}
</style>

