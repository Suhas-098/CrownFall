import prisma from "../config/db";

const regions = [
  // ====================
  // Capitals (4)
  // ====================
  { name: "Aurelia", regionType: "CAPITAL" },
  { name: "Drakemoor", regionType: "CAPITAL" },
  { name: "Stormhold", regionType: "CAPITAL" },
  { name: "Valewatch", regionType: "CAPITAL" },

  // ====================
  // Villages (8)
  // ====================
  { name: "Oakridge", regionType: "VILLAGE" },
  { name: "Ravenbrook", regionType: "VILLAGE" },
  { name: "Willowdale", regionType: "VILLAGE" },
  { name: "Stonefield", regionType: "VILLAGE" },
  { name: "Greenhollow", regionType: "VILLAGE" },
  { name: "Briarford", regionType: "VILLAGE" },
  { name: "Goldmeadow", regionType: "VILLAGE" },
  { name: "Rivercross", regionType: "VILLAGE" },

  // ====================
  // Farms (8)
  // ====================
  { name: "Sunfield", regionType: "FARM" },
  { name: "Harvest Plains", regionType: "FARM" },
  { name: "Golden Acre", regionType: "FARM" },
  { name: "Eastgrain", regionType: "FARM" },
  { name: "Westgrain", regionType: "FARM" },
  { name: "Amberfield", regionType: "FARM" },
  { name: "Windmill Reach", regionType: "FARM" },
  { name: "Barley Downs", regionType: "FARM" },

  // ====================
  // Forests (7)
  // ====================
  { name: "Ashenwood", regionType: "FOREST" },
  { name: "Eldergrove", regionType: "FOREST" },
  { name: "Moonshade Forest", regionType: "FOREST" },
  { name: "Whispering Woods", regionType: "FOREST" },
  { name: "Blackbark Forest", regionType: "FOREST" },
  { name: "Mistleaf Grove", regionType: "FOREST" },
  { name: "Thornwild", regionType: "FOREST" },

  // ====================
  // Mountains (5)
  // ====================
  { name: "Ironpeak", regionType: "MOUNTAIN" },
  { name: "Frostspire", regionType: "MOUNTAIN" },
  { name: "Thundercrag", regionType: "MOUNTAIN" },
  { name: "Stonefang Ridge", regionType: "MOUNTAIN" },
  { name: "Kingscrest", regionType: "MOUNTAIN" },

  // ====================
  // Gold Mines (3)
  // ====================
  { name: "Golden Depths", regionType: "GOLD_MINE" },
  { name: "Kingsgold Mine", regionType: "GOLD_MINE" },
  { name: "Deepvein Mine", regionType: "GOLD_MINE" },

  // ====================
  // Temples (3)
  // ====================
  { name: "Temple of Dawn", regionType: "TEMPLE" },
  { name: "Temple of Echoes", regionType: "TEMPLE" },
  { name: "Temple of Kings", regionType: "TEMPLE" },

  // ====================
  // Ancient Ruins (2)
  // ====================
  { name: "Ruins of Avaris", regionType: "ANCIENT_RUINS" },
  { name: "Forgotten Sanctum", regionType: "ANCIENT_RUINS" },

  // ====================
  // Dragon Lair (1)
  // ====================
  { name: "Dragon's Maw", regionType: "DRAGON_LAIR" },

  // ====================
  // Bandit Camps (3)
  // ====================
  { name: "Redfang Camp", regionType: "BANDIT_CAMP" },
  { name: "Blackknife Camp", regionType: "BANDIT_CAMP" },
  { name: "Bloodtrail Camp", regionType: "BANDIT_CAMP" },

  // ====================
  // Goblin Camps (2)
  // ====================
  { name: "Rottooth Camp", regionType: "GOBLIN_CAMP" },
  { name: "Muckhide Camp", regionType: "GOBLIN_CAMP" },

  // ====================
  // Monster Dens (2)
  // ====================
  { name: "Shadow Den", regionType: "MONSTER_DEN" },
  { name: "Boneclaw Den", regionType: "MONSTER_DEN" }
];

async function seedRegions() {
  try {
    const existingRegions = await prisma.region.count();

    if (existingRegions > 0) {
      console.log(
        `Region table already contains ${existingRegions} regions. Skipping seed.`
      );
      return;
    }

    await prisma.region.createMany({
      data: regions
    });

    console.log(`Successfully seeded ${regions.length} regions.`);
  } catch (error) {
    console.error("Region seed failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedRegions();