const MilyonerEngine = {
    currentQuestionIndex: 0,
    score: 0,
    questions: [
        { q: "Türkiye'nin başkenti neresidir?", options: ["İstanbul", "Ankara", "İzmir", "Bursa"], answer: 1 },
        { q: "Güneş sistemindeki en büyük gezegen hangisidir?", options: ["Mars", "Jüpiter", "Satürn", "Venüs"], answer: 1 },
        { q: "Kanuni Sultan Süleyman'ın saltanat süresi yaklaşık kaç yıldır?", options: ["36", "46", "25", "30"], answer: 1 },
        { q: "Su hangi sıcaklık derecesinde kaynar?", options: ["90°C", "100°C", "80°C", "120°C"], answer: 1 },
        { q: "Eyfel Kulesi hangi şehirde yer almaktadır?", options: ["Londra", "Paris", "Berlin", "Roma"], answer: 1 }
    ],

    startQuiz() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.renderQuestion();
    },

    renderQuestion() {
        const container = document.getElementById('activeModuleContent');
        if (!container) return;

        if (this.currentQuestionIndex >= this.questions.length) {
            container.innerHTML = `
                <div class="milyoner-wrapper">
                    <h2>🏆 Yarışma Tamamlandı!</h2>
                    <p style="font-size: 20px; color: #feca57; margin: 15px 0;">Toplam Kazanç: ${this.score} ₺</p>
                    <button class="premium-btn" onclick="MilyonerEngine.startQuiz()">Yeniden Oyna</button>
                </div>
            `;
            return;
        }

        const qData = this.questions[this.currentQuestionIndex];
        let html = `
            <div class="milyoner-wrapper">
                <div style="display: flex; justify-content: space-between; color: #a4b0be; font-size: 13px; margin-bottom: 10px;">
                    <span>Soru ${this.currentQuestionIndex + 1} / ${this.questions.length}</span>
                    <span>Ödül: ${(this.currentQuestionIndex + 1) * 1000} ₺</span>
                </div>
                <div class="question-box">${qData.q}</div>
                <div class="options-grid">
        `;

        qData.options.forEach((opt, idx) => {
            html += `<button class="option-btn" onclick="MilyonerEngine.checkAnswer(${idx})">${String.fromCharCode(65 + idx)}. ${opt}</button>`;
        });

        html += `</div></div>`;
        container.innerHTML = html;
    },

    checkAnswer(selectedIndex) {
        const qData = this.questions[this.currentQuestionIndex];
        if (selectedIndex === qData.answer) {
            this.score += (this.currentQuestionIndex + 1) * 1000;
            this.currentQuestionIndex++;
            setTimeout(() => this.renderQuestion(), 400);
        } else {
            alert("❌ Yanlış cevap! Yarışma sona erdi.");
            returnToMainMenu();
        }
    }
};