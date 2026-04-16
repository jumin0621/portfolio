document.addEventListener("DOMContentLoaded", () => {
	const container = document.querySelector(".card-grid");
	const cardsArray = Array.from(document.querySelectorAll(".card"));

	let flippedCards = [];
	let matchedCount = 0;
	const TOTAL_PAIRS = 7;

	// --- 1. 셔플 및 초기화 로직 ---
	function resetGame() {
		// 1. 모든 상태 초기화
		matchedCount = 0;
		flippedCards = [];

		cardsArray.forEach((card) => {
			card.classList.remove("matched", "joker-found");
			const input = card.querySelector("input");
			input.checked = false;
			input.disabled = false;
		});

		// 2. 피셔-예이츠 셔플
		for (let i = cardsArray.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[cardsArray[i], cardsArray[j]] = [cardsArray[j], cardsArray[i]];
		}

		// 3. 화면 재배치
		cardsArray.forEach((card) => container.appendChild(card));
	}

	// --- 2. 카드 클릭 이벤트 ---
	function initGame() {
		resetGame(); // 시작할 때 리셋(셔플) 호출

		cardsArray.forEach((card) => {
			const checkbox = card.querySelector('input[type="checkbox"]');
			checkbox.addEventListener("change", () => {
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
					if (flippedCards.length === 2) {
						checkMatch();
					}
				}
			});
		});
	}

	// --- 3. 조커 처리 ---
	function handleJoker(card) {
		card.classList.add("joker-found");
		card.querySelector("input").disabled = true;
		setTimeout(() => alert("🃏 조커를 찾으셨습니다!"), 300);
	}

	// --- 4. 매칭 체크 ---
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

			// [게임 종료 체크]
			if (matchedCount === TOTAL_PAIRS) {
				finishGame();
			}
		} else {
			// 불일치할 때 (잠시 후 다시 뒤집기)
			document.body.style.pointerEvents = "none";

			setTimeout(() => {
				card1.querySelector("input").checked = false;
				card2.querySelector("input").checked = false;
				flippedCards = [];
				document.body.style.pointerEvents = "auto";
			}, 500);
		}
	}

	// --- 5. 게임 종료 처리 ---
	function finishGame() {
		// 만약 조커가 아직 안 뒤집혔다면? 강제로 뒤집기
		const jokerCard = cardsArray.find((card) =>
			card.querySelector(".card-image-slot").classList.contains("img00"),
		);

		if (!jokerCard.classList.contains("joker-found")) {
			jokerCard.querySelector("input").checked = true;
			jokerCard.classList.add("joker-found");
		}

		setTimeout(() => {
			alert("🎉 모든 짝을 찾으셨습니다! 확인을 누르면 다시 시작합니다.");
			resetGame(); // 확인 버튼 누르면 초기화 및 재셔플
		}, 500);
	}

	initGame();
});
