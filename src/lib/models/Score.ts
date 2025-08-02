export class Score {
	public static set(snakeLength: number) {
		const score = Score.get();

		if (snakeLength * 10 > score) {
			localStorage.setItem('highScore', (snakeLength * 10).toString());
		}
	}

	public static get() {
		return Number(localStorage.getItem('highScore') || '0');
	}
}
