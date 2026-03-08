import React, { useCallback, useState, useEffect } from 'react';
import { Graphics, Container, Text } from '@pixi/react';
import * as PIXI from 'pixi.js';
import { toScreen, colorMap } from './IsoEngine';

export default function IsoAgent({ agent, x, y, onClick, selected }) {
    const [tick, setTick] = useState(0);

    // Animation Loop
    useEffect(() => {
        let req;
        const animate = () => {
            setTick(t => t + 0.05);
            req = requestAnimationFrame(animate);
        };
        req = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(req);
    }, []);

    const basePos = toScreen(x + 0.5, y + 0.5, 0); // center of agent's room bounding box

    let zOffset = 0;
    let colorHex = colorMap[agent.color] || 0xffffff;

    // State machine animations
    if (agent.action === 'working' || agent.action === 'typing') {
        zOffset = Math.abs(Math.sin(tick * 3)) * 8; // Bouncing fast
    } else if (agent.status === 'blocked') {
        basePos.x += Math.sin(tick * 15) * 2; // Shaking
        colorHex = 0xff0000;
        zOffset = 0;
    } else {
        zOffset = Math.sin(tick) * 4; // Slow floating (idle/walking)
    }

    const drawAgent = useCallback((g) => {
        g.clear();

        // Shadow (on the floor)
        g.beginFill(0x000000, 0.4);
        g.drawEllipse(0, 0, 15, 7);
        g.endFill();

        // Agent Body (floating above shadow)
        const bodyY = -30 - zOffset;
        g.beginFill(colorHex, 0.9);
        g.lineStyle(selected ? 3 : 1, 0xffffff, selected ? 1 : 0.8);
        g.drawCircle(0, bodyY, 18);
        g.endFill();

        // Inner glowing core
        g.beginFill(0xffffff, 0.8);
        g.drawCircle(0, bodyY, 6);
        g.endFill();

    }, [colorHex, zOffset, selected]);

    return (
        <Container
            x={basePos.x}
            y={basePos.y}
            interactive={true}
            buttonMode={true}
            pointerdown={() => onClick(agent.id)}
            cursor="pointer"
        >
            <Graphics draw={drawAgent} />
            <Text
                text={agent.name}
                anchor={[0.5, 1]}
                x={0}
                y={-60 - zOffset}
                style={new PIXI.TextStyle({
                    fill: '#ffffff',
                    fontSize: 12,
                    fontWeight: 'bold',
                    dropShadow: true,
                    dropShadowColor: '#000000',
                    dropShadowAlpha: 0.8,
                    dropShadowBlur: 3,
                    dropShadowDistance: 0
                })}
            />
        </Container>
    );
}
