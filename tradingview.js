
import { writeFileSync, readFileSync } from 'fs';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const body = req.body;

        let signals = [];
        try {
            const raw = readFileSync('sygnaly.json');
            signals = JSON.parse(raw);
        } catch (e) {
            signals = [];
        }

        const now = new Date().toISOString();
        const signal = {
            instrument: body.instrument || "UNKNOWN",
            direction: body.kierunek || "N/A",
            rsi: body.rsi || "N/A",
            ema: body.ema || "N/A",
            volume: body.volume || "N/A",
            volume_change: body.volume_change || "N/A",
            sl: body.sl || "-",
            tp: body.tp || "-",
            efficiency: body.efficiency || 0,
            timestamp: now
        };

        signals.unshift(signal);
        if (signals.length > 20) signals = signals.slice(0, 20);

        writeFileSync('sygnaly.json', JSON.stringify(signals, null, 2));
        res.status(200).json({ success: true, signal });
    } else {
        res.status(405).json({ message: 'Tylko POST!' });
    }
}
