const canvas = document.getElementById("snakeGame");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const restartBtn = document.getElementById("restart-btn");

const box = 22;
const keywords = [
	"const",
	"let",
	"var",
	"func",
	"if",
	"else",
	"for",
	"while",
	"async",
	"await",
	"try",
	"catch",
	"push",
	"pop",
	"map",
	"class",
	"this",
];

let snake, score, d, food, game, isGameOver;

function init() {
	snake = [{ x: 10 * box, y: 10 * box, text: "<|>" }];
	score = 0;
	d = "RIGHT";
	isGameOver = false;
	scoreElement.innerText = score;
	restartBtn.style.display = "none";
	spawnFood();
	if (game) clearInterval(game);
	game = setInterval(draw, 130); // 모바일을 위해 속도를 아주 미세하게 늦춤
}

function spawnFood() {
	food = {
		x: Math.floor(Math.random() * (canvas.width / box - 2) + 1) * box,
		y: Math.floor(Math.random() * (canvas.height / box - 2) + 1) * box,
		text: keywords[Math.floor(Math.random() * keywords.length)],
	};
}

// 방향 전환 로직 (중복 방지를 위해 함수화)
function changeDirection(newDir) {
	if (newDir == "LEFT" && d != "RIGHT") d = "LEFT";
	if (newDir == "UP" && d != "DOWN") d = "UP";
	if (newDir == "RIGHT" && d != "LEFT") d = "RIGHT";
	if (newDir == "DOWN" && d != "UP") d = "DOWN";
}

// 키보드 이벤트
document.addEventListener("keydown", (e) => {
	if (isGameOver) return;
	if (e.keyCode == 37) changeDirection("LEFT");
	if (e.keyCode == 38) changeDirection("UP");
	if (e.keyCode == 39) changeDirection("RIGHT");
	if (e.keyCode == 40) changeDirection("DOWN");

	window.addEventListener(
		"keydown",
		(e) => {
			// 방지하고 싶은 키들의 키코드를 배열에 담습니다.
			const preventKeys = [
				"ArrowUp",
				"ArrowDown",
				"ArrowLeft",
				"ArrowRight",
				" ",
			]; // 상, 하, 좌, 우, 스페이스바

			if (preventKeys.includes(e.key)) {
				// 해당 키가 눌렸을 때 브라우저의 기본 스크롤 동작을 막습니다.
				e.preventDefault();
			}
		},
		{ passive: false },
	);
});

// 버튼 이벤트 (터치 및 클릭)
document.getElementById("up").addEventListener("touchstart", (e) => {
	e.preventDefault();
	changeDirection("UP");
});
document.getElementById("down").addEventListener("touchstart", (e) => {
	e.preventDefault();
	changeDirection("DOWN");
});
document.getElementById("left").addEventListener("touchstart", (e) => {
	e.preventDefault();
	changeDirection("LEFT");
});
document.getElementById("right").addEventListener("touchstart", (e) => {
	e.preventDefault();
	changeDirection("RIGHT");
});

// PC 클릭 대응
document
	.getElementById("up")
	.addEventListener("click", () => changeDirection("UP"));
document
	.getElementById("down")
	.addEventListener("click", () => changeDirection("DOWN"));
document
	.getElementById("left")
	.addEventListener("click", () => changeDirection("LEFT"));
document
	.getElementById("right")
	.addEventListener("click", () => changeDirection("RIGHT"));

restartBtn.addEventListener("click", init);

function draw() {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	snake.forEach((part, i) => {
		const isHead = i === 0;
		ctx.fillStyle = isHead ? "#06b6d4" : "#1e293b";
		ctx.strokeStyle = "#0f172a";
		ctx.fillRect(part.x, part.y, box, box);
		ctx.strokeRect(part.x, part.y, box, box);

		ctx.fillStyle = isHead ? "#fff" : "#94a3b8";
		ctx.font = isHead ? "bold 10px monospace" : "9px monospace";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(part.text, part.x + box / 2, part.y + box / 2);
	});

	ctx.fillStyle = "#fbbf24";
	ctx.font = "bold 12px monospace";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("<" + food.text + ">", food.x + box / 2, food.y + box / 2);

	let nx = snake[0].x;
	let ny = snake[0].y;
	if (d == "LEFT") nx -= box;
	if (d == "UP") ny -= box;
	if (d == "RIGHT") nx += box;
	if (d == "DOWN") ny += box;

	// 1. 벽 충돌 체크
	const hitWall = nx < 0 || nx >= canvas.width || ny < 0 || ny >= canvas.height;

	// 2. 자기 몸 충돌 체크 (머리 위치 nx, ny와 몸통 좌표 비교)
	const hitSelf = snake.some((part, i) => {
		// 중요: 머리가 다음으로 갈 위치(nx, ny)가
		// 현재 몸통 마디들(part.x, part.y) 중 하나와 일치하는지 확인
		// 단, 이동 시 꼬리가 빠질 예정이므로 마지막 마디는 제외하고 검사하는 것이 안전합니다.
		if (i === 0) return false;
		return part.x === nx && part.y === ny;
	});

	if (hitWall || hitSelf) {
		gameOver();
		return;
	}

	if (
		nx < 0 ||
		nx >= canvas.width ||
		ny < 0 ||
		ny >= canvas.height ||
		snake.some((p, i) => i !== 0 && p.x === nx && p.y === ny)
	) {
		gameOver();
		return;
	}

	if (nx == food.x && ny == food.y) {
		score++;
		scoreElement.innerText = score;
		snake[0].text = food.text;
		snake.unshift({ x: nx, y: ny, text: "<|>" });
		spawnFood();
	} else {
		for (let i = snake.length - 1; i > 0; i--) {
			snake[i].x = snake[i - 1].x;
			snake[i].y = snake[i - 1].y;
		}
		snake[0].x = nx;
		snake[0].y = ny;
	}
}

function gameOver() {
	isGameOver = true;
	clearInterval(game);
	ctx.fillStyle = "rgba(0,0,0,0.8)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#ef4444";
	ctx.font = "bold 30px monospace";
	ctx.textAlign = "center";
	ctx.fillText("COMPILE ERROR", canvas.width / 2, canvas.height / 2);
	restartBtn.style.display = "block";
}

init();
