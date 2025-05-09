        // URL'den verileri oku
        const params = new URLSearchParams(window.location.search);
        const ad = params.get('name');
        const email = params.get('email');
        const mesaj = params.get('message');
        const theme = params.get('theme');

        // CSS dosyasını yükle
        if (theme) {
            document.getElementById('dynamic-theme').setAttribute('href', theme);
        }

        // Bilgileri doldur
        const bilgiler = document.getElementById('bilgiler');
        bilgiler.innerHTML = `
            <li><strong>Ad:</strong> ${ad}</li>
            <li><strong>E-posta:</strong> ${email}</li>
            <li><strong>Mesaj:</strong> ${mesaj}</li>
        `;