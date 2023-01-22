"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeCommand = exports.commandCallbacks = exports.commandDefinitions = exports.CommandID = void 0;
const AbstractBoss_1 = require("../Entity/Boss/AbstractBoss");
const Defender_1 = require("../Entity/Boss/Defender");
const FallenBooster_1 = require("../Entity/Boss/FallenBooster");
const FallenOverlord_1 = require("../Entity/Boss/FallenOverlord");
const Guardian_1 = require("../Entity/Boss/Guardian");
const Summoner_1 = require("../Entity/Boss/Summoner");
const Live_1 = require("../Entity/Live");
const ArenaCloser_1 = require("../Entity/Misc/ArenaCloser");
const FallenAC_1 = require("../Entity/Misc/Boss/FallenAC");
const FallenSpike_1 = require("../Entity/Misc/Boss/FallenSpike");
const Dominator_1 = require("../Entity/Misc/Dominator");
const AbstractShape_1 = require("../Entity/Shape/AbstractShape");
const Crasher_1 = require("../Entity/Shape/Crasher");
const Pentagon_1 = require("../Entity/Shape/Pentagon");
const Square_1 = require("../Entity/Shape/Square");
const Triangle_1 = require("../Entity/Shape/Triangle");
const AutoTurret_1 = require("../Entity/Tank/AutoTurret");
const Bullet_1 = require("../Entity/Tank/Projectile/Bullet");
const TankBody_1 = require("../Entity/Tank/TankBody");
const Entity_1 = require("../Native/Entity");
const util_1 = require("../util");
const Enums_1 = require("./Enums");
const TankDefinitions_1 = require("./TankDefinitions");
var CommandID;
(function (CommandID) {
    CommandID["gameSetTank"] = "game_set_tank";
    CommandID["gameSetLevel"] = "game_set_level";
    CommandID["gameSetScore"] = "game_set_score";
    CommandID["gameTeleport"] = "game_teleport";
    CommandID["gameClaim"] = "game_claim";
    CommandID["adminSetStatMax"] = "admin_set_stat_max";
    CommandID["adminAddUpgradePoints"] = "admin_add_upgrade_points";
    CommandID["adminGodmode"] = "admin_godmode";
    CommandID["adminSummon"] = "admin_summon";
    CommandID["adminKillAll"] = "admin_kill_all";
    CommandID["adminKillEntity"] = "admin_kill_entity";
    CommandID["adminCloseArena"] = "admin_close_arena";
})(CommandID = exports.CommandID || (exports.CommandID = {}));
exports.commandDefinitions = {
    game_set_tank: {
        id: CommandID.gameSetTank,
        usage: "[tank]",
        description: "Changes your tank to the given class",
        permissionLevel: 2 /* AccessLevel.BetaAccess */
    },
    game_set_level: {
        id: CommandID.gameSetLevel,
        usage: "[level]",
        description: "Changes your level to the given whole number",
        permissionLevel: 2 /* AccessLevel.BetaAccess */
    },
    game_set_score: {
        id: CommandID.gameSetScore,
        usage: "[score]",
        description: "Changes your score to the given whole number",
        permissionLevel: 2 /* AccessLevel.BetaAccess */
    },
    admin_set_stat_max: {
        id: CommandID.adminSetStatMax,
        usage: "[stat num] [max]",
        description: "Set the max value of one of your statuses. [stat num] is equivalent to the number that appears in the UI",
        permissionLevel: 3 /* AccessLevel.FullAccess */
    },
    admin_add_upgrade_points: {
        id: CommandID.adminAddUpgradePoints,
        usage: "[points]",
        description: "Add upgrade points",
        permissionLevel: 3 /* AccessLevel.FullAccess */
    },
    game_teleport: {
        id: CommandID.gameTeleport,
        usage: "[x] [y]",
        description: "Teleports you to the given position",
        permissionLevel: 2 /* AccessLevel.BetaAccess */
    },
    game_claim: {
        id: CommandID.gameClaim,
        usage: "[entityName]",
        description: "Attempts claiming an entity of the given type",
        permissionLevel: 2 /* AccessLevel.BetaAccess */
    },
    admin_godmode: {
        id: CommandID.adminGodmode,
        description: "Toggles godmode",
        permissionLevel: 3 /* AccessLevel.FullAccess */
    },
    admin_summon: {
        id: CommandID.adminSummon,
        usage: "[entityName] [?count] [?x] [?y]",
        description: "Spawns entities at a certain location",
        permissionLevel: 3 /* AccessLevel.FullAccess */
    },
    admin_kill_all: {
        id: CommandID.adminKillAll,
        description: "Kills all entities in the arena",
        permissionLevel: 3 /* AccessLevel.FullAccess */
    },
    admin_kill_entity: {
        id: CommandID.adminKillEntity,
        usage: "[entityName]",
        description: "Kills all entities of the given type (might include self)",
        permissionLevel: 3 /* AccessLevel.FullAccess */
    },
    admin_close_arena: {
        id: CommandID.adminCloseArena,
        description: "Closes the current arena",
        permissionLevel: 3 /* AccessLevel.FullAccess */
    }
};
exports.commandCallbacks = {
    game_set_tank: (client, tankNameArg) => {
        const tankDef = (0, TankDefinitions_1.getTankByName)(tankNameArg);
        const player = client.camera?.camera.player;
        if (!tankDef || !Entity_1.Entity.exists(player) || !(player instanceof TankBody_1.default))
            return;
        player.setTank(tankDef.id);
    },
    game_set_level: (client, levelArg) => {
        const level = parseInt(levelArg);
        const player = client.camera?.camera.player;
        if (isNaN(level) || !Entity_1.Entity.exists(player) || !(player instanceof TankBody_1.default))
            return;
        client.camera?.setLevel(level);
    },
    game_set_score: (client, scoreArg) => {
        const score = parseInt(scoreArg);
        const camera = client.camera?.camera;
        const player = client.camera?.camera.player;
        if (isNaN(score) || score > Number.MAX_SAFE_INTEGER || score < Number.MIN_SAFE_INTEGER || !Entity_1.Entity.exists(player) || !(player instanceof TankBody_1.default) || !camera)
            return;
        camera.scorebar = score;
    },
    admin_add_upgrade_points: (client, pointsArg) => {
        const points = parseInt(pointsArg);
        const camera = client.camera?.camera;
        const player = client.camera?.camera.player;
        if (isNaN(points) || points > Number.MAX_SAFE_INTEGER || points < Number.MIN_SAFE_INTEGER || !Entity_1.Entity.exists(player) || !(player instanceof TankBody_1.default) || !camera)
            return;
        camera.statsAvailable += points;
    },
    game_teleport: (client, xArg, yArg) => {
        const x = parseInt(xArg);
        const y = parseInt(yArg);
        const player = client.camera?.camera.player;
        if (isNaN(x) || isNaN(y) || !Entity_1.Entity.exists(player) || !(player instanceof TankBody_1.default))
            return;
        player.position.x = x;
        player.position.y = y;
        player.setVelocity(0, 0);
        player.state |= Entity_1.EntityStateFlags.needsCreate | Entity_1.EntityStateFlags.needsDelete;
    },
    game_claim: (client, entityArg) => {
        const TEntity = new Map([
            ["ArenaCloser", ArenaCloser_1.default],
            ["Dominator", Dominator_1.default],
            ["Shape", AbstractShape_1.default],
            ["Boss", AbstractBoss_1.default],
            ["AutoTurret", AutoTurret_1.default]
        ]).get(entityArg);
        if (!TEntity || !client.camera?.game.entities.AIs.length)
            return;
        const AIs = Array.from(client.camera.game.entities.AIs);
        for (let i = 0; i < AIs.length; ++i) {
            if (!(AIs[i].owner instanceof TEntity))
                continue;
            client.possess(AIs[i]);
            return;
        }
    },
    admin_godmode: (client) => {
        if (client.camera?.camera.player?.style?.styleFlags) {
            if (client.camera.camera.player.style.styleFlags & Enums_1.StyleFlags.invincibility) {
                client.camera.camera.player.style.styleFlags ^= Enums_1.StyleFlags.invincibility;
            }
            else {
                client.camera.camera.player.style.styleFlags |= Enums_1.StyleFlags.invincibility;
            }
        }
    },
    admin_summon: (client, entityArg, countArg, xArg, yArg) => {
        const count = countArg ? parseInt(countArg) : 1;
        const x = parseInt(xArg || "");
        const y = parseInt(yArg || "");
        const game = client.camera?.game;
        const TEntity = new Map([
            ["Defender", Defender_1.default],
            ["Summoner", Summoner_1.default],
            ["Guardian", Guardian_1.default],
            ["FallenOverlord", FallenOverlord_1.default],
            ["FallenBooster", FallenBooster_1.default],
            ["FallenAC", FallenAC_1.default],
            ["FallenSpike", FallenSpike_1.default],
            ["ArenaCloser", ArenaCloser_1.default],
            ["Crasher", Crasher_1.default],
            ["Pentagon", Pentagon_1.default],
            ["Square", Square_1.default],
            ["Triangle", Triangle_1.default]
        ]).get(entityArg);
        if (isNaN(count) || count < 0 || !game || !TEntity)
            return;
        for (let i = 0; i < count; ++i) {
            const boss = new TEntity(game);
            if (!isNaN(x) && !isNaN(y)) {
                boss.position.x = x;
                boss.position.y = y;
            }
        }
    },
    admin_kill_all: (client) => {
        const game = client.camera?.game;
        if (!game)
            return;
        for (let id = 0; id <= game.entities.lastId; ++id) {
            const entity = game.entities.inner[id];
            if (Entity_1.Entity.exists(entity) && entity instanceof Live_1.default && entity !== client.camera?.camera.player)
                entity.health.health = 0;
        }
    },
    admin_close_arena: (client) => {
        client?.camera?.game.arena.close();
    },
    admin_kill_entity: (client, entityArg) => {
        const TEntity = new Map([
            ["ArenaCloser", ArenaCloser_1.default],
            ["Dominator", Dominator_1.default],
            ["Bullet", Bullet_1.default],
            ["Tank", TankBody_1.default],
            ["Shape", AbstractShape_1.default],
            ["Boss", AbstractBoss_1.default]
        ]).get(entityArg);
        const game = client.camera?.game;
        if (!TEntity || !game)
            return;
        for (let id = 0; id <= game.entities.lastId; ++id) {
            const entity = game.entities.inner[id];
            if (Entity_1.Entity.exists(entity) && entity instanceof TEntity)
                entity.health.health = 0;
        }
    }
};
const executeCommand = (client, cmd, args) => {
    if (!exports.commandDefinitions.hasOwnProperty(cmd) || !exports.commandCallbacks.hasOwnProperty(cmd)) {
        return (0, util_1.saveToVLog)(`${client.toString()} tried to run the invalid command ${cmd}`);
    }
    if (client.accessLevel < exports.commandDefinitions[cmd].permissionLevel) {
        return (0, util_1.saveToVLog)(`${client.toString()} tried to run the command ${cmd} with a permission that was too low`);
    }
    exports.commandCallbacks[cmd](client, ...args);
};
exports.executeCommand = executeCommand;
