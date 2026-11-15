const DiniImtihanEngine = {
    currentQuestionIndex: 0,
    score: 0,
    questions: [
        { q: "İslam'ın şartları kaç tanedir?", options: ["3", "4", "5", "6"], answer: 2 },
        { q: "Kur'an-ı Kerim hangi ayda indirilmeye başlanmıştır?", options: ["Recep", "Şaban", "Ramazan", "Muharrem"], answer: 2 },
        { q: "İlk insan ve ilk peygamber kimdir?", options: ["Hz. İbrahim", "Hz. Adem", "Hz. Nuh", "Hz. Musa"], answer: 1 },
        { q: "Kabe hangi şehirde yer almaktadır?", options: ["Medine", "Kudüs", "Mekke", "İstanbul"], answer: 2 }
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
                <div class="dini-wrapper">
                    <h2>🌟 İmtihan Tamamlandı!</h2>
                    <p style="font-size: 18px; color: #2ed573; margin: 15px 0;">Doğru Sayısı: ${this.score} / ${this.questions.length}</p>
                    <button class="premium-btn" onclick="DiniImtihanEngine.startQuiz()">Yeniden Başla</button>
                </div>
            `;
            return;
        }

        const qData = this.questions[this.currentQuestionIndex];
        let html = `
            <div class="dini-wrapper">
                <div style="color: #747d8c; font-size: 13px; margin-bottom: 10px;">Soru ${this.currentQuestionIndex + 1} / ${this.questions.length}</div>
                <div class="question-box">${qData.q}</div>
                <div class="options-grid">
        `;

        qData.options.forEach((opt, idx) => {
            html += `<button class="option-btn" onclick="DiniImtihanEngine.checkAnswer(${idx})">${String.fromCharCode(65 + idx)}. ${opt}</button>`;
        });

        html += `</div></div>`;
        container.innerHTML = html;
    },

    checkAnswer(selectedIndex) {
        if (selectedIndex === this.questions[this.currentQuestionIndex].answer) {
            this.score++;
            this.currentQuestionIndex++;
            setTimeout(() => this.renderQuestion(), 400);
        } else {
            alert("❌ Yanlış cevap!");
            this.currentQuestionIndex++;
            this.renderQuestion();
        }
    }
};