var arr_replace = function(arr, strTemp) {
    var str, key, val
    str = strTemp
    for ( key in arr ) {
        val = arr[key]
        str = str.replace('#' + key + '#', val)
    }
    return str
}

///////////////////////////////////
var preloader = function(){
	var preL
	preL = document.createElement('div')
	preL.id = 'preLoader'
	preL.innerHTML = '<div id="autor"></div><div id="loader"></div>'
	document.body.prepend( preL )	
	
	setTimeout( function(){
		preL.remove()
	}, 1000 )	
}
/////////////////////

var run = function (){
	ghFront.setHost( 'git.graff-hause.lh' )	
	
	$( '#block-butt a' ).click( function( e ){
		e.preventDefault()
		var path = $( '#pathproject' ).val()
		if( path.length ){
			ghFront.send( 'setpath', path )
		}
	} )
}
