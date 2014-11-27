module.exports = {
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
	 * Add new jobs that need to be taken care of to the global job market. It'll then be
	 * picked up by creeps w/ the associated role.
	 */
	create: function(markets, strategy) {
		for (var mid in markets) {
			
			switch (mid) {
			    // Add reproduce events that are used to create new creeps.
			    case "reproduce":
    			    while (Object.keys(Game.creeps).length + markets.reproduce.length < strategy.population.desired) {
						markets.reproduce.push({
							jobName: "reproduce",
							params: {
								type: "miner"
							}
						});
	    		    }
	    		    break;
	    		// Add miner events, used to bolster resource collection.
	    		case "miner":
	    		    while (markets.miner.length < 5) {
	    		        markets.miner.push({
	    		            jobName: "harvest",
	    		        });
	    		    }
	    		    break;
	    		default:
	    		    break;
			}
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
	
	/**
	 * Pull the first job from the queue and return it. Eventually we should make sure that
	 * the creep is capable of doing the job.
	 */
	match: function(creep, market) {
		var numJobs = market.length;
		var i = 0;

        if (numJobs > 0) return market.shift();
        else return null;

/*
		return {
			assignedOn: 0,
			worker: creep,
			jobName: "harvest"
		}
*/
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
