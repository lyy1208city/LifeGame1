class ElderlyStage {
    constructor(player) {
        this.player = player;
        this.currentEventIndex = 0;
        this.errorBox = document.getElementById('error-box');
        this.errorMessage = document.getElementById('error-message');
        this.errorCloseBtn = document.querySelector('.error-close-btn');
        this.transitionDisplay = document.getElementById('transition-display');
        this.transitionMessage = document.getElementById('transition-message');
        this.eventContainer = document.getElementById('event-container');
        this.buttonsContainer = document.getElementById('buttons');
        this.summaryContainer = document.getElementById('summary-container');
        
        this.errorCloseBtn.addEventListener('click', () => this.hideError());
        this.updateStatusBox();
    }

    updateStatusBox() {
        const moneyElement = document.getElementById('status-money');
        const learningElement = document.getElementById('status-learning');
        const achievementElement = document.getElementById('status-achievement');
        
        if (moneyElement) {
            moneyElement.textContent = `Level ${this.player.getMoneyLevel()}`;
        }
        
        if (learningElement) {
            const learningMap = {
                1: '中學',
                2: '大專',
                3: '學士',
                4: '碩士'
            };
            learningElement.textContent = learningMap[this.player.getLearningLevel()] || '中學';
        }

        if (achievementElement){
            let temp = '';
            for (const achEle of this.player.getAchievement()){
                temp += '[' + achEle + ']' + '<br>';
            }
            achievementElement.innerHTML = temp;
        }
    }

    displayEvent(headerText, gifPath, choices) {
        this.clearEvent();
        this.eventContainer.innerHTML = `
            <div class="event active" id="event-${this.currentEventIndex}">
                <div class="event-header">
                    <div class="event-header-block">${headerText}</div>
                    <div class="event-gif-placeholder">
                        <img src="${gifPath}" alt="Event" style="display: ${gifPath === '//TBC' ? 'none' : 'block'}">
                    </div>
                </div>
            </div>
        `;
        this.displayChoices(choices);
    }

    displayChoices(choices) {
        this.buttonsContainer.innerHTML = '';
        choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.textContent = choice.label;
            btn.onclick = () => {
                const validationResult = choice.validate ? choice.validate() : { valid: true, message: '' };
                if (!validationResult.valid) {
                    this.showError(validationResult.message);
                } else {
                    this.hideError();
                    choice.action();
                }
            };
            this.buttonsContainer.appendChild(btn);
        });
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorBox.classList.add('show');
    }

    hideError() {
        this.errorBox.classList.remove('show');
    }

    clearEvent() {
        this.eventContainer.innerHTML = '';
    }

    async showTransition(message, gifPath = 'player_walk.gif') {
        this.hideError();
        this.buttonsContainer.innerHTML = '';
        this.transitionMessage.textContent = message;
        
        const img = this.transitionDisplay.querySelector('img');
        img.src = gifPath;
        img.style.display = gifPath === '//TBC' ? 'none' : 'block';
        
        this.transitionDisplay.classList.add('show');
        
        return new Promise(resolve => {
            setTimeout(() => {
                this.transitionDisplay.classList.remove('show');
                this.updateStatusBox();
                resolve();
            }, 2000);
        });
    }

    async startElderlyStage() {
        this.currentEventIndex = 0;
        await this.event1();
        await this.event2();
        await this.event3();
        this.summaryOfElderlyStage();
        await this.finalSummary();
    }

    async event1() {
        return new Promise((resolve) => {
            this.currentEventIndex = 1;
            this.displayEvent(
                "活動1：日常生活\n你選擇如何享受退休時光？",
                "//TBC",
                [
                    {
                        label: "打麻雀",
                        validate: () => {
                            if (!this.player.getAchievement().has("終生好友")) {
                                return {
                                    valid: false,
                                    message: "打麻雀需有終生好友才能暢快遊戲\n你還沒有結交終生好友，請重新選擇"
                                };
                            }
                            return { valid: true, message: '' };
                        },
                        action: async () => {
                            await this.showTransition("你和朋友們一起打麻雀\n歡樂的時光飛快流逝");
                            resolve();
                        }
                    },
                    {
                        label: "湊孫",
                        validate: () => {
                            if (!this.player.getAchievement().has("天綸之樂")) {
                                return {
                                    valid: false,
                                    message: "你未有生兒育女\n沒有下一代可以照顧，請重新選擇"
                                };
                            }
                            return { valid: true, message: '' };
                        },
                        action: async () => {
                            await this.showTransition("你和孫兒一起遊戲\n享受天倫之樂");
                            resolve();
                        }
                    },
                    {
                        label: "散步",
                        action: async () => {
                            this.player.addLifeLongInTotal(1);
                            await this.showTransition("你在公園散步\n呼吸新鮮空氣\n增加了健康的年數");
                            resolve();
                        }
                    }
                ]
            );
        });
    }

    async event2() {
        return new Promise((resolve) => {
            this.currentEventIndex = 2;
            this.displayEvent(
                "活動2：急病\n你面臨健康問題，如何應對？",
                "//TBC",
                [
                    {
                        label: "積極治療",
                        validate: () => {
                            if (!this.player.getAchievement().has("長期服務金") || this.player.getMoneyLevel() < 1) {
                                return {
                                    valid: false,
                                    message: "積極治療需要足夠的經濟支持\n你未有公務員服務金或財富不足，請選擇保守治療"
                                };
                            }
                            return { valid: true, message: '' };
                        },
                        action: async () => {
                            this.player.minusMoneyLevel(2);
                            this.player.addLifeLongInTotal(5);
                            await this.showTransition("你選擇積極治療\n醫療成本高昂，財富降級\n但你爭取了更多的健康時光");
                            resolve();
                        }
                    },
                    {
                        label: "保守治療",
                        action: async () => {
                            await this.showTransition("你選擇保守治療\n調理身體，順其自然");
                            resolve();
                        }
                    }
                ]
            );
        });
    }

    async event3() {
        return new Promise((resolve) => {
            this.currentEventIndex = 3;
            this.displayEvent(
                "活動3：日常生活\n你在晚年如何保持身心健康？",
                "//TBC",
                [
                    {
                        label: "飲茶",
                        action: async () => {
                            await this.showTransition("你和朋友們在茶樓飲茶\n閒聊人生的點點滴滴");
                            resolve();
                        }
                    },
                    {
                        label: "晨操",
                        action: async () => {
                            this.player.addLifeLongInTotal(1);
                            await this.showTransition("你堅持每天做晨操\n保持身體活力\n增加了健康的年數");
                            resolve();
                        }
                    },
                    {
                        label: "多睡",
                        action: async () => {
                            await this.showTransition("你享受充足的休息\n讓身體得到充分恢復");
                            resolve();
                        }
                    }
                ]
            );
        });
    }

    summaryOfElderlyStage() {
        const summaryContent = `
第三階 - 老年時期已結束

在財富上：你已達 Level ${this.player.getMoneyLevel()}

在學歷上：
${this.player.getLearningLevel() === 2 ? "你已達大專" : this.player.getLearningLevel() === 3 ? "你已達學士" : "你已達碩士"}

${this.player.getAchievement().size > 0 ? "你獲得的成就：" : ""}
${Array.from(this.player.getAchievement()).map(ach => `✓ ${ach}`).join("\n")}

你的生命過了 ${this.player.getLifeLongInTotal()} 年

準備前往大結局...
        `.trim();

        this.clearEvent();
        this.eventContainer.innerHTML = `
            <img src="player_walk.gif"
            alt="學生時期總結 - 角色走路動畫"
            class="event-gif">
            `;
        this.buttonsContainer.innerHTML = '';
        
        const summaryTitle = document.getElementById('summary-title');
        const summaryContentDiv = document.getElementById('summary-content');
        
        summaryTitle.textContent = "老年時期總結";
        summaryContentDiv.textContent = summaryContent;
        
        this.summaryContainer.classList.add('show');
    }

    async finalSummary() {
        await new Promise(resolve => {
            const controlButtons = document.getElementById('control-buttons');
            controlButtons.innerHTML = '';
            const nextBtn = document.createElement('button');
            nextBtn.textContent = "查看人生總結";
            nextBtn.onclick = () => {
                resolve();
            };
            controlButtons.appendChild(nextBtn);
        });

        // Show final summary
        const finalSummaryContent = this.player.summary();
        const summaryTitle = document.getElementById('summary-title');
        const summaryContentDiv = document.getElementById('summary-content');
        const controlButtons = document.getElementById('control-buttons');
        
        summaryTitle.textContent = "人生總結";
        summaryContentDiv.textContent = finalSummaryContent;
        
        controlButtons.innerHTML = '';
        const restartBtn = document.createElement('button');
        restartBtn.textContent = "重新開始遊戲";
        restartBtn.onclick = () => {
            localStorage.removeItem('player');
            window.location.href = 'student.html';
        };
        controlButtons.appendChild(restartBtn);
    }
}