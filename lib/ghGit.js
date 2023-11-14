var cmd = require( 'node-cmd' )
var GHGit = function(){
	this.path = ''	
	this.command = 'git '
	this.back = null
}

GHGit.prototype.setBack = function( back ){	
	this.back = back
}

GHGit.prototype.setPath = function( path ){	
	if ( path.length ){
		this.path = path
		this.command = 'git -C ' + this.path + ' '
	}	
}

GHGit.prototype.getBranchs = function(){
	var command = this.command + 'branch'
	var back = this.back
	
	var cmdRes = cmd.runSync( command )
	
	if( cmdRes.err != 'null' ){		
		var arBranchs = []
		var arRes = []
		
		var data = cmdRes.data.trim()
		arBranchs = data.split( '\n' )
		
		for( var key in arBranchs ){
			var flagMainBranch = false
			var val = arBranchs[key]
			val = val.trim()
			var name = val
			
			var arT = val.split( ' ' )
			if(						
					arT.length == 2
				&&	arT[0] == '*'
			){
				flagMainBranch = true
				name = arT[1]
			}
			arRes.push( {
				'NAME'	:	name,
				'MAIN'	:	flagMainBranch
			} )
			
		}
		back.send( 'BRANCHS', JSON.stringify( arRes ) )		
	}else{
		back.send( 'ERR', cmdRes.err )
	}
	
}

GHGit.prototype.getCommits = function( branch ){
	if( branch !== undefined ){
		branch = ' ' + branch
	}else{
		branch = ''
	}
	
	var command = this.command + 'log --pretty=format:"%h;%an;%at;%s" -25' + branch	
	var back = this.back
	
	var cmdRes = cmd.runSync( command )
	if( cmdRes.err != 'null' ){
		var arCommits = []
		var arRes = []
		var data = cmdRes.data.trim()
		arCommits = data.split( '\n' )
		for( var key in arCommits ){				
			var item = arCommits[key].split( ';' )
			arRes.push( {
				'HASH'	:	item[0],
				'NAME'	:	item[1],
				'DATE'	:	item[2],
				'COMM'	:	item[3],
			} )
			
		}			
		back.send( 'COMMITS', JSON.stringify( arRes ) )		
	}else{
		back.send( 'ERR', cmdRes.err )
	}

}

GHGit.prototype.setBranch = function( branch ){
	if( branch === undefined ){
		return 0
	}	
	var command = this.command + 'checkout ' + branch	
	var back = this.back
	
	return new Promise( function( resolve, reject ){		
		var cmdRes = cmd.runSync( command )		
		if( cmdRes.err != 'null' ){
			resolve( cmdRes.data )
		}else{
			reject( cmdRes.err )
		}
	} )
	
}

GHGit.prototype.deleteBranch = function( branch ){
	if( branch === undefined ){
		return 0
	}	
	var command = this.command + 'branch -D ' + branch	
	var back = this.back
	
	return new Promise( function( resolve, reject ){		
		var cmdRes = cmd.runSync( command )		
		if( cmdRes.err != 'null' ){
			resolve( cmdRes.data )
		}else{
			reject( cmdRes.err )
		}
	} )
	
}

GHGit.prototype.newBranch = function( branch ){
	if( branch === undefined ){
		return 0
	}	
	var command = this.command + 'checkout -b ' + branch	
	var back = this.back
	
	return new Promise( function( resolve, reject ){		
		var cmdRes = cmd.runSync( command )		
		if( cmdRes.err != 'null' ){
			resolve( cmdRes.data )
		}else{
			reject( cmdRes.err )
		}
	} )
	
}

module.exports = new GHGit()