<template>

	<header class="header header-in-app">
		<div class="container">
		<div class="header__logo">
			<a href="/">
				<img src="/themes/cc/assets/images/cc-logo-desktop.svg" alt="crosscountry logo" class="logo-desk">
				<img src="/themes/cc/assets/images/cc-logo-mob.svg" alt="crosscountry logo" class="logo-mob">
			</a>
		</div>
		<div
      class="header__allItems"
      :class="isMobileMenuVisible ? 'showMenu' : ''"
    >
			<nav class="header__nav">
				<ul class="nav nav-pills"><li class="item "><a href="/services" target="_self">
                        Our Services
                    </a></li> <li class="item "><a href="/areas-we-serve" target="_self">
                        Areas we serve
                    </a></li> <li class="item "><a href="/reviews" target="_self">
                        Reviews
                    </a></li> <li class="dropdown item "><a href="/about-us" target="_self" data-toggle="dropdown" class="dropdown-toggle">
                        About <span class="caret"></span></a> <ul class="dropdown-menu"><li class="item "><a href="/about-us" target="_self">
                        About Us
                    </a></li> <li class="item "><a href="/blog/1" target="_self">
                        Blog
                    </a></li> <li class="item "><a href="/contact-us" target="_self">
                        Contact
                    </a></li></ul></li></ul>
			</nav>
		</div>

		<div
      class="ham-menu"
      :class="isMobileMenuVisible ? 'ham-active' : ''"
    >
			<i
        @click="isMobileMenuVisible = true"
        class="icon-ham"
      />
			<i
        @click="isMobileMenuVisible = false"
        class="icon-close"
      />
		</div>
		</div>
	</header>

</template>
<script>
	import pathsMixin from "../mixins/paths";

  export default {
	  mixins: [pathsMixin],
    data() {
	    return {
	      isMobileMenuVisible: false
      }
    }
  }
</script>


<!--$('.ham-menu').addClass('ham-active');-->
<!--$('.header__allItems').addClass('showMenu');-->
