;(function () {

	var autoTransition = function() {
		setTimeout(function() {
			location.href = "photo.html";
		}, 10);
	};

	// Document on load.
	$(function(){
		autoTransition();
	});
}());
