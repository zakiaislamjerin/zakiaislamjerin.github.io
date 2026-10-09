        // --- SECURELY CONNECT PROVIDED GRAPHICS DIRECTLY TO CORRESPONDING CONTENT NODES ---
        document.getElementById('child-1').src = "assets/baby-1.jpg";
        document.getElementById('child-2').src = "assets/baby-2.jpg";
        document.getElementById('child-3').src = "assets/baby-3.jpg";
        document.getElementById('child-4').src = "assets/baby-4.jpg";
        document.getElementById('diva-1').src = "assets/diva-1.webp";
        document.getElementById('k-boy').src = "assets/k-boy.jpg";
        document.getElementById('draw-1').src = "assets/draw-1.jpg";
        document.getElementById('jerin-2').src = "assets/jerin-2.jpg";
        document.getElementById('draw-3').src = "assets/draw-3.jpg";
        document.getElementById('draw-4').src = "assets/draw-4.jpg";
        document.getElementById('party-frame').src = "assets/party-frame.jpg";

        // --- CORE NAVIGATION STATE & TOUCH INSTANTIATION ---
        let activeLayer = 1;
        const finalLayerCount = 11;
        let isUnlocked = false;

        // Variables to handle swipe gestures
        let touchStartX = 0;
        let touchEndX = 0;
        const swipeThreshold = 50; // Minimum sliding distance in pixels to count as a swap

        const mainCard = document.getElementById('main-card');

        // Capture touch coordinates on mobile/touch displays
        mainCard.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, {
            passive: true
        });

        mainCard.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipeGesture();
        }, {
            passive: true
        });

        // Evaluates horizontal vector displacements to step layers left or right
        function handleSwipeGesture() {
            if (!isUnlocked) return; // Prevent swipe gestures before opening the gift box

            const displacement = touchEndX - touchStartX;

            if (displacement < -swipeThreshold) {
                // Swiped Left -> Load next element
                if (activeLayer < finalLayerCount) changeLayer(1, 'right');
            } else if (displacement > swipeThreshold) {
                // Swiped Right -> Load previous element
                if (activeLayer > 2) changeLayer(-1, 'left');
            }
        }

        function unlockStory() {
            isUnlocked = true;
            changeLayer(1, 'right');
            document.getElementById('nav-controls').style.display = 'flex';
        }

        function navigateButton(direction) {
            const animDir = (direction === 1) ? 'right' : 'left';
            changeLayer(direction, animDir);
        }

        function changeLayer(offset, animationDirection) {
            const currentElement = document.getElementById(`layer-${activeLayer}`);
            currentElement.classList.remove('active');
            currentElement.classList.remove('slide-from-left');
            currentElement.classList.remove('slide-from-right');

            activeLayer += offset;
            if (activeLayer < 1) activeLayer = 1;
            if (activeLayer > finalLayerCount) activeLayer = finalLayerCount;

            const targetElement = document.getElementById(`layer-${activeLayer}`);
            targetElement.classList.add('active');

            // Apply corresponding slide direction layout vectors
            if (animationDirection === 'right') {
                targetElement.classList.add('slide-from-right');
            } else if (animationDirection === 'left') {
                targetElement.classList.add('slide-from-left');
            }

            // Sync button controller visibility state flags
            document.getElementById('prev-btn').disabled = (activeLayer === 2);
            document.getElementById('next-btn').style.visibility = (activeLayer === finalLayerCount) ? 'hidden' : 'visible';

            // Synchronize step-indicator tracking dot arrays
            const dots = document.querySelectorAll('.dot');
            dots.forEach((d, idx) => {
                d.classList.toggle('active', idx === (activeLayer - 1));
            });

            // HANDLE BACKGROUND LAYER TRANMUTATIONS
            if (activeLayer === finalLayerCount) {
                clearInterval(particleInterval);
                particleContainer.innerHTML = '';
                balloonContainer.style.display = 'block';
                this.balloonLoop = setInterval(spawnPartyBalloon, 750);
                burstConfetti();
            } else {
                balloonContainer.style.display = 'none';
                clearInterval(this.balloonLoop);
                if (!particleInterval) particleInterval = setInterval(spawnAmbientParticle, 1200);
            }
        }

        // --- AMBIENT NEON DRIFT CONTEXT ---
        const particleContainer = document.getElementById('particle-container');

        function spawnAmbientParticle() {
            const p = document.createElement('div');
            p.classList.add('particle');
            const size = Math.random() * 70 + 40;
            p.style.width = `${size}px`;
            p.style.height = `${size}px`;
            p.style.left = `${Math.random() * 100}%`;
            const speed = Math.random() * 10 + 10;
            p.style.animationDuration = `${speed}s`;
            particleContainer.appendChild(p);
            setTimeout(() => p.remove(), speed * 1000);
        }
        let particleInterval = setInterval(spawnAmbientParticle, 1200);

        // --- BALLOON RENDER ENGINE ---
        const balloonContainer = document.getElementById('balloon-container');
        const partyColors = ['#ff6b81', '#00f2fe', '#a29bfe', '#ffeaa7', '#55efc4', '#fd79a8'];

        function spawnPartyBalloon() {
            const b = document.createElement('div');
            b.classList.add('balloon');
            const targetColor = partyColors[Math.floor(Math.random() * partyColors.length)];
            b.style.backgroundColor = targetColor;
            b.style.left = `${Math.random() * 100}%`;
            b.style.transform = `scale(${Math.random() * 0.4 + 0.7})`;
            balloonContainer.appendChild(b);
            setTimeout(() => b.remove(), 9000);
        }

        function buildTrackingDots() {
            const dotsWrapper = document.getElementById('progress-dots');
            dotsWrapper.innerHTML = '';
            for (let i = 1; i <= finalLayerCount; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === 1) dot.classList.add('active');
                dotsWrapper.appendChild(dot);
            }
        }

        // --- SYSTEM METRIC PROFILE CHECK ---
        function startScan() {
            const btn = document.getElementById('scan-btn');
            const bar = document.getElementById('scan-bar');
            const res = document.getElementById('scan-results');
            btn.disabled = true;
            btn.innerText = "Analyzing Neural Vibe Patterns...";
            bar.style.width = "100%";
            setTimeout(() => {
                res.style.display = "block";
                btn.innerText = "Scan Verified! Check Results:";
                burstConfetti();
            }, 2000);
        }

        // --- HTML5 CANVAS PARTICLE MATRIX ENGINE ---
        const canvas = document.getElementById('confetti-canvas');
        const ctx = canvas.getContext('2d');
        let elements = [];

        function handleResize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', handleResize);
        handleResize();

        class ParticleItem {
            constructor() {
                this.x = window.innerWidth / 2;
                this.y = window.innerHeight / 2 - 30;
                this.size = Math.random() * 8 + 4;
                this.color = partyColors[Math.floor(Math.random() * partyColors.length)];
                this.vX = (Math.random() - 0.5) * 15;
                this.vY = (Math.random() - 0.7) * 15 - 4;
                this.gravity = 0.23;
                this.rotation = Math.random() * 360;
                this.alpha = 1;
            }
            refresh() {
                this.x += this.vX;
                this.vY += this.gravity;
                this.y += this.vY;
                this.alpha -= 0.013;
                this.rotation += this.vX;
            }
            render() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate((this.rotation * Math.PI) / 180);
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = this.color;
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
                ctx.restore();
            }
        }

        function burstConfetti() {
            for (let i = 0; i < 85; i++) elements.push(new ParticleItem());
        }

        function mainLoop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            elements = elements.filter(item => item.alpha > 0);
            elements.forEach(item => {
                item.refresh();
                item.render();
            });
            requestAnimationFrame(mainLoop);
        }
        mainLoop();
        buildTrackingDots();

        // --- press ENTER button to submit ---
        document.addEventListener("DOMContentLoaded", () => {
            const nameInputField = document.getElementById('login-username');
            const pinInputField = document.getElementById('login-pin');


            if (nameInputField) {
                nameInputField.addEventListener("keypress", (event) => {
                    if (event.key === "Enter") {
                        event.preventDefault();
                        pinInputField.focus();
                    }
                });
            }


            if (pinInputField) {
                pinInputField.addEventListener("keypress", (event) => {
                    if (event.key === "Enter") {
                        event.preventDefault();
                        verifyLogin();
                    }
                });
            }
        });

        // DEV security
        document.addEventListener('contextmenu', event => event.preventDefault());
        document.addEventListener('keydown', (e) => {
            if (e.key === "F12" ||
                (e.ctrlKey && e.shiftKey && e.key === "I") ||
                (e.ctrlKey && e.shiftKey && e.key === "J") ||
                (e.ctrlKey && e.key === "U")) {
                e.preventDefault();
                alert("🚨 ACCESS DENIED: Firewall alert!");
            }
        });
        setInterval(function () {
            debugger;
        }, 100);
