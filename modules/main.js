// One tenth of a step should decay every turn.
var MOVETRAIL_DECAY = 0.1;

/**
 * Init is used to configure environmental properties that should be set
 * on the first run of the simulation. Unfortunately it has to be called
 * each run but its wrapped with a check that should only evaluate to
 * true on the first iteration.
 */
function init() {
	// Only run this the first tick.
	if (Memory.tickCounter === undefined) {
		Memory.tickCounter = 0;
		
		// Create a two-dimensional array called moveTrail that keeps
		// track of where everyone is moving 
		Memory.moveTrail = [];
		for (var i = 0; i < 10; i++) {
			var row = [];
			for (var j = 0; j < 8; j++) {
				row.push(0);
			}
			
			Memory.moveTrail.push(row);
		}
	}
}


console.log("test 2");

var jobs = require('jobs');
var strategy = require('strategy');



// Init will only actually execute on the first tick of the simulation.
init();
Memory.tickCounter++;

/**
 * The job market is where work requests are stored. These are assigned to
 * creeps of a given role (the keys in the market object). 
 */
var market = {
	miner: [],
	reproduce: [],
	builder: [],
};

// Select the civilization-wide strategy that'll govern what roles everyone
// has and what tasks they pick up.
var strat = strategy.select();

// Create new jobs for each of the roles depending on what society needs.
// Note that this function also creates reproduction requests ("jobs" for
// spawners), which takes the global strategy into account.
jobs.create(market, strat);

// All creeps perform their jobs.
for (var i in Game.creeps) {
	var creep = Game.creeps[i];

	// If the creep is unemployed, find a new job that needs to be done.
	if (creep.memory.currentJob === null) {
		var job = jobs.match(creep, market[creep.memory.role]);
		console.log("New job: " + job.jobName + "; " + market[creep.memory.role].length + " jobs left for " + creep.memory.role + "s.");
			
		creep.memory.currentJob = job;			
	}
		
	// Work the job. It's possible that the creep still won't have a
	// job to do (i.e. if none were available at the marketplace), in which 
	// case we should skip.
	if (creep.memory.currentJob !== null) {
		jobs.work(creep);
	}		
	
	// Increment the moveTrail counter for the creep's current location.
	if (Memory.moveTrail[creep.pos.x][creep.pos.y] >= 0) {
		Memory.moveTrail[creep.pos.x][creep.pos.y]++;
	}
}

// Reproduction tasks, to be handled by spawners.
for (var i in Game.spawns) {
	var spawn = Game.spawns[i];
	
	if (market.reproduce.length > 0) {
		var job = market.reproduce.shift();

		// Create a creep of the specified type. Note that there's probably
		// a more elegant way to implement this, simliar to what is done
		// above. This is a POC.
		var creep_id = Math.round(Math.random() * 10000);
		var success = null;
		
		switch (job.params.type) {
			case "miner":
				success = spawn.createCreep([Game.WORK, Game.MOVE, Game.CARRY], "Creep-" + creep_id, {
					role: "miner",
					jobsCompleted: 0,
					currentJob: null,
				});
				break;
			case "builder":
				success = spawn.createCreep([Game.WORK, Game.MOVE], "Creep-" + creep_id, {
					role: "builder",
					jobsCompleted: 0,
					currentJob: null,
				});
				break;
			default:
				console.log("invalid reproduce task: create " + job.params.type);
		}
		
		// If this spawn couldn't fulfill the reproduction request, add it back to the
		// queue and allow another spawn to take care of it (or for this one to take care
		// of it later).
		if (success !== 0) {
			market.reproduce.push(job);
		}
	}
}

/**
 *  Environmental things.
 */

// Decay the moveTrail counter.
for (var i = 0; i < Memory.moveTrail.length; i++) {
	var row = Memory.moveTrail[i];
	
	for (var j = 0; j < row.length; j++) {
		if (Memory.moveTrail[i][j] > 0) Memory.moveTrail[i][j] -= MOVETRAIL_DECAY;
	}
}
