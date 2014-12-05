var ROAD_THRESHOLD = 5;

module.exports = {	
	/**
	 * Add new jobs that need to be taken care of to the global job market. It'll then be
	 * picked up by creeps w/ the associated role. This function creates jobs for all
	 * roles, including reproduce jobs for spawners.
	 */
	create: function(markets, strategy) {
		for (var mid in markets) {
			switch (mid) {
			    // Add reproduce events that are used to create new creeps.
			    case "reproduce":
					for (var roleType in strategy.work) {
						// Count the number of creeps that have this role as well as
						// those who are already queued up.
						var roleCount = 0;
						for (var i in Game.creeps) {
							if (Game.creeps[i].memory.role == roleType) roleCount++;
						}
						for (var i in markets.reproduce) {
							if (markets.reproduce[i].params.type == roleType) roleCount++;
						}
						
						// If we should have more than we do, generate reproduction requests.
						while (roleCount < strategy.population.desired * strategy.work[roleType]) {
							markets.reproduce.push({
								jobName: "reproduce",
								params: {
									type: roleType
								}
							});
						}
						
						console.log("[Reproduction:" + roleType + \
							"] Current: " + roleCount + \
							", Desired: " + strategy.population.desired * strategy.work[roleType]);
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
	    		case "builder":
					// Look for places that need roads, and generate requests to build
					// them if you find any.
					for (var i = 0; i < Memory.moveTrail.length; i++) {
						var row = Memory.moveTrail[i];
						
						for (var j = 0; j < row.length; j++) {
							if (Memory[i][j] > ROAD_THRESHOLD) {
								// Create a job request to build a road.
								markets.builder.push({
									jobName: "build.road"
									params: {
										pos: {x: i, y: j}
									}
								};
							}
						}
						
						console.log("[Build.road] Road construction request @ (" + i + ", " + j + ")");
					}
					
					// TODO: Add more builder jobs.
					
					break;
	    		default:
					console.log("No job creation role for role type " + mid);
	    		    break;
			}
		}
	},
	
	/**
	 * Called in the main loop to get a creep to perform their assigned job.
	 * Note that this function does NOT do the assignment (match identifies
	 * an appropriate job for a given creep).
	 */
	work: function(creep) {
		switch(creep.memory.currentJob.jobName) {
			// Get energy and return it to spawn points.
			case "harvest":
				harvest(creep);
				break;
			case "build.road":
				buildRoad(creep);
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
	},
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

// TODO: finish this function and make sure it works.
function buildRoad(creep) {
	// var dest = 
	
	// If the player isn't at the right place, keep moving.
	if (creep.pos != dest) {
		creep.moveTo(dest);
	// If the player is at the right place but the road doesn't exist yet,
	// build it.
	} else if (creep.room.lookAt(dest) {
		
	// Otherwise, the road already exists so the work is complete!
	} else {
		finishJob(creep);
	}
}
