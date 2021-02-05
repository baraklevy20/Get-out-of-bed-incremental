game.activities = {
  get_out_of_bed: {
    label: 'Get out of bed',
    on: false,
    progress: 0,
    attempts: 0,
    progressToComplete: 50,
    baseSuccessRate: 0.4,
    reward: 8,
    loss: 1,
  },
  make_breakfast: {
    label: 'Make breakfast',
    on: false,
    progress: 0,
    progressToComplete: 200,
    baseSuccessRate: 0.5,
    upgradesToUnlock: ['make_breakfast'],
    reward: 5,
    loss: 1,
  },
  // todo add shower, talk to a friend
};

const renderActivity = (activityName, activity) => `
      <div>
      <label for="file">${activity.label}:</label>
      <progress id="${activityName}Progress" value="0" max="${activity.progressToComplete}"></progress>
      <button id="attempt${activityName}" onclick="attemptActivity('${activityName}')">Attempt</button>
      <span id="${activityName}Success"></span>
    </div>
      `;

const canUnlockActivity = (activity) => {
  const requiredUpgrades = activity.upgradesToUnlock || [];
  const requiredMotivation = activity.motivationToUnlock || 0;
  return game.motivation >= requiredMotivation && requiredUpgrades.every((u) => game.upgrades[u].bought);
};

const updateActivities = (diff) => {
  const activitiesDiv = document.getElementById('activities');

  Object.keys(game.activities).forEach((activityName) => {
    const activity = game.activities[activityName];
    if (!activity.rendered && canUnlockActivity(activity)) {
      activity.rendered = true;
      activitiesDiv.innerHTML += renderActivity(activityName, activity);
    }

    if (activity.on) {
      activity.progress += diff / 1000 * 10;
      game.motivation -= diff / 1000 * 0.1;

      if (activity.progress > activity.progressToComplete) {
        activity.progress = 0;
        activity.attempts += 1;
        changeActivityStatus(activityName, false);

        const successfulAttempt = Math.random() < getActivitySuccessRate(activityName);
        if (successfulAttempt) {
          document.getElementById(`${activityName}Success`).innerText = 'I finally made it..';
          game.motivation += activity.reward;
        } else {
          document.getElementById(`${activityName}Success`).innerText = 'I couldn\'t make it...';
          game.motivation -= activity.loss;
        }
      }
      document.getElementById(`${activityName}Progress`).value = activity.progress;
    }
  });
};

const getActivitySuccessRate = (activityName) => {
  if (game.activities[activityName].attempts === 1) {
    return 0;
  }

  let successRate = game.activities[activityName].baseSuccessRate;

  Object.values(game.upgrades).forEach((upgrade) => {
    if (upgrade.bought) {
      if (upgrade.type === 'successRate') {
        if (activityName === upgrade.activity) {
          successRate += upgrade.value;
        }
      }
    }
  });

  return successRate;
};

const changeActivityStatus = (activityName, status) => {
  game.activities[activityName].on = status;
  if (game.activities[activityName].on) {
    document.getElementById(`attempt${activityName}`).innerText = 'Stop trying';
  } else {
    document.getElementById(`attempt${activityName}`).innerText = 'Attempt';
  }
};

// eslint-disable-next-line no-unused-vars
const attemptActivity = (activityName) => {
  const activity = game.activities[activityName];
  changeActivityStatus(activityName, !activity.on);
};
