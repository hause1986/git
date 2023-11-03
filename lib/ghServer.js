var fs = require( 'fs' )
var path = require('path')

var GHServer = function(){
	this.host = 'localhost.lh'
	this.port = 8081
	
	this.http = require( 'http' )
	this.server = null
}

GHServer.prototype.setHost = function( host ){
	if( host.length ){
		this.host = host
	}
}

GHServer.prototype.setPort = function( port ){
	if( port ){
		this.port = port
	}
}

GHServer.prototype.run = function(){
	var host = this.host
	var server = null
	var getContentType = this.getContentType
	
	console.clear()
	
	server = this.http.Server( function( req, res ){		
		var statusCode = 200
		var contentType = 'text/html'
		var content = ''
		var url = req.url
		
		if( url == '' || url == '/' ){
			url = '/index.html'
		}
		
		/*
		console.log( 'UrlReal: ' + req.url, false )
		console.log( 'Url: ' + url, false )
		console.log( 'Тип запроса: ' + req.method, false )
		console.log( 'User-Agent: ' + req.headers['user-agent'], false )	
		*/
		
		if( req.method == 'GET' ){
			/////////GET
			var basePath = path.join( process.cwd(), '/www' )
			var filePath			
		
			filePath = path.join( basePath, url )
			
			if( fs.existsSync( filePath ) ){
				contentType = getContentType( filePath )
				content = fs.readFileSync( filePath )			
			}else{
				statusCode = 404
				content = '<h1>404</h1>'
				console.log( 'Нет такого файла: [ ' + filePath + ' ]', false )
			}
			
			res.statusCode = statusCode
			res.setHeader( 'Content-Type',	contentType + '; charset=utf-8;' )
			res.write( content )
			res.end()			
		}
		
	} )	
	
	server.listen( this.port, host, function(){
		console.log( host + ' - Sever start!'	)		
	} )	
	
}


GHServer.prototype.getContentType = function( filePath ){
	var contentType = 'text/html'
	var extName
	var arrContentTypes = {
		'css'	: 'text/css',
		'js'	: 'text/javascript',
		'json'	: 'application/json',
		'png'	: 'image/png',
		'jpg'	: 'image/jpg',
		'ico'	: 'image/x-icon',
	}
	
	if( !filePath.length ){
		return contentType
	}
	extName = path.extname( filePath ).slice( 1 ).toLowerCase()	
	for( var k in arrContentTypes ){
		if( k == extName ){
			contentType = arrContentTypes[k]
			break
		}
	}
	
	return contentType	
}

module.exports = new GHServer()