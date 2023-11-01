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
var GHAjax = function(){
	var XHR = ( 'onload' in new XMLHttpRequest() ) ? XMLHttpRequest : XDomainRequest
	this.xhr = new XHR()	
}
GHAjax.prototype.send = function( opt ){
	var key, val
	var option = {
		'url'		: '',
		'method'	: 'GET',
		'async'		: true,
		'data'		: {},
		'success'	: function(){
			console.log( this.responseText )
		},
		'errore'	: function(){
			console.log( this.responseText )
		}
	}
	
	for( key in option ){
		val = option[key]
		switch ( key ){
			case 'url':
				if( opt[key] == '' ){
					return {
						'STATUS'	: 'ERR',
						'MESS'		: 'NON URL',
					}
				}else{
					option[key] = opt[key]
				}
			break
			case 'method':
				if( option[key] != opt[key] ){
					option[key] = 'POST'
				}
			break
			case 'async':
				if( option[key] != opt[key] ){
					option[key] = false
				}
			break			
			default:
				if( opt[key] != null ){
					option[key] = opt[key]
				}
			break			
		}		
	}
	
	this.xhr.onload = option.success
	this.xhr.onerror = option.errore
	
	this.xhr.open(
		option.method,		
		option.url,
		option.async
	)	
	this.xhr.send( JSON.stringify( option.data ) )
}