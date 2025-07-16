import WebsiteList from "./features/Website/WebsiteList.tsx";
import { useState, useEffect } from "react";
import EventList from "./features/Event/EventList.tsx";
import EventGraph from "./features/Event/EventGraph.tsx";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

function App() {
    const [website, setWebsite] = useState<any>();
    const [event, setEvent] = useState<string>();
    const [uniqueVisitors, setUniqueVisitors] = useState<number | null>(null);

    useEffect(() => {
        if (website?.id) {
            fetch(`/api/event/uniqueVisitors?websiteId=${website.id}`)
                .then(res => res.json())
                .then(json => setUniqueVisitors(json.data))
                .catch(() => setUniqueVisitors(null));
        } else {
            setUniqueVisitors(null);
        }
    }, [website]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', height: '100vh', minHeight: 0 }}>
            {/* Sidebar (like Discord server list) */}
            <Box sx={{ width: 88, background: '#23272a', display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2, gap: 2, boxShadow: 3, minHeight: 0, overflow: 'auto', p: 2 }}>
                <WebsiteList onSelect={id => setWebsite(id)} selectedWebsiteId={website?.id} />
            </Box>
            {/* Channel list (like Discord channels) */}
            <Box sx={{ width: 260, background: '#2b2d31', boxShadow: 3, minHeight: 0, overflow: 'auto', display: 'flex', flexDirection: 'column', p: 2 }}>
                {website && (
                    <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
                        <EventList websiteId={website.id} onEventClick={(ev) => setEvent(ev)} selectedEventName={event} />
                    </Box>
                )}
            </Box>
            {/* Main content */}
            <Box sx={{ flex: 1, p: 4, overflow: 'auto', background: '#313338', color: '#fff', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                {(website && event) ? (
                    <>
                        <Typography variant="h4" gutterBottom sx={{ color: '#fff', fontWeight: 700 }}>{website.name}</Typography>
                        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                            <Typography variant="subtitle1" sx={{ color: '#b5bac1' }}>Unique Visitors:</Typography>
                            <Typography variant="h6" sx={{ color: '#43b581', fontWeight: 700 }}>{uniqueVisitors !== null ? uniqueVisitors : '...'}</Typography>
                        </Stack>
                        <EventGraph websiteId={website.id} eventName={event} />
                    </>
                ) : (
                    <Typography variant="h5" sx={{ color: '#b5bac1' }}>Select a website and event to view analytics</Typography>
                )}
            </Box>
        </Box>
    );
}

export default App;
