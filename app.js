// ARENA - Quiz Game Logic

const questions = [
    {
        question: "Türkiye'nin başkenti neresidir?",
        options: ["İstanbul", "Ankara", "İzmir", "Bursa"],
        answer: 1
    },
    {
        question: "Dünyaya en yakın gezegen hangisidir?",
        options: ["Mars", "Venüs", "Jüpiter", "Satürn"],
        answer: 1
    },
    {
        question: "Su hangi sıcaklıkta kaynar (deniz seviyesinde)?",
        options: ["90°C", "100°C", "110°C", "120°C"],
        answer: 1
    },
    {
        question: "Mavi renkli gezegen olarak bilinen gök cismi hangisidir?",
        options: ["Neptün", "Dünya", "Uranüs", "Merkür"],
        answer: 1
    },
    {
        question: "Hangi elementin simgesi 'Fe'dir?",
        options: ["Bakır", "Altın", "Demir", "Gümüş"],
        answer: 2
    }
];

let currentQuestionIndex = 0;
let score = 0;

const homeView = document.getElementById('homeView');
const quizView = document.getElementById('quizView');
const resultView = document.getElementById('resultView');
const profileView = document.getElementById('profileView');

const navHome = document.getElementById('navHome');
const navProfile = document.getElementById('navProfile');
const startQuickQuiz = document.getElementById('startQuickQuiz');
const restartBtn = document.getElementById('restartBtn');

const questionCounter = document.getElementById('questionCounter');
const scoreDisplay = document.getElementById('scoreDisplay');
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const finalScoreText = document.getElementById('finalScoreText');

const checkUpdateBtn = document.getElementById('checkUpdateBtn');
const updateStatusText = document.getElementById('updateStatusText');

navHome.addEventListener('click', () => showView('home'));
navProfile.addEventListener('click', () => showView('profile'));
startQuickQuiz.addEventListener('click', startQuiz);
restartBtn.addEventListener('click', () => showView('home'));

function showView(viewName) {
    homeView.classList.add('hidden');
    quizView.classList.add('hidden');
    resultView.classList.add('hidden');
    profileView.classList.add('hidden');

    navHome.className = "px-3.5 py-1.5 rounded-lg bg-gray-800/50 hover:bg-gray-700 text-sm font-medium transition flex items-center space-x-1.5 shadow";
    navProfile.className = "px-3.5 py-1.5 rounded-lg bg-gray-800/50 hover:bg-gray-700 text-sm font-medium transition flex items-center space-x-1.5 shadow";

    if (viewName === 'home') {
        homeView.classList.remove('hidden');
        navHome.className = "px-3.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm font-medium transition flex items-center space-x-1.5 shadow";
    } else if (viewName === 'quiz') {
        quizView.classList.remove('hidden');
    } else if (viewName === 'result') {
        resultView.classList.remove('hidden');
    } else if (viewName === 'profile') {
        profileView.classList.remove('hidden');
        navProfile.className = "px-3.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm font-medium transition flex items-center space-x-1.5 shadow";
    }
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    showView('quiz');
    loadQuestion();
}

function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showResult();
        return;
    }

    const q = questions[currentQuestionIndex];
    questionCounter.textContent = `Soru ${currentQuestionIndex + 1} / ${questions.length}`;
    scoreDisplay.textContent = `Puan: ${score}`;
    questionText.textContent = q.question;
    optionsContainer.innerHTML = '';

    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = "w-full text-left p-4 rounded-2xl bg-gray-800/80 hover:bg-gray-800 border border-gray-700/60 text-gray-200 font-medium transition shadow";
        btn.textContent = opt;
        btn.addEventListener('click', () => selectAnswer(index, btn));
        optionsContainer.appendChild(btn);
    });
}

function selectAnswer(selectedIndex, selectedBtn) {
    const q = questions[currentQuestionIndex];
    const buttons = optionsContainer.querySelectorAll('button');

    buttons.forEach(b => b.disabled = true);

    if (selectedIndex === q.answer) {
        selectedBtn.className = "w-full text-left p-4 rounded-2xl bg-emerald-600/20 border border-emerald-500 text-emerald-300 font-medium transition shadow";
        score += 20;
    } else {
        selectedBtn.className = "w-full text-left p-4 rounded-2xl bg-red-600/20 border border-red-500 text-red-300 font-medium transition shadow";
        if (buttons[q.answer]) {
            buttons[q.answer].className = "w-full text-left p-4 rounded-2xl bg-emerald-600/20 border border-emerald-500 text-emerald-300 font-medium transition shadow";
        }
    }

    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion();
    }, 1200);
}

function showResult() {
    showView('result');
        finalScoreText.textContent = `Toplam Puanın: ${score} / 100`;
}

checkUpdateBtn.addEventListener('click', async () => {
    updateStatusText.textContent = "Güncellemeler kontrol ediliyor...";
    try {
        const response = await fetch('version.json', { cache: 'no-store' });
        const data = await response.json();
        const currentVersion = "1.0.1";
        
        if (data.version !== currentVersion) {
            updateStatusText.innerHTML = `Yeni sürüm bulundu! (${data.version}) <a href="${data.downloadUrl}" target="_blank" class="text-amber-400 underline font-bold">İndir</a>`;
        } else {
            updateStatusText.textContent = "Uygulamanız güncel!";
        }
    } catch (err) {
        updateStatusText.textContent = "Güncelleme kontrol edilemedi (Çevrimdışı).";
    }
});
