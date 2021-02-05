const habits = {
  habitOutOfBed: {
    label: 'Out of Bed',
    interval: 2000,
    ticks: 0,
    activityName: 'get_out_of_bed',
  },
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
        if (!activities[habit.activityName].on) {
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
