import React, {useEffect, useState} from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface EventData {
    Day: string;
    Events?: number;
    UniqueEvents?: number;
}

interface Props {
    websiteId: string;
    eventName: string;
}

const EventGraph: React.FC<Props> = ({websiteId, eventName}) => {
    const [data, setData] = useState<EventData[]>([]);
    const [mode, setMode] = useState<'total' | 'unique'>('total');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!websiteId || !eventName) return;
        setLoading(true);
        let url = '';
        if (mode === 'total') {
            url = `/api/event/eventsPerDay?websiteId=${websiteId}&eventName=${eventName}`;
        } else {
            url = `/api/event/uniqueEventsPerDay?websiteId=${websiteId}&eventName=${eventName}`;
        }
        fetch(url)
            .then(res => res.json())
            .then((json: { data: EventData[] }) => setData(json.data))
            .finally(() => setLoading(false));
    }, [websiteId, eventName, mode]);

    return (
        <Box sx={{
            background: '#23272a',
            borderRadius: 3,
            p: 3,
            boxShadow: 3,
            border: '1px solid #393c43',
            mt: 2
        }}>
            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <Typography variant="subtitle1" sx={{ color: '#b5bac1' }}>Graph:</Typography>
                <ToggleButtonGroup
                    value={mode}
                    exclusive
                    onChange={(_, value) => value && setMode(value)}
                    size="small"
                    sx={{ background: '#23272a', borderRadius: 2 }}
                >
                    <ToggleButton value="total" sx={{ color: '#b5bac1', '&.Mui-selected': { color: '#fff', background: '#5865f2' } }}>Total</ToggleButton>
                    <ToggleButton value="unique" sx={{ color: '#b5bac1', '&.Mui-selected': { color: '#fff', background: '#5865f2' } }}>Unique</ToggleButton>
                </ToggleButtonGroup>
            </Stack>
            <Box sx={{ height: 300, width: '100%' }}>
                <ResponsiveContainer>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#393c43" />
                        <XAxis dataKey="Day" stroke="#b5bac1" tick={{ fill: '#b5bac1' }} />
                        <YAxis stroke="#b5bac1" tick={{ fill: '#b5bac1' }} />
                        <Tooltip contentStyle={{ background: '#23272a', border: '1px solid #393c43', color: '#fff' }} labelStyle={{ color: '#fff' }} />
                        {mode === 'total' ? (
                            <Line type="monotone" dataKey="Events" stroke="#5865f2" strokeWidth={3} dot={{ r: 4, fill: '#5865f2' }} />
                        ) : (
                            <Line type="monotone" dataKey="UniqueEvents" stroke="#43b581" strokeWidth={3} dot={{ r: 4, fill: '#43b581' }} />
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    );
};

export default EventGraph;
