var GHGit = function(){
	this.path = ''
}

GHGit.prototype.setPath = function( path ){
	if ( path.length ){
		this.path = path
	}
}

module.exports = new GHGit()