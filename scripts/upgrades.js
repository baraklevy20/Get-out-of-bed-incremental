const upgrades = {
  motivationalQuote: {
    label: 'Motivational quote',
    desc: 'I don\'t think it\'s going to help',
    effect: `Increase [${activities.get_out_of_bed.label}] base success rate by 1%.`,
    price: 5,
    motivationToUnlock: 10,
    value: 0.01,
    activity: 'get_out_of_bed',
    type: 'successRate',
  },
  motivationalQuote1: {
    label: 'Another motivational quote',
    desc: "It's not helping",
    effect: `Increase [${activities.get_out_of_bed.label}] base success rate by 2%`,
    price: 7,
    motivationToUnlock: 12,
    value: 0.02,
    activity: 'get_out_of_bed',
    type: 'successRate',
  },
  habitOutOfBed: {
    label: 'A reddit comment about habits',
    desc: "I'll try to implement a habit of getting out of bed. I hope I can stick to it...",
    effect: `Unlock [${activities.get_out_of_bed.label}] habit.`,
    price: 15,
    motivationToUnlock: 17,
  },
  motivationalQuote2: {
    label: 'A third motivational quote',
    desc: "These motivational quotes are useless, I'm gonna take a break",
    effect: `Increase [${activities.get_out_of_bed.label}] base success rate by 2%.`,
    price: 20,
    motivationToUnlock: 20,
    value: 0.02,
    activity: 'get_out_of_bed',
    type: 'successRate',
  },
  motivationalQuote3: {
    label: 'A decent motivational quote',
    desc: "I'm too tired to look for motivational quotes...",
    effect: `Increase [${activities.get_out_of_bed.label}] base success rate by 5%`,
    price: 100,
    motivationToUnlock: 75,
    value: 0.05,
    activity: 'get_out_of_bed',
    type: 'successRate',
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

const updateUpgrades = () => {
  const div = document.getElementById('upgrades');
  Object.keys(upgrades).forEach((upgradeName) => {
    const upgrade = upgrades[upgradeName];
    if (!upgrade.unlocked && motivation >= upgrade.motivationToUnlock) {
      upgrade.unlocked = true;
      div.innerHTML += renderUpgrade(upgrade, upgradeName);
    }

    if (upgrade.unlocked) {
      document.getElementById(`buy${upgradeName}`).disabled = !canBuyUpgrade(upgradeName);
    }
  });
};

const canBuyUpgrade = (upgradeName) => !upgrades[upgradeName].bought
  && motivation >= upgrades[upgradeName].price;

// eslint-disable-next-line no-unused-vars
const buyUpgrade = (upgradeName) => {
  if (canBuyUpgrade(upgradeName)) {
    motivation -= upgrades[upgradeName].price;
    upgrades[upgradeName].bought = true;
    document.getElementById(`buyUpgradeDiv${upgradeName}`).style = 'display: none';
  }
};
