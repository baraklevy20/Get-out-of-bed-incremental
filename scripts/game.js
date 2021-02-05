let lastUpdate;
// eslint-disable-next-line prefer-const
let motivation = 1000;

// eslint-disable-next-line prefer-const
let style = 0;

const tabs = {
  activities: {
    unlockCondition: () => true,
  },
  upgrades: {
    unlockCondition: () => true,
  },
  habits: {
    unlockCondition: () => upgrades.habitOutOfBed.bought,
  },
};

const updateStyles = () => {
  if (style < 1 && upgrades.declutter.bought) {
    style = 1;
    switchTab('activities');
  }
};

const update = (diff) => {
  updateTabs();
  updateActivities(diff);
  updateUpgrades();
  updateHabits(diff);
  updateStyles();

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
  // Hide previous styles
  // todo change it to everything other than the current style
  if (style === 1) {
    const style0Elements = document.getElementsByClassName('style0');
    for (const e of style0Elements) {
      e.style = 'display: none';
    }
  } else if (style === 0) {
    const style1Elements = document.getElementsByClassName('style1');
    for (const e of style1Elements) {
      e.style = 'display: none';
    }
  }

  // Unlock buttons
  Object.keys(tabs).forEach((tabName) => {
    if (tabs[tabName].unlockCondition()) {
      tabs[tabName].unlocked = true;
      document.getElementById(`${tabName}Button${style}`).style = 'display: block';
    }
  });
};

const init = () => {
  setInterval(gameLoop, 200);

  if (style === 1) {
    switchTab('activities');
  }
};

$(document).ready(init);
