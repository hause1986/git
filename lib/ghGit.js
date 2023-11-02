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
	
	console.log( command )
	cmd.run( command, function( err, data, stderr ){
		if( err != 'null' ){
			
			var arBranchs = []
			var arRes = []
			
			data = data.trim()
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
			console.log( arRes )
			console.log( '----------------------------' )
			back.send( 'BRANCHS', JSON.stringify( arRes ) )		
		}else{
			back.send( 'ERR', err )
		}
	} )
}

GHGit.prototype.getCommits = function( branch ){
	if( branch !== undefined ){
		branch = ' ' + branch
	}else{
		branch = ''
	}
	
	var command = this.command + 'log --pretty=format:"%h;%an;%at;%s" -25' + branch	
	var back = this.back
	cmd.run( command, function( err, data, stderr ){
		if( err != 'null' ){
			var arCommits = []
			var arRes = []
			data = data.trim()
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
			back.send( 'ERR', err )
		}

	} )
}

GHGit.prototype.setBranch = function( branch ){
	if( branch === undefined ){
		return 0
	}	
	var command = this.command + 'checkout ' + branch	
	var back = this.back
	cmd.run( command, function( err, data, stderr ){
		if( err != 'null' ){		
			back.send( 'ERR', err )
		}else{
			back.send( 'ERR', err )
		}

	} )
}

module.exports = new GHGit()