var cfg = {};

cfg.memory_max = 3500; // Mb

cfg.mouse_interaction_canvas = "top";   // Required, changing will not change anything

// Debug stuff
cfg.debug_enable = true; // Enable debugging stuff ( console out, debug window, etc )
cfg.debug_window_FontSize = "12px"; // Pixels
cfg.debug_window_Width = 400;
cfg.debug_defaultInterval = 100;
cfg.debug_mp_enable = true;
cfg.debug_mp_interval = 100; // ms
cfg.debug_fps_enable = true;
cfg.debug_fps_interval = 1000/30;
cfg.debug_heapUsed_enable = true;
cfg.debug_heapUsed_interval = 100;
cfg.debug_analytics_flow_enable = false;
cfg.debug_analytics_flow_interval = 16;
cfg.debug_pixeloffset_enable = true;
cfg.debug_pixeloffset_interval = 16;
cfg.debug_general_analytics_enable = true;
cfg.debug_general_analytics_interval = 16;
cfg.debug_show_chunk_region = false;
cfg.debug_show_entity_drawRegion = true;
cfg.debug_show_tile_region = true;

cfg.debug_chunk_backgroundload_disable = true;
cfg.debug_chunk_load_mode = "sync" || "async";
cfg.debug_seed_default = "debug";
cfg.debug_enable_newChunkRenders = true;


// World stuff
cfg.world_chunkSize = 32; // The size of each chunk, in tiles
cfg.world_treePlacementModifier = 0.05; // The chance that a tree will be placed
cfg.world_map_size_debug = 2;
cfg.world_map_size_normal = 5;
cfg.world_map_size_double = 8;
cfg.world_map_size_large = 12;
cfg.world_time_draw_enable = false;
cfg.tile_size = 16;
// Sprite Batches
cfg.batching_enable = false; // Don't enable. EVER.

cfg.entity_roam_dist = 20;

// Sprite stuff
cfg.sprite_ground_y = 4;
cfg.sprite_ground_flowSizeCoefficient = 4;
cfg.sprite_ground_flowFrameCoefficient = 1/10/4;

// Pathfinding
cfg.pathfinding_cost_vh = 1;    // Vertical-horizontal (vh)
cfg.pathfinding_cost_diagonal = Math.sqrt(2);
cfg.pathfinding_iteration_max = 50000;
cfg.pathfinding_batch_size = 10;

// Rendering stuff
cfg.render_dynamic_only = false; // Only render the stuff that changes
cfg.render_chunk_offset_x = 0;
cfg.render_chunk_offset_y = 0;
cfg.render_chunk_extra_y = 1;
cfg.render_chunk_extra_x = 2;
cfg.render_enable_frame_skip = false;
cfg.render_frame_skip = 2;
cfg.render_decals = true;

// Map move constants
cfg.map_move_rate_cc = 0;
cfg.map_move_rate_px = 1;
cfg.map_move_rate_nx = -1;
cfg.map_move_rate_py = 1;
cfg.map_move_rate_ny = -1;
cfg.map_move_speed = 10;

cfg.update_tps_pause = 0;
cfg.update_tps_slow = 5;
cfg.update_tps_normal = 25;
cfg.update_tps_double = 50;

cfg.update_interval_pause = 10000000000;
cfg.update_interval_slow = 1000/cfg.update_tps_slow;
cfg.update_interval_normal = 1000/cfg.update_tps_normal;
cfg.update_interval_double = 1000/cfg.update_tps_double;
cfg.update_interval_triple = 1000/cfg.update_tps_triple;

cfg.testing_entity_amount = 10;
cfg.eventlog_entity_size = 0;

cfg.generation_elevationCoefficient_x = 1/75;
cfg.generation_elevationCoefficient_y = 1/75;
cfg.generation_stone_threshold = 0.35;
cfg.generation_stone_x_coefficient = 1/75;
cfg.generation_stone_y_coefficient = 1/75;

cfg.t3_routineEnable_viewRangeUpdate = true;
cfg.t3_routineEnable_drawChunk = true;
cfg.t3_routineEnable_drawEntity = true;
cfg.t3_routineEnable_drawFrame = true;
cfg.t3_routineEnable_composite = true;