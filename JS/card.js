document.addEventListener("DOMContentLoaded", () => {
	const container = document.querySelector(".card-grid");
	const cardsArray = Array.from(document.querySelectorAll(".card"));

	let flippedCards = [];
	let matchedCount = 0;
	const TOTAL_PAIRS = 7;

	// 타이머 관련 변수
	let timeLeft = 60; // 제한 시간 60초
	let timerInterval = null;
	let isGameStarted = false;

	// 타이머 UI 생성 (HTML에 미리 만들어둬도 되고, JS로 삽입해도 됩니다)
	const timerDisplay = document.createElement("div");
	timerDisplay.id = "timer";
	timerDisplay.style =
		"font-size: 20px; font-weight: bold; color: red; margin-bottom: 10px;";
	timerDisplay.innerText = `남은 시간: ${timeLeft}초`;
	document.querySelector(".game-header").appendChild(timerDisplay);

	function startTimer() {
		if (isGameStarted) return;
		isGameStarted = true;

		timerInterval = setInterval(() => {
			timeLeft--;
			timerDisplay.innerText = `남은 시간: ${timeLeft}초`;

			if (timeLeft <= 0) {
				clearInterval(timerInterval);
				alert("⏰ 시간 초과! 다시 도전해 보세요.");
				resetGame();
			}
		}, 1000);
	}

	function resetGame() {
		clearInterval(timerInterval);
		timeLeft = 60;
		isGameStarted = false;
		timerDisplay.innerText = `남은 시간: ${timeLeft}초`;

		matchedCount = 0;
		flippedCards = [];

		cardsArray.forEach((card) => {
			card.classList.remove("matched", "joker-found");
			const input = card.querySelector("input");
			input.checked = false;
			input.disabled = false;
		});

		for (let i = cardsArray.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[cardsArray[i], cardsArray[j]] = [cardsArray[j], cardsArray[i]];
		}
		cardsArray.forEach((card) => container.appendChild(card));
	}

	function initGame() {
		resetGame();
		cardsArray.forEach((card) => {
			const checkbox = card.querySelector('input[type="checkbox"]');
			checkbox.addEventListener("change", () => {
				// 첫 카드를 뒤집는 순간 타이머 시작
				if (!isGameStarted) startTimer();

				if (
					card.classList.contains("matched") ||
					card.classList.contains("joker-found")
				)
					return;
				if (checkbox.checked) {
					const imgClass = card.querySelector(".card-image-slot").classList[1];
					if (imgClass === "img00") {
						handleJoker(card);
						return;
					}
					flippedCards.push(card);
					if (flippedCards.length === 2) checkMatch();
				}
			});
		});
	}

	function handleJoker(card) {
		card.classList.add("joker-found");
		card.querySelector("input").disabled = true;
		setTimeout(() => alert("🃏 조커를 찾으셨습니다!"), 300);
	}

	function checkMatch() {
		const [card1, card2] = flippedCards;
		const img1 = card1.querySelector(".card-image-slot").classList[1];
		const img2 = card2.querySelector(".card-image-slot").classList[1];

		if (img1 === img2) {
			card1.classList.add("matched");
			card2.classList.add("matched");
			card1.querySelector("input").disabled = true;
			card2.querySelector("input").disabled = true;
			matchedCount++;
			flippedCards = [];
			if (matchedCount === TOTAL_PAIRS) finishGame();
		} else {
			document.body.style.pointerEvents = "none";
			setTimeout(() => {
				card1.querySelector("input").checked = false;
				card2.querySelector("input").checked = false;
				flippedCards = [];
				document.body.style.pointerEvents = "auto";
			}, 500);
		}
	}

	function finishGame() {
		clearInterval(timerInterval); // 타이머 멈춤
		const timeTaken = 60 - timeLeft; // 소요 시간 계산

		const jokerCard = cardsArray.find((card) =>
			card.querySelector(".card-image-slot").classList.contains("img00"),
		);
		if (!jokerCard.classList.contains("joker-found")) {
			jokerCard.querySelector("input").checked = true;
			jokerCard.classList.add("joker-found");
		}

		setTimeout(() => {
			alert(
				`🎉 성공! 모든 짝을 찾았습니다.\n⏱ 소요 시간: ${timeTaken}초\n확인을 누르면 재시작합니다.`,
			);
			resetGame();
		}, 500);
	}

	initGame();
});
