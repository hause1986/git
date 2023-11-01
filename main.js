console.clear(  )
var ghServ = require( './lib/ghServer' )
var ghBack = require( './lib/ghBack' )
var ghGit = require( './lib/ghGit' )

/*старт сервера*/
ghServ.setHost( 'git.graff-hause.lh' )
ghServ.run()
/**/

ghGit.setBack( ghBack )

/*обработчики сообщений*/
ghBack.on( 'SETPATH', function( msg ){
	if( msg.length ){
		ghGit.setPath( msg )
		ghGit.getBranchs()
		ghGit.getCommits()
	}
} )
ghBack.run()
/**/

