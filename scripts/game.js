let lastUpdate;
let motivation = 100;

const activities = [
  {
    name: 'get_out_of_bed',
    label: 'Get out of bed',
    motivationNeeded: 0,
    on: false,
    progress: 0,
    progressToComplete: 50,
    baseSuccessRate: 0.5,
    reward: 3,
    loss: 1,
  },
  {
    name: 'make_breakfast',
    label: 'Make breakfast',
    motivationNeeded: 12,
    on: false,
    progress: 0,
    progressToComplete: 200,
    baseSuccessRate: 0.5,
    reward: 5,
    loss: 1,
  },
  // todo add shower, talk to a friend
];

const upgrades = {
  motivationalQuote: {
    label: 'Motivational quote',
    desc: 'I don\'t think it\'s going to help',
    effect: `Increase [${activities.find((a) => a.name === 'get_out_of_bed').label}] base success rate by 1%.`,
    price: 5,
    motivationToUnlock: 10,
    value: 0.01,
    activity: 'get_out_of_bed',
    type: 'successRate',
  },
  motivationalQuote1: {
    label: 'Another motivational quote',
    desc: "It's not helping",
    effect: `Increase [${activities.find((a) => a.name === 'get_out_of_bed').label}] base success rate by 2%`,
    price: 7,
    motivationToUnlock: 12,
    value: 0.02,
    activity: 'get_out_of_bed',
    type: 'successRate',
  },
  habitOutOfBed: {
    label: 'A reddit comment about habits',
    desc: "I'll try to implement a habit of getting out of bed. I hope I can stick to it...",
    effect: `Unlock [${activities.find((a) => a.name === 'get_out_of_bed').label}] habit.`,
    price: 15,
    motivationToUnlock: 17,
  },
  motivationalQuote2: {
    label: 'A third motivational quote',
    desc: "These motivational quotes are useless, I'm gonna take a break",
    effect: `Increase [${activities.find((a) => a.name === 'get_out_of_bed').label}] base success rate by 2%.`,
    price: 20,
    motivationToUnlock: 20,
    value: 0.02,
    activity: 'get_out_of_bed',
    type: 'successRate',
  },
  motivationalQuote3: {
    label: 'A decent motivational quote',
    desc: "I'm too tired to look for motivational quotes...",
    effect: `Increase [${activities.find((a) => a.name === 'get_out_of_bed').label}] base success rate by 5%`,
    price: 100,
    motivationToUnlock: 75,
    value: 0.05,
    activity: 'get_out_of_bed',
    type: 'successRate',
  },
  // interesting_recipe: {
  //   label: 'Interesting Recipe',
  //   effect: `Increase [${activities.find((a) => a.name === 'make_breakfast').label}] success rate by 2%`,
  //   price: 15,
  //   motivationToUnlock: 10,
  // },
};

const habits = {
  habitOutOfBed: {
    label: 'Out of Bed',
    interval: 2000,
    ticks: 0,
    activityName: 'get_out_of_bed',
  },
};

const tabs = {
  activities: {
    unlockCondition: () => true,
  },
  upgrades: {
    unlockCondition: () => motivation >= upgrades.motivationalQuote.motivationToUnlock,
  },
  habits: {
    unlockCondition: () => upgrades.habitOutOfBed.bought,
  },
};

const gameLoop = () => {
  const thisUpdate = new Date().getTime();
  const diff = lastUpdate ? thisUpdate - lastUpdate : 0;
  update(diff * 1);
  lastUpdate = thisUpdate;
};

// eslint-disable-next-line no-unused-vars
const switchTab = (tab) => {
  Object.keys(tabs).forEach((tabName) => {
    if (tabs[tabName].unlocked) {
      document.getElementById(tabName).style = 'display: none';
    }
  });
  document.getElementById(tab).style = 'display: block';
};

const updateTabs = () => {
  Object.keys(tabs).forEach((tabName) => {
    if (!tabs[tabName].unlocked && tabs[tabName].unlockCondition()) {
      tabs[tabName].unlocked = true;
      document.getElementById(`${tabName}Button`).style = 'display: block';
    }
  });
};

const update = (diff) => {
  updateTabs();
  updateActivities(diff);
  updateUpgrades();
  updateHabits(diff);

  if (motivation <= 0) {
    console.log("You can't take it anymore. Restart?");
  }

  document.getElementById('motivation').innerText = Math.round(motivation * 100) / 100;
};

const changeActivityStatus = (activity, status) => {
  activity.on = status;
  if (activity.on) {
    document.getElementById(`attempt${activity.name}`).innerText = 'Stop trying';
  } else {
    document.getElementById(`attempt${activity.name}`).innerText = 'Attempt';
  }
};

const getActivitySuccessRate = (activity) => {
  let successRate = activity.baseSuccessRate;

  Object.values(upgrades).forEach((upgrade) => {
    if (upgrade.bought) {
      if (upgrade.type === 'successRate') {
        if (activity.name === upgrade.activity) {
          successRate += upgrade.value;
        }
      }
    }
  });

  return successRate;
};

const updateActivities = (diff) => {
  const activitiesDiv = document.getElementById('activities');
  activities.forEach((activity) => {
    if (!activity.unlocked && motivation >= activity.motivationNeeded) {
      activity.unlocked = true;
      activitiesDiv.innerHTML += `
      <div>
      <label for="file">${activity.label}:</label>
      <progress id="${activity.name}Progress" value="0" max="${activity.progressToComplete}"></progress>
      <button id="attempt${activity.name}" onclick="attemptActivity('${activity.name}')">Attempt</button>
      <span id="${activity.name}Success"></span>
    </div>
      `;
    }

    if (activity.on) {
      activity.progress += diff / 1000 * 10;
      motivation -= diff / 1000 * 0.1;

      if (activity.progress > activity.progressToComplete) {
        activity.progress = 0;
        changeActivityStatus(activity, false);

        const successfulAttempt = Math.random() < getActivitySuccessRate(activity);
        if (successfulAttempt) {
          document.getElementById(`${activity.name}Success`).innerText = 'I finally made it..';
          motivation += activity.reward;
        } else {
          document.getElementById(`${activity.name}Success`).innerText = 'I couldn\'t make it...';
          motivation -= activity.loss;
        }
      }
      document.getElementById(`${activity.name}Progress`).value = activity.progress;
    }
  });
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

const renderHabit = (habit) => `
      <div>
        <h5>${habit.label}</h5>
        <h6>${habit.interval} ms</h6>
      </div>
      `;

const updateHabits = (diff) => {
  const div = document.getElementById('habits');
  Object.keys(habits).forEach((habitsName) => {
    const habit = habits[habitsName];

    if (upgrades[habitsName].bought) {
      habit.unlocked = true;
      habit.ticks += diff;

      if (habit.ticks >= habit.interval) {
        habit.ticks = 0;
        if (!activities.find((a) => a.name === habit.activityName).on) {
          attemptActivity(habit.activityName);
        }
      }
    }

    if (habit.unlocked && !habit.rendered) {
      habit.rendered = true;
      div.innerHTML += renderHabit(habit);
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

// eslint-disable-next-line no-unused-vars
const attemptActivity = (activityName) => {
  const activity = activities.find((a) => a.name === activityName);
  changeActivityStatus(activity, !activity.on);
};

const init = () => {
  setInterval(gameLoop, 200);
  switchTab('activities');
};

$(document).ready(init);
