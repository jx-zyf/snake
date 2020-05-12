var timer = null;		// 定时器
var SCORE = 5;		// 每吃一个食物得五分	
// 游戏参数配置
var config = {
	map: { width: 1200, height: 600 },
	square: { width: 50, height: 50 },
	getRows: function () {
		return this.map.height / this.square.height;
	},
	getCols: function () {
		return this.map.width / this.square.width;
	},
	getNum: function () {
		return this.getCols() * this.getRows();
	}
};
// 声明游戏辅助对象
// foodIndex:当前食物的编号
// dir:移动方向
var help = {
	squares: [],
	snake: [],
	foods: [],
	foodIndex: -1,
	dir: 3
};
// 辅助函数
function removeEleFromArr(arr, ele) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] == ele) {
			arr.splice(i, 1);
			break;
		}
	}
}
// 获取新方向
function getNewHeadIndex(h_index) {
	var h_new_index = -1;		// 新蛇头位置编号
	switch (help.dir) {
		case 1:// 向左
			h_new_index = h_index % config.getCols() == 0 ? h_index + config.getCols() - 1 : h_index - 1;
			break;
		case 2:// 向上
			h_new_index = h_index < config.getCols() ? (config.getRows() - 1) * config.getCols() + h_index : h_index - config.getCols();
			break;
		case 3:// 向右
			h_new_index = h_index + 1;
			h_new_index = h_new_index % config.getCols() == 0 ? h_new_index - config.getCols() : h_new_index;
			break;
		case 4:// 向下
			h_new_index = h_index + config.getCols();
			h_new_index = h_new_index >= config.getNum() ? h_new_index - config.getNum() : h_new_index;
			break;
	}
	return h_new_index;
}
// 初始化地图
function initMap() {
	id('map').style.width = config.map.width + 'px';
	id('map').style.height = config.map.height + 'px';
	var num = config.getNum(), span;
	for (var i = 0; i < num; i++) {
		span = document.createElement('span');
		span.style.width = config.square.width + 'px';
		span.style.height = config.square.height + 'px';
		id('map').appendChild(span);
		// 初始化全局辅助变量
		help.squares.push(span);		// 所有span对象
		if (i <= 4) {
			help.snake.push(i);			// 蛇的身体
			span.className = 'snake';
		} else {
			help.foods.push(i);			// 食物
		}
	}
}
// 在地图中随机刷新一个食物
function showFood() {
	var index = Math.floor(Math.random() * help.foods.length);
	help.foodIndex = help.foods[index];
	help.squares[help.foods[index]].className = 'food';
}
function snakeMove() {
	// 处理蛇头
	var h_index = help.snake[help.snake.length - 1];
	var h_new_index = getNewHeadIndex(h_index);
	help.squares[h_new_index].className = 'snake';
	removeEleFromArr(help.foods, h_new_index);
	help.snake.push(h_new_index);
	// 处理蛇尾
	if (h_new_index == help.foodIndex) {
		showFood();
	} else {
		help.squares[help.snake[0]].className = '';
		help.foods.push(help.snake.shift());
	}
	id('score').innerText = (help.snake.length - 5) * SCORE;

	// 处理游戏结束，撞到自身
	if (new Set(help.snake).size !== help.snake.length) {
		clearInterval(timer);
		alert(`游戏结束，您的分数为“${id('score').innerText}”分，继续游戏吗？`);
		window.location.reload();
	}
}

// 暂停、继续
function onPause(e) {
	clearInterval(timer);
	this.style.display = 'none';
	id('continue').style.display = 'block';
}
function onContinue(e) {
	timer = setInterval(snakeMove, 200);
	this.style.display = 'none';
	id('pause').style.display = 'block';
}

window.onload = function () {
	initMap();
	showFood();
	timer = setInterval(snakeMove, 200);
	document.onkeyup = function (e) {
		if (e.keyCode >= 37 && e.keyCode <= 40) {
			help.dir = e.keyCode - 36;
		}
	}
	id('pause').onclick = onPause;
	id('continue').onclick = onContinue;
}