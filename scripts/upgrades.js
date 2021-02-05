game.upgrades = {
  motivationalQuote1: {
    label: 'Motivational quote',
    desc: "I don't think it's going to help",
    effect: `Increase [${game.activities.get_out_of_bed.label}] base success rate by 1%.`,
    price: 5,
    motivationToUnlock: 0,
    value: 0.01,
    activity: 'get_out_of_bed',
    type: 'successRate',
  },
  motivationalQuote2: {
    label: 'Another motivational quote',
    desc: "It's not helping",
    effect: `Increase [${game.activities.get_out_of_bed.label}] base success rate by 2%`,
    price: 7,
    upgradesToUnlock: ['motivationalQuote1'],
    value: 0.02,
    activity: 'get_out_of_bed',
    type: 'successRate',
  },
  habitOutOfBed: {
    label: 'A reddit comment about habits',
    desc: "I'll try to implement a habit of getting out of bed. I hope I can stick to it...",
    effect: `Unlock [${game.activities.get_out_of_bed.label}] habit.`,
    price: 50,
    motivationToUnlock: 12,
  },
  motivationalQuote3: {
    label: 'A third motivational quote',
    desc: "Why bother? these things don't help",
    effect: `Increase [${game.activities.get_out_of_bed.label}] base success rate by 2%.`,
    price: 20,
    upgradesToUnlock: ['motivationalQuote2'],
    value: 0.02,
    activity: 'get_out_of_bed',
    type: 'successRate',
  },
  motivationalQuote4: {
    label: 'A forth motivational quote',
    desc: 'What did I do to deserve being so unhappy?',
    effect: `Increase [${game.activities.get_out_of_bed.label}] base success rate by 2%.`,
    price: 30,
    upgradesToUnlock: ['motivationalQuote3'],
    value: 0.02,
    activity: 'get_out_of_bed',
    type: 'successRate',
  },
  motivationalQuote5: {
    label: 'A fifth motivational quote',
    desc: "These motivational quotes are useless, I'm gonna take a break",
    effect: `Increase [${game.activities.get_out_of_bed.label}] base success rate by 7%.`,
    price: 45,
    upgradesToUnlock: ['motivationalQuote4'],
    value: 0.07,
    activity: 'get_out_of_bed',
    type: 'successRate',
  },
  motivationalQuote6: {
    label: 'A decent motivational quote',
    desc: "I'm too tired to look for motivational quotes...",
    effect: `Increase [${game.activities.get_out_of_bed.label}] base success rate by 5%`,
    price: 100,
    upgradesToUnlock: ['motivationalQuote5'],
    value: 0.05,
    activity: 'get_out_of_bed',
    type: 'successRate',
  },
  declutter: {
    label: 'Anti trash',
    desc: "My room is full of trash, maybe if I clean up a bit I'll feel better...",
    effect: `Increase [${game.activities.get_out_of_bed.label}] reward by 5%. Also improves UI.`,
    price: 300,
    motivationToUnlock: 12,
    value: 0.05,
    activity: 'get_out_of_bed',
    type: 'successRate',
  },
  make_breakfast: {
    label: "It's time for breakfast",
    desc: 'With the habit of making my own bed every morning, I feel I can conquer a new challenge - making breakfast!',
    effect: `Unlocks [${game.activities.make_breakfast.label}] activity.`,
    price: 100,
    upgradesToUnlock: ['habitOutOfBed'],
  },
};

const renderUpgrade = (upgrade, upgradeName) => `
      <div id='buyUpgradeDiv${upgradeName}'>
        <h5>${upgrade.label}</h5>
        <h6>${upgrade.desc}</h6>
        <p>${upgrade.effect}</p>
        <p>Cost: ${upgrade.price} Motivation</p>
        <button id="buy${upgradeName}" onclick="buyUpgrade('${upgradeName}')">Get motivational boost</button>
      </div>
      `;

const canUnlockUpgrade = (upgrade) => {
  const requiredUpgrades = upgrade.upgradesToUnlock || [];
  const requiredMotivation = upgrade.motivationToUnlock || 0;
  return game.motivation >= requiredMotivation && requiredUpgrades.every((u) => game.upgrades[u].bought);
};
const updateUpgrades = () => {
  const div = document.getElementById('upgrades');
  Object.keys(game.upgrades).forEach((upgradeName) => {
    const upgrade = game.upgrades[upgradeName];
    if (!upgrade.unlocked && canUnlockUpgrade(upgrade)) {
      upgrade.unlocked = true;
    }
    if (upgrade.unlocked && !upgrade.bought && !upgrade.rendered) {
      upgrade.rendered = true;
      div.innerHTML += renderUpgrade(upgrade, upgradeName);
    }

    if (upgrade.unlocked && !upgrade.bought) {
      document.getElementById(`buy${upgradeName}`).disabled = !canBuyUpgrade(upgradeName);
    }
  });
};

const canBuyUpgrade = (upgradeName) => !game.upgrades[upgradeName].bought
  && game.motivation >= game.upgrades[upgradeName].price;

// eslint-disable-next-line no-unused-vars
const buyUpgrade = (upgradeName) => {
  if (canBuyUpgrade(upgradeName)) {
    game.motivation -= game.upgrades[upgradeName].price;
    game.upgrades[upgradeName].bought = true;
    document.getElementById(`buyUpgradeDiv${upgradeName}`).style = 'display: none';
  }
};
