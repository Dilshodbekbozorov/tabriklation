
let selectedTemplate = null;
const templates = {
    1: './template1.png',
    2: './template2.png',
    3: './template3.png'
};

// Chiroqlar yaratish
function createLights() {
    const lights = document.getElementById('lights');
    const colors = ['#ff6b6b', '#ffd93d', '#6bcf7f', '#4d9de0', '#e15554'];

    for (let i = 0; i < 20; i++) {
        const light = document.createElement('div');
        light.className = 'light';
        light.style.left = (i * 5.5) + '%';
        light.style.top = Math.sin(i * 0.5) * 30 + 20 + 'px';
        light.style.background = colors[i % colors.length];
        light.style.animationDelay = (i * 0.1) + 's';
        lights.appendChild(light);
    }
}

// Qor yog'ish effekti
function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    snowflake.innerHTML = '❄';
    snowflake.style.left = Math.random() * 100 + '%';
    snowflake.style.fontSize = (Math.random() * 1.5 + 0.5) + 'em';
    snowflake.style.animationDuration = (Math.random() * 3 + 5) + 's';
    snowflake.style.opacity = Math.random() * 0.7 + 0.3;

    document.getElementById('snowfall').appendChild(snowflake);

    setTimeout(() => {
        snowflake.remove();
    }, 8000);
}

setInterval(createSnowflake, 200);

// Modal ochish
function openModal() {
    document.getElementById('modal').style.display = 'flex';
    document.getElementById('templateSection').style.display = 'block';
    document.getElementById('nameSection').style.display = 'none';
}

// Template tanlash
function selectTemplate(templateId) {
    document.querySelectorAll('.template-item').forEach(item => {
        item.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    selectedTemplate = templateId;
}

// Ism kiritish qismiga o'tish
function goToNameInput() {
    if (!selectedTemplate) {
        alert('Iltimos, avval template tanlang!');
        return;
    }
    document.getElementById('templateSection').style.display = 'none';
    document.getElementById('nameSection').style.display = 'block';
}

// Template tanlashga qaytish
function backToTemplates() {
    document.getElementById('nameSection').style.display = 'none';
    document.getElementById('templateSection').style.display = 'block';
}

// Tabrik yaratish
function createGreeting() {
    const name = document.getElementById('nameInput').value.trim();

    if (!name) {
        alert('Iltimos, ismingizni kiriting!');
        return;
    }

    const greetingText = `Kirib kelayotgan Yangi yil barchangizga sog'lik, xotirjamlik va baraka olib kelsin. Yangi yil yangi maqsadlar, yangi imkoniyatlar va yangi yutuqlar yili bo'lsin. Boshlagan ishlaringiz muvaffaqiyat bilan yakunlansin, orzu-intilishlaringiz ro'yobga chiqsin. Har bir kuningiz quvonchli lahzalarga, hayotingiz esa tinchlik va fayzga to'la bo'lsin.\n\nYangi yil muborak bo'lsin!\nHurmat bilan, ${name} \n Qamashi IT Park`;

    document.getElementById('cardText').innerText = greetingText;
    document.getElementById('modal').style.display = 'none';
    document.getElementById('greetingCard').style.display = 'flex';

    // Tanlangan templateni ko'rsatish
    const img = document.getElementById('cardImage');
    img.src = templates[selectedTemplate];
}

// Kartani yopish
function closeCard() {
    document.getElementById('greetingCard').style.display = 'none';
    document.getElementById('nameInput').value = '';
    selectedTemplate = null;
    document.querySelectorAll('.template-item').forEach(item => {
        item.classList.remove('selected');
    });
}

// Kartani yuklab olish
function downloadCard() {
    const name = document.getElementById('nameInput').value.trim() || 'tabrik';

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = 1135;
        canvas.height = 640;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(img, 0, 0, 1135, 640);

        const text = document.getElementById('cardText').innerText;
        ctx.fillStyle = '#2d4d3d';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;

        const lines = text.split('\n');
        const lineHeight = 28;
        const centerX = 567;
        const centerY = 320;
        const maxWidth = 620;

        let currentY = centerY - (lines.length * lineHeight) / 2;

        lines.forEach((line) => {
            if (line.trim() === '') {
                currentY += lineHeight;
                return;
            }

            const words = line.split(' ');
            let currentLine = '';

            words.forEach((word, index) => {
                const testLine = currentLine + word + ' ';
                const metrics = ctx.measureText(testLine);

                if (metrics.width > maxWidth && currentLine !== '') {
                    ctx.fillText(currentLine.trim(), centerX, currentY);
                    currentLine = word + ' ';
                    currentY += lineHeight;
                } else {
                    currentLine = testLine;
                }

                if (index === words.length - 1) {
                    ctx.fillText(currentLine.trim(), centerX, currentY);
                    currentY += lineHeight;
                }
            });
        });

        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `yangi-yil-tabrigi-${name}.png`;
            a.click();
            URL.revokeObjectURL(url);
        });
    };

    img.src = templates[selectedTemplate];
}

createLights();
