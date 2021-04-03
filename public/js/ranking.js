;(function () {

	'use strict';

	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
			BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
			iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
			Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
			Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
			any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};

	var fullHeight = function() {

		if ( !isMobile.any() ) {
			$('.js-fullheight').css('height', $(window).height());
			$(window).resize(function(){
				$('.js-fullheight').css('height', $(window).height());
			});
		}

	};

	var parallax = function() {
		$(window).stellar({
			horizontalScrolling: false,
			hideDistantElements: false,
			responsive: true
		});
	};

	var testimonialCarousel = function(){
		var owl = $('.owl-carousel-fullwidth');
		owl.owlCarousel({
			items: 1,
		    loop: true,
		    margin: 0,
		    responsiveClass: true,
		    nav: false,
		    dots: true,
		    smartSpeed: 500,
		    autoHeight: true
		});
	};


	// Animations
	var contentWayPoint = function() {
		var i = 0;
		$('.animate-box').waypoint( function( direction ) {

			if( direction === 'down' && !$(this.element).hasClass('animated') ) {

				i++;

				$(this.element).addClass('item-animate');
				setTimeout(function(){

					$('body .animate-box.item-animate').each(function(k){
						var el = $(this);
						setTimeout( function () {
							var effect = el.data('animate-effect');
							if ( effect === 'fadeIn') {
								el.addClass('fadeIn animated');
							} else if ( effect === 'fadeInLeft') {
								el.addClass('fadeInLeft animated');
							} else if ( effect === 'fadeInRight') {
								el.addClass('fadeInRight animated');
							} else {
								el.addClass('fadeInUp animated');
							}

							el.removeClass('item-animate');
						},  k * 200, 'easeInOutExpo' );
					});

				}, 100);

			}

		} , { offset: '85%' } );
	};

	var counter = function() {
		$('.js-counter').countTo({
			 formatter: function (value, options) {
	      return value.toFixed(options.decimals);
	    },
		});
	};

	var counterWayPoint = function() {
		if ($('#counter-animate').length > 0 ) {
			$('#counter-animate').waypoint( function( direction ) {

				if( direction === 'down' && !$(this.element).hasClass('animated') ) {
					setTimeout( counter , 400);
					$(this.element).addClass('animated');

				}
			} , { offset: '90%' } );
		}
	};

	var burgerMenu = function() {
		$('.js-fh5co-nav-toggle').on('click', function(event){
			event.preventDefault();
			var $this = $(this);
			if ($('body').hasClass('offcanvas')) {
				$this.removeClass('active');
				$('body').removeClass('offcanvas');
			} else {
				$this.addClass('active');
				$('body').addClass('offcanvas');
			}
		});
	};


	Vue.use(VueLazyload)

	// or with options
	Vue.use(VueLazyload, {
	  preLoad: 1.3,
	  loading: '../images/image_loading.gif',
//		  loading: 'dist/loading.gif',
//		  attempt: 10,
	})

	var photoListView = new Vue({
	  el: '#ranking-photo-main',
		interval: undefined,
		data: {
			label: "Happy",
			happy_items: [],
			groom_bride_items: [],
			surprised_items: [],
			sorted_item_1: undefined,
			sorted_item_2: undefined,
			sorted_item_3: undefined,
			sorted_items: [],
			happy: false,
			groom_bride: false,
			surprised: false,
			show: false,
	  },
		created: function () {
			this.fetchPhotos();
		},
		methods: {
			sortItemsBy: function(category) {
				var render_items = [];
				if (category == "happy") {
					render_items = this.happy_items;
					this.label = "Happy";
					this.happy = true;
					this.groom_bride = false;
					this.surprised = false;
				}
				if (category == "groom_bride") {
					render_items = this.groom_bride_items;
					this.label = "Bride&Groom";
					this.happy = false;
					this.groom_bride = true;
					this.surprised = false;
				}
				if (category == "surprised") {
					render_items = this.surprised_items;
					this.label = "Surprised";
					this.happy = false;
					this.groom_bride = false;
					this.surprised = true;
				}
				this.sorted_item_1 = render_items.length >= 1 ? render_items[0] : undefined;
				this.sorted_item_2 = render_items.length >= 2 ? render_items[1] : undefined;
				this.sorted_item_3 = render_items.length >= 3 ? render_items[2] : undefined;
				this.sorted_items = [];

				clearInterval(this.interval);

				var index = 3;
				this.interval = setInterval(function() {
					if (index < render_items.length) {
						const item = render_items[index];
						this.sorted_items.push(item);
						index++;
					}
				}.bind(this), 50);
				//this.sorted_items = render_items.slice(3);
			},
	    fetchPhotos: function() {
				var imageWidth = isMobile.any() ? 300 : 450;
				var pickupImageWidth = isMobile.any() ? 600 : 900;
				var imageBaseUrl = "https://d1fdfkwimfb0y0.cloudfront.net/";
				// var imageBaseUrl = "https://20210404.s3.us-east-2.amazonaws.com/";
	      $.ajax({
					type: 'get',
			    url: 'https://5s4ldq0sw1.execute-api.us-east-2.amazonaws.com/v1/image',
					dataType: 'json',
					success: function(result, status, xhr) {
						var items = []; // clear.

						for (const imageEntry of result) {
							var happy = imageEntry.happy || 0;
							var groom_bride = imageEntry.groom_bride || 0;
							var surprised = imageEntry.surprised || 0;
							var item = {
								id: imageEntry.id,
								user_name: imageEntry.user_name,
								pickup_photo_url: imageBaseUrl + imageEntry.image_file_name + "?w=" + pickupImageWidth,
								photo_url: imageBaseUrl + imageEntry.image_file_name + "?w=" + imageWidth,
								created_at: imageEntry.created_at,
								happy_point: happy,
								groom_bride_point: groom_bride,
								surprised_point: surprised,
							};
							items.push(item);
						}

						this.happy_items = items.sort(function(a, b) {
							if (a.happy_point < b.happy_point) {
								return 1;
							} else {
								return -1;
							}
						}).filter(function(item) { return item.happy_point > 0; });

						this.groom_bride_items = items.sort(function(a, b) {
							if (a.groom_bride_point < b.groom_bride_point) {
								return 1;
							} else {
								return -1;
							}
						}).filter(function(item) { return item.groom_bride_point > 0; });

						this.surprised_items = items.sort(function(a, b) {
							if (a.surprised_point < b.surprised_point) {
								return 1;
							} else {
								return -1;
							}
						}).filter(function(item) { return item.surprised_point > 0; });

						// default happy.
						this.sortItemsBy("happy");

						// loading消す.
						$('#loader-container').addClass('hide');
						this.show = true;
			    }.bind(this)
				});
	    }
	  }
	});


	var tab = function() {
	  $('.tab-buttons span').click(function(){
	    var thisclass=$(this).attr('class');
	    $('#lamp').removeClass().addClass('#lamp').addClass(thisclass);
			if (thisclass == "content1") {
				photoListView.sortItemsBy("happy");
			}
			if (thisclass == "content2") {
				photoListView.sortItemsBy("groom_bride");
			}
			if (thisclass == "content3") {
				photoListView.sortItemsBy("surprised");
			}
	  });
	};

	// Click outside of offcanvass
	var mobileMenuOutsideClick = function() {
		$(document).click(function (e) {
	    var container = $("#fh5co-aside, .js-fh5co-nav-toggle");
	    if (!container.is(e.target) && container.has(e.target).length === 0) {
	    	if ( $('body').hasClass('offcanvas') ) {
    			$('body').removeClass('offcanvas');
    			$('.js-fh5co-nav-toggle').removeClass('active');

	    	}

	    }
		});

		$(window).scroll(function(){
			if ( $('body').hasClass('offcanvas') ) {
    			$('body').removeClass('offcanvas');
    			$('.js-fh5co-nav-toggle').removeClass('active');

	    	}
		});
	};

	// Document on load.
	$(function(){
		fullHeight();
		parallax();
		testimonialCarousel();
		contentWayPoint();
		counterWayPoint();
		burgerMenu();
		mobileMenuOutsideClick();
		tab();
	});
}());
