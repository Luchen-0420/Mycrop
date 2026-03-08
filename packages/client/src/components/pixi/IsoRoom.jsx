import React, { useCallback } from 'react';
import { Graphics } from '@pixi/react';
import { toScreen, colorMap } from './IsoEngine';

export default function IsoRoom({ x, y, width, height, colorName, label }) {
    const drawBase = useCallback((g) => {
        g.clear();

        const p1 = toScreen(x, y, 0);
        const p2 = toScreen(x + width, y, 0);
        const p3 = toScreen(x + width, y + height, 0);
        const p4 = toScreen(x, y + height, 0);

        const hexColor = colorMap[colorName] || 0xffffff;

        // Draw Floor Fill
        g.beginFill(hexColor, 0.2); // semi-transparent
        g.lineStyle(1, hexColor, 0.6); // border
        g.moveTo(p1.x, p1.y);
        g.lineTo(p2.x, p2.y);
        g.lineTo(p3.x, p3.y);
        g.lineTo(p4.x, p4.y);
        g.lineTo(p1.x, p1.y);
        g.endFill();

        // Draw internal grid lines for tech feel
        g.lineStyle(1, 0xffffff, 0.1);
        for (let i = 1; i < width; i++) {
            let ptA = toScreen(x + i, y, 0);
            let ptB = toScreen(x + i, y + height, 0);
            g.moveTo(ptA.x, ptA.y);
            g.lineTo(ptB.x, ptB.y);
        }
        for (let i = 1; i < height; i++) {
            let ptA = toScreen(x, y + i, 0);
            let ptB = toScreen(x + width, y + i, 0);
            g.moveTo(ptA.x, ptA.y);
            g.lineTo(ptB.x, ptB.y);
        }

    }, [x, y, width, height, colorName]);

    return (
        <Graphics draw={drawBase} />
    );
}
