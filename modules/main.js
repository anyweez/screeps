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
	}
}

var jobs = require('jobs');
var strategy = require('strategy');

init();
Memory.tickCounter++;

if (Memory.tickCounter == 1) {
	var creep_id = Math.round(Math.random() * 10000);
	Game.spawns.Spawn1.createCreep([Game.WORK, Game.MOVE, Game.CARRY], "Creep-" + creep_id);
}

// TODO: job market
var market = {
	miner: [],
	reproduce: [],
}

// Select the civilization-wide strategy that'll govern what roles everyone
// has and what tasks they pick up.
var strat = strategy.select();
jobs.create(market, strat);

// Assign jobs to all of the creeps by setting their 'role' field in memory.
jobs.employ(Game.creeps, strat);

// All creeps perform their jobs.
for (var i in Game.creeps) {
	var creep = Game.creeps[i];
	
	if (creep.memory.role !== null) {	
		// If the creep is unemployed, find a new job that needs to be done.
		if (creep.memory.currentJob === null) {
			var job = jobs.match(creep, market[creep.memory.role]);
			console.log("New job: " + job.jobName + "; " + market[creep.memory.role].length + " jobs left for this role.");
			creep.memory.currentJob = job.jobName;			
		}
		
		// Work the job. It's possible that the creep still won't have a
		// job to do (none available at the marketplace), in which case
		// we should skip.
		if (creep.memory.currentJob !== null) {
			jobs.work(creep);
		}		
	}
}

// Reproduction.
for (var i in Game.spawns) {
	var spawn = Game.spawns[i];
	
	if (market.reproduce.length > 0) {
		var job = market.reproduce.shift();

		// Create a creep of the specified type. Note that there's probably
		// a more elegant way to implement this, simliar to what is done
		// above. This is a POC.
		if (job.params.type == "miner") {
			var creep_id = Math.round(Math.random() * 10000);
			spawn.createCreep([Game.WORK, Game.MOVE, Game.CARRY], "Creep-" + creep_id);
		} else {
			console.log("invalid reproduce task: create " + job.params.type);
		}
	}
}
