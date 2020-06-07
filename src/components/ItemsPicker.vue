<!-- ITEM PICKER with all -functionality -->
<template>
  <div class="items-picker-wrapper step-3" id="step-modal">
    <base-layout>
      <!-- steps show bar -->
      <header class="steps-show-bar" id="steps">
        <div class="container">
          <ul>
            <!--step 1-->
            <li class="step-num-1 passed">
              <router-link :to="paths.MY_MOVING_PLAN"><span>1</span><i>My <em>move </em>plan</i></router-link>
            </li>
            <!--step 2-->
            <li class="step-num-2 passed">
              <router-link :to="paths.MY_DETAILS"><span>2</span><i><em>My </em>details</i></router-link>
            </li>
            <!--step 3-->
            <li class="step-num-3 active" v-if="startFromHome">
              <router-link :to="paths.MY_INVENTORY"><span>3</span><i><em>Select </em>your items</i></router-link>
            </li>
            <li class="step-num-3 passed" v-if="!startFromHome">
              <router-link :to="paths.MY_CAR"><span>3</span><i><em>Car </em>details</i></router-link>
            </li>
            <!--step 4-->
            <li class="step-num-4" v-if="startFromHome">
              <router-link to="#"><span>4</span><i><em>Moving your </em>car<em>?</em></i></router-link>
            </li>
            <li class="step-num-4 active" v-if="!startFromHome">
              <router-link to="#"><span>4</span><i><em>Include</em> your home<em>?</em></i></router-link>
            </li>
            <!--step 5-->
            <li class="step-num-5">
              <router-link to="#"><span>5</span><i><em>Review and </em>finish</i></router-link>
            </li>
          </ul>
        </div>
      </header>
      <main class="main-panel">
        <div class="container">
          <!-- title if you start from home -->
          <h2 class="step__title" v-if="startFromHome">Create Your Moving Checklist</h2>
          <!-- title if you start from cars -->
          <h2 class="step__title" v-if="!startFromHome">We can offer better rates if you move both your car and home
                                                        with us <br>would like to include it?</h2>
          <!--Skip step or cleaar ALL-->
          <div class="clear-note">
            <!-- text if you start from home -->
            <div class="inner-wrapper" v-if="startFromHome">
              <p>We’ve pre-filled your inventory checklist with some of the items most commonly found in homes. Once
                 your list is complete, we’ll help you check it so you’re prepared for the big day.</p>
            </div>
            <!-- text if you start from cars -->
            <div class="inner-wrapper" v-if="!startFromHome">
              <p>Please add the rooms and boxes by clicking on the button bellow. Once you add them you can add items,
                 notes and edit them. If you wish you can skip this step by clicking on the button.</p>
            </div>
            <div class="btn-wrapper">
              <button class="btn-default btn-clear b-grey" @click="triggerClear()" :disabled="!displayRoomsLocal.length"><span>Clear all rooms</span></button>
              <!-- btn skip if you start from home -->
              <router-link :to="paths.MY_CAR">
                <button class="btn-default btn-skip b-white" v-if="startFromHome"><span>Skip this</span></button>
              </router-link>
              <!-- btn skip if you start from cars -->
              <router-link :to="paths.REVIEW_AND_FINISH">
                <button class="btn-default btn-skip b-white" v-if="!startFromHome"><span>Skip this</span></button>
              </router-link>
            </div>
            <div class="icon-info"><span class="path1"></span><span class="path2"></span><span
              class="path3"></span><span class="path4"></span></div>
          </div>
          <div class="loader" v-if="loading && !error">
            <img src="/themes/cc/assets/images/cc.gif" alt="">
          </div>
          <div class="rooms" v-if="!loading && !error">
            <div>
              <!-- room -->
              <section v-for="(defaultroom,index) in displayRoomsLocal" class="room">
                <div class="room__tab" @click="$event.currentTarget.parentElement.classList.toggle('expand')">
                  <h3>{{ defaultroom.room_info.name }} ({{ defaultroom.room_items.length }})</h3>
                  <i class="icon-arrow-down"></i>
                </div>
                <div class="btn-dots-edit" @click="$event.currentTarget.classList.toggle('active')"><i
                  class="icon-edit"></i>
                  <nav class="edit-menu">
                    <span class="room__rename" @click="addRenameParentClass">Rename</span>
                    <span class="room__remove" @click="addParentClass">Delete</span>
                  </nav>
                </div>
                <!--rename-modal-->
                <div class="rename-modal" @click="closeModalRename">
                  <div class="ask-box">
                    <h4>Rename {{defaultroom.room_info.name}}</h4>
                    <span class="icon-close" @click="removeRenameParentClass"></span>
                    <div class="input-wrapper"><input type="text" :placeholder="defaultroom.room_info.name"
                                                      @input="newRoomName = $event.target.value" maxlength="16"
                                                      minlength="2" /></div>
                    <p v-if="renameError" class="renameError">You must enter at least one character.</p>
                    <button class="btn-default btn-ask-box" @click="renameRoom(index,newRoomName)"><span>Change</span>
                    </button>
                  </div>
                </div>
                <!--remove-room-modal-->
                <div class="remove-modal" @click="closeModalRemove">
                  <div class="ask-box">
                    <h4>Remove {{defaultroom.room_info.name}}</h4>
                    <span class="close" @click="removeParentClass"><i class="icon-close"></i></span>
                    <p>Are you sure you want to remove this room? All the items in the room will be discarded.</p>
                    <button class="btn-default btn-ask-box" @click="removeRoom(index)"><span>Remove</span></button>
                  </div>
                </div>

                <div class="room__items-list">
                  <!-- ITEM single inventory item -->
                  <article v-for="(item,indexIt) in  defaultroom.room_items" class="item">
                    <div class="item__top">
                      <h5>{{ item.name }} {{ !item.id ? `(${item.width}x${item.height}x${item.depth} in)` : '' }}</h5>
                      <span class="icon-note" @click="addNoteParentClass" :class="item.note ? 'noteIn' : ''"></span>
                    </div>

                    <!-- item img -->
                    <i class="item__img" :class="makeClass(item.image)"></i>
                    <figure class="img-holder">
                      <img src="/themes/cc/assets/images/icon_armchair.png" alt="">
                    </figure>
                    <!--quantity counter -->
                    <div class="quantity">
                      <div class="inner">
                        <i class="decrease icon-minus" @click="decrease(item, index, indexIt)"></i>
                        <span>{{ item.quantity }}</span>
                        <i class="increase icon-plus" @click="item.quantity++"></i>
                      </div>
                    </div>
                    <!--note-modal-->
                    <div class="note-modal" @click="closeModalNote">

                      <div class="ask-box">
                        <div class="note-modal__top">
                          <i :class="makeClass(item.image)"><img src="/themes/cc/assets/images/icon_armchair.png"
                                                                 alt=""></i>
                          <h4>{{ item.name }}</h4>
                          <span class="icon-close" @click="removeNoteParentClass"></span>
                        </div>
                        <h6>Item Note</h6>
                        <div class="textarea-wrapper">
                          <textarea name="" id="" cols="30" rows="10"
                                    placeholder="Write some details about the item, if it is glass/fragile and require crating, or it is very heavy..."
                                    @input="textNote = $event.target.value" :value="item.note"></textarea>
                        </div>
                        <button class="btn-default btn-ask-box" @click="addNote(index, indexIt, $event)">
                          <span>Save</span></button>
                      </div>
                    </div>
                  </article>
                  <div class="add-items" @click="toggleItemModal(index)">
                    <i>Add Item</i>
                    <span @click="">+</span>
                  </div>
                </div>

              </section>
              <!-- modal for adding items to rooms -->
              <add-item :currentRoom="currentRoom" v-if="showItemModal" @close-modal="showItemModal = false"
                        @closeAddItem="closeAddItem"
                        :allRooms="this.allRooms"
              ></add-item>

              <!-- button for addroom -->
              <div class="button-wrapper">
                <button @click="toggleRoomModal()" class="btn-default btn-addRoom"><span>Add Room/Boxes</span></button>
              </div>
              <!--remove-all-rooms-modal-->
              <div class="remove-all-modal" v-if="showClearModal" @click="closeModalClear">
                <div class="ask-box">
                  <span class="close" @click="triggerClear()"><i class="icon-close"></i></span>
                  <p>Are you sure you want to remove all rooms and their content from this location?</p>
                  <button class="btn-default btn-ask-box b-white" @click="triggerClear()"><span>Cancel</span></button>
                  <button class="btn-default btn-ask-box b-red" @click="clearAll()"><span>Remove</span></button>
                </div>
              </div>
            </div>
            <!--back if start from home -->
            <button class="btn-default btn-back b-white" @click="back" v-if="startFromHome"><span>Go Back</span>
            </button>
            <!--back if start from cars -->
            <router-link :to="paths.MY_CAR">
              <button class="btn-default btn-back b-white" v-if="!startFromHome"><span>Go Back</span></button>
            </router-link>
            <!--next if start from home -->
            <button
              class="btn-default btn-next"
              @click="nextHandler"
              :disabled="!displayRoomsLocal.length"
            ><span>Next</span></button>
          </div>
          <div v-if="error">Something went wrong, please try again leater.</div>
        </div>
        <app-footer></app-footer>
      </main>

      <!-- ADD ROOMS BOX modal -->
      <div class="addroom-modal" v-if="showRoomsModal" @click="closeAddRoom">
        <div class="addroom-box">
          <div class="addroom-box__top">
            <h2>Add Room/boxes</h2>
            <span class="icon-close close" @click="toggleRoomModal"></span>
          </div>
          <div class="addroom-box__main">
            <ul>
              <li v-for="(room,index) in allRooms" v-bind:index="index" @click="addRoom(index)">
                <div :class="'icon-' + room.room_info.name.replace(/\s+/g, '-').toLowerCase()"><span
                  class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span
                  class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span>
                </div>
                <span>{{room.room_info.name}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </base-layout>
  </div>
</template>
<script>
  import axios from 'axios';
  import { dataBus } from '../main';
  import pathsMixin from "../mixins/paths";
  import { PREDEFINED_ROOMS_TO_ADD } from "../constants/predefinedRoomsToAdd";


  export default {
    props: ['rooms'],
    mixins: [pathsMixin],
    data() {
      return {
        showItemModal: false,
        showRoomsModal: false,
        showClearModal: false,
        displayRoomsLocal: dataBus.displayRooms,
        allRooms: dataBus.roomsToAdd,
        currentRoom: '',
        isActive: '',
        newRoomName: '',
        textNote: '',
        loading: false,
        error: false,
        startFromHome: '',
        renameError: false
      };
    },
    methods: {
      // Choose room to add
      startAdding( index ) {
        this.currentRoom = dataBus.displayRooms[ index ];
      },
      addRoom( index ) {
        const roomToAdd = dataBus.roomsToAdd[ index ];
        dataBus.displayRooms.push( JSON.parse( JSON.stringify( roomToAdd ) ) );
        this.toggleRoomModal();
      },
      back() {
        this.$router.push( { path: this.paths.MY_DETAILS } );
      },
      nextHandler() {
        if (this.startFromHome) {
          this.$router.push({ path: this.paths.MY_CAR });
        } else {
          this.$router.push({ path: this.paths.REVIEW_AND_FINISH });
        }
      },
      //-- CLEAR all rooms
      triggerClear() {
        this.showClearModal = !this.showClearModal;
      },
      clearAll() {
        dataBus.displayRooms = [];
        this.displayRoomsLocal = dataBus.displayRooms;
        this.showClearModal = !this.showClearModal;
      },
      // show modal for adding items
      toggleItemModal( index ) {
        this.startAdding( index );
        this.showItemModal = !this.showItemModal;
      },
      // show modal for addiing rooms
      toggleRoomModal() {
        this.showRoomsModal = !this.showRoomsModal;
      },
      toggleRemoveModal() {
        this.showRemoveModal = !this.showRemoveModal;
      },
      // remove item from room
      removeItem( index, indexIt ) {
        let hereRemove = dataBus.displayRooms[ index ];
        let itemToRemove = hereRemove.room_items[ indexIt ];
        hereRemove.room_items.splice( indexIt, 1 );
      },
      // remove room from display
      removeRoom( index ) {
        let roomRemove = dataBus.displayRooms[ index ];
        dataBus.displayRooms.splice( index, 1 );
        // this.toggleRemoveModal();
        this.removeParentClass( event );
      },
      // rename room from display
      renameRoom( index, value ) {
        if ( value.length > 0 ) {
          let roomRename = dataBus.displayRooms[ index ];
          roomRename.room_info.name = value;
          this.removeRenameParentClass( event );
          this.renameError = false;
          this.newRoomName = '';
        } else {
          this.renameError = true;
        }

      },
      // Add note
      addNote( index, indexIt, event ) {
        let hereRemove = dataBus.displayRooms[ index ];
        let noteForItem = hereRemove.room_items[ indexIt ];
        noteForItem.note = this.textNote;
        event.target
          .closest( '.item' )
          .classList.remove( 'showNoteModal' );
        event.target
          .closest( '.item' )
          .classList.add( 'noteIn' );

      },
      decrease( it, index, indexIt ) {
        it.quantity--;
        if ( it.quantity < 1 ) {
          return this.removeItem( index, indexIt );
        }
      },
      makeClass( cls ) {
        let iconImgName = cls;
        if ( iconImgName !== null ) {
          var iconClass = iconImgName.slice( 0, -4 );
          return iconClass;
        } else {
          return "";
        }
      },
      addParentClass( event ) {
        event.target
          .closest( '.room' )
          .classList.add( 'showModal' );
      },
      addRenameParentClass( event ) {
        event.target
          .closest( '.room' )
          .classList.add( 'showRenameModal' );

      },
      addNoteParentClass( event ) {
        event.target
          .closest( '.item' )
          .classList.add( 'showNoteModal' );
      },
      removeParentClass( event ) {
        event.target
          .closest( '.room' )
          .classList.remove( 'showModal' );
      },
      removeRenameParentClass( event ) {
        event.target
          .closest( '.room' )
          .classList.remove( 'showRenameModal' );
        this.renameError = false;
      },
      removeNoteParentClass( event ) {
        event.target
          .closest( '.item' )
          .classList.remove( 'showNoteModal' );
      },
      closeModalClear: function ( event ) {
        if ( event.target == event.currentTarget )
          this.triggerClear();
      },
      closeModalRename: function ( event ) {
        if ( event.target == event.currentTarget ) {
          event.target
            .closest( '.room' )
            .classList.remove( 'showRenameModal' );
          this.renameError = false;
        }

      },
      closeModalRemove: function ( event ) {
        if ( event.target == event.currentTarget ) {
          event.target
            .closest( '.room' )
            .classList.remove( 'showModal' );
        }
      },
      closeModalNote: function ( event ) {
        if ( event.target == event.currentTarget ) {
          event.target
            .closest( '.item' )
            .classList.remove( 'showNoteModal' );
        }
      },
      closeAddRoom() {
        if ( event.target == event.currentTarget ) {
          this.showRoomsModal = false;
        }
      },
      closeAddItem() {
        if ( event.target == event.currentTarget ) {
          this.showItemModal = false;
        }
      },


      async fetchRoomsAndInventory() {
        const headers = {
          'Authorization': 'eCLk7RvaJfYSnQaneUoH'
        };

        let requestRooms = "https://dev.ultimatemoving.us/api/v1/rooms";
        let requestInventory = "https://dev.ultimatemoving.us/api/v1/inventory";

        const requestOne = axios.get( requestRooms, { headers } );
        const requestTwo = axios.get( requestInventory, { headers } );

        try {
          this.loading = true;

          const response = await axios.all(
            [
              requestOne,
              requestTwo,
            ]
          );

          dataBus.rooms = response[ 0 ].data.data;
          dataBus.inventory = response[ 1 ].data.data;
        } catch (e) {
          this.error = true
        } finally {
          this.loading = false
        }
      },

      populatePredefinedRoomsToAdd() {
        dataBus.roomsToAdd = dataBus.rooms
          .sort( ( a, b ) => a.id - b.id )
          .map( item => {
            const inventoryItems = PREDEFINED_ROOMS_TO_ADD
              .find( i => i.roomId === item.id ).inventoryIds
              .map( i => {
                const singleItem = dataBus.inventory.find( t => t.id === i );

                return {
                  ...singleItem,
                  quantity: 1,
                };
              } )
            ;

            return {
              room_info: {
                ...item
              },
              room_items: inventoryItems
            };
          } );

        this.allRooms = dataBus.roomsToAdd;
      },
      populatePredefinedRoomsByHomeSizeId(homeSizeId) {
        const predefinedData = require( `../constants/predefinedRoomsByHomeSize/${ homeSizeId }.json` );

        dataBus.displayRooms = predefinedData.map( item => {
          const roomInfo = dataBus.rooms.find( i => i.id === item.roomId );
          const roomItems = item.inventory
            .map( i => {
              return {
                ...dataBus.inventory.find( e => e.id === i.id ),
                quantity: i.quantity
              };
            } )
          ;

          return {
            room_info: {
              ...roomInfo
            },
            room_items: roomItems,
          };
        } );

        this.displayRoomsLocal = dataBus.displayRooms;
      }

    },

    async created() {
      this.startFromHome = dataBus.startFromHome;
      const homeSizeId = dataBus.userHomeSize.id;

      if (
        !dataBus.rooms.length
        && !dataBus.inventory.length
      ) {
        await this.fetchRoomsAndInventory();
      }

      if (
        !!dataBus.rooms.length
        && !!dataBus.inventory.length
        && !dataBus.displayRooms.length
        && ( (homeSizeId > 0) && (homeSizeId <= 4))
      ) {
        this.populatePredefinedRoomsByHomeSizeId(homeSizeId)
      }

      if (
        !!dataBus.rooms.length
        && !!dataBus.inventory.length
        && !dataBus.roomsToAdd.length
      ) {
      	this.populatePredefinedRoomsToAdd();
      }

    },

  };

</script>
<style lang="scss">

</style>

