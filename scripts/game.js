window.addEventListener('load', () => {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    const ctx    = canvas.getContext('2d');
    const W      = canvas.width, H = canvas.height;

    // Oyuncu
    const playerX = W/2, playerY = H - 20, playerR = 10;
    // Sütunlar
    const leftX  = W * 0.25, rightX = W * 0.75;

    // Resimler
    const houseImg = new Image();
    houseImg.src   = '../images/house.png';
    const paperImg = new Image();
    paperImg.src   = '../images/newspaper.png';

    // Oyun durumları
    let houses     = [];
    let papers     = [];
    let explosions = [];
    let score      = 0;
    let lives      = 3;
    let lastSpawn  = 0;
    const spawnInterval = 1200;
    const speed         = 2;
    let gameOver   = false;
    let lastTime   = 0;

    // Cooldown (ms)
    const cooldownMs     = 500;
    let lastLeftThrow    = -cooldownMs;
    let lastRightThrow   = -cooldownMs;

    // Ev sınıfı
    class House {
      constructor(side) {
        this.side    = side;
        this.hasGold = Math.random() < 0.5;
        this.w       = 40;
        this.h       = 40;
        this.x       = (side==='left' ? leftX : rightX) - this.w/2;
        this.y       = -this.h;
      }
      update() {
        this.y += speed;
      }
      draw() {
        if (houseImg.complete && houseImg.naturalWidth) {
          ctx.drawImage(houseImg, this.x, this.y, this.w, this.h);
        } else {
          ctx.fillStyle = '#888';
          ctx.fillRect(this.x, this.y, this.w, this.h);
        }
        if (this.hasGold) {
          ctx.fillStyle = 'gold';
          ctx.beginPath();
          ctx.arc(this.x + this.w/2, this.y + this.h/2, 6, 0, Math.PI*2);
          ctx.fill();
        }
      }
      offScreen() {
        return this.y > H;
      }
    }

    // Gazete sınıfı
    class Paper {
      constructor(side) {
        this.x   = (side==='left' ? leftX : rightX);
        this.y   = playerY;
        this.vy  = -6;
        this.r   = 8;
        this.hit = false;
      }
      update() {
        this.y += this.vy;
      }
      draw() {
        if (paperImg.complete && paperImg.naturalWidth) {
          ctx.drawImage(paperImg, this.x - this.r, this.y - this.r, this.r*2, this.r*2);
        } else {
          ctx.fillStyle = '#000';
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
          ctx.fill();
        }
      }
      offScreen() {
        return this.y < -this.r;
      }
    }

    // Patlama efekti
    class Explosion {
      constructor(x,y) {
        this.x    = x;
        this.y    = y;
        this.life = 20;
      }
      update() {
        this.life--;
      }
      draw() {
        ctx.fillStyle = `rgba(255,0,0,${this.life/20})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 20 - this.life, 0, Math.PI*2);
        ctx.fill();
      }
      done() {
        return this.life <= 0;
      }
    }

    // Tuş yönetimi + cooldown
    window.addEventListener('keydown', e => {
      if (gameOver) return;
      const now = performance.now();
      const k   = e.key.toLowerCase();
      if (k === 'a' && now - lastLeftThrow >= cooldownMs) {
        papers.push(new Paper('left'));
        lastLeftThrow = now;
      }
      if (k === 'd' && now - lastRightThrow >= cooldownMs) {
        papers.push(new Paper('right'));
        lastRightThrow = now;
      }
    });

    // Oyun döngüsü
    function loop(ts) {
      if (!lastTime) lastTime = ts;
      const dt = ts - lastTime;
      lastTime = ts;
      ctx.clearRect(0,0,W,H);

      // Oyuncu çizimi
      ctx.fillStyle = '#007';
      ctx.beginPath();
      ctx.arc(playerX, playerY, playerR, 0, Math.PI*2);
      ctx.fill();

      // Ev spawn
      if (ts - lastSpawn > spawnInterval) {
        lastSpawn = ts;
        houses.push(new House(Math.random() < 0.5 ? 'left' : 'right'));
      }

      // Evleri güncelle & çiz
      houses.forEach(h => { h.update(dt); h.draw(); });
      // Gazeteleri güncelle & çiz
      papers.forEach(p => { p.update(); p.draw(); });

      // Çarpışma kontrolü
      papers.forEach((p, pi) => {
        houses.forEach((h, hi) => {
          if (!p.hit &&
              p.x > h.x && p.x < h.x + h.w &&
              p.y > h.y && p.y < h.y + h.h) {
            p.hit = true;
            if (h.hasGold) {
              score++;
            } else {
              lives--;
              explosions.push(new Explosion(h.x + h.w/2, h.y + h.h/2));
            }
            houses.splice(hi,1);
            papers.splice(pi,1);
          }
        });
      });

      // Patlama efektlerini güncelle & çiz
      explosions.forEach((ex,i) => {
        ex.update();
        ex.draw();
        if (ex.done()) explosions.splice(i,1);
      });

      // Boş atış cezası: ekranın dışına çıkan kağıtlar
      papers = papers.filter(p => {
        if (p.offScreen()) {
          if (!p.hit) {
            lives--;
          }
          return false;
        }
        return true;
      });

      // Ekrandan çıkan evleri temizle
      houses = houses.filter(h => !h.offScreen());

      // HUD: Skor ve Can
      ctx.fillStyle = '#000';
      ctx.font = '18px sans-serif';
      ctx.fillText(`Skor: ${score}`, 10, 20);
      ctx.fillText(`Can: ${lives}`, 10, 40);

      // Oyun bitti mi?
      if (lives > 0) {
        requestAnimationFrame(loop);
      } else {
        ctx.fillStyle = 'red';
        ctx.font = '32px sans-serif';
        ctx.fillText('Oyun Bitti!', W/2 - 80, H/2);
      }
    }

    requestAnimationFrame(loop);
  });