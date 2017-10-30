
$(function(){
	
	
	$(".radio__elem").click(function() {
	$(".radio__elem").removeClass("radio__elem--border-active").eq($(this).index()).addClass("radio__elem--border-active")});
	



	$(".hamburger").click(function(){
		$(this).toggleClass("is-active");
		$('.nav-tablet').slideToggle("slow", function(){
		});
	});
});