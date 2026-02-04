class StudentStage {
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
            for (const achEle of this.player.getAchievement()){
                achievementElement.textContent = achEle;
            }
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

    async startStudentStage() {
        this.currentEventIndex = 0;
        await this.event1();
        await this.event2();
        if (!this.player.getVtc()) {
            await this.event3();
        } else {
            await this.event5();
        }
        if (this.player.getLearningLevel() !== 2) {
            await this.event4();
        }
        this.summaryOfStudentStage();
        localStorage.setItem('player', JSON.stringify(this.player.toJSON()));
    }

    async event1() {
        return new Promise((resolve) => {
            this.currentEventIndex = 1;
            this.displayEvent(
                "活動1：選科\n你需要選擇你的高中課程方向",
                "//TBC",
                [
                    {
                        label: "文科",
                        action: async () => {
                            this.player.defineHighSchoolSubject("art");
                            await this.showTransition("你已選擇修讀文科");
                            resolve();
                        }
                    },
                    {
                        label: "理科",
                        action: async () => {
                            this.player.defineHighSchoolSubject("science");
                            await this.showTransition("你已選擇修讀理科");
                            resolve();
                        }
                    },
                    {
                        label: "職業訓練",
                        action: async () => {
                            this.player.defineHighSchoolSubject("vtc");
                            this.player.chooseVtc();
                            await this.showTransition("你已選擇修讀職業訓練");
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
                "活動2：日常生活\n你今天決定如何吃飯？",
                "//TBC",
                [
                    {
                        label: "屋企食",
                        action: async () => {
                            await this.showTransition("你今日屋企食");
                            resolve();
                        }
                    },
                    {
                        label: "自己煮",
                        action: async () => {
                            await this.showTransition("你今日自己煮飯食");
                            resolve();
                        }
                    },
                    {
                        label: "搵朋友食",
                        action: async () => {
                            this.player.addAchievement("終生好友");
                            await this.showTransition("你今日搵朋友食\n獲得成就 [終生好友]");
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
                "活動3：升讀大學\n你需要選擇你的大學主修科目",
                "//TBC",
                [
                    {
                        label: "工程",
                        validate: () => {
                            if (this.player.getHighSchoolSubject() !== "science") {
                                return {
                                    valid: false,
                                    message: "只有選修科為理科才能修讀工程\n你正在修讀非理科，請重新選擇"
                                };
                            }
                            return { valid: true, message: '' };
                        },
                        action: async () => {
                            this.player.addLearningLevel(2);
                            this.player.defineMajor("Engine");
                            await this.showTransition("你已修讀工程");
                            resolve();
                        }
                    },
                    {
                        label: "商科",
                        action: async () => {
                            this.player.addLearningLevel(2);
                            this.player.defineMajor("Bussine");
                            await this.showTransition("你已修讀商科");
                            resolve();
                        }
                    },
                    {
                        label: "藝術",
                        action: async () => {
                            this.player.addLearningLevel(2);
                            this.player.defineMajor("Art");
                            await this.showTransition("你已修讀藝術");
                            resolve();
                        }
                    }
                ]
            );
        });
    }

    async event5() {
        return new Promise((resolve) => {
            this.currentEventIndex = 5;
            this.displayEvent(
                "活動：學習生活\n在職業訓練中，你如何度過？",
                "//TBC",
                [
                    {
                        label: "玩樂",
                        action: async () => {
                            this.player.addLearningLevel(1);
                            await this.showTransition("由於你成績未如理想，無法升讀大學\n準備進入社會");
                            resolve();
                        }
                    },
                    {
                        label: "讀書",
                        action: async () => {
                            await this.showTransition("由於你在職業訓練中的努力\n你現在可以升讀大學了");
                            await this.event3();
                            resolve();
                        }
                    }
                ]
            );
        });
    }

    async event4() {
        return new Promise((resolve) => {
            this.currentEventIndex = 4;
            this.displayEvent(
                "活動4：大學生活\n你在大學期間如何度過？",
                "//TBC",
                [
                    {
                        label: "上莊",
                        action: async () => {
                            this.player.addAchievement("終生好友");
                            await this.showTransition("你選擇上莊\n獲得成就 [終生好友]");
                            resolve();
                        }
                    },
                    {
                        label: "Part-time",
                        action: async () => {
                            this.player.addMoneyLevel(1);
                            await this.showTransition("你選擇做Part-time\n你的財富已升級");
                            resolve();
                        }
                    },
                    {
                        label: "讀書",
                        action: async () => {
                            this.player.addAchievement("一級榮譽畢業");
                            await this.showTransition("你選擇專注讀書\n獲得成就 [一級榮譽畢業]");
                            resolve();
                        }
                    }
                ]
            );
        });
    }

    summaryOfStudentStage() {
        const summaryContent = `
第一階 - 學生時期已結束

在財富上：你已達 Level ${this.player.getMoneyLevel()}

在學歷上：
${this.player.getLearningLevel() === 2 ? "你已達大專" : "你已達學士"}

${this.player.getAchievement().size > 0 ? "你獲得的成就：" : ""}
${Array.from(this.player.getAchievement()).map(ach => `✓ ${ach}`).join("\n")}

你的生命過了 22 年，準備前往下一階段 - 成年時期
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
        const controlButtons = document.getElementById('control-buttons');
        
        summaryTitle.textContent = "學生時期總結";
        summaryContentDiv.textContent = summaryContent;
        
        this.summaryContainer.classList.add('show');
        
        controlButtons.innerHTML = '';
        const nextBtn = document.createElement('button');
        nextBtn.textContent = "前往成年時期";
        nextBtn.onclick = () => {
            window.location.href = 'adult.html';
        };
        controlButtons.appendChild(nextBtn);
    }
}