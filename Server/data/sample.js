const sample = {
    history: {
        0: {
            //time format: Mon May 18 2020 15:47:16
            // "Team 1": {
            //     point: 100,
            //     last_eaten_time: 0,
            //     time: new Date().toString().slice(0, 24),
            // },
            // "Team 2": {
            //     point: 50,
            //     last_eaten_time: 0,
            //     time: new Date().toString().slice(0, 24),
            // },
            // "Team 3": {
            //     point: 10,
            //     last_eaten_time: 0,
            //     time: new Date().toString().slice(0, 24),
            // },
        },
        1: {
            // Legacy game 2, 2020 version
        },
    },

    // Current game data
    current_team: null,
    time_remaining: GAME_TIME,
    status: {
        gamemode: null,
        //point of current team
        point: 0,
        current_sequence_index: 0,
        last_eaten_time: 0,
    },
    cur_game_countdown: null,
    visited: {},
};

module.exports = sample