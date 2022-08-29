import * as Minecraft from "mojang-minecraft";

const world = Minecraft.world;

let blockLoggingDatabaseDB = new Database("BlockLogging");
let blockLoggingDatabase = [];

world.events.blockBreak.subscribe(blockBreak => {
    let { player, block, brokenBlockPermutation, dimension } = blockBreak;
    const { x, y, z } = block;
    const Pos = `${x} ${y} ${z}`;
    if (player.hasTag(`unk:inspect`)) {
        blockLoggingDatabase[Pos] = blockLoggingDatabaseDB.get(Pos) || undefined;
        block.setPermutation(brokenBlockPermutation);
        player.runCommand(`tellraw @s {"rawtext":[{"text":"---- §cUnknown §4Anti-Cheat§r ----- §7(x${x}/y${y}/z${z})"}]}`);
        if (blockLoggingDatabase[Pos] === undefined) return player.runCommand(`tellraw @s {"rawtext":[{"text":" No data"}]}`);
        for (let i = 0; i <= blockLoggingDatabase[Pos].length; i++) {
            const TIME_DATA = msToTime(Number(Date.now() - blockLoggingDatabase[Pos][i][3]));
            let TIME = " ";
            if (TIME_DATA.s > 0) TIME = `${TIME_DATA.s}s${TIME}`;
            if (TIME_DATA.m > 0) TIME = `${TIME_DATA.m}m${TIME}`;
            if (TIME_DATA.h > 0) TIME = `${TIME_DATA.h}h${TIME}`;
            if (TIME_DATA.d > 0) TIME = `${TIME_DATA.d}d${TIME}`;
            player.runCommand(`tellraw @s {"rawtext":[{"text":" §7${TIME}ago - §c${blockLoggingDatabase[Pos][i][2]}§r ${blockLoggingDatabase[Pos][i][0] === "break" ? "removed" : "placed"} §4${blockLoggingDatabase[Pos][i][1]}"}]}`);
        }
    } else {
        blockLoggingDatabase[Pos] = blockLoggingDatabaseDB.get(Pos) || undefined;
        const TYPE = "break";
        const BLOCK = brokenBlockPermutation.type.id;
        const USER = player.nameTag || player.id || null;
        const TIME = Date.now()
        const DATA = [ TYPE, BLOCK, USER, TIME ];
        if (blockLoggingDatabase[Pos] === undefined || blockLoggingDatabase[Pos].length >= 20) blockLoggingDatabase[Pos] = [];
        blockLoggingDatabase[Pos].push(DATA);
        blockLoggingDatabaseDB.set(Pos, blockLoggingDatabase[Pos]);
    }
});

world.events.blockPlace.subscribe(blockPlace => {
    let { player, block } = blockPlace;
    const { x, y, z } = block;
    const Pos = `${x} ${y} ${z}`;
    if (player.hasTag(`unk:inspect`)) {
        blockLoggingDatabase[Pos] = blockLoggingDatabaseDB.get(Pos) || undefined;
        blockPlace.dimension.getBlock(new Minecraft.BlockLocation(x, y, z)).setType(Minecraft.MinecraftBlockTypes.air);
        player.runCommand(`tellraw @s {"rawtext":[{"text":"---- §cUnknown §4Anti-Cheat§r ----- §7(x${x}/y${y}/z${z})"}]}`);
        if (blockLoggingDatabase[Pos] === undefined) return player.runCommand(`tellraw @s {"rawtext":[{"text":" No data"}]}`);
        for (let i = 0; i <= blockLoggingDatabase[Pos].length; i++) {
            const TIME_DATA = msToTime(Number(Date.now() - blockLoggingDatabase[Pos][i][3]));
            let TIME = " ";
            if (TIME_DATA.s > 0) TIME = `${TIME_DATA.s}s${TIME}`;
            if (TIME_DATA.m > 0) TIME = `${TIME_DATA.m}m${TIME}`;
            if (TIME_DATA.h > 0) TIME = `${TIME_DATA.h}h${TIME}`;
            if (TIME_DATA.d > 0) TIME = `${TIME_DATA.d}d${TIME}`;
            player.runCommand(`tellraw @s {"rawtext":[{"text":" §7${TIME}ago - §c${blockLoggingDatabase[Pos][i][2]}§r ${blockLoggingDatabase[Pos][i][0] === "break" ? "removed" : "placed"} §4${blockLoggingDatabase[Pos][i][1]}"}]}`);
        }
    } else {
        blockLoggingDatabase[Pos] = blockLoggingDatabaseDB.get(Pos) || undefined;
        const TYPE = "place";
        const BLOCK = block.type.id;
        const USER = player.nameTag || player.id || null;
        const TIME = Date.now();
        const DATA = [ TYPE, BLOCK, USER, TIME ];
        if (blockLoggingDatabase[Pos] === undefined || blockLoggingDatabase[Pos].length >= 20) blockLoggingDatabase[Pos] = [];
        blockLoggingDatabase[Pos].push(DATA);
        blockLoggingDatabaseDB.set(Pos, blockLoggingDatabase[Pos]);
    }
});
