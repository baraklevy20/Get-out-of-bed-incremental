let game = {};
// eslint-disable-next-line prefer-const
game.motivation = 1000;

// eslint-disable-next-line prefer-const
game.style = 0;

const tabs = {
  activities: {
    unlockCondition: () => true,
  },
  upgrades: {
    unlockCondition: () => true,
  },
  habits: {
    unlockCondition: () => game.upgrades.habitOutOfBed.bought,
  },
};

const updateStyles = () => {
  if (game.style < 1 && game.upgrades.declutter.bought) {
    game.style = 1;
    switchTab('upgrades');
  }
};

const update = (diff) => {
  updateTabs();
  updateActivities(diff);
  updateUpgrades();
  updateHabits(diff);
  updateStyles();

  if (game.motivation <= 0) {
    console.log("You can't take it anymore. Restart?");
  }

  document.getElementById('motivation').innerText = Math.round(game.motivation * 100) / 100;
};

const gameLoop = () => {
  const thisUpdate = new Date().getTime();
  const diff = game.lastUpdate ? thisUpdate - game.lastUpdate : 0;
  update(diff * 1);
  game.lastUpdate = thisUpdate;
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
  if (game.style === 1) {
    const style0Elements = document.getElementsByClassName('style0');
    for (const e of style0Elements) {
      e.style = 'display: none';
    }
  } else if (game.style === 0) {
    const style1Elements = document.getElementsByClassName('style1');
    for (const e of style1Elements) {
      e.style = 'display: none';
    }
  }

  // Unlock buttons
  Object.keys(tabs).forEach((tabName) => {
    if (tabs[tabName].unlockCondition()) {
      tabs[tabName].unlocked = true;
      document.getElementById(`${tabName}Button${game.style}`).style = 'display: block';

      if (game.style === 0) {
        document.getElementById(`${tabName}`).style = 'display: block';
      }
    }
  });
};

const saveGame = () => {
  localStorage.setItem('gameSave', JSON.stringify(game));
};

const loadGame = () => {
  const save = localStorage.getItem('gameSave');

  if (save) {
    game = JSON.parse(save);
    Object.values(game.activities).forEach((activity) => {
      activity.rendered = false;
    });
    Object.values(game.upgrades).forEach((upgrade) => {
      upgrade.rendered = false;
    });
    Object.values(game.habits).forEach((habit) => {
      habit.rendered = false;
    });
  }
};

const init = () => {
  loadGame();
  setInterval(gameLoop, 200);
  // setInterval(saveGame, 30000);

  if (game.style === 1) {
    switchTab('activities');
  }
};

$(document).ready(init);
