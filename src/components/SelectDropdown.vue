<!-- CUSTOM MENU SELECT DROPDOWN -->
<template>

		<div :class="{ __disabled: disabled }" class="select">
			<div @click="toggle" class="select__label" :class="getLabel(value)">
				{{ getLabel(value) }}
			</div>
			<div v-if="opened" class="select__options">
				<div v-for="(o, index) in options" :value="getVal(value)" @click="change(o, index)" :class="{__active: getVal(o) == getVal(value)}" class="select__option">{{ getLabel(o) }}</div>
			</div>
			<div v-if="opened" @click="toggle" class="select__overlay"></div>
		</div>

</template>
<script>
	import { dataBus } from '../main';
	export default {

		props: ['options', 'cars', 'models', 'indexNum'],
		data () {
			return {
				opened: false
			}
		},
		props: {
			value: {
				required: true
			},
			options: {
				type: Array,
				required: true
			},
			cars: {
				type: Array,
				required: false
			},
			models: {
				type: Array,
				required: false
			},
			indexNum: {
				type: Number,
				required: false
			},
			valueKey: {
				type: String,
				required: false
			},
			labelKey: {
				type: String,
				required: false
			},
			onChange: {
				type: Function,
				required: false
			},
			disabled: {
				type: Boolean,
			}
		},

		methods: {
			getVal (opt) {
				return !this.valueKey ? opt : opt[this.valueKey]
			},
			getLabel (opt) {
				return !this.labelKey ? opt : opt[this.labelKey]
			},
			change (opt, index) {
				this.$emit('input', opt)
				this.opened = false;
				let that = this;
				// localStorage.clear();
				if (this.onChange !== undefined) {
					this.onChange(this.value)
				}

			},
			toggle () {
				if ( this.disabled ) {
					return
				}
				this.opened = !this.opened
			}
		}
	}
</script>
<style lang="scss">
  .select__options {
    max-height: 275px;
    overflow: auto;
  }
</style>
