class AdultStage {
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

    async startAdultStage() {
        this.currentEventIndex = 0;
        await this.event1();
        await this.event2();
        await this.event3();
        await this.event4();
        await this.event5();
        await this.event6();
        this.summaryOfAdultStage();
        localStorage.setItem('player', JSON.stringify(this.player.toJSON()));
    }

    async event1() {
        return new Promise((resolve) => {
            this.currentEventIndex = 1;
            this.displayEvent(
                "活動1：求職\n選擇你的工作方向",
                "//TBC",
                [
                    {
                        label: "工程公司",
                        validate: () => {
                            if (this.player.getMajor() !== "Engine") {
                                return {
                                    valid: false,
                                    message: "公司要求畢業生大學主修為工程\n你的主修不符合要求，請重新選擇"
                                };
                            }
                            return { valid: true, message: '' };
                        },
                        action: async () => {
                            this.player.addMoneyLevel(2);
                            this.player.addJob("Engine");
                            await this.showTransition("你已就職工程公司");
                            resolve();
                        }
                    },
                    {
                        label: "投資銀行",
                        validate: () => {
                            if (!this.player.getAchievement().has("一級榮譽畢業")) {
                                return {
                                    valid: false,
                                    message: "公司要求畢業生需有優異成績\n你未達到要求，請重新選擇"
                                };
                            }
                            return { valid: true, message: '' };
                        },
                        action: async () => {
                            this.player.addMoneyLevel(3);
                            this.player.addJob("IB");
                            await this.showTransition("你已就職投資銀行");
                            resolve();
                        }
                    },
                    {
                        label: "文職",
                        action: async () => {
                            this.player.addMoneyLevel(1);
                            this.player.addJob("Normal");
                            await this.showTransition("你已就職文職");
                            resolve();
                        }
                    },
                    {
                        label: "藍領",
                        action: async () => {
                            this.player.addMoneyLevel(1);
                            this.player.addJob("BlueTie");
                            await this.showTransition("你已就職藍領");
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
                "活動2：日常生活\n你如何安排你的空閒時間？",
                "//TBC",
                [
                    {
                        label: "健身",
                        action: async () => {
                            this.player.addLifeLongInTotal(5);
                            await this.showTransition("你選擇健身\n你的健康已升級");
                            resolve();
                        }
                    },
                    {
                        label: "進修",
                        action: async () => {
                            this.player.addMoneyLevel(1);
                            this.player.addLearningLevel(1);
                            await this.showTransition("你選擇進修\n你的學歷與財富已升級");
                            resolve();
                        }
                    },
                    {
                        label: "旅行",
                        action: async () => {
                            this.player.addAchievement("環遊世界");
                            this.player.minusMoneyLevel(1);
                            await this.showTransition("你選擇旅行\n獲得成就 [環遊世界]\n你的財富已降級");
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
                "活動3：轉工\n你是否考慮改變你的職業？",
                "//TBC",
                [
                    {
                        label: "公務員",
                        validate: () => {
                            if (this.player.getLearningLevel() < 4) {
                                let requiredLevel = "學士";
                                let currentLevel = "大專";
                                if (this.player.getLearningLevel() === 3) {
                                    currentLevel = "學士";
                                    requiredLevel = "碩士";
                                }
                                return {
                                    valid: false,
                                    message: `公務員要求碩士學歷\n你目前為${currentLevel}學歷，未符合要求`
                                };
                            }
                            return { valid: true, message: '' };
                        },
                        action: async () => {
                            this.player.addMoneyLevel(2);
                            this.player.addAchievement("長期服務金");
                            this.player.addJob("Gov");
                            await this.showTransition("你已成為公務員\n獲得成就 [長期服務金]");
                            resolve();
                        }
                    },
                    {
                        label: "創業",
                        action: async () => {
                            if (Math.random() < 0.5) {
                                this.player.minusMoneyLevel(this.player.getMoneyLevel());
                                await this.showTransition("你選擇創業\n但不幸創業失敗\n你的財富已歸零");
                            } else {
                                this.player.addMoneyLevel(4);
                                await this.showTransition("你選擇創業\n創業成功！\n你的財富已升級");
                            }
                            this.player.addJob("OwnBus");
                            resolve();
                        }
                    },
                    {
                        label: "維持現況",
                        action: async () => {
                            await this.showTransition("你選擇維持現況");
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
                "活動4：置業\n你考慮購置房產嗎？",
                "//TBC",
                [
                    {
                        label: "私人樓宇",
                        validate: () => {
                            if (this.player.getMoneyLevel() < 5) {
                                return {
                                    valid: false,
                                    message: `你未有足夠的財富購買私人樓宇\n需要 Level 5，你目前為 Level ${this.player.getMoneyLevel()}`
                                };
                            }
                            return { valid: true, message: '' };
                        },
                        action: async () => {
                            this.player.addHousing("Private");
                            await this.showTransition("你已購入私人樓宇");
                            resolve();
                        }
                    },
                    {
                        label: "居屋",
                        validate: () => {
                            if (this.player.getMoneyLevel() < 2) {
                                return {
                                    valid: false,
                                    message: `你未有足夠的財富購買居屋\n需要 Level 2，你目前為 Level ${this.player.getMoneyLevel()}`
                                };
                            }
                            return { valid: true, message: '' };
                        },
                        action: async () => {
                            this.player.addHousing("Hos");
                            await this.showTransition("你已購入居屋");
                            resolve();
                        }
                    },
                    {
                        label: "不置業",
                        action: async () => {
                            this.player.addHousing("N");
                            await this.showTransition("你決定暫不置業");
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
                "活動5：日常生活\n你如何享受生活？",
                "//TBC",
                [
                    {
                        label: "中同聚會",
                        action: async () => {
                            this.player.addAchievement("終生好友");
                            await this.showTransition("你參加了中同聚會\n獲得成就 [終生好友]");
                            resolve();
                        }
                    },
                    {
                        label: "學習烘培",
                        action: async () => {
                            await this.showTransition("你學習了烘培\n充實了自己");
                            resolve();
                        }
                    },
                    {
                        label: "看演唱會",
                        action: async () => {
                            await this.showTransition("你去看了演唱會\n享受了美妙的時光");
                            resolve();
                        }
                    }
                ]
            );
        });
    }

    async event6() {
        return new Promise((resolve) => {
            this.currentEventIndex = 6;
            this.displayEvent(
                "活動6：組織家庭\n你如何規劃你的家庭？",
                "//TBC",
                [
                    {
                        label: "生兒育女",
                        validate: () => {
                            if (this.player.getMoneyLevel() < 2) {
                                return {
                                    valid: false,
                                    message: `你未有足夠的財富養育子女\n需要 Level 2，你目前為 Level ${this.player.getMoneyLevel()}`
                                };
                            }
                            return { valid: true, message: '' };
                        },
                        action: async () => {
                            this.player.addAchievement("天綸之樂");
                            this.player.minusMoneyLevel(2);
                            await this.showTransition("你選擇生兒育女\n獲得成就 [天綸之樂]\n你的財富已降級");
                            resolve();
                        }
                    },
                    {
                        label: "丁克",
                        action: async () => {
                            this.player.addAchievement("終生至愛");
                            await this.showTransition("你選擇丁克人生\n獲得成就 [終生至愛]");
                            resolve();
                        }
                    },
                    {
                        label: "單身",
                        action: async () => {
                            await this.showTransition("你選擇單身");
                            resolve();
                        }
                    }
                ]
            );
        });
    }

    summaryOfAdultStage() {
        const summaryContent = `
第二階 - 成年時期已結束

在財富上：你已達 Level ${this.player.getMoneyLevel()}

在學歷上：
${this.player.getLearningLevel() === 2 ? "你已達大專" : this.player.getLearningLevel() === 3 ? "你已達學士" : "你已達碩士"}

你從事的職業：
${Array.from(this.player.getJob()).map(job => {
    const jobMap = { "Engine": "工程師", "IB": "投資銀行", "Normal": "文職", "BlueTie": "藍領工人", "Gov": "公務員", "OwnBus": "創業" };
    return `✓ ${jobMap[job] || job}`;
}).join("\n")}

${this.player.getHousing() !== "N" ? `你的居所：${this.player.getHousing() === "Private" ? "私人屋苑" : "居屋"}` : ""}

${this.player.getAchievement().size > 0 ? "你獲得的成就：" : ""}
${Array.from(this.player.getAchievement()).map(ach => `✓ ${ach}`).join("\n")}

你的生命過了 40 年（共 62 年），準備前往下一階段 - 老年時期
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
        
        summaryTitle.textContent = "成年時期總結";
        summaryContentDiv.textContent = summaryContent;
        
        this.summaryContainer.classList.add('show');
        
        controlButtons.innerHTML = '';
        const nextBtn = document.createElement('button');
        nextBtn.textContent = "前往老年時期";
        nextBtn.onclick = () => {
            window.location.href = 'elderly.html';
        };
        controlButtons.appendChild(nextBtn);
    }
}