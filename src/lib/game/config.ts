export const ASPECT_RATIO = innerWidth / innerHeight;
export const COLUMNS = innerWidth > 1920 ? 50 : innerWidth < 720 ? 16 : 30;
export const ROWS = Math.floor(COLUMNS / ASPECT_RATIO);
export const CELL_SIZE = Math.floor(innerWidth / COLUMNS);
