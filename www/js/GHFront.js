var GHFront = function(){
	this.host = 'localhost'
	this.port = 8081
	this.socket = null
	this.listFunc = []	
}



GHFront.prototype.setPort = function( port ){
	if( port ){
		this.port = port
	}
}

GHFront.prototype.start = function( ){
	this.run( this.host, this.port )
}

GHFront.prototype.run = function( host, port ){
	var start = this.start 
	var listFunc = this.listFunc	
	this.socket = new WebSocket( 'ws://' + host + ':' + port )
	
	this.socket.onopen = function() {
		console.log( 'Соединение установлено.' )
	}
	
	this.socket.onclose = function() {
		console.log( 'Соединение закрыто.' )
		setTimeout( function(){			
			start()
		}, 1000 * 2 )
	}
	
	this.socket.onerror = function( err ) {
		console.log( 'Ошибка соединения.' )		
	}
	
	this.socket.onmessage = function( event ) {
		console.log( event.data )
		var jsonMess = JSON.parse( event.data )
		jsonMess.FORM_NAME = jsonMess.FORM_NAME.toUpperCase()
		if(
			jsonMess.FORM_NAME.length &&
			jsonMess.FORM_NAME != undefined &&
			listFunc[jsonMess.FORM_NAME] != undefined
		){
			listFunc[jsonMess.FORM_NAME]( jsonMess.VALUE )
		}
	}

}

GHFront.prototype.send = function( name, value ){	
	if( this.socket.readyState != 1 ){
		console.log( 'Нет соединения с сервером.' )
		return 0		
	}
	if( !name.length ){
		return false
	}
	var obj = {
		'FORM_NAME'	: name.toUpperCase(),
		'VALUE'		: value,
	}
	this.socket.send( JSON.stringify( obj ) )
}

GHFront.prototype.on = function( formName, fn ){
	formName = formName.toUpperCase()
	this.listFunc[formName] = fn
}

var ghFront = new GHFront()