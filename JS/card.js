document.addEventListener("DOMContentLoaded", () => {
	const container = document.querySelector(".card-grid");
	const cardsArray = Array.from(document.querySelectorAll(".card"));

	let flippedCards = []; // 현재 뒤집힌 카드 배열
	let matchedCount = 0; // 맞춘 쌍의 개수
	const TOTAL_PAIRS = 7; // 조커 제외 이미지 쌍의 수 (img01~07)

	// --- 1. 카드 셔플 (Fisher-Yates 알고리즘) ---
	function shuffle() {
		for (let i = cardsArray.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[cardsArray[i], cardsArray[j]] = [cardsArray[j], cardsArray[i]];
		}
		// 섞인 카드를 화면(DOM)에 다시 배치
		cardsArray.forEach((card) => container.appendChild(card));
	}

	// --- 2. 카드 클릭 이벤트 설정 ---
	function initGame() {
		shuffle(); // 게임 시작 시 셔플 실행

		cardsArray.forEach((card) => {
			const checkbox = card.querySelector('input[type="checkbox"]');

			checkbox.addEventListener("change", () => {
				// 이미 맞췄거나 조커인 카드는 클릭 무시
				if (
					card.classList.contains("matched") ||
					card.classList.contains("joker-found")
				)
					return;

				if (checkbox.checked) {
					const imgClass = card.querySelector(".card-image-slot").classList[1];

					// [조커 체크]
					if (imgClass === "img00") {
						handleJoker(card);
						return;
					}

					flippedCards.push(card);

					// 카드 2장이 뒤집혔을 때 비교
					if (flippedCards.length === 2) {
						checkMatch();
					}
				}
			});
		});
	}

	// --- 3. 조커 처리 로직 ---
	function handleJoker(card) {
		card.classList.add("joker-found");
		card.querySelector("input").disabled = true;

		setTimeout(() => {
			alert("🃏 조커를 찾으셨습니다! 이 카드는 이제 계속 공개됩니다.");
		}, 300);
	}

	// --- 4. 두 카드 비교 로직 ---
	function checkMatch() {
		const [card1, card2] = flippedCards;
		const img1 = card1.querySelector(".card-image-slot").classList[1];
		const img2 = card2.querySelector(".card-image-slot").classList[1];

		if (img1 === img2) {
			// 일치할 때
			card1.classList.add("matched");
			card2.classList.add("matched");
			card1.querySelector("input").disabled = true;
			card2.querySelector("input").disabled = true;

			matchedCount++;
			flippedCards = [];

			if (matchedCount === TOTAL_PAIRS) {
				setTimeout(() => alert("🎉 모든 짝을 찾으셨습니다! 게임 클리어!"), 500);
			}
		} else {
			// 불일치할 때 (잠시 후 다시 뒤집기)
			document.body.style.pointerEvents = "none"; // 다른 카드 클릭 방지

			setTimeout(() => {
				card1.querySelector("input").checked = false;
				card2.querySelector("input").checked = false;
				flippedCards = [];
				document.body.style.pointerEvents = "auto";
			}, 1000);
		}
	}

	// 게임 실행
	initGame();
});
