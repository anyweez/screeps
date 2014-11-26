var jobs = require('jobs');
var strategy = require('strategy');

// TODO: job market
var market = {
	miner: []
}

// Select the civilization-wide strategy that'll govern what roles everyone
// has and what tasks they pick up.
var strat = strategy.select();

// Assign jobs to all of the creeps by setting their 'role' field in memory.
jobs.employ(Game.creeps, strat);

// All creeps perform their jobs.
for (var i in Game.creeps) {
	var creep = Game.creeps[i];
	
	// If the creep has a role but doesn't have a specific job, find 
	// them a new one.
	if (creep.memory.role !== null) {	
		// If the creep is unemployed, find a new job that needs to be
		// done.		
		if (!creep.memory.working) {
			console.log("Finding a " + creep.memory.role + " job for " + creep.name);
			var job = jobs.match(creep, market[creep.memory.role]);
			console.log("calling work");
			job.work();
			
			// Creep is now working.
			creep.memory.working = true;
			creep.memory.jobsCompleted += 1;
		}		
	}
}

// Create new creeps if we don't have enough to satisfy demand.
/*
if (Math.random() > .9) {
	var creep_id = Math.round(Math.random() * 10000);
	Game.spawns.Spawn1.createCreep([Game.WORK, Game.MOVE, Game.CARRY], "Creep-" + creep_id);
}
*/
