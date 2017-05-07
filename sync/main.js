class Main {
    constructor() {
        this.numHarvester = 0;
        this.numBuilder = 0;
        this.numUpgrader = 0;
    }

    calcQuantityOfCreeps() {
        this.numHarvester = 0;
        this.numBuilder = 0;
        this.numUpgrader = 0;
        for(const i in Game.creeps) {
            if(Game.creeps[i].memory.role == 'harvester') {
                this.numHarvester++;
            }
            else if(Game.creeps[i].memory.role == 'builder') {
                this.numBuilder++;
            }
            else if(Game.creeps[i].memory.role == 'upgrader') {
                this.numUpgrader++;
            }
        }
        console.log('Harvester: ' + this.numHarvester + ' // ' + 'Builder: ' + this.numBuilder + ' // ' + 'Upgrader: ' + this.numUpgrader);
        //console.log('Total number of creeps: ' + Object.keys(Game.creeps).length;
    }
    
    respawnCreeps() {
        if(this.numHarvester < 1) {
            Game.spawns['MainBase'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'harvester'});
        }
        if(this.numBuilder < 1) {
            Game.spawns['MainBase'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'builder'});
        }
        if(this.numUpgrader < 6) {
            Game.spawns['MainBase'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'upgrader'});
        }
    }

    run() {
        this.calcQuantityOfCreeps();
        this.respawnCreeps();

        for(const name in Game.creeps) {
            const creep = Game.creeps[name];
            if(creep.memory.role == 'harvester') {
                if(creep.carry.energy < creep.carryCapacity) {
                    const sources = creep.room.find(FIND_SOURCES);
                    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
                else {
                    const targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                        }
                    });
                    if(targets.length > 0) {
                        if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    }
                }
            }
            if(creep.memory.role == 'upgrader') {
                if(creep.memory.upgrading && creep.carry.energy == 0) {
                    creep.memory.upgrading = false;
                    creep.say('🔄 harvest');
                }
                if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
                    creep.memory.upgrading = true;
                    creep.say('⚡ upgrade');
                }

                if(creep.memory.upgrading) {
                    if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                else {
                    const sources = creep.room.find(FIND_SOURCES);
                    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
            }
            if(creep.memory.role == 'builder') {
                if(creep.memory.building && creep.carry.energy == 0) {
                    creep.memory.building = false;
                    creep.say('🔄 harvest');
                }
                if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
                    creep.memory.building = true;
                    creep.say('🚧 build');
                }

                if(creep.memory.building) {
                    const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                    if(targets.length) {
                        if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    }
                }
                else {
                    const sources = creep.room.find(FIND_SOURCES);
                    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
            }
        }
    }
}

const main = new Main();
main.run();

// Test Sync