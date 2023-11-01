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
	
	cmd.run( command, function( err, data, stderr ){
		if( err != 'null' ){
			var arBranch = []
			data = data.trim()
			arBranch = data.split( '\n' )			
			back.send( 'BRANCH', JSON.stringify( arBranch ) )		
		}else{
			back.send( 'ERR', err )
		}
	} )
}

GHGit.prototype.getCommits = function(){
	var command = this.command + 'branch'
	var back = this.back
	cmd.run( command, function( err, data, stderr ){
		if( err != 'null' ){
			var arBranch = []
			data = data.trim()
			arBranch = data.split( '\n' )			
			back.send( 'BRANCH', JSON.stringify( arBranch ) )		
		}else{
			back.send( 'ERR', err )
		}

	} )
}

module.exports = new GHGit()