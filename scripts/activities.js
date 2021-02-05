const activities = {
  get_out_of_bed: {
    label: 'Get out of bed',
    motivationNeeded: 0,
    on: false,
    progress: 0,
    attempts: 0,
    progressToComplete: 50,
    baseSuccessRate: 0.4,
    reward: 8,
    loss: 1,
  },
  // make_breakfast: {
  //   label: 'Make breakfast',
  //   motivationNeeded: 12,
  //   on: false,
  //   progress: 0,
  //   progressToComplete: 200,
  //   baseSuccessRate: 0.5,
  //   reward: 5,
  //   loss: 1,
  // },
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

const updateActivities = (diff) => {
  const activitiesDiv = document.getElementById('activities');

  Object.keys(activities).forEach((activityName) => {
    const activity = activities[activityName];
    if (!activity.unlocked && motivation >= activity.motivationNeeded) {
      activity.unlocked = true;
      activitiesDiv.innerHTML += renderActivity(activityName, activity);
    }

    if (activity.on) {
      activity.progress += diff / 1000 * 10;
      motivation -= diff / 1000 * 0.1;

      if (activity.progress > activity.progressToComplete) {
        activity.progress = 0;
        activity.attempts += 1;
        changeActivityStatus(activityName, false);

        const successfulAttempt = Math.random() < getActivitySuccessRate(activityName);
        if (successfulAttempt) {
          document.getElementById(`${activityName}Success`).innerText = 'I finally made it..';
          motivation += activity.reward;
        } else {
          document.getElementById(`${activityName}Success`).innerText = 'I couldn\'t make it...';
          motivation -= activity.loss;
        }
      }
      document.getElementById(`${activityName}Progress`).value = activity.progress;
    }
  });
};

const getActivitySuccessRate = (activityName) => {
  if (activities[activityName].attempts === 1) {
    return 0;
  }

  let successRate = activities[activityName].baseSuccessRate;

  Object.values(upgrades).forEach((upgrade) => {
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
  activities[activityName].on = status;
  if (activities[activityName].on) {
    document.getElementById(`attempt${activityName}`).innerText = 'Stop trying';
  } else {
    document.getElementById(`attempt${activityName}`).innerText = 'Attempt';
  }
};

// eslint-disable-next-line no-unused-vars
const attemptActivity = (activityName) => {
  const activity = activities[activityName];
  changeActivityStatus(activityName, !activity.on);
};
