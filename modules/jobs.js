module.exports = {
	MINER: 1,
	
	employ: function(creeps, strategy) {
		// Assign a role to each creep.
		for (var i in creeps) {
			// Initialize.
			if (creeps[i].memory.jobsCompleted === undefined) {
				creeps[i].memory.jobsCompleted = 0;
				creeps[i].memory.currentJob = null;
			}
			
			creeps[i].memory.role = this.Miner().type;
		}
	},
	
	/**
	 * Function called in the main loop that gets a creep to perform their
	 * assigned job.
	 */
	work: function(creep) {
		switch(creep.memory.currentJob) {
			// Get energy and return it to spawn points.
			case "harvest":
				harvest(creep);
				break;
			case null:
				console.log(creep.name + " is idle.");
				break;
			default:
				console.log(creep.name + " is idle.");
				break;
		}
	},
	
	match: function(creep, market) {
		return {
			assignedOn: 0,
			worker: creep,
			jobName: "harvest"
		}
	},
	
	Miner: function() {
		return {
			/**
			 * The type of the creep. This is used for conditions everywhere
			 * and shouldn't be changed for this job type.
			 */
			type: "miner",
		} // end return
	}
}

/**
 * Mark the current job as finished!
 */
function finishJob(creep) {
	creep.memory.currentJob = null;
	creep.memory.jobsCompleted++;

	console.log("Finished job!");
}


/****************************
 ****** Jobs functions ******
 ****************************/
function harvest(creep) {
	// Get a source and go to it.
	var source = creep.pos.findNearest(Game.SOURCES_ACTIVE);
	var spawn = creep.pos.findNearest(Game.MY_SPAWNS);
	var returning = false;
				
	if (source === null) return;

	// Fetch energy if the creep has less than their limit.
	if (creep.energy < creep.energyCapacity) {
		// TODO: don't drain a source entirely, stop at X instead.
		if (creep.harvest(source) == Game.ERR_NOT_IN_RANGE) {
			creep.moveTo(source);
		}
	// If the creep is at capacity, return back to the nearest spawn point.
	} else {
		switch (creep.transferEnergy(spawn)) {
			case Game.ERR_NOT_IN_RANGE:
				creep.moveTo(spawn);
				break;
			case Game.OK:
				finishJob(creep);
				break;
		}
	}				
}
