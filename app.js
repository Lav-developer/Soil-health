// Garden Helper - Accessible Soil Health Monitoring App
// JavaScript for interactive functionality

class GardenHelperApp {
    constructor() {
        this.currentScreen = 'welcomeScreen';
        this.currentStep = 1;
        this.userData = {
            name: '',
            role: '',
            location: '',
            preferences: {
                largeText: false,
                highContrast: false,
                voiceGuidance: false
            }
        };
        this.soilData = {
            moisture: 65,
            ph: 6.8,
            temperature: 72,
            nutrients: 'moderate'
        };
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadUserData();
        this.updateLastChecked();
        this.showScreen('welcomeScreen');
    }

    bindEvents() {
        // Emergency Help
        document.getElementById('emergencyHelp').addEventListener('click', () => {
            this.showModal('helpModal');
        });

        // Voice Control
        document.getElementById('voiceControl').addEventListener('click', () => {
            this.showModal('voiceModal');
            this.startVoiceSimulation();
        });

        // Role Selection
        document.querySelectorAll('.role-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const role = e.currentTarget.dataset.role;
                this.userData.role = role;
                this.showScreen('setupScreen');
            });
        });

        // Setup Form
        document.getElementById('completeSetup').addEventListener('click', () => {
            this.completeSetup();
        });

        // Navigation - Fixed to ensure proper screen switching
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const screen = e.currentTarget.dataset.screen;
                console.log('Navigation clicked:', screen); // Debug log
                this.navigateToScreen(screen);
            });
        });

        // Back buttons
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const screen = e.currentTarget.dataset.back;
                this.showScreen(screen + 'Screen');
            });
        });

        // Quick Actions
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleQuickAction(action);
            });
        });

        // Soil Testing
        document.getElementById('startMoistureTest')?.addEventListener('click', () => {
            this.runMoistureTest();
        });

        document.getElementById('startPhTest')?.addEventListener('click', () => {
            this.runPhTest();
        });

        // Results Actions
        document.querySelectorAll('[data-action="save-results"]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.saveResults();
            });
        });

        document.querySelectorAll('[data-action="share-results"]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.shareResults();
            });
        });

        // Learning Tools
        document.querySelectorAll('.tool-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const tool = e.currentTarget.dataset.tool;
                this.openTool(tool);
            });
        });

        // Community Help
        document.querySelectorAll('.help-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const helpType = e.currentTarget.dataset.help;
                this.handleCommunityHelp(helpType);
            });
        });

        // Modal Controls
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.closeModal(e.target.closest('.modal').id);
            });
        });

        // Help Options
        document.querySelectorAll('.help-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const helpType = e.currentTarget.dataset.helpType;
                this.handleHelpOption(helpType);
            });
        });

        // Post Actions
        document.querySelectorAll('.post-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handlePostAction(e.target);
            });
        });

        // Accessibility Checkboxes
        document.getElementById('largeText')?.addEventListener('change', (e) => {
            this.toggleLargeText(e.target.checked);
        });

        document.getElementById('highContrast')?.addEventListener('change', (e) => {
            this.toggleHighContrast(e.target.checked);
        });

        document.getElementById('voiceGuidance')?.addEventListener('change', (e) => {
            this.userData.preferences.voiceGuidance = e.target.checked;
            this.saveUserData();
        });

        // Category Cards
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                this.showNotification('Coming soon! This lesson will be available shortly. 📚✨');
            });
        });

        // Featured Lesson
        document.querySelectorAll('.lesson-card .btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.startFeaturedLesson();
            });
        });

        // Close modals when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
    }

    showScreen(screenId) {
        console.log('Showing screen:', screenId); // Debug log
        
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });

        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.remove('hidden');
            this.currentScreen = screenId;
            console.log('Successfully showed screen:', screenId); // Debug log
        } else {
            console.error('Screen not found:', screenId); // Debug log
        }

        // Update navigation
        this.updateNavigation(screenId);
    }

    navigateToScreen(screen) {
        console.log('Navigate to screen called with:', screen); // Debug log
        
        const screenMap = {
            'dashboard': 'dashboardScreen',
            'testing': 'testingScreen',
            'progress': 'progressScreen',
            'learning': 'learningScreen',
            'community': 'communityScreen'
        };

        const screenId = screenMap[screen];
        console.log('Mapped to screenId:', screenId); // Debug log
        
        if (screenId) {
            this.showScreen(screenId);
        } else {
            console.error('Invalid screen:', screen); // Debug log
        }
    }

    updateNavigation(currentScreen) {
        // Remove active class from all nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Map screen IDs to navigation keys
        const screenToNav = {
            'dashboardScreen': 'dashboard',
            'testingScreen': 'testing',
            'progressScreen': 'progress',
            'learningScreen': 'learning',
            'communityScreen': 'community'
        };

        const navKey = screenToNav[currentScreen];
        console.log('Updating navigation for:', currentScreen, 'navKey:', navKey); // Debug log
        
        if (navKey) {
            const navBtn = document.querySelector(`[data-screen="${navKey}"]`);
            if (navBtn) {
                navBtn.classList.add('active');
                console.log('Added active class to nav button:', navKey); // Debug log
            } else {
                console.error('Nav button not found for:', navKey); // Debug log
            }
        }
    }

    completeSetup() {
        const nameInput = document.getElementById('userName');
        const locationSelect = document.getElementById('location');
        const largeTextCheck = document.getElementById('largeText');
        const highContrastCheck = document.getElementById('highContrast');
        const voiceGuidanceCheck = document.getElementById('voiceGuidance');

        if (!nameInput.value.trim()) {
            this.showNotification('Please enter your name to continue! 😊');
            nameInput.focus();
            return;
        }

        if (!locationSelect.value) {
            this.showNotification('Please select your gardening location! 🌍');
            locationSelect.focus();
            return;
        }

        // Save user data
        this.userData.name = nameInput.value.trim();
        this.userData.location = locationSelect.value;
        this.userData.preferences = {
            largeText: largeTextCheck.checked,
            highContrast: highContrastCheck.checked,
            voiceGuidance: voiceGuidanceCheck.checked
        };

        this.saveUserData();
        this.applyUserPreferences();

        // Update greeting
        document.getElementById('userNameDisplay').textContent = this.userData.name;

        // Celebrate setup completion
        this.showNotification(`Welcome to Garden Helper, ${this.userData.name}! 🎉 Let's start growing together!`);
        
        setTimeout(() => {
            this.showScreen('dashboardScreen');
        }, 2000);
    }

    handleQuickAction(action) {
        switch (action) {
            case 'test':
                this.showScreen('testingScreen');
                break;
            case 'learn':
                this.showScreen('learningScreen');
                break;
            case 'community':
                this.showScreen('communityScreen');
                break;
            case 'progress':
                this.showScreen('progressScreen');
                break;
            default:
                this.showNotification('Feature coming soon! 🚀');
        }
    }

    runMoistureTest() {
        const button = document.getElementById('startMoistureTest');
        const readingElement = document.getElementById('moistureReading');
        
        button.disabled = true;
        button.textContent = '🔄 Testing...';
        readingElement.textContent = '...';

        // Simulate testing process
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            readingElement.textContent = Math.min(Math.floor(progress), this.soilData.moisture);
            
            if (progress >= this.soilData.moisture) {
                clearInterval(interval);
                readingElement.textContent = this.soilData.moisture + '%';
                button.textContent = '✅ Test Complete!';
                button.style.background = 'var(--color-success)';
                
                this.celebrateTestCompletion('Great job! Your soil moisture is perfect! 💧');
                
                setTimeout(() => {
                    this.nextStep(3);
                }, 2000);
            }
        }, 200);
    }

    runPhTest() {
        const button = document.getElementById('startPhTest');
        const readingElement = document.getElementById('phReading');
        
        button.disabled = true;
        button.textContent = '🔄 Testing...';
        readingElement.textContent = '...';

        // Simulate testing process
        let progress = 0;
        const targetPh = this.soilData.ph;
        const interval = setInterval(() => {
            progress += 0.1 + Math.random() * 0.2;
            readingElement.textContent = Math.min(progress, targetPh).toFixed(1);
            
            if (progress >= targetPh) {
                clearInterval(interval);
                readingElement.textContent = targetPh.toFixed(1);
                button.textContent = '✅ Test Complete!';
                button.style.background = 'var(--color-success)';
                
                this.celebrateTestCompletion('Excellent! Your soil pH is just right! ⚖️');
                
                setTimeout(() => {
                    this.nextStep(4);
                }, 2000);
            }
        }, 300);
    }

    nextStep(stepNumber) {
        // Hide current step
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active');
            step.classList.add('hidden');
        });

        // Show next step
        const nextStep = document.getElementById(`step${stepNumber}`);
        if (nextStep) {
            nextStep.classList.remove('hidden');
            nextStep.classList.add('active');
            this.currentStep = stepNumber;
        }
    }

    celebrateTestCompletion(message) {
        this.showNotification(message);
        
        // Add some visual celebration
        const celebration = document.createElement('div');
        celebration.innerHTML = '🎉';
        celebration.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 4rem;
            z-index: 1500;
            animation: bounce 1s ease-in-out;
        `;
        
        document.body.appendChild(celebration);
        
        setTimeout(() => {
            document.body.removeChild(celebration);
        }, 1000);
    }

    saveResults() {
        this.showNotification('Your soil test results have been saved! 💾 Great work!');
        
        // Update progress data (simulated)
        setTimeout(() => {
            this.showScreen('progressScreen');
        }, 1500);
    }

    shareResults() {
        this.showNotification('Your results have been shared with the community! 📤 Others can learn from your success!');
        
        setTimeout(() => {
            this.showScreen('communityScreen');
        }, 1500);
    }

    openTool(toolName) {
        const toolMessages = {
            'ph-simulator': 'pH Simulator is starting up! 🧪 Learn how different materials affect soil acidity.',
            'creature-spotter': 'Creature Spotter is ready! 🔍 Let\'s find helpful soil creatures.',
            'compost-mixer': 'Compost Mixer is loading! 🍂 Discover the perfect compost recipe.'
        };
        
        this.showNotification(toolMessages[toolName] || 'Tool is loading...');
    }

    handleCommunityHelp(helpType) {
        const messages = {
            'question': 'Question form is opening! ❓ What would you like to ask the community?',
            'expert': 'Connecting you with a master gardener! 👨‍🔬 They\'ll help you soon!',
            'photo': 'Photo sharing is ready! 📸 Show off your garden progress!'
        };
        
        this.showNotification(messages[helpType] || 'Feature is loading...');
    }

    handlePostAction(button) {
        const action = button.textContent.toLowerCase();
        
        if (action.includes('like')) {
            const currentLikes = parseInt(button.textContent.match(/\d+/)[0]);
            button.innerHTML = `❤️ ${currentLikes + 1} likes`;
            this.showNotification('Thanks for showing love to the community! ❤️');
        } else if (action.includes('reply')) {
            this.showNotification('Reply feature coming soon! 💬 Stay tuned!');
        } else if (action.includes('share')) {
            this.showNotification('Post shared successfully! 🔄 Spreading the knowledge!');
        }
    }

    startFeaturedLesson() {
        this.showNotification('🌟 Starting "What Makes Soil Happy?" - Get ready to discover soil secrets! 🚀');
        
        setTimeout(() => {
            this.showNotification('Interactive lesson coming soon! For now, try our soil testing feature! 🔬');
        }, 2000);
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    handleHelpOption(helpType) {
        const messages = {
            'voice': 'Voice help is starting! 🎤 Say "Help me test soil" or "Show my progress"',
            'text': 'Text help is available! 💬 Type your question in the chat box.',
            'video': 'Video guide is loading! 📹 Watch step-by-step instructions.',
            'expert': 'Connecting to expert! 👨‍🏫 Master Gardener Mary will help you soon.'
        };
        
        this.showNotification(messages[helpType]);
        this.closeModal('helpModal');
    }

    startVoiceSimulation() {
        const statusElement = document.getElementById('voiceStatus');
        if (!statusElement) return;

        const phrases = [
            "Listening for your command...",
            "Try saying: 'Test my soil'",
            "Or say: 'Show my progress'",
            "Voice helper is ready! 🎤"
        ];

        let index = 0;
        const interval = setInterval(() => {
            statusElement.textContent = phrases[index];
            index = (index + 1) % phrases.length;
        }, 2000);

        // Simulate voice commands
        setTimeout(() => {
            clearInterval(interval);
            statusElement.textContent = "I heard: 'Test my soil' - Opening soil testing! 🔬";
            
            setTimeout(() => {
                this.closeModal('voiceModal');
                this.showScreen('testingScreen');
            }, 2000);
        }, 8000);
    }

    toggleLargeText(enabled) {
        this.userData.preferences.largeText = enabled;
        if (enabled) {
            document.body.classList.add('large-text');
        } else {
            document.body.classList.remove('large-text');
        }
        this.saveUserData();
    }

    toggleHighContrast(enabled) {
        this.userData.preferences.highContrast = enabled;
        if (enabled) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
        this.saveUserData();
    }

    applyUserPreferences() {
        if (this.userData.preferences.largeText) {
            document.body.classList.add('large-text');
        }
        if (this.userData.preferences.highContrast) {
            document.body.classList.add('high-contrast');
        }
    }

    showNotification(message) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());

        // Create notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--color-success);
            color: var(--color-white);
            padding: var(--space-16) var(--space-24);
            border-radius: var(--radius-lg);
            font-size: var(--font-size-lg);
            font-weight: var(--font-weight-medium);
            z-index: 1500;
            box-shadow: var(--shadow-lg);
            max-width: 400px;
            text-align: center;
            animation: slideInDown 0.3s ease-out, slideOutUp 0.3s ease-in 2.7s forwards;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    updateLastChecked() {
        const now = new Date();
        const timeString = this.getRelativeTime(now);
        const lastUpdatedElement = document.getElementById('lastUpdated');
        if (lastUpdatedElement) {
            lastUpdatedElement.textContent = timeString;
        }
    }

    getRelativeTime(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 60) {
            return `${diffMins} minutes ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hours ago`;
        } else {
            return `${diffDays} days ago`;
        }
    }

    saveUserData() {
        // In a real app, this would save to a backend
        // For demo purposes, we'll use a simple object
        console.log('User data saved:', this.userData);
    }

    loadUserData() {
        // In a real app, this would load from a backend
        // For demo purposes, we'll use default values
        if (this.userData.name) {
            const nameDisplay = document.getElementById('userNameDisplay');
            if (nameDisplay) {
                nameDisplay.textContent = this.userData.name;
            }
        }
    }

    // Simulate realistic sensor readings
    simulateRealtimeData() {
        setInterval(() => {
            // Small random variations to make it feel realistic
            this.soilData.moisture += (Math.random() - 0.5) * 2;
            this.soilData.moisture = Math.max(40, Math.min(80, this.soilData.moisture));
            
            this.soilData.temperature += (Math.random() - 0.5) * 1;
            this.soilData.temperature = Math.max(65, Math.min(78, this.soilData.temperature));
            
            this.soilData.ph += (Math.random() - 0.5) * 0.1;
            this.soilData.ph = Math.max(6.0, Math.min(7.5, this.soilData.ph));
            
            this.updateDashboardReadings();
        }, 30000); // Update every 30 seconds
    }

    updateDashboardReadings() {
        // Update moisture
        const moistureCard = document.querySelector('.status-card .status-value');
        if (moistureCard) {
            moistureCard.textContent = Math.round(this.soilData.moisture) + '%';
        }

        // Update temperature
        const tempCards = document.querySelectorAll('.status-card .status-value');
        if (tempCards[2]) {
            tempCards[2].textContent = Math.round(this.soilData.temperature) + '°F';
        }

        // Update pH
        if (tempCards[1]) {
            tempCards[1].textContent = this.soilData.ph.toFixed(1);
        }
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInDown {
        from {
            opacity: 0;
            transform: translate(-50%, -100px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
    
    @keyframes slideOutUp {
        from {
            opacity: 1;
            transform: translate(-50%, 0);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -100px);
        }
    }

    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translate(-50%, -50%) translateY(0);
        }
        40% {
            transform: translate(-50%, -50%) translateY(-20px);
        }
        60% {
            transform: translate(-50%, -50%) translateY(-10px);
        }
    }
`;
document.head.appendChild(style);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gardenHelper = new GardenHelperApp();
    
    // Start simulating real-time data after a delay
    setTimeout(() => {
        window.gardenHelper.simulateRealtimeData();
    }, 5000);
});

// Global functions for inline event handlers (if needed)
window.nextStep = function(stepNumber) {
    if (window.gardenHelper) {
        window.gardenHelper.nextStep(stepNumber);
    }
};

// Add keyboard accessibility
document.addEventListener('keydown', (e) => {
    // ESC key closes modals
    if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal:not(.hidden)');
        if (openModal && window.gardenHelper) {
            window.gardenHelper.closeModal(openModal.id);
        }
    }
    
    // Enter key activates focused buttons
    if (e.key === 'Enter' && e.target.tagName === 'BUTTON') {
        e.target.click();
    }
});

// Voice command simulation (for demonstration)
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    // Real speech recognition would go here
    console.log('Speech recognition available');
} else {
    // Fallback to simulated voice commands
    console.log('Using simulated voice commands');
}