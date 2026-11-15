function switchGameModule(moduleName) {
    const mainMenu = document.getElementById('mainMenu');
    const gameViewContainer = document.getElementById('gameViewContainer');
    const titleSpan = document.getElementById('activeModuleTitle');

    if (!mainMenu || !gameViewContainer) return;

    mainMenu.style.display = 'none';
    gameViewContainer.style.display = 'block';

    const titles = {
        colorSort: 'Renk Sıralama Bulmacası',
        milyoner: 'Milyoner Bilgi Yarışması',
        diniImtihan: 'Dini İmtihan Kültür',
        okey: 'Klasik Okey Masası',
        okey101: '101 Okey Strateji'
    };

    if (titleSpan) titleSpan.innerText = titles[moduleName] || 'ARENA';

    const contentContainer = document.getElementById('activeModuleContent');
    contentContainer.innerHTML = '';

    if (moduleName === 'colorSort') {
        ColorSortEngine.initLevel(1);
    } else if (moduleName === 'milyoner') {
        MilyonerEngine.startQuiz();
    } else if (moduleName === 'diniImtihan') {
        DiniImtihanEngine.startQuiz();
    } else if (moduleName === 'okey' || moduleName === 'okey101') {
        renderOkeyPlaceholder(contentContainer, moduleName === 'okey101' ? '101 Okey' : 'Klasik Okey');
    }
}

function returnToMainMenu() {
    document.getElementById('gameViewContainer').style.display = 'none';
    document.getElementById('mainMenu').style.display = 'block';
}

function renderOkeyPlaceholder(container, modeName) {
    container.innerHTML = `
        <div style="text-align:center; padding: 40px 20px; background: rgba(15,45,36,0.9); border-radius: 16px; border: 2px solid #2ed573; box-shadow: 0 10px 30px rgba(0,0,0,0.6);">
            <div style="font-size: 50px; margin-bottom: 15px;">🀄</div>
            <h2 style="color: #2ed573; margin-bottom: 10px;">${modeName} Masası Hazırlanıyor</h2>
            <p style="color: #a4b0be; font-size: 14px; margin-bottom: 20px;">Ahşap ıstakalar, fildişi taşlar ve yapay zeka bot motoru aktif ediliyor.</p>
            <button class="premium-btn" onclick="alert('Okey masası simülasyonu başlatıldı!')">Masaya Otur</button>
        </div>
    `;
}