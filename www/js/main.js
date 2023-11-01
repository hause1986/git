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
	
	/*указание проекта*/
	$( '#block-butt a' ).click( function( e ){
		e.preventDefault()
		var path = $( '#pathproject' ).val()
		if( path.length ){
			ghFront.send( 'SETPATH', path )
		}
	} )
	
	/*получение списка веток*/
	ghFront.on( 'BRANCH', function( msg ){
		var arBranch = JSON.parse( msg )
		var str = ''
		for( var key in arBranch ){
			var val = arBranch[key]
			val = val.trim()
			var name = val
			
			var arT = val.split( ' ' )
			if( arT.length == 2 ){
				name = arT[1]
			}
			str += '<div class="item" data-name="' + name + '">'
			str += val
			str += '</div>'
		}		
		$( '#branch' ).html( str )
	} )
	/**/
	
	/*ошибка*/
	ghFront.on( 'ERR', function( msg ){
		$( '#block-err' ).html( msg )
	} )
	/**/	
	
	
	
	ghFront.start()
}
