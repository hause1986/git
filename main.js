console.clear(  )
var ghServ = require( './lib/ghServer' )
var ghBack = require( './lib/ghBack' )
var ghGit = require( './lib/ghGit' )

/*******************************************/
var fs = require( 'fs' )
var data = [  ]
function getAllFolders( path ) {
	var items = fs.readdirSync( path )
	var folders = []

	for( key in items ){
		var val = items[key]

		var itemPath = `${path}/${val}`
		if ( fs.statSync( itemPath ).isDirectory() ) {
			if( val == '.git' ){				
				folders.push( `${path}/` )
			}else{
				folders = folders.concat( getAllFolders( itemPath ) )
			}
		}			
	}

	return folders
}
/*******************************************/

/*старт сервера*/
ghServ.setHost( 'git.graff-hause.lh' )
ghServ.run()
/**/

ghGit.setBack( ghBack )

/*обработчики сообщений*/


ghBack.on( 'GETLISTGIT', function( msg ){
	const data = getAllFolders( '/WEB' )	
	ghBack.send( 'GETLISTGIT', data )	
} )

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
			.then( function( data ){
				ghGit.getBranchs()
				ghGit.getCommits()
			} )
			.catch( function( err ){
				ghBack.send( 'ERR', err )
			} )
	}
} )
/**/

/*Создание новой ветки*/
ghBack.on( 'NEWBRANCH', function( msg ){
	if( msg.length ){
		ghGit.newBranch( msg )
			.then( function( data ){
				ghGit.getBranchs()
				ghGit.getCommits()
			} )
			.catch( function( err ){
				ghBack.send( 'ERR', err )
			} )		
	}
} )

/*Переименовать ветку*/
ghBack.on( 'RENAME', function( msg ){
	if( msg.NEW.length && msg.OLD.length ){
		ghGit.renameBranch( msg )
			.then( function( data ){
				ghGit.getBranchs()
			} )
			.catch( function( err ){
				ghBack.send( 'ERR', err )
			} )		
	}
} )

/**/

/*Удаляем ветку*/
ghBack.on( 'DELETEBRANCH', function( msg ){
	if( msg.length ){
		ghGit.deleteBranch( msg )
			.then( function( data ){
				ghGit.getBranchs()				
			} )
			.catch( function( err ){
				ghBack.send( 'ERR', err )
			} )
	}
} )
/**/

ghBack.run()
/**/

