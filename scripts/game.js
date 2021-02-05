let lastUpdate;
// eslint-disable-next-line prefer-const
let motivation = 100;

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

const init = () => {
  setInterval(gameLoop, 200);
  switchTab('activities');
};

$(document).ready(init);
