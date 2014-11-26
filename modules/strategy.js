
module.exports = {
		select: function() {
			return this.DevelopmentStrategy()
		},
		
		/**
		 * The development strategy focuses on mining and building
		 * infrastructure for economic growth.
		 */
		DevelopmentStrategy: function() {
			return {
				type: "development",
				work: {
					miner: .8,
					builder: .2
				}
			}
		},
}
