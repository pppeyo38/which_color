//スクリプト書く
(function($){
	// スタート画面からの画面遷移
	$('#start_button').on('click', function(){
		$('#display_start').toggleClass('delete');
		$('#display_name').toggleClass('visible');
	})
	$('#name_button').on('click', function(){
		$('#display_name').removeClass('visible');
		$('.display_char').toggleClass('visible');
	});

	//音楽流す
	$('#music_button').on('click', function(){
		$('#display_start_bgm').get(0).play();
	});

	//キャラクター選択画面
	var dx = 0;
	$('#cicon_D').on('click', function(){
		if(dx === 0){
			dx += 1;
			$('#decide_button').attr('src', 'buttons/char_decide.png');
			$('#cicon_D').attr('src', 'images/dec_witch_D.png');
			$('#decide_button').attr('onclick', "game_start()");
		}else if(dx !== 0){
			$('#cicon_D').attr('src', 'images/dec_witch_D.png');
			$('#cicon_B').attr('src', 'images/cho_witch_B.png');
		}
	});
	$('#cicon_B').on('click', function(){
		if(dx === 0){
			dx += 1;
			$('#decide_button').attr('src', 'buttons/char_decide.png');
			$('#cicon_B').attr('src', 'images/dec_witch_B.png');
			$('#decide_button').attr('onclick', "game_start()");
		}else if(dx !== 0){
			$('#cicon_B').attr('src', 'images/dec_witch_B.png');
			$('#cicon_D').attr('src', 'images/cho_witch_D.png');
		}
	});

	//ゲーム画面
	$('#decide_button').on('click', function(){
		$('.display_char').removeClass('visible');
		$('.display_game').toggleClass('visible');
		$('#display_start_bgm').get(0).pause();
		$('#battle_bgm').get(0).play();
	});

	$('#bimg_Area1').on('click', function(){
		$('.lower-1').addClass('onclick');
		$('#item-decide-button').addClass('decide');
		$('.lower-2, .lower-3, .lower-4, .lower-5').removeClass('onclick');
	});
	$('#bimg_Area2').on('click', function(){
		$('.lower-2').addClass('onclick');
		$('#item-decide-button').addClass('decide');
		$('.lower-1, .lower-3, .lower-4, .lower-5').removeClass('onclick');
	});
	$('#bimg_Area3').on('click', function(){
		$('.lower-3').addClass('onclick');
		$('#item-decide-button').addClass('decide');
		$('.lower-1, .lower-2, .lower-4, .lower-5').removeClass('onclick');
	});
	$('#bimg_Area4').on('click', function(){
		$('.lower-4').addClass('onclick');
		$('#item-decide-button').addClass('decide');
		$('.lower-1, .lower-2, .lower-3, .lower-5').removeClass('onclick');
	});
	$('#bimg_Area5').on('click', function(){
		$('.lower-5').addClass('onclick');
		$('#item-decide-button').addClass('decide');
		$('.lower-1, .lower-2, .lower-3, .lower-4').removeClass('onclick');
	});
	// $('#item-decide-button').on('click', function(){
	// 	$('.lower-1', '.lower-2', '.lower-3', '.lower-4', '.lower-5').removeClass('onclick');
	// });

})(jQuery);