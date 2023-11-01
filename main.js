console.clear(  )
var ghServ = require( './lib/ghServer' )
var ghBack = require( './lib/ghBack' )
var ghGit = require( './lib/ghGit' )

/*старт сервера*/
ghServ.setHost( 'git.graff-hause.lh' )
ghServ.run()
/**/

/*обработчики сообщений*/
ghBack.on( 'setpath', function( msg ){
	if( msg.length ){
		ghGit.setPath( msg )
	}
} )
ghBack.run()
/**/

