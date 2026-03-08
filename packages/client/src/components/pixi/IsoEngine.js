export const tileWidth = 80;
export const tileHeight = 40;

// Convert Cartesian (x, y) logical grid coordinates to Isometric screen coordinates
export function toScreen(x, y, z = 0) {
    return {
        x: (x - y) * (tileWidth / 2),
        y: (x + y) * (tileHeight / 2) - z,
    };
}

// Convert Tailwind color names to Hexadecimal values for PIXI rendering
export const colorMap = {
    emerald: 0x10b981,
    slate: 0x64748b,
    orange: 0xf97316,
    cyan: 0x06b6d4,
    pink: 0xec4899,
    rose: 0xf43f5e,
    blue: 0x3b82f6,
    yellow: 0xeab308,
    amber: 0xf59e0b,
    indigo: 0x6366f1,
    purple: 0xa855f7
};
