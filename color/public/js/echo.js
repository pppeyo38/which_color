//DOMの宣言
//ユーザー入力フォーム
var form = document.querySelector("form");
//メッセージ入力テキストボックス
var input = document.querySelector("input[name=message]");
//エコーメッセージの出力
var output = document.querySelector("output");

//WebSocketサーバへ接続する
var ws = new WebSocket("ws://" + location.host);

//WebSocketサーバと接続した
ws.onopen = on_open;
//WebSocketサーバからメッセージを受信した
ws.onmessage = on_message;
//WebSocketサーバとの接続が切れた
ws.onclose = on_close;


// --- 以下追加変数 ---
//対戦スタート
var battle_start; //True:スタート False:接続待ち
//キャラクター選択
var char; //1:魔法士(B) 2:悪魔法士(D)
var opp_char = 0; //相手のキャラクター
//キャラクターアイコンが入ったリスト
var st_char_pics = new Array(
	'../avatar_imgs/standing_picture1.png', '../avatar_imgs/standing_picture2.png',
	'../avatar_imgs/standing_picture1D.png', '../avatar_imgs/standing_picture2D.png'
);
var bt_char_pics = new Array(
	'../avatar_imgs/battle_picture1.png', '../avatar_imgs/battle_picture2.png',
	'../avatar_imgs/battle_picture1D.png', '../avatar_imgs/battle_picture2D.png'
);


//プレイヤー名
var my_name = 0;
var opp_name = 0;
var p1_name, p2_name;

var count_turn = 0; //ターン数カウント
var count = 0; //何人目のクライアントか

var dis_ready = 0; //バトル開始画面になったか

//自分と相手の体力(Max7)
var my_life = 7;
var opp_life = 7;

//体力表示連想配列
var player1HP_Array = {
	'7':'../heart_img/player1_H7.png', '6.5':'../heart_img/player1_H6.5.png',
	'6':'../heart_img/player1_H6.png', '5.5':'../heart_img/player1_H5.5.png',
	'5':'../heart_img/player1_H5.png', '4.5':'../heart_img/player1_H4.5.png',
	'4':'../heart_img/player1_H4.png', '3.5':'../heart_img/player1_H3.5.png',
	'3':'../heart_img/player1_H3.png', '2.5':'../heart_img/player1_H2.5.png',
	'2':'../heart_img/player1_H2.png', '1.5':'../heart_img/player1_H1.5.png',
	'1':'../heart_img/player1_H1.png', '0.5':'../heart_img/player1_H0.5.png', '0':'../heart_img/player1_H0.png'
};
var player2HP_Array = {
	'7':'../heart_img/player2_H7.png', '6.5':'../heart_img/player2_H6.5.png',
	'6':'../heart_img/player2_H6.png', '5.5':'../heart_img/player2_H5.5.png',
	'5':'../heart_img/player2_H5.png', '4.5':'../heart_img/player2_H4.5.png',
	'4':'../heart_img/player2_H4.png', '3.5':'../heart_img/player2_H3.5.png',
	'3':'../heart_img/player2_H3.png', '2.5':'../heart_img/player2_H2.5.png',
	'2':'../heart_img/player2_H2.png', '1.5':'../heart_img/player2_H1.5.png',
	'1':'../heart_img/player2_H1.png', '0.5':'../heart_img/player2_H0.5.png', '0':'../heart_img/player2_H0.png'
};

//自分と相手の使用アイテム
var my_item, opp_item;

//魔導書が入った配列
const books_img = [
	'../img-book/book-R1.png', '../img-book/book-R2.png', '../img-book/book-R3.png',
	'../img-book/book-G1.png', '../img-book/book-G2.png', '../img-book/book-G3.png',
	'../img-book/book-B1.png', '../img-book/book-B2.png', '../img-book/book-B3.png'
];
const books_imgD = [
	'../img-D-book/book-R1.png', '../img-D-book/book-R2.png', '../img-D-book/book-R3.png',
	'../img-D-book/book-G1.png', '../img-D-book/book-G2.png', '../img-D-book/book-G3.png',
	'../img-D-book/book-B1.png', '../img-D-book/book-B2.png', '../img-D-book/book-B3.png'
];

//戦闘シーンのアイコン
const bpc_p1 = {
	'R1':'../avatar_imgs/battle_picture1/battle_picture1R1.png', 'R2':'../avatar_imgs/battle_picture1/battle_picture1R2.png', 'R3':'../avatar_imgs/battle_picture1/battle_picture1R3.png',
	'G1':'../avatar_imgs/battle_picture1/battle_picture1G1.png', 'G2':'../avatar_imgs/battle_picture1/battle_picture1G2.png', 'G3':'../avatar_imgs/battle_picture1/battle_picture1G3.png',
	'B1':'../avatar_imgs/battle_picture1/battle_picture1B1.png', 'B2':'../avatar_imgs/battle_picture1/battle_picture1B2.png', 'B3':'../avatar_imgs/battle_picture1/battle_picture1B3.png'
};
const bpc_p2 = {
	'R1':'../avatar_imgs/battle_picture2/battle_picture2R1.png', 'R2':'../avatar_imgs/battle_picture2/battle_picture2R2.png', 'R3':'../avatar_imgs/battle_picture2/battle_picture2R3.png',
	'G1':'../avatar_imgs/battle_picture2/battle_picture2G1.png', 'G2':'../avatar_imgs/battle_picture2/battle_picture2G2.png', 'G3':'../avatar_imgs/battle_picture2/battle_picture2G3.png',
	'B1':'../avatar_imgs/battle_picture2/battle_picture2B1.png', 'B2':'../avatar_imgs/battle_picture2/battle_picture2B2.png', 'B3':'../avatar_imgs/battle_picture2/battle_picture2B3.png'
};

const bpc_p1D = {
	'R1':'../avatar_imgs/battle_picture1D/battle_picture1DR1.png', 'R2':'../avatar_imgs/battle_picture1D/battle_picture1DR2.png', 'R3':'../avatar_imgs/battle_picture1D/battle_picture1DR3.png',
	'G1':'../avatar_imgs/battle_picture1D/battle_picture1DG1.png', 'G2':'../avatar_imgs/battle_picture1D/battle_picture1DG2.png', 'G3':'../avatar_imgs/battle_picture1D/battle_picture1DG3.png',
	'B1':'../avatar_imgs/battle_picture1D/battle_picture1DB1.png', 'B2':'../avatar_imgs/battle_picture1D/battle_picture1DB2.png', 'B3':'../avatar_imgs/battle_picture1D/battle_picture1DB3.png'
};
const bpc_p2D = {
	'R1':'../avatar_imgs/battle_picture2D/battle_picture2DR1.png', 'R2':'../avatar_imgs/battle_picture2D/battle_picture2DR2.png', 'R3':'../avatar_imgs/battle_picture2D/battle_picture2DR3.png',
	'G1':'../avatar_imgs/battle_picture2D/battle_picture2DG1.png', 'G2':'../avatar_imgs/battle_picture2D/battle_picture2DG2.png', 'G3':'../avatar_imgs/battle_picture2D/battle_picture2DG3.png',
	'B1':'../avatar_imgs/battle_picture2D/battle_picture2DB1.png', 'B2':'../avatar_imgs/battle_picture2D/battle_picture2DB2.png', 'B3':'../avatar_imgs/battle_picture2D/battle_picture2DB3.png'
};

//ランダムの数字を入れる変数
var imgNo1, imgNo2, imgNo3, imgNo4, imgNo5;
var attack_list = ['atta'];

//アイテム使用決定ボタンの場所
const d_button = document.getElementById('item-decide-button');
//どこにあるアイテムを使用したか
var use_where; //imgNo1, imgNo2, imgNo3, imgNo4, imgNo5

//アイコン選択→配置
//相手に送るためのリスト(アイコン用)
//キャラクター選択結果
var player_icon = ['icon'];
document.getElementById("cicon_B").onclick = function() {
	char = 'B';
};
document.getElementById("cicon_D").onclick = function() {
	char = 'D';
};

const my_icon = document.getElementsByClassName("my_icon");
const opp_icon = document.getElementsByClassName("opp_icon");

var com_c = 0; //何回クリックされたかカウント

// --- 以上追加変数 ---


//各イベントが発生した時に呼び出す関数を決める
//WebSocketサーバと接続した
function on_open(e) {
	// output.innerHTML += "[[サーバと接続しました]] <br>";
}

//WebSocketサーバからメッセージを受信した
function on_message(e){
	if(e.data.length == 1 && typeof(e.data) == 'string'){
		count = Number(e.data);
		console.log("あなたはプレイヤー" + count + "です.");
		attack_list.push(count);
		if(count === 1){
			battle_start = false;
		}else if(count === 2){
			console.log('対戦開始！');
			battle_start = true;
			document.getElementById("start_button").classList.add("visible");
			document.getElementById("con_wait").classList.add("delete");
		}
	}else if(e.data === 'True'){ //1番目のクライアントが待っている時にサーバー側からもらう
		console.log('対戦開始！');
		battle_start = true;
		document.getElementById("start_button").classList.add("visible");
		document.getElementById("con_wait").classList.add("delete");
	}else if(e.data instanceof Blob){
		reader = new FileReader();
		reader.onload = () => {
			//受け取ったテキスト
			var reserve_text = reader.result;
			//受け取ったテキストの頭4文字
			var a_str = reserve_text.substring(0, 4);
			//どちらからのテキストか
			var p_num = Number(reserve_text.substr(5, 1));
			//自分が送ったテキストではない場合
			if(p_num !== count){
				console.log('受け取った文' + reserve_text);
				//名前の読み取り
				if(a_str === 'name'){
					opp_name = reserve_text.substr(7);
					console.log('相手の名前は' + opp_name);
					if(count === 1){
						player2_name.innerHTML = opp_name;
					}
					else if(count === 2){
						player1_name.innerHTML = opp_name;
					}
				//アイコン情報
				}else if(a_str === 'icon'){
					opp_char = reserve_text.substr(-1);
					if(opp_char === 'B'){
						if(count == 1){
							document.getElementById("player2_icon").src=st_char_pics[1];
						}else if(count == 2){
							document.getElementById("player1_icon").src=st_char_pics[0];
						}
					}else if(opp_char === 'D'){
						if(count == 1){
							document.getElementById("player2_icon").src=st_char_pics[3];
						}else if(count == 2){
							document.getElementById("player1_icon").src=st_char_pics[2];
						}
					}
					dis_ready += 1;
					if(dis_ready < 2){
						commandtext.innerHTML = "ちょっと待ってね";
					}else{
						commandtext.innerHTML = "何を使う？";
					}
				}else if(a_str === 'atta'){
					opp_item = reserve_text.substr(7);
					attack();
				}

			}
		}
		reader.readAsText(e.data);
	}else{
		console.log("Result:" + e.data);
	}
}

//WebSocketサーバとの接続が切れた
function on_close(e){
	// output.innerHTML += "[[サーバの接続が切れました]]";
}

//ユーザが送信ボタンを押した
function on_submit(e){
	var msg = input.value;

	if(ws){
		ws.send(msg);
	}
	input.value = "";
}


// --- 以下追加関数 ---
//プレイヤー名送信
function on_submit_name(e){
	const namebox = document.getElementById("player_name");
    my_name = namebox.value;

	var player_name = ['name', count];
	player_name.push(my_name);

	if(ws){
		ws.send(player_name);
	}
}

//ゲーム画面上の名前とターン数表示
function game_start(){
	dis_ready += 1;
	count_turn += 1;
	player_icon.push(count);
	player_icon.push(char);

	if(count == 1){
		document.getElementById("your_icon1").src="../images/your_icon.png";
		if(char === 'B'){
			document.getElementById("player1_icon").src=st_char_pics[0];
		}else if(char === 'D'){
			document.getElementById("player1_icon").src=st_char_pics[2];
		}
		document.getElementById("player1_icon").classList.add("my_icon");
		document.getElementById("player2_icon").classList.add("opp_icon");
	}else if(count == 2){
		document.getElementById("your_icon2").src="../images/your_icon.png";
		if(char === 'B'){
			document.getElementById("player2_icon").src=st_char_pics[1];
		}else if(char === 'D'){
			document.getElementById("player2_icon").src=st_char_pics[3];
		}
		document.getElementById("player2_icon").classList.add("my_icon");
		document.getElementById("player1_icon").classList.add("opp_icon");
	}

	if(count === 1){
		player1_name.innerHTML = my_name;
		p1_name = my_name;
		p2_name = opp_name;
	}
	else if(count === 2){
		player2_name.innerHTML = my_name;
		p2_name = my_name;
		p1_name = opp_name;
	}
	turn_number.innerHTML = count_turn;
	if(dis_ready < 2){
		commandtext.innerHTML = "ちょっと待ってね";
	}else{
		commandtext.innerHTML = "何を使う？";
	}

	ws.send(player_icon);
	books_icon_random();
}


function attack_decide(){
	if(my_item === 'R1' || my_item === 'R2' || my_item === 'R3'){
		console.log('赤魔導書使用');
	}else if(my_item === 'G1' || my_item === 'G2' || my_item === 'G3'){
		console.log('緑魔導書使用');
	}else if(my_item === 'B1' || my_item === 'B2' || my_item === 'B3'){
		console.log('青魔導書使用');
	}

	//自分のアイコンの影の色が変わる
	if(char === "B"){
		for(var i = 0; i < my_icon.length; ++i) my_icon[i].classList.toggle(my_item);
	}else if(char === "D"){
		for(var i = 0; i < my_icon.length; ++i) my_icon[i].classList.toggle('D' + my_item);
	}

	d_button.src = '../buttons/wait-button.png';
	commandtext.innerHTML = "相手を待っています…";

	ws.send(attack_list);
	attack_list.pop();
}

const n_text = document.getElementById('next_command');

function attack(){
	d_button.src = '../buttons/i-decide.png';
	//決定ボタンの削除
	var decide_buttonArea = document.getElementById('item-decide-button');
	decide_buttonArea.classList.remove('decide');

	//相手のアイコンの影の色が変わる
	if(opp_char === "B"){
		for(var i = 0; i < opp_icon.length; ++i){
			opp_icon[i].classList.toggle(opp_item);
		}
	}else if(opp_char === "D"){
		for(var j= 0; j < opp_icon.length; ++j){
			opp_icon[j].classList.toggle('D' + opp_item);
		}
	}
	commandtext.innerHTML = "対戦開始！ ▶︎";
	n_text.setAttribute('onclick', 'command_c()');
	attack_calc();
}

//コマンドに書く用のテキスト
var my_at_text, opp_at_text;

const player1HP_Area = document.getElementById('player1_HP');
const player2HP_Area = document.getElementById('player2_HP');
const result_Area = document.getElementById('game_result');
var x, y;

var my_d, opp_d;

function attack_calc(){
	//属性 R,G,B
	var my_at = my_item.substr(0, 1); var opp_at = opp_item.substr(0, 1);
	if(my_at === 'R'){
		my_at_text = '赤';
	}else if(my_at === 'G'){
		my_at_text = '緑';
	}else if(my_at === 'B'){
		my_at_text = '青';
	}
	if(opp_at === 'R'){
		opp_at_text = '赤';
	}else if(opp_at === 'G'){
		opp_at_text = '緑';
	}else if(opp_at === 'B'){
		opp_at_text = '青';
	}
	//強さ 1>2>3
	var my_st = my_item.substr(1); var opp_st = opp_item.substr(1);

	if(char !== opp_char){
		//自分が有利属性で相手が不利属性
		if((my_at === 'R' && opp_at === 'G') || (my_at === 'G' && opp_at === 'B') || (my_at === 'B' && opp_at === 'R')){
			if(my_st === '1' && opp_st === '3'){
				my_life -= 0.5;
				opp_life -= 2;
				my_d = 0.5;
				opp_d = 2;
			}else if((my_st === '1' && opp_st === '2') || (my_st === '2' && opp_st === '3')){
				my_life -= 0.5;
				opp_life -= 1.5;
				my_d = 0.5;
				opp_d = 1.5;
			}else if(my_st === opp_st){
				my_life -= 0.5;
				opp_life -= 1;
				my_d = 0.5;
				opp_d = 1;
			}else{
				my_life -= 0.5;
				opp_life -= 0.5;
				my_d = 0.5;
				opp_d = 0.5;
			}
		//自分が不利属性で相手が有利属性
		}else if((my_at === 'R' && opp_at === 'B') || (my_at === 'G' && opp_at === 'R') || (my_at === 'B' && opp_at === 'G')){
			if(my_st === '3' && opp_st === '1'){
				my_life -= 2;
				opp_life -= 0.5;
				my_d = 2;
				opp_d = 0.5;
			}else if((my_st === '3' && opp_st === '2') || (my_st === '2' && opp_st === '1')){
				my_life -= 1.5;
				opp_life -= 0.5;
				my_d = 1.5;
				opp_d = 0.5;
			}else if(my_st === opp_st){
				my_life -= 1;
				opp_life -= 0.5;
				my_d = 1;
				opp_d = 0.5;
			}else{
				my_life -= 0.5;
				opp_life -= 0.5;
				my_d = 0.5;
				opp_d = 0.5;
			}
		}else{
			my_life -= 0.5;
			opp_life -= 0.5;
			my_d = 0.5;
			opp_d = 0.5;
		}
	}else if(char === opp_char){
		//自分が有利属性で相手が不利属性
		if((my_at === 'R' && opp_at === 'G') || (my_at === 'G' && opp_at === 'B') || (my_at === 'B' && opp_at === 'R')){
			if(my_st === '1' && opp_st === '3'){
				my_life -= 0.5;
				opp_life -= 2;
				my_d = 0.5;
				opp_d = 2;
			}else if((my_st === '1' && opp_st === '2') || (my_st === '2' && opp_st === '3')){
				my_life -= 0.5;
				opp_life -= 1.5;
				my_d = 0.5;
				opp_d = 1.5;
			}else if(my_st === opp_st){
				my_life -= 0.5;
				opp_life -= 1;
				my_d = 0.5;
				opp_d = 1;
			}else{
				my_life -= 0.5;
				opp_life -= 0.5;
				my_d = 0.5;
				opp_d = 0.5;
			}
		//自分が不利属性で相手が有利属性
		}else if((my_at === 'R' && opp_at === 'B') || (my_at === 'G' && opp_at === 'R') || (my_at === 'B' && opp_at === 'G')){
			if(my_st === '3' && opp_st === '1'){
				my_life -= 2;
				opp_life -= 0.5;
				my_d = 2;
				opp_d = 0.5;
			}else if((my_st === '3' && opp_st === '2') || (my_st === '2' && opp_st === '1')){
				my_life -= 1.5;
				opp_life -= 0.5;
				my_d = 1.5;
				opp_d = 0.5;
			}else if(my_st === opp_st){
				my_life -= 1;
				opp_life -= 0.5;
				my_d = 1;
				opp_d = 0.5;
			}else{
				my_life -= 0.5;
				opp_life -= 0.5;
				my_d = 0.5;
				opp_d = 0.5;
			}
		}else{
			my_life -= 0.5;
			opp_life -= 0.5;
			my_d = 0.5;
			opp_d = 0.5;
		}
	}

		if(my_life < 0){
			my_life = 0;
		}else if(opp_life < 0){
			opp_life = 0;
		}


		x = String(my_life);
		y = String(opp_life);
}

function command_c(){
	com_c += 1;

	if(com_c == 1){
		if(count_turn % 2 === 1){
			if(count == 1){
				commandtext.innerHTML = my_name + "のターン！";
			}else if(count == 2){
				commandtext.innerHTML = opp_name + "のターン！";
			}
		}else if(count_turn % 2 === 0){
			if(count == 1){
				commandtext.innerHTML = opp_name + "のターン！";
			}else if(count == 2){
				commandtext.innerHTML = my_name + "のターン！";
			}
		}
	}else if(com_c == 2){
		document.getElementById("shoot_bgm").play();
		//先手
		if(count_turn % 2 === 1){
			if(count == 1){
				commandtext.innerHTML = my_name + "は" + my_at_text + "色魔導書を使用";
				if(char === 'B'){
					document.getElementById("player1_icon").src=bpc_p1[my_item];
				}else if(char === 'D'){
					document.getElementById("player1_icon").src=bpc_p1D[my_item];
				}
			}else if(count == 2){
				commandtext.innerHTML = opp_name + "は" + opp_at_text + "色魔導書を使用";
				if(opp_char === 'B'){
					document.getElementById("player1_icon").src=bpc_p1[opp_item];
				}else if(opp_char === 'D'){
					document.getElementById("player1_icon").src=bpc_p1D[opp_item];
				}
			}
		}else if(count_turn % 2 === 0){
			if(count == 1){
				commandtext.innerHTML = opp_name + "は" + opp_at_text + "色魔導書を使用";
				if(opp_char === 'B'){
					document.getElementById("player2_icon").src=bpc_p2[opp_item];
				}else if(opp_char === 'D'){
					document.getElementById("player2_icon").src=bpc_p2D[opp_item];
				}
			}else if(count == 2){
				commandtext.innerHTML = my_name + "は" + my_at_text + "色魔導書を使用";
				if(char === 'B'){
					document.getElementById("player2_icon").src=bpc_p2[my_item];
				}else if(char === 'D'){
					document.getElementById("player2_icon").src=bpc_p2D[my_item];
				}
			}
		}
	}else if(com_c == 3){
		document.getElementById("damage_bgm").play();
		if(count_turn % 2 === 1){
			if(count == 1){
				commandtext.innerHTML = opp_name + "に♡" + opp_d + "ダメージ!";
				player2HP_Area.src = player2HP_Array[y];
				if(char === 'B'){
					document.getElementById("player1_icon").src=st_char_pics[0];
				}else if(char === 'D'){
					document.getElementById("player1_icon").src=st_char_pics[2];
				}
			}else if(count == 2){
				commandtext.innerHTML = my_name + "に♡" + my_d + "ダメージ!";
				player2HP_Area.src = player2HP_Array[x];
				if(opp_char === 'B'){
					document.getElementById("player1_icon").src=st_char_pics[0];
				}else if(opp_char === 'D'){
					document.getElementById("player1_icon").src=st_char_pics[2];
				}
			}
		}else if(count_turn % 2 === 0){
			if(count == 1){
				commandtext.innerHTML = my_name + "に♡" + my_d + "ダメージ!";
				player1HP_Area.src = player1HP_Array[x];
				if(opp_char === 'B'){
					document.getElementById("player2_icon").src=st_char_pics[1];
				}else if(opp_char === 'D'){
					document.getElementById("player2_icon").src=st_char_pics[3];
				}
			}else if(count == 2){
				commandtext.innerHTML = opp_name + "に♡" + opp_d + "ダメージ!";
				player1HP_Area.src = player1HP_Array[y];
				if(char === 'B'){
					document.getElementById("player2_icon").src=st_char_pics[1];
				}else if(char === 'D'){
					document.getElementById("player2_icon").src=st_char_pics[3];
				}
			}
		}
	}else if(com_c == 4){
		//後手ターン
		if(count_turn % 2 === 1){
			if(count == 1){
				if(y <= 0){
					document.getElementById("win_bgm").play();
					result_Area.src = "../images/win.png";
					commandtext.innerHTML = "勝ち！！！";
					if(count === 1){
						// アバターの非表示化
						let ele = document.getElementById('player2_icon');
						ele.style.visibility = 'hidden';
					}else if(count === 2){
						// アバターの非表示化
						let ele = document.getElementById('player1_icon');
						ele.style.visibility = 'hidden';
					}
				}else{
					commandtext.innerHTML = opp_name + "のターン！";
				}
			}else if(count == 2){
				if(x <= 0){
					document.getElementById("lose_bgm").play();
					result_Area.src = "../images/lose.png";
					commandtext.innerHTML = "負け…";
					if(count === 1){
						// アバターの非表示化
						let ele = document.getElementById('player1_icon');
						ele.style.visibility = 'hidden';
					}else if(count === 2){
						// アバターの非表示化
						let ele = document.getElementById('player2_icon');
						ele.style.visibility = 'hidden';
					}
				}else{
					commandtext.innerHTML = my_name + "のターン！";
				}
			}
		}else if(count_turn % 2 === 0){
				if(count == 1){
					if(x <= 0){
						document.getElementById("lose_bgm").play();
						result_Area.src = "../images/lose.png";
						commandtext.innerHTML = "負け…";
						if(count === 1){
							// アバターの非表示化
							let ele = document.getElementById('player1_icon');
							ele.style.visibility = 'hidden';
						}else if(count === 2){
							// アバターの非表示化
							let ele = document.getElementById('player2_icon');
							ele.style.visibility = 'hidden';
						}
					}else{
						commandtext.innerHTML = my_name + "のターン！";
					}
				}else if(count == 2){
					if(y <= 0){
						document.getElementById("win_bgm").play();
						result_Area.src = "../images/win.png";
						commandtext.innerHTML = "勝ち！！！";
						if(count === 1){
							// アバターの非表示化
							let ele = document.getElementById('player2_icon');
							ele.style.visibility = 'hidden';
						}else if(count === 2){
							// アバターの非表示化
							let ele = document.getElementById('player1_icon');
							ele.style.visibility = 'hidden';
						}
					}else{
						commandtext.innerHTML = opp_name + "のターン！";
					}
				}
			}
	}else if(com_c == 5){
		//後手
		document.getElementById("shoot_bgm").play();
		if(count_turn % 2 === 1){
			if(count == 1){
				commandtext.innerHTML = opp_name + "は" + opp_at_text + "色魔導書を使用";
				if(opp_char === 'B'){
					document.getElementById("player2_icon").src=bpc_p2[opp_item];
				}else if(opp_char === 'D'){
					document.getElementById("player2_icon").src=bpc_p2D[opp_item];
				}
			}else if(count == 2){
				commandtext.innerHTML = my_name + "は" + my_at_text + "色魔導書を使用";
				if(char === 'B'){
					document.getElementById("player2_icon").src=bpc_p2[my_item];
				}else if(char === 'D'){
					document.getElementById("player2_icon").src=bpc_p2D[my_item];
				}
			}
		}else if(count_turn % 2 === 0){
			if(count == 1){
				commandtext.innerHTML = my_name + "は" + my_at_text + "色魔導書を使用";
				if(char === 'B'){
					document.getElementById("player1_icon").src=bpc_p1[my_item];
				}else if(char === 'D'){
					document.getElementById("player1_icon").src=bpc_p1D[my_item];
				}
			}else if(count == 2){
				commandtext.innerHTML = opp_name + "は" + opp_at_text + "色魔導書を使用";
				if(opp_char === 'B'){
					document.getElementById("player1_icon").src=bpc_p1[opp_item];
				}else if(opp_char === 'D'){
					document.getElementById("player1_icon").src=bpc_p1D[opp_item];
				}
			}
		}
	}else if(com_c == 6){
		document.getElementById("damage_bgm").play();
		if(count_turn % 2 === 1){
			if(count == 1){
				commandtext.innerHTML = my_name + "に♡" + my_d + "ダメージ!";
				player1HP_Area.src = player1HP_Array[x];
				if(opp_char === 'B'){
					document.getElementById("player2_icon").src=st_char_pics[1];
				}else if(opp_char === 'D'){
					document.getElementById("player2_icon").src=st_char_pics[3];
				}
			}else if(count == 2){
				commandtext.innerHTML = opp_name + "に♡" + opp_d + "ダメージ!";
				player1HP_Area.src = player1HP_Array[y];
				if(char === 'B'){
					document.getElementById("player2_icon").src=st_char_pics[1];
				}else if(char === 'D'){
					document.getElementById("player2_icon").src=st_char_pics[3];
				}
			}
		}else if(count_turn % 2 === 0){
			if(count == 1){
				commandtext.innerHTML = opp_name + "に♡" + opp_d + "ダメージ!";
				player2HP_Area.src = player2HP_Array[y];
				if(char === 'B'){
					document.getElementById("player1_icon").src=st_char_pics[0];
				}else if(char === 'D'){
					document.getElementById("player1_icon").src=st_char_pics[2];
				}
			}else if(count == 2){
				commandtext.innerHTML = my_name + "に♡" + my_d + "ダメージ!";
				player2HP_Area.src = player2HP_Array[x];
				if(opp_char === 'B'){
					document.getElementById("player1_icon").src=st_char_pics[0];
				}else if(opp_char === 'D'){
					document.getElementById("player1_icon").src=st_char_pics[2];
				}
			}
		}
	}else if(com_c == 7){
		if(count_turn % 2 === 1){
			if(count == 1){
				if(x <= 0){
					document.getElementById("lose_bgm").play();
					result_Area.src = "../images/lose.png";
					commandtext.innerHTML = "負け…";
					if(count === 1){
						// アバターの非表示化
						let ele = document.getElementById('player1_icon');
						ele.style.visibility = 'hidden';
					}else if(count === 2){
						// アバターの非表示化
						let ele = document.getElementById('player2_icon');
						ele.style.visibility = 'hidden';
					}
				}else{
					reset();
				}
			}else if(count == 2){
				if(y <= 0){
					document.getElementById("win_bgm").play();
					result_Area.src = "../images/win.png";
					commandtext.innerHTML = "勝ち！！！";
					if(count === 1){
						// アバターの非表示化
						let ele = document.getElementById('player2_icon');
						ele.style.visibility = 'hidden';
					}else if(count === 2){
						// アバターの非表示化
						let ele = document.getElementById('player1_icon');
						ele.style.visibility = 'hidden';
					}
				}else{
					reset();
				}
			}
		}else if(count_turn % 2 === 0){
			if(count == 1){
				if(y <= 0){
					document.getElementById("win_bgm").play();
					result_Area.src = "../images/win.png";
					commandtext.innerHTML = "勝ち！！！";
					if(count === 1){
						// アバターの非表示化
						let ele = document.getElementById('player2_icon');
						ele.style.visibility = 'hidden';
					}else if(count === 2){
						// アバターの非表示化
						let ele = document.getElementById('player1_icon');
						ele.style.visibility = 'hidden';
					}
				}else{
					reset();
				}
			}else if(count == 2){
				if(x <= 0){
					document.getElementById("lose_bgm").play();
					result_Area.src = "../images/lose.png";
					commandtext.innerHTML = "負け…";
					if(count === 1){
						// アバターの非表示化
						let ele = document.getElementById('player1_icon');
						ele.style.visibility = 'hidden';
					}else if(count === 2){
						// アバターの非表示化
						let ele = document.getElementById('player2_icon');
						ele.style.visibility = 'hidden';
					}
				}else{
					reset();
				}
			}
		}
	}
}

function reset(){

	n_text.removeAttribute("onclick");

	if(char === "B"){
		for(var i = 0; i < my_icon.length; ++i) my_icon[i].classList.toggle(my_item);
		for(var i = 0; i < opp_icon.length; ++i){
			opp_icon[i].classList.toggle(opp_item);
		}
	}else if(char === "D"){
		for(var i = 0; i < my_icon.length; ++i) my_icon[i].classList.toggle('D' + my_item);
		for(var j= 0; j < opp_icon.length; ++j){
			opp_icon[j].classList.toggle('D' + opp_item);
		}
	}

	commandtext.innerHTML = "次のターンへ！何を使う？";
	//下方向矢印の削除
	if(use_where === 'imgNo1'){
		var lower1_Area = document.getElementById('lower-1');
		lower1_Area.classList.remove('onclick');
	}else if(use_where === 'imgNo2'){
		var lower2_Area = document.getElementById('lower-2');
		lower2_Area.classList.remove('onclick');
	}else if(use_where === 'imgNo3'){
		var lower3_Area = document.getElementById('lower-3');
		lower3_Area.classList.remove('onclick');
	}else if(use_where === 'imgNo4'){
		var lower4_Area = document.getElementById('lower-4');
		lower4_Area.classList.remove('onclick');
	}else if(use_where === 'imgNo5'){
		var lower5_Area = document.getElementById('lower-5');
		lower5_Area.classList.remove('onclick');
	}

	//ターン数の更新
	count_turn += 1;
	turn_number.innerHTML = count_turn;
	//魔導書のシャッフル配置
	books_icon_random();
	com_c = 0;

}

//魔導書をランダムに配置する関数
function books_icon_random(){
	const bimg_Area1 = document.getElementById('bimg_Area1');
	const bimg_Area2 = document.getElementById('bimg_Area2');
	const bimg_Area3 = document.getElementById('bimg_Area3');
	const bimg_Area4 = document.getElementById('bimg_Area4');
	const bimg_Area5 = document.getElementById('bimg_Area5');

	if(char === 'B'){
		imgNo1 = Math.floor( Math.random() * books_img.length);
		bimg_Area1.src = books_img[imgNo1];
		imgNo2 = Math.floor( Math.random() * books_img.length);
		bimg_Area2.src = books_img[imgNo2];
		imgNo3 = Math.floor( Math.random() * books_img.length);
		bimg_Area3.src = books_img[imgNo3];
		imgNo4 = Math.floor( Math.random() * books_img.length);
		bimg_Area4.src = books_img[imgNo4];
		imgNo5 = Math.floor( Math.random() * books_img.length);
		bimg_Area5.src = books_img[imgNo5];
	}else if(char === 'D'){
		imgNo1 = Math.floor( Math.random() * books_imgD.length);
		bimg_Area1.src = books_imgD[imgNo1];
		imgNo2 = Math.floor( Math.random() * books_imgD.length);
		bimg_Area2.src = books_imgD[imgNo2];
		imgNo3 = Math.floor( Math.random() * books_imgD.length);
		bimg_Area3.src = books_imgD[imgNo3];
		imgNo4 = Math.floor( Math.random() * books_imgD.length);
		bimg_Area4.src = books_imgD[imgNo4];
		imgNo5 = Math.floor( Math.random() * books_imgD.length);
		bimg_Area5.src = books_imgD[imgNo5];
	}
}

function trg_attack1(){
	attack_list.push(0);
	if(imgNo1 == 0){
		attack_list[2] = 'R1';
		my_item = 'R1';
	}else if(imgNo1 == 1){
		attack_list[2] = 'R2';
		my_item = 'R2';
	}else if(imgNo1 == 2){
		attack_list[2] = 'R3';
		my_item = 'R3';
	}else if(imgNo1 == 3){
		attack_list[2] = 'G1';
		my_item = 'G1';
	}else if(imgNo1 == 4){
		attack_list[2] = 'G2';
		my_item = 'G2';
	}else if(imgNo1 == 5){
		attack_list[2] = 'G3';
		my_item = 'G3';
	}else if(imgNo1 == 6){
		attack_list[2] = 'B1';
		my_item = 'B1';
	}else if(imgNo1 == 7){
		attack_list[2] = 'B2';
		my_item = 'B2';
	}else if(imgNo1 == 8){
		attack_list[2] = 'B3';
		my_item = 'B3';
	}
	use_where = 'imgNo1';
}

function trg_attack2(){
	if(imgNo2 == 0){
		attack_list[2] = 'R1';
		my_item = 'R1';
	}else if(imgNo2 == 1){
		attack_list[2] = 'R2';
		my_item = 'R2';
	}else if(imgNo2 == 2){
		attack_list[2] = 'R3';
		my_item = 'R3';
	}else if(imgNo2 == 3){
		attack_list[2] = 'G1';
		my_item = 'G1';
	}else if(imgNo2 == 4){
		attack_list[2] = 'G2';
		my_item = 'G2';
	}else if(imgNo2 == 5){
		attack_list[2] = 'G3';
		my_item = 'G3';
	}else if(imgNo2 == 6){
		attack_list[2] = 'B1';
		my_item = 'B1';
	}else if(imgNo2 == 7){
		attack_list[2] = 'B2';
		my_item = 'B2';
	}else if(imgNo2 == 8){
		attack_list[2] = 'B3';
		my_item = 'B3';
	}
	use_where = 'imgNo2';
}

function trg_attack3(){
	if(imgNo3 == 0){
		attack_list[2] = 'R1';
		my_item = 'R1';
	}else if(imgNo3 == 1){
		attack_list[2] = 'R2';
		my_item = 'R2';
	}else if(imgNo3 == 2){
		attack_list[2] = 'R3';
		my_item = 'R3';
	}else if(imgNo3 == 3){
		attack_list[2] = 'G1';
		my_item = 'G1';
	}else if(imgNo3 == 4){
		attack_list[2] = 'G2';
		my_item = 'G2';
	}else if(imgNo3 == 5){
		attack_list[2] = 'G3';
		my_item = 'G3';
	}else if(imgNo3 == 6){
		attack_list[2] = 'B1';
		my_item = 'B1';
	}else if(imgNo3 == 7){
		attack_list[2] = 'B2';
		my_item = 'B2';
	}else if(imgNo3 == 8){
		attack_list[2] = 'B3';
		my_item = 'B3';
	}
	use_where = 'imgNo3';
}

function trg_attack4(){
	if(imgNo4 == 0){
		attack_list[2] = 'R1';
		my_item = 'R1';
	}else if(imgNo4 == 1){
		attack_list[2] = 'R2';
		my_item = 'R2';
	}else if(imgNo4 == 2){
		attack_list[2] = 'R3';
		my_item = 'R3';
	}else if(imgNo4 == 3){
		attack_list[2] = 'G1';
		my_item = 'G1';
	}else if(imgNo4 == 4){
		attack_list[2] = 'G2';
		my_item = 'G2';
	}else if(imgNo4 == 5){
		attack_list[2] = 'G3';
		my_item = 'G3';
	}else if(imgNo4 == 6){
		attack_list[2] = 'B1';
		my_item = 'B1';
	}else if(imgNo4 == 7){
		attack_list[2] = 'B2';
		my_item = 'B2';
	}else if(imgNo4 == 8){
		attack_list[2] = 'B3';
		my_item = 'B3';
	}
	use_where = 'imgNo4';
}

function trg_attack5(){
	if(imgNo5 == 0){
		attack_list[2] = 'R1';
		my_item = 'R1';
	}else if(imgNo5 == 1){
		attack_list[2] = 'R2';
		my_item = 'R2';
	}else if(imgNo5 == 2){
		attack_list[2] = 'R3';
		my_item = 'R3';
	}else if(imgNo5 == 3){
		attack_list[2] = 'G1';
		my_item = 'G1';
	}else if(imgNo5 == 4){
		attack_list[2] = 'G2';
		my_item = 'G2';
	}else if(imgNo5 == 5){
		attack_list[2] = 'G3';
		my_item = 'G3';
	}else if(imgNo5 == 6){
		attack_list[2] = 'B1';
		my_item = 'B1';
	}else if(imgNo5 == 7){
		attack_list[2] = 'B2';
		my_item = 'B2';
	}else if(imgNo5 == 8){
		attack_list[2] = 'B3';
		my_item = 'B3';
	}
	use_where = 'imgNo5';
}

// --- 以上追加変数 ---