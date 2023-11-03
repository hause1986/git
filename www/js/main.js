var dateFormat = function( unixT  ){
	var ms = unixT * 1000
	var dateOdj = new Date( ms )
	var date = dateOdj.toLocaleString( 'ru-RU', {
	  'dateStyle' : 'short',
	  'timeStyle' : 'short',	  
	} )	
	return date
}

//////////////////////////////////////////
var arr_replace = function(arr, strTemp) {
    var str, key, val
    str = strTemp
    for ( key in arr ) {
        val = arr[key]
        str = str.replace('#' + key + '#', val)
    }
    return str
}

///////////////////////////////////
var preloader = function(){
	var preL
	preL = document.createElement('div')
	preL.id = 'preLoader'
	preL.innerHTML = '<div id="autor"></div><div id="loader"></div>'
	document.body.prepend( preL )	
	
	setTimeout( function(){
		preL.remove()
	}, 1000 )	
}

/////////////////////
var setContecstMenu = function(){	
	var mainBlock = $( '#contecstMenu' )
	
	/*формеруем меню*/
	var arMenu = [
		{
			'NAME'	:	'Перейти',
			'ID'	:	'checkout',
		},
		{
			'NAME'	:	'Ответвится',
			'ID'	:	'newbranch',
		},
		{
			'NAME'	:	'Переименовать',
			'ID'	:	'rename',
		},
		{
			'NAME'	:	'Rebase',
			'ID'	:	'rebase',
		},
		{
			'NAME'	:	'Merge',
			'ID'	:	'merge',
		},
		{
			'NAME'	:	'Удалить',
			'ID'	:	'delete',
		},		
	]
	
	for( var key in arMenu ){
		var val = arMenu[key]
		var item = '<div class="itemCM" id="' + val.ID + '">' + val.NAME + '</div>'
		mainBlock.append( item )
	}
	
	/*событие для открытия меню*/
	$( '#content' ).on( 'mousedown', '#branch .item', function( e ){
		
		if( e.button == 2 ){
			var el = $( this )
			var nameBranch = el.attr( 'data-name' )
			if( mainBlock.hasClass( 'dis-non' ) ){
				mainBlock.removeClass( 'dis-non' )
			}			
			var top = e.pageY
			var left = e.pageX
			mainBlock.css( {
				'top' : top + 'px',
				'left' : left + 'px',
			} ).attr( 'data-branch', nameBranch )
			return false
		}
		
	} )
	
	/*событие для закрытия меню*/
	$( document ).on( 'click', function( e ){
		if(
				mainBlock.has( e.target ).length === 0
			&&	!mainBlock.hasClass( 'dis-non' )
		){
			mainBlock.addClass( 'dis-non' )
		}
	} )
	
	
}



var run = function (){
	
	/*указание проекта*/
	$( '#content' ).on( 'click', '#block-butt a', function( e ){
		e.preventDefault()
		var path = $( '#pathproject' ).val()
		if( path.length ){
			ghFront.send( 'SETPATH', path )
		}
	} )
	
	/*выбор ветки для просмотра коммитов*/
	$( '#content' ).on( 'click', '#branch .item', function( e ){	
		e.preventDefault()		
		var el = $( this )
		var select = el.attr( 'data-select' )
		if( select == '1' ){
			return 0
		}
		$( '#branch .item[data-select=1]' ).attr( 'data-select', '0' )
		el.attr( 'data-select', '1' )
		var nameBranch = el.data( 'name' )
		ghFront.send( 'COMMITS', nameBranch )
	} )
	/**/
	
	/*смена ветки*/
	$( '#contecstMenu' ).on( 'click', '#checkout', function( e ){	
		e.preventDefault()		
		var nameBranch = $( this ).attr( 'data-branch' )
		var el = $( '#branch .item[data-name=' + nameBranch + ']' )
		if( el.hasClass( 'active' ) ){
			return 0
		}
		$( '#branch .item.active' ).removeClass( 'active' )
		el.addClass( 'active' )
		
		ghFront.send( 'SETBRANCH', nameBranch )
	} )	
	/**/
	
	
	/*получение списка веток*/
	ghFront.on( 'BRANCHS', function( msg ){
		var arItems = JSON.parse( msg )
		var str = ''
		for( var key in arItems ){
			var val = arItems[key]
			var main = ''
			var act = ''
			var select = '0'
			
			if( val.MAIN ){
				main ='* '
				act = ' active'
				select = '1'
			}
			str += '<div class="item' + act + '" data-name="' + val.NAME + '" data-select="' + select + '">'
			str += main + val.NAME
			str += '</div>'
		}		
		$( '#branch .items' ).html( str )
	} )
	/**/
	
	/*получение списка коммитов выбраной ветке*/
	ghFront.on( 'COMMITS', function( msg ){
		var arItems = JSON.parse( msg )
		var str = ''
		for( var key in arItems ){
			var val = arItems[key]
			var date = dateFormat( val.DATE )
			str += '<div class="item" data-hash="' + val.HASH + '">'
				str += '<div class="comm">' + val.COMM + '</div>'
				str += '<div class="name">' + val.NAME + '</div>'
				str += '<div class="date">' + date + '</div>'
			str += '</div>'
		}		
		$( '#commit .items' ).html( str )
	} )
	/**/	
	
	
	/*ошибка*/
	ghFront.on( 'ERR', function( msg ){
		$( '#block-err' ).html( msg )
	} )
	/**/	
	
	
	
	ghFront.start()
}
