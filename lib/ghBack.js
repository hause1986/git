var wsGlob = null
var GHBack = function(){
	this.port = 8081	
	this.listFunc = []
}

GHBack.prototype.send = function( name, value ){
	if( !name.length ){
		return false
	}
	var obj = {
		'FORM_NAME'	: name.toUpperCase(),
		'VALUE'		: value,
	}
	if( wsGlob != undefined ){		
		wsGlob.send( JSON.stringify( obj ) )
	}
}
 
GHBack.prototype.on = function( formName, fn ){
	formName = formName.toUpperCase()
	this.listFunc[formName] = fn
}

GHBack.prototype.run = function(){
	var listFunc = this.listFunc
	var WebSocket = new require( 'ws' )
	var wsServer  = new WebSocket.Server({
		'port'	:	this.port
	})
	
	wsServer.on( 'connection', function( ws ) {
		wsGlob = ws
		//console.log( 'новое соединение' )		
		ws.on( 'message', function( mess ){
			var jsonMess = JSON.parse( mess )
			jsonMess.FORM_NAME = jsonMess.FORM_NAME.toUpperCase()
			if(
				jsonMess.FORM_NAME.length &&
				jsonMess.FORM_NAME != undefined &&
				listFunc[jsonMess.FORM_NAME] != undefined
			){
				listFunc[jsonMess.FORM_NAME]( jsonMess.VALUE )
			}
		})
		
		ws.on( 'close', function(){
			//console.log( 'соединение закрыто' )			
		})
	})	
}
module.exports = new GHBack()