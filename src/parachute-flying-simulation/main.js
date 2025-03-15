        document.addEventListener('DOMContentLoaded', function() {
            // Elements
            const parachute = document.getElementById('parachute');
            const canopy = document.querySelector('.parachute-canopy');
            const deployBtn = document.getElementById('deploy-btn');
            const leftBtn = document.getElementById('left-btn');
            const rightBtn = document.getElementById('right-btn');
            const restartBtn = document.getElementById('restart-btn');
            const altitudeEl = document.getElementById('altitude');
            const hSpeedEl = document.getElementById('h-speed');
            const vSpeedEl = document.getElementById('v-speed');
            const gameContainer = document.getElementById('game-container');
            const messageEl = document.getElementById('message');
            
            // Game state
            let altitude = 1000;
            let horizontalPos = window.innerWidth / 2 - 40;
            let verticalSpeed = 2;
            let horizontalSpeed = 0;
            let maxHorizontalSpeed = 3;
            let isParachuteDeployed = false;
            let isGameOver = false;
            let wind = 0.5;
            let windDirection = 1;
            let frameCount = 0;
            let gameInterval;
            let cloudIntervals = [];
            
            // Initialize parachute position
            function initGame() {
                altitude = 1000;
                horizontalPos = window.innerWidth / 2 - 40;
                verticalSpeed = 2;
                horizontalSpeed = 0;
                maxHorizontalSpeed = 3;
                isParachuteDeployed = false;
                isGameOver = false;
                wind = 0.5;
                windDirection = 1;
                frameCount = 0;
                
                // Reset UI
                parachute.style.top = '10px';
                parachute.style.left = horizontalPos + 'px';
                parachute.style.transform = 'rotate(0deg)';
                canopy.style.width = '80px';
                canopy.style.height = '60px';
                canopy.style.left = '0px';
                
                deployBtn.disabled = false;
                deployBtn.textContent = 'Deploy';
                
                altitudeEl.textContent = '1000';
                hSpeedEl.textContent = '0';
                vSpeedEl.textContent = '2.0';
                
                messageEl.style.display = 'none';
                
                // Generate clouds
                clearClouds();
                for (let i = 0; i < 10; i++) {
                    createCloud();
                }
                
                // Start game loop
                if (gameInterval) {
                    cancelAnimationFrame(gameInterval);
                }
                gameLoop();
            }
            
            // Clear clouds and intervals
            function clearClouds() {
                const clouds = document.querySelectorAll('.cloud');
                clouds.forEach(cloud => cloud.remove());
                
                cloudIntervals.forEach(interval => clearInterval(interval));
                cloudIntervals = [];
            }
            
            // Deploy parachute
            deployBtn.addEventListener('click', function() {
                if (!isParachuteDeployed && !isGameOver) {
                    deployParachute();
                }
            });
            
            // Control buttons
            leftBtn.addEventListener('mousedown', function() {
                if (!isGameOver) horizontalSpeed = -maxHorizontalSpeed;
            });
            
            leftBtn.addEventListener('mouseup', function() {
                if (!isGameOver) horizontalSpeed = 0;
            });
            
            rightBtn.addEventListener('mousedown', function() {
                if (!isGameOver) horizontalSpeed = maxHorizontalSpeed;
            });
            
            rightBtn.addEventListener('mouseup', function() {
                if (!isGameOver) horizontalSpeed = 0;
            });
            
            // Restart button
            restartBtn.addEventListener('click', function() {
                initGame();
            });
            
            // Keyboard controls
            document.addEventListener('keydown', function(e) {
                if (isGameOver) return;
                
                if (e.key === 'ArrowLeft') {
                    horizontalSpeed = -maxHorizontalSpeed;
                } else if (e.key === 'ArrowRight') {
                    horizontalSpeed = maxHorizontalSpeed;
                } else if (e.key === ' ' || e.key === 'Spacebar') {
                    if (!isParachuteDeployed) {
                        deployParachute();
                    }
                } else if (e.key === 'r' || e.key === 'R') {
                    initGame();
                }
            });
            
            document.addEventListener('keyup', function(e) {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    horizontalSpeed = 0;
                }
            });
            
            // Deploy parachute function
            function deployParachute() {
                isParachuteDeployed = true;
                canopy.style.width = '120px';
                canopy.style.height = '90px';
                canopy.style.left = '-20px';
                deployBtn.disabled = true;
                deployBtn.textContent = 'Deployed';
                verticalSpeed = 1;
                maxHorizontalSpeed = 1.5;
            }
            
            // Create cloud
            function createCloud() {
                const cloud = document.createElement('div');
                cloud.className = 'cloud';
                cloud.style.width = Math.random() * 100 + 50 + 'px';
                cloud.style.height = Math.random() * 50 + 30 + 'px';
                cloud.style.left = Math.random() * window.innerWidth + 'px';
                cloud.style.top = Math.random() * 600 + 'px';
                cloud.style.opacity = Math.random() * 0.3 + 0.5;
                gameContainer.appendChild(cloud);
                
                // Move cloud
                const interval = setInterval(() => {
                    const currentLeft = parseFloat(cloud.style.left);
                    cloud.style.left = (currentLeft - 0.5) + 'px';
                    
                    if (currentLeft < -100) {
                        cloud.style.left = window.innerWidth + 'px';
                        cloud.style.top = Math.random() * 600 + 'px';
                    }
                }, 50);
                
                cloudIntervals.push(interval);
            }
            
            // Game loop
            function gameLoop() {
                if (isGameOver) return;
                
                frameCount++;
                
                // Change wind occasionally
                if (frameCount % 100 === 0) {
                    wind = Math.random() * 1 - 0.5;
                    windDirection = Math.random() > 0.5 ? 1 : -1;
                }
                
                // Update altitude
                altitude -= verticalSpeed;
                altitudeEl.textContent = Math.max(0, Math.floor(altitude));
                
                // Update speeds
                hSpeedEl.textContent = Math.abs(horizontalSpeed + wind * windDirection).toFixed(1);
                vSpeedEl.textContent = verticalSpeed.toFixed(1);
                
                // Update position
                horizontalPos += horizontalSpeed + wind * windDirection;
                if (horizontalPos < 0) horizontalPos = 0;
                if (horizontalPos > window.innerWidth - 80) horizontalPos = window.innerWidth - 80;
                
                // Update parachute display
                const verticalPos = 600 - altitude / 2;
                parachute.style.left = horizontalPos + 'px';
                parachute.style.top = verticalPos + 'px';
                
                // Tilt parachute based on horizontal speed
                parachute.style.transform = `rotate(${(horizontalSpeed + wind * windDirection) * 10}deg)`;
                
                // Check for landing
                if (altitude <= 0) {
                    endGame();
                    return;
                }
                
                // Continue game loop
                gameInterval = requestAnimationFrame(gameLoop);
            }
            
            // End game
            function endGame() {
                isGameOver = true;
                
                // Display landing message
                messageEl.style.display = 'block';
                
                // Check landing speed
                if (verticalSpeed > 1.5 || Math.abs(horizontalSpeed + wind * windDirection) > 2) {
                    messageEl.textContent = 'Rough landing! Try to slow down more next time.';
                    messageEl.style.backgroundColor = 'rgba(255, 100, 100, 0.9)';
                } else {
                    messageEl.textContent = 'Perfect landing! Great job!';
                    messageEl.style.backgroundColor = 'rgba(100, 255, 100, 0.9)';
                }
            }
            
            // Start game
            initGame();
        });
