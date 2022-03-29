addLayer("1", {
    name: "Main Tab",
    symbol: "M",
    position: 0,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        best: new Decimal(0),
        clickValue: new Decimal(1),
        clickValueBest: new Decimal(1),
        clickValueBestT: new Decimal(1),
        clickTotalValue: new Decimal(0),
        clickTotalValueBest: new Decimal(0),
        clickTotalValueBestT: new Decimal(0),
        clickTotalValueTotal: new Decimal(0),
        clickTotalValueTotalT: new Decimal(0),
        clickTimes: new Decimal(0),
        clickTimesBest: new Decimal(0),
        clickTimesBestT: new Decimal(0),
        clickTimesTotal: new Decimal(0),
        clickTimesTotalT: new Decimal(0),
        gemMult: new Decimal(1),
    }},
    color: "#CCCCCC",
    requires: new Decimal(2500),
    resource: "gems",
    baseResource: "coins",
    baseAmount() {return player.points},
    type: "normal",
    exponent: 0.5,
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 0,
    effectDescription() {return "which effect is increasing all production by " + player['1'].gemMult + "% each, for a total of " + (format(1 + (player['1'].points) * player['1'].gemMult * 0.01)) + 'x'},
    hotkeys: [
        {key: "a", description: "A: Abdicate for gems", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    tooltip() {return "Main Tab"},
    doReset(resettingLayer) {
        let keep = ["clickValueBestT", "clickTotalValueBestT", "clickTotalValueTotalT", "clickTimesBestT", "clickTimesTotalT"];
        if (resettingLayer == '1') keep.push("points", "best", "clickValueBest", "clickTotalValueBest", "clickTotalValueTotal", "clickTimesBest", "clickTimesTotal");
        layerDataReset('1', keep);
    },
    update() {
        let pointGain = getPointGen();
        let FCchance = new Decimal(2.5);
        // click value
        player['1'].clickValue = new Decimal((new Decimal(getBuyableAmount('1', 11) * 0.1)).add(getBuyableAmount('1', 13)).add(1));
        // best coins
        if (player.points.gt(player.best)) player.best = player.points;
	    if (player.points.gt(player.bestR)) player.bestR = player.points;
	    if (player.points.gt(player.bestT)) player.bestT = player.points;
	    // total coins
        player.total = new Decimal(player.total.add(pointGain));
	    player.totalR = new Decimal(player.totalR.add(pointGain));
	    player.totalT = new Decimal(player.totalT.add(pointGain));
        // FC chance
        // upgrades that improve FC chance will be added here
        player.FCchance = new Decimal(FCchance);
        // FC bests
        if (player.FCchance.gt(player.FCchancebest)) player.FCchancebest = player.FCchance;
        if (player.FCchance.gt(player.FCchancebestT)) player.FCchancebestT = player.FCchance;
        if (player._FC.gt(player.FCbest)) player.FCbest = player._FC;
        if (player._FC.gt(player.FCbestR)) player.FCbestR = player._FC;
        if (player._FC.gt(player.FCbestT)) player.FCbestT = player._FC;
    },
    tabFormat: {
        "Things Tab": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                ["display-text",
                    function() { return 'Your faction coin find chance is ' + format(player.FCchance) + '%'},
                    {}],
                "blank",
                ["row", [
                    ["display-text",
                        function() { return 'You have ' + formatWhole(player.fairyCoins) + ' fairy coins<br>You have ' + formatWhole(player.elfCoins) + ' elf coins<br>You have ' + formatWhole(player.angelCoins) + ' angel coins'},
                        {}],
                    ["blank", ["17px", "17px"]],
                    "clickables",
                    ["blank", ["17px", "17px"]],
                    ["display-text",
                        function() { return 'You have ' + formatWhole(player.goblinCoins) + ' goblin coins<br>You have ' + formatWhole(player.undeadCoins) + ' undead coins<br>You have ' + formatWhole(player.demonCoins) + ' demon coins'},
                        {}]
                ]],
                "blank",
                "buyables",
            ],
        },
        "Faction Tab": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                ["display-text",
                    function() { return 'Your faction coin find chance is ' + format(player.FCchance) + '%'},
                    {}],
                "blank",
                ["row", [
                    ["display-text",
                        function() { return 'You have ' + formatWhole(player.fairyCoins) + ' fairy coins<br>You have ' + formatWhole(player.elfCoins) + ' elf coins<br>You have ' + formatWhole(player.angelCoins) + ' angel coins'},
                        {}],
                    ["blank", ["17px", "17px"]],
                    "clickables",
                    ["blank", ["17px", "17px"]],
                    ["display-text",
                        function() { return 'You have ' + formatWhole(player.goblinCoins) + ' goblin coins<br>You have ' + formatWhole(player.undeadCoins) + ' undead coins<br>You have ' + formatWhole(player.demonCoins) + ' demon coins'},
                        {}]
                ]],
                "blank",
                ["display-text",
                    function() { if (hasUpgrade('1', 11) == false && hasUpgrade('1', 21) == false) return '<h2>First, choose a side' },
                    {}],
                ["display-text",
                    function() { if (hasUpgrade('1', 11) == true || hasUpgrade('1', 21) == true) return '<h2>Next, choose a faction' },
                    {}],
                "blank",
                ["row", [["upgrades", [1]], ["blank", ["17px", "17px"]], ["upgrades", [2]]]],
                ["row", [["upgrades", [3]], ["blank", ["17px", "17px"]], ["upgrades", [4]], ["blank", ["17px", "17px"]], ["upgrades", [5]]]],
                ["row", [["upgrades", [6]], ["blank", ["17px", "17px"]], ["upgrades", [7]], ["blank", ["17px", "17px"]], ["upgrades", [8]]]],
            ],
        },
    },
    clickables: {
        11: {
            title: "Click Button",
            display() {return "\nyour clicks are worth " + format(player['1'].clickValue) + " coins"},
            canClick() {return true},
            onClick() {
                // faction coin initialization
                let factionCoinGainType = randint(0, 6);
                let factionCoinsFound = new Decimal(0);
                // faction coins gained calculation
                if (player.FCchance.gte(new Decimal(100))) factionCoinsFound = player.FCchance.div(100).floor();
                else if (player.FCchance.div(100).gte(new Decimal(Math.random()))) factionCoinsFound = new Decimal(1);
                // earning the faction coins
                if (factionCoinGainType == 0) player.fairyCoins = player.fairyCoins.add(factionCoinsFound);
                else if (factionCoinGainType == 1) player.elfCoins = player.elfCoins.add(factionCoinsFound);
                else if (factionCoinGainType == 2) player.angelCoins = player.angelCoins.add(factionCoinsFound);
                else if (factionCoinGainType == 3) player.goblinCoins = player.goblinCoins.add(factionCoinsFound);
                else if (factionCoinGainType == 4) player.undeadCoins = player.undeadCoins.add(factionCoinsFound);
                else if (factionCoinGainType == 5) player.demonCoins = player.demonCoins.add(factionCoinsFound);
                player._FC = player._FC.add(factionCoinsFound);
                // faction coin totals
                player.FCtotal = player.FCtotal.add(factionCoinsFound);
                player.FCtotalR = player.FCtotalR.add(factionCoinsFound);
                player.FCtotalT = player.FCtotalT.add(factionCoinsFound);
                // times clicked
                player['1'].clickTimes = player['1'].clickTimes.add(1);
                // best times clicked
                if (player['1'].clickTimes.gt(player['1'].clickTimesBest)) player['1'].clickTimesBest = player['1'].clickTimes;
                if (player['1'].clickTimes.gt(player['1'].clickTimesBestT)) player['1'].clickTimesBestT = player['1'].clickTimes;
                // total times clicked
                player['1'].clickTimesTotal = player['1'].clickTimesTotal.add(1);
                player['1'].clickTimesTotalT = player['1'].clickTimesTotalT.add(1);
                // coins gained
                player.points = player.points.add(player['1'].clickValue);
                // total coins gained
                player['1'].clickTotalValue = player['1'].clickTotalValue.add(player['1'].clickValue);
                player.total = player.total.add(player['1'].clickValue);
	            player.totalR = player.totalR.add(player['1'].clickValue);
	            player.totalT = player.totalT.add(player['1'].clickValue);
                // best click value
                if (player['1'].clickValue.gt(player['1'].clickValueBest)) player['1'].clickValueBest = player['1'].clickValue;
                if (player['1'].clickValue.gt(player['1'].clickValueBestT)) player['1'].clickValueBestT = player['1'].clickValue;
                // best total click value
                if (player['1'].clickTotalValue.gt(player['1'].clickTotalValueBest)) player['1'].clickTotalValueBest = player['1'].clickTotalValue;
                if (player['1'].clickTotalValue.gt(player['1'].clickTotalValueBestT)) player['1'].clickTotalValueBestT = player['1'].clickTotalValue;
	            // total coins gained (this R and all time)
                player['1'].clickTotalValueTotal = player['1'].clickTotalValueTotal.add(player['1'].clickValue);
                player['1'].clickTotalValueTotalT = player['1'].clickTotalValueTotalT.add(player['1'].clickValue);
            },
        },
    },
    buyables: {
        11: {
            title: "Dirt",
            cost() { return new Decimal(Math.pow(getBuyableAmount('1', this.id).add(1), 1.5)) },
            display() {
                if (this.cost() == new Decimal(1)) return "\nCost: 1 coin\n\nAmount: " + getBuyableAmount('1', this.id) + "\n\nEffect: +0.1 to click production\n\nTotal Effect: +" + format(getBuyableAmount('1', this.id) * 0.1);
                else return "\nCost: " + format(this.cost()) + " coins\n\nAmount: " + getBuyableAmount('1', this.id) + "\n\nEffect: +0.1 to click production\n\nTotal Effect: +" + format(getBuyableAmount('1', this.id) * 0.1);
            },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.sub(this.cost())
                setBuyableAmount('1', this.id, getBuyableAmount('1', this.id).add(1))
            },
            style: {'width':'180px', 'height':'180px'},
        },
        12: {
            title: "Rocks",
            cost() { return new Decimal(Math.pow(getBuyableAmount('1', this.id).add(1), 1.5) * 100) },
            display() { return "\nCost: " + format(this.cost()) + " coins\n\nAmount: " + getBuyableAmount('1', this.id) + "\n\nEffect: +0.2 to passive production\n\nTotal Effect: +" + format(getBuyableAmount('1', this.id) * 0.2)},
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.sub(this.cost())
                setBuyableAmount('1', this.id, getBuyableAmount('1', this.id).add(1))
            },
            style: {'width':'180px', 'height':'180px'},
        },
        13: {
            title: "Grass",
            cost() { return new Decimal(Math.pow(getBuyableAmount('1', this.id).add(1), 1.5) * 10000) },
            display() { return "\nCost: " + format(this.cost()) + " coins\n\nAmount: " + getBuyableAmount('1', this.id) + "\n\nEffect: +1 to click production and passive production\n\nTotal Effect: +" + getBuyableAmount('1', this.id)},
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.sub(this.cost())
                setBuyableAmount('1', this.id, getBuyableAmount('1', this.id).add(1))
            },
            style: {'width':'180px', 'height':'180px'},
        },
    },
    upgrades: {
        11: {
            fullDisplay() { return '<h3>Proof of Good Deed</h3><br>ally yourself with the side of good, which focuses on active production<br><br>Cost: 250 coins'},
            canAfford() {
                if (player.points.gte(new Decimal(250))) return true;
                else return false
            },
            pay() {
                player.points = player.points.sub(new Decimal(250))
            },
            style: {'color':'#0000FF'},
            unlocked() { if (hasUpgrade('1', 11) == false && hasUpgrade('1', 21) == false) return true },
        },
        21: {
            fullDisplay() { return '<h3>Proof of Evil Deed</h3><br>ally yourself with the side of evil, which focuses on passive production<br><br>Cost: 250 coins'},
            canAfford() {
                if (player.points.gte(new Decimal(250))) return true;
                else return false
            },
            pay() {
                player.points = player.points.sub(new Decimal(250))
            },
            style: {'color':'#FF0000'},
            unlocked() { if (hasUpgrade('1', 11) == false && hasUpgrade('1', 21) == false) return true },
        },
        31: {
            fullDisplay() { return '<h3>Fairy Alliance</h3><br>ally yourself with the fairies, which focus on basic buildings<br><br>Cost: 10 fairy coins'},
            canAfford() {
                if (player.fairyCoins.gte(new Decimal(10))) return true;
                else return false
            },
            pay() {
                player.fairyCoins = player.fairyCoins.sub(new Decimal(10))
            },
            style: {'color':'#FF00FF'},
            unlocked() { if (hasUpgrade('1', 11) == true) return true },
        },
        41: {
            fullDisplay() { return '<h3>Elven Alliance</h3><br>ally yourself with the elves, which focus on click production<br><br>Cost: 10 elf coins'},
            canAfford() {
                if (player.elfCoins.gte(new Decimal(10))) return true;
                else return false
            },
            pay() {
                player.elfCoins = player.elfCoins.sub(new Decimal(10))
            },
            style: {'color':'#00FF00'},
            unlocked() { if (hasUpgrade('1', 11) == true) return true },
        },
        51: {
            fullDisplay() { return '<h3>Angel Alliance</h3><br>ally yourself with the angels, which focus on mana and spells<br><br>Cost: 10 angel coins'},
            canAfford() {
                if (player.angelCoins.gte(new Decimal(10))) return true;
                else return false
            },
            pay() {
                player.angelCoins = player.angelCoins.sub(new Decimal(10))
            },
            style: {'color':'#00FFFF'},
            unlocked() { if (hasUpgrade('1', 11) == true) return true },
        },
        61: {
            fullDisplay() { return '<h3>Goblin Alliance</h3><br>ally yourself with the goblins, which focus on faction coins<br><br>Cost: 10 goblin coins'},
            canAfford() {
                if (player.goblinCoins.gte(new Decimal(10))) return true;
                else return false
            },
            pay() {
                player.goblinCoins = player.goblinCoins.sub(new Decimal(10))
            },
            style: {'color':'#888800'},
            unlocked() { if (hasUpgrade('1', 21) == true) return true },
        },
        71: {
            fullDisplay() { return '<h3>Undead Alliance</h3><br>ally yourself with the undead, which focus purely on passive production<br><br>Cost: 10 undead coins'},
            canAfford() {
                if (player.undeadCoins.gte(new Decimal(10))) return true;
                else return false
            },
            pay() {
                player.undeadCoins = player.undeadCoins.sub(new Decimal(10))
            },
            style: {'color':'#8800FF'},
            unlocked() { if (hasUpgrade('1', 21) == true) return true },
        },
        81: {
            fullDisplay() { return '<h3>Demon Alliance</h3><br>ally yourself with the demons, which focus on non-basic buildings<br><br>Cost: 10 demon coins'},
            canAfford() {
                if (player.demonCoins.gte(new Decimal(10))) return true;
                else return false
            },
            pay() {
                player.demonCoins = player.demonCoins.sub(new Decimal(10))
            },
            style: {'color':'#880000'},
            unlocked() { if (hasUpgrade('1', 21) == true) return true },
        },
    },
});

addLayer("9", {
    name: "Stats",
    symbol: "S",
    position: 0,
    startData() { return {
        unlocked: true,
    }},
    color: "#55EE55",
    type: "none",
    row: 1,
    layerShown(){return true},
    tooltip() {return "Stats"},
    tabFormat: [
        ["display-text",
            function() { return '<h1>STATS' },
            {}],
        "blank",
        "h-line",
        "blank",
        ["display-text",
            function() { return '<h2>THIS GAME' },
            {}],
        "blank",
        "h-line",
        "blank",
        ["display-text",
            function() { return '<h3>CURRENCY' },
            {}],
        ["display-text",
            function() { return 'You have <b>' + format(player.points) + '</b> coins' },
            {}],
        ["display-text",
            function() { return 'You have <b>' + format(player.best) + '</b> best coins' },
            {}],
        ["display-text",
            function() { return 'You have <b>' + format(player.total) + '</b> total coins' },
            {}],
        ["display-text",
            function() { return 'You have <b>' + formatWhole(player['1'].points) + '</b> gems' },
            {}],
        "blank",
        ["display-text",
            function() { return '<h3>CLICKS' },
            {}],
        ["display-text",
            function() { return 'Your click production is <b>' + format(player['1'].clickValue)},
            {}],
        ["display-text",
            function() { return 'You have earned <b>' + format(player['1'].clickTotalValue) + '</b> coins from clicking' },
            {}],
        ["display-text",
            function() { return 'You have clicked <b>' + formatWhole(player['1'].clickTimes) + '</b> times' },
            {}],
        "blank",
        ["display-text",
            function() { return '<h3>FACTION COINS' },
            {}],
        ["display-text",
            function() { return 'You have <b>' + formatWhole(player._FC) + '</b> faction coins'},
            {}],
        ["display-text",
            function() { return 'You have <b>' + formatWhole(player.FCbest) + '</b> best faction coins'},
            {}],
        ["display-text",
            function() { return 'You have <b>' + formatWhole(player.FCtotal) + '</b> total faction coins'},
            {}],
        ["display-text",
            function() { return 'You have <b>' + format(player.FCchance) + '%</b> faction coin chance' },
            {}],
        "blank",
        "h-line",
        "blank",
        ["display-text",
            function() { return '<h2>THIS REINCARNATION' },
            {}],
        "blank",
        "h-line",
        "blank",
        ["display-text",
            function() { return '<h3>CURRENCY' },
            {}],
        ["display-text",
            function() { return 'You have <b>' + format(player.bestR) + '</b> best coins' },
            {}],
        ["display-text",
            function() { return 'You have <b>' + format(player.totalR) + '</b> total coins' },
            {}],
        ["display-text",
            function() { return 'You have <b>' + formatWhole(player['1'].best) + '</b> best gems' },
            {}],
        "blank",
        ["display-text",
            function() { return '<h3>CLICKS' },
            {}],
        ["display-text",
            function() { return 'Your best click production is <b>' + format(player['1'].clickValue)},
            {}],
        ["display-text",
            function() { return 'Your best earnings from clicking is <b>' + format(player['1'].clickTotalValueBest) + '</b> coins' },
            {}],
        ["display-text",
            function() { return 'You have earned <b>' + format(player['1'].clickTotalValueTotal) + '</b> total coins from clicking' },
            {}],
        ["display-text",
            function() { return 'Your best times clicked is <b>' + formatWhole(player['1'].clickTimesBest) + '</b> times' },
            {}],
        ["display-text",
            function() { return 'You have clicked <b>' + formatWhole(player['1'].clickTimesTotal) + '</b> times total' },
            {}],
        "blank",
        ["display-text",
            function() { return '<h3>FACTION COINS' },
            {}],
        ["display-text",
            function() { return 'You have <b>' + formatWhole(player.FCbestR) + '</b> best faction coins'},
            {}],
        ["display-text",
            function() { return 'You have <b>' + formatWhole(player.FCtotalR) + '</b> total faction coins'},
            {}],
        ["display-text",
            function() { return 'You have <b>' + format(player.FCchancebest) + '%</b> best faction coin chance' },
            {}],
        "blank",
        "h-line",
        "blank",
        ["display-text",
            function() { return '<h2>ALL TIME' },
            {}],
        "blank",
        "h-line",
        "blank",
        ["display-text",
            function() { return '<h3>CURRENCY' },
            {}],
        ["display-text",
            function() { return 'You have <b>' + format(player.bestT) + '</b> best coins' },
            {}],
        ["display-text",
            function() { return 'You have <b>' + format(player.totalT) + '</b> total coins' },
            {}],
        ["display-text",
            function() { return 'You have <b>' + formatWhole(player['1'].best) + '</b> best gems' },
            {}],
        "blank",
        ["display-text",
            function() { return '<h3>CLICKS' },
            {}],
        ["display-text",
            function() { return 'Your best click production is <b>' + format(player['1'].clickValueBestT)},
            {}],
        ["display-text",
            function() { return 'Your best earnings from clicking is <b>' + format(player['1'].clickTotalValueBestT) + '</b> coins' },
            {}],
        ["display-text",
            function() { return 'You have earned <b>' + format(player['1'].clickTotalValueTotalT) + '</b> total coins from clicking' },
            {}],
        ["display-text",
            function() { return 'Your best times clicked is <b>' + formatWhole(player['1'].clickTimesBestT) + '</b> times' },
            {}],
        ["display-text",
            function() { return 'You have clicked <b>' + formatWhole(player['1'].clickTimesTotalT) + '</b> times total' },
            {}],
        "blank",
        ["display-text",
            function() { return '<h3>FACTION COINS' },
            {}],
        ["display-text",
            function() { return 'You have <b>' + formatWhole(player.FCbestT) + '</b> best faction coins'},
            {}],
        ["display-text",
            function() { return 'You have <b>' + formatWhole(player.FCtotalT) + '</b> total faction coins'},
            {}],
        ["display-text",
            function() { return 'You have <b>' + format(player.FCchancebestT) + '%</b> best faction coin chance' },
            {}],
        "blank",
    ],
});
