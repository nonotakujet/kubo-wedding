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

		Vue.use(VueLazyload)

		// or with options
		Vue.use(VueLazyload, {
		  preLoad: 1.3,
		  loading: '../images/image_loading.gif',
//		  loading: 'dist/loading.gif',
//		  attempt: 10,
		})

		var photoListView = new Vue({
		  el: '#fh5co-main',
		  data: {
		    items: []
		  },
 			created: function () {
				this.fetchPhotos();
			},
			methods: {
		    fetchPhotos: function() {
				// var imageBaseUrl = "https://test-suwa.s3.us-east-2.amazonaws.com/";
				var imageBaseUrl = "https://20210404.s3.us-east-2.amazonaws.com/";
				var imageWidth = isMobile.any() ? 300 : 450;
				// var imageBaseUrl = "https://d1fdfkwimfb0y0.cloudfront.net/";
				$.ajax({
					type: 'get',
					url: 'https://5s4ldq0sw1.execute-api.us-east-2.amazonaws.com/v1/image',
					dataType: 'json',
					success: function(result, status, xhr) {
						this.items = []; // clear.
						for (const imageEntry of result) {
							var happy = imageEntry.happy || 0;
							var groom_bride = imageEntry.groom_bride || 0;
							var surprised = imageEntry.surprised || 0;
							var isHappy = happy >= groom_bride && happy >= surprised;
							var isGroomBride = !isHappy && groom_bride >= happy && groom_bride >= surprised;
							var isSurprised = !isHappy && !isGroomBride;
							var item = {
								id: imageEntry.id,
								user_name: imageEntry.user_name,
								photo_url: imageBaseUrl + imageEntry.image_file_name + "?w=" + imageWidth,
								happiness: imageEntry.happy,
								created_at: imageEntry.created_at,
								happy: isHappy,
								groom_bride: isGroomBride,
								surprised: isSurprised,
								happy_point: happy,
								groom_bride_point: groom_bride,
								surprised_point: surprised,
							};
							this.items.push(item);
						}
						this.items.sort(function(a, b) {
							if (a.created_at < b.created_at) {
								return 1;
							} else {
								return -1;
							}
						});
						$('#loader-container').addClass('hide');
				    }.bind(this)
					});
		    }
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
	});
}());
