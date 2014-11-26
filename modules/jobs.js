module.exports = {
	employ: function(creeps, strategy) {
		// Assign a role to each creep.
		for (var i in creeps) {
			creeps[i].memory.role = this.Miner().type;
			creeps[i].memory.working = false;
			
			if (creeps[i].memory.jobsCompleted === undefined) {
				creeps[i].memory.jobsCompleted = 0;
			}
		}
	},
	
	match: function(creep, market) {
		return {
			assignedOn: 0,
			worker: creep,
			work: function() {
				// Get a source and go to it.
				var source = this.worker.pos.findNearest(Game.SOURCES_ACTIVE);
				var spawn = this.worker.pos.findNearest(Game.MY_SPAWNS);
				var returning = false;
				
				// Return with the energy.
				if (this.worker.energy == this.worker.energyCapacity) {
					creep.moveTo(spawn);
					creep.transferEnergy(spawn);
					
					returning = true;	
				} else {
					// Don't harvest energy to extinction.
					if (source.energy > 50) {
						this.worker.moveTo(source);
						this.worker.harvest(source);
					}
				}
				
				if (returning && this.worker.energy == 0) {
					console.log("job complete");
					returning = false;
				}
			}
		}
	},
	
	Miner: function() {
		return {
			/**
			 * The type of the creep. This is used for conditions everywhere
			 * and shouldn't be changed for this job type.
			 */
			type: "miner",
			/**
			 * Retrieve another task for the screep to perform and 
			 * overwrite the one that they're working on now.
			 */
			nextTask: function() {
				this.currentTask = {
					assignedOn: 0,
					work: function() {
						console.log("Doing work");
					}
				}
			}
		} // end return
	}
}
