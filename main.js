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

/*установил путь к проекту*/
ghBack.on( 'SETPATH', function( msg ){
	if( msg.length ){
		ghGit.setPath( msg )
		ghGit.getBranchs()
		ghGit.getCommits()
	}
} )
/**/

/*Получить список коммитов у ветке*/
ghBack.on( 'COMMITS', function( msg ){
	if( msg.length ){
		ghGit.getCommits( msg )
	}
} )
/**/

/*перйти на ветку*/
ghBack.on( 'SETBRANCH', function( msg ){
	if( msg.length ){
		ghGit.setBranch( msg )
		ghGit.getBranchs()
		ghGit.getCommits()		
	}
} )
/**/


ghBack.run()
/**/

