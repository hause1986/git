var coord = null
$(document).ready(function(){
	document.oncontextmenu = function() {
		return false
	} //отключить выпадающее меню
	
	
	preloader()
	setContecstMenu()
	run()
})