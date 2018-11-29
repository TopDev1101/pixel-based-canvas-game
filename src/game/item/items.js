
var Items = {};

Items.log = new ResourceItem( "log", new Noun("log"), STR.itemDesc.log);
Items.stone = new ResourceItem( "stone", new Noun("stone"), STR.itemDesc.stone);
Items.coal = new ResourceItem( "coal", new Noun("coal", "coal"), STR.itemDesc.stone);
Items.ironOre = new ResourceItemOre( "iron", new Noun("iron ore", "iron ore"), STR.itemDesc.stone);
Items.pigIron = new ResourceItem( "pigIron", new Noun("pig iron", "pig iron"), STR.itemDesc.stone);
Items.rust = new Item( "rust", new Noun("rust", "rust"), STR.itemDesc.stone);
Items.iron = new ResourceItem( "iron", new Noun("iron ingot"), STR.itemDesc.stone);

Townsend.Item = Items;