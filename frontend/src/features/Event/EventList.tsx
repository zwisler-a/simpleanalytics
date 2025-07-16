import React, {useEffect, useState} from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TagIcon from '@mui/icons-material/Tag';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

interface Event {
    name: string;
}

interface Props {
    websiteId: string;
    onEventClick: (eventName: string) => void;
    selectedEventName?: string;
}

const EventList: React.FC<Props> = ({websiteId, onEventClick, selectedEventName}) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean, eventName: string | null }>({ open: false, eventName: null });

    useEffect(() => {
        if (!websiteId) return;

        fetch(`/api/event/eventsOnWebsite?websiteId=${websiteId}`)
            .then(res => res.json())
            .then((json: { data: Event[] }) => setEvents(json.data));
    }, [websiteId]);

    const handleDelete = (eventName: string) => {
        setDeleteDialog({ open: true, eventName });
    };

    const confirmDelete = () => {
        // TODO: Implement backend delete call
        setEvents(events.filter(e => e.name !== deleteDialog.eventName));
        setDeleteDialog({ open: false, eventName: null });
    };

    return (
        <>
            <List sx={{
                background: '#23272a',
                borderRadius: 2,
                p: 1,
                minWidth: 180,
                color: '#b5bac1',
                boxShadow: 1,
            }}>
                <Typography variant="overline" sx={{ color: '#5865f2', pl: 2, letterSpacing: 1, fontWeight: 700 }}>
                    EVENTS
                </Typography>
                {events.map(event => (
                    <ListItem key={event.name} disablePadding sx={{ display: 'block', position: 'relative' }}>
                        <ListItemButton
                            onClick={() => onEventClick(event.name)}
                            sx={{
                                borderRadius: 1,
                                mb: 0.5,
                                pl: 2,
                                py: 1.2,
                                alignItems: 'center',
                                background: selectedEventName === event.name ? '#393c43' : 'transparent',
                                color: selectedEventName === event.name ? '#fff' : '#b5bac1',
                                borderLeft: selectedEventName === event.name ? '4px solid #5865f2' : '4px solid transparent',
                                transition: 'background 0.15s, border-color 0.15s',
                                '&:hover': {
                                    background: '#393c43',
                                    color: '#fff',
                                    borderLeft: '4px solid #5865f2',
                                },
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <TagIcon fontSize="small" sx={{ color: selectedEventName === event.name ? '#5865f2' : '#b5bac1' }} />
                                <ListItemText
                                    primary={event.name}
                                    primaryTypographyProps={{
                                        fontWeight: selectedEventName === event.name ? 700 : 400,
                                        fontSize: 15,
                                        letterSpacing: 0.2,
                                    }}
                                />
                            </Box>
                        </ListItemButton>
                        <IconButton size="small" sx={{ position: 'absolute', top: 8, right: 8, color: '#b5bac1' }} onClick={() => handleDelete(event.name)}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </ListItem>
                ))}
            </List>
            <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, eventName: null })}>
                <DialogTitle>Delete this event?</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog({ open: false, eventName: null })}>Cancel</Button>
                    <Button onClick={confirmDelete} variant="contained" color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default EventList;
