/**
 * jQuery TextConnect plugin v1.0.0
 * http://github.com/narian/textconnect
 *
 * @copyright 2014 Nick Voyloshnikov, http://narian.ru/
 * @license Released under MIT license
 */

(function($) {
	$.fn.textconnect = function(options) {
		var settings =  $.extend({}, { 
							firstcolumn: 	'#'+$(this).attr('id')+' ul:first-child', 
							lastcolumn:  	'#'+$(this).attr('id')+' ul:last-child',
							background:  	'#900',
							step: 			2,	 		// (1) everyone, (2) through one
							begin: 			0,	 		// start from nth element
							even: 			1,  		// odd or even (0 or 1)

						}, options);

		var firstcolumn_margpad = MargPaddCalc( $(settings.firstcolumn) );
		var lastcolumn_margpad = MargPaddCalc( $(settings.lastcolumn) );

		var params = {
			cntwidth:  $(settings.firstcolumn).width()+$(settings.lastcolumn).width()+firstcolumn_margpad.mhor+firstcolumn_margpad.phor,
			cntheight: $(settings.lastcolumn).width()+$(settings.lastcolumn).width()+lastcolumn_margpad.mhor+lastcolumn_margpad.phor,
			childs:  0,
			childsO: 0,
			columncount : 'left',
		};

		var svgOut = '';
		var count=0;
		var leftCoords = new Array();
		var rightCoords = new Array();



		/**
		 * checking bigger top offset of lists for SVG positioning
		 * @return {integer} bigger offset
		 */
		function checkListsTopOffset() {
			var offFirst = parseInt($(settings.firstcolumn).css('margin-top'));
			var offLast = parseInt($(settings.lastcolumn).css('margin-top'));

			if(offFirst > offLast) {
				return offFirst;
			}
			return 0;
		}


		/**
		 * calculating all margins and paddings of object
		 * @param - jquery object, example - $('.class1')
		 * @return object = { mtop, mright, mbottom, mleft, mhor, mver, ptop, pright, pbottom, pleft, phor, pver }
		 * where mhor, mver, phor, pver - summ of vertical and horisontal margins and paddings
		 */
		function MargPaddCalc(obj) {
			var out = {};
			var mtop = parseInt(obj.css('margin-top'));
			var mright = parseInt(obj.css('margin-right'));
			var mbottom = parseInt(obj.css('margin-bottom'));
			var mleft = parseInt(obj.css('margin-left'));

			var mrs = { mtop:    isNaN(mtop) ? 0 : mtop, 
					    mright:  isNaN(mright) ? 0 : mright, 
					    mbottom: isNaN(mbottom) ? 0 : mbottom, 
					    mleft:   isNaN(mleft) ? 0 : mleft 
					  };
			mrs.mhor = mrs.mleft+mrs.mright;
			mrs.mver = mrs.mtop+mrs.mbottom;

			var ptop = parseInt(obj.css('padding-top'));
			var pright = parseInt(obj.css('padding-right'));
			var pbottom = parseInt(obj.css('padding-bottom'));
			var pleft = parseInt(obj.css('padding-left'));

			var pds = { ptop:    isNaN(ptop) ? 0 : ptop, 
					  	pright:  isNaN(pright) ? 0 : pright, 
					  	pbottom: isNaN(pbottom) ? 0 : pbottom, 
					  	pleft:   isNaN(pleft) ? 0 : pleft 
					  };
			pds.phor = pds.pleft+pds.pright;
			pds.pver = pds.ptop+pds.pbottom;

			jQuery.extend(out, mrs);
			jQuery.extend(out, pds);

			return out;
		}


		/**
		 * check childrens in every column
		 */
		function checkChildrens() {
			var left = $(settings.firstcolumn).children().length;
			var right = $(settings.lastcolumn).children().length;
			if(left==0 || right==0) {
				throw new Error("One of lists is empty.");
				return;
			}
			if(left>=right) {
				params.childs = left;
				params.childsO = right;
				params.columncount = 'left';
			} else {
				params.childs = right;
				params.childsO = left;
				params.columncount = 'right';
			}
		}


		/**
		 * get position of single element
		 * @param elem {string} selector of specific element
		 * @return {array} with coordinates
		 */
		function getCoords(elem) {
			var offset = $(elem).offset();
			var offCnt = $(settings.firstcolumn).offset();

			offset.left = offset.left - offCnt.left;
			offset.top = offset.top - offCnt.top;

			var pad = MargPaddCalc( $(elem) );

			return [	
						{ x:offset.left,					 		 y:offset.top }, 								// top left
						{ x:offset.left+$(elem).width()+pad.phor,	 y:offset.top }, 								// top right
						{ x:offset.left+$(elem).width()+pad.phor,	 y:offset.top+$(elem).height()+pad.pver }, 		// bottom right
						{ x:offset.left, 							 y:offset.top+$(elem).height()+pad.pver }, 		// bottom left
				   ];
		}


		/** 
		 * making array with all coordinates
		 */
		function makeAllCoords() {
			$(settings.firstcolumn).children('li').each(function(){
				leftCoords[leftCoords.length] = getCoords(this);
			});

			$(settings.lastcolumn).children('li').each(function(){
				rightCoords[rightCoords.length] = getCoords(this);
			});

			// if quantity of childs in lists are different
			if(params.childsO<params.childs) {

				for(var j=params.childsO; j<params.childs; j++) {
					if(params.columncount=='left') {
						var lcolLast = rightCoords[leftCoords.length-1][2];
						var lcolaLast = rightCoords[leftCoords.length-1][2];
						rightCoords[rightCoords.length] = [ lcolLast, lcolaLast, lcolLast, lcolaLast ];

					} else {
						var rcolLast = leftCoords[leftCoords.length-1][2];
						var rcolaLast = leftCoords[leftCoords.length-1][2];
						leftCoords[leftCoords.length] = [ rcolLast, rcolaLast, rcolLast, rcolaLast ];

					}
				}

			}
			
		}


		/** 
		 * create svg polygon from coordinates
		 * @param {array} firstCoords - coordinates of the block from left list item
		 * @param {array} lastCoords - coordinates of the block from right list item
		 * @return {string} html markup that represents current polygon
		 */
		function makeElement(firstCoords, lastCoords) {
			var coords =  firstCoords[0].x+' '+firstCoords[0].y+', '+firstCoords[1].x+' '+firstCoords[1].y+', ';
				coords += lastCoords[0].x+' '+lastCoords[0].y+', '+lastCoords[1].x+' '+lastCoords[1].y+', ';
				coords += lastCoords[2].x+' '+lastCoords[2].y+', '+lastCoords[3].x+' '+lastCoords[3].y+', ';
				coords += firstCoords[2].x+' '+firstCoords[2].y+', '+firstCoords[3].x+' '+firstCoords[3].y;

			return '<polygon points="'+coords+'" style="fill:'+settings.background+';" />';
		}


		// execution starts here
		try {
			checkChildrens();

		} catch(e) {
			console.log('Wait a second! Function checkChildrens(): '+e.name+' Message: '+e.message);

		} finally {
			makeAllCoords();

			for(var i=settings.begin; i<params.childs; i++) {
				if(i%settings.step==settings.even) {
					svgOut += makeElement(leftCoords[i], rightCoords[i]);
				}
			}

			var topOffset = checkListsTopOffset();
			$(this).append('<svg class="textconnect-svg" style="padding-top:'+topOffset+'px;">'+svgOut+'</svg>');
		}

	};
})(jQuery);