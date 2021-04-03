;(function () {

	'use strict';

	var autoTransition = function() {
		setTimeout(function() {
			location.href = "photo.html";
		}, 0);
	};

	// Document on load.
	$(function(){
		autoTransition();
	});
}());
