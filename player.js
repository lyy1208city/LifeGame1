class Player {
    constructor() {
        this.moneyLevel = 0;
        this.learningLevel = 1;
        this.lifeLongInTotal = 70;
        this.achievement = new Set();
        this.major = "";
        this.vtc = false;
        this.highSchoolSubject = "";
        this.job = new Set();
        this.housing = "";
    }

    getMoneyLevel() {
        return this.moneyLevel;
    }

    getLearningLevel() {
        return this.learningLevel;
    }

    getLifeLongInTotal() {
        return this.lifeLongInTotal;
    }

    getAchievement() {
        return this.achievement;
    }

    getMajor() {
        return this.major;
    }

    getHighSchoolSubject() {
        return this.highSchoolSubject;
    }

    getVtc() {
        return this.vtc;
    }

    getJob() {
        return this.job;
    }

    getHousing() {
        return this.housing;
    }

    addMoneyLevel(value) {
        this.moneyLevel += value;
    }

    minusMoneyLevel(value) {
        this.moneyLevel -= value;
    }

    addLearningLevel(value) {
        this.learningLevel += value;
    }

    addLifeLongInTotal(value) {
        this.lifeLongInTotal += value;
    }

    addAchievement(value) {
        this.achievement.add(value);
    }

    defineMajor(value) {
        this.major = value;
    }

    chooseVtc() {
        this.vtc = true;
    }

    defineHighSchoolSubject(value) {
        this.highSchoolSubject = value;
    }

    addJob(value) {
        this.job.add(value);
    }

    addHousing(value) {
        this.housing = value;
    }

    summary() {
        let summaryText = "";
        summaryText += "你活了" + this.lifeLongInTotal + "年\n";
        summaryText += "你最後財富達到了" + this.moneyLevel + "\n";
        if (this.learningLevel === 2) {
            summaryText += "你最後學歷達到了大專\n";
        } else if (this.learningLevel === 3) {
            summaryText += "你最後學歷達到了學士\n";
        } else {
            summaryText += "你最後學歷達到了碩士\n";
        }
        summaryText += "你從事了" + this.job.size + "個工作\n";
        if (this.job.size > 0) {
            for (let j of this.job) {
                let jobName = j;
                if (j === "Engine") jobName = "工程師";
                else if (j === "IB") jobName = "投資銀行";
                else if (j === "Normal") jobName = "文職";
                else if (j === "BlueTie") jobName = "藍領工人";
                else if (j === "Gov") jobName = "公務員";
                else if (j === "OwnBus") jobName = "創業";
                summaryText += "你曾經的職業包括[" + jobName + "]\n";
            }
        }
        if (this.housing !== "N") {
            if (this.housing === "Private") {
                summaryText += "你的居所是私人屋苑\n";
            } else {
                summaryText += "你的居所是居屋\n";
            }
        }
        summaryText += "你一生中獲得了 " + this.achievement.size + " 個成就\n";
        if (this.achievement.size > 0) {
            for (let ach of this.achievement) {
                summaryText += "你獲得成就 [" + ach + "]\n";
            }
        }
        return summaryText;
    }

    toJSON() {
        return {
            moneyLevel: this.moneyLevel,
            learningLevel: this.learningLevel,
            lifeLongInTotal: this.lifeLongInTotal,
            achievement: Array.from(this.achievement),
            major: this.major,
            vtc: this.vtc,
            highSchoolSubject: this.highSchoolSubject,
            job: Array.from(this.job),
            housing: this.housing
        };
    }

    static fromJSON(data) {
        let p = new Player();
        p.moneyLevel = data.moneyLevel;
        p.learningLevel = data.learningLevel;
        p.lifeLongInTotal = data.lifeLongInTotal;
        data.achievement.forEach(a => p.addAchievement(a));
        p.major = data.major;
        p.vtc = data.vtc;
        p.highSchoolSubject = data.highSchoolSubject;
        data.job.forEach(j => p.addJob(j));
        p.housing = data.housing;
        return p;
    }
}