import {useEffect, useState} from "react";
import {AddWebsiteDialog} from "./AddWebsiteDialog.tsx";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

function WebsiteList({onSelect, selectedWebsiteId}: { onSelect?: (id: string) => void, selectedWebsiteId?: string }) {
    const [websites, setWebsites] = useState<any[]>([]);
    const [showDialog, setShowDialog] = useState(false);
    const [editDialog, setEditDialog] = useState<{ open: boolean, website: any | null }>({ open: false, website: null });
    const [editName, setEditName] = useState("");
    const [editId, setEditId] = useState("");
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean, website: any | null }>({ open: false, website: null });
    const [hovered, setHovered] = useState<string | null>(null);
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [menuWebsite, setMenuWebsite] = useState<any | null>(null);

    useEffect(() => {
        fetch("/api/website/all")
            .then((res) => res.json())
            .then((data) => {
                if (!data.error) {
                    setWebsites(data.data);
                }
            });
    }, []);

    const handleAdd = (site: any) => {
        setWebsites((prev) => [...prev, site]);
    };

    const handleEditClick = (website: any) => {
        setEditDialog({ open: true, website });
        setEditName(website.name);
        setEditId(website.id);
    };

    const handleEditSave = async () => {
        try {
            const res = await fetch('/api/website/updateWebsite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: editDialog.website.id, name: editName, newId: editId })
            });
            const data = await res.json();
            if (!data.error) {
                setWebsites((prev) => prev.map(w => w.id === editDialog.website.id ? { ...w, name: editName, id: editId } : w));
            }
        } catch (e) { /* Optionally show error */ }
        setEditDialog({ open: false, website: null });
    };

    const handleDeleteClick = (website: any) => {
        setDeleteDialog({ open: true, website });
    };

    const handleDeleteConfirm = async () => {
        try {
            const res = await fetch('/api/website/deleteWebsite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: deleteDialog.website.id })
            });
            const data = await res.json();
            if (!data.error) {
                setWebsites((prev) => prev.filter(w => w.id !== deleteDialog.website.id));
            }
        } catch (e) { /* Optionally show error */ }
        setDeleteDialog({ open: false, website: null });
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, website: any) => {
        setMenuAnchor(event.currentTarget);
        setMenuWebsite(website);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
        setMenuWebsite(null);
    };

    return (
        <Box sx={{ width: 88, height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2, gap: 2, minHeight: 0, overflow: 'auto', background: '#23272a' }}>
            <Box sx={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, overflowY: 'auto' }}>
                {websites.map((site: any, idx: number) => {
                    const isSelected = selectedWebsiteId === site.id;
                    return (
                        <>
                            <Box key={site.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1 }}>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: isSelected ? '#5865f2' : '#b5bac1',
                                        fontWeight: isSelected ? 700 : 400,
                                        textAlign: 'center',
                                        width: 72,
                                        wordBreak: 'break-word',
                                        mb: 0.5,
                                    }}
                                    title={site.name}
                                >
                                    {site.name}
                                </Typography>
                                <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Avatar
                                        onClick={() => onSelect?.(site)}
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            fontSize: 24,
                                            fontWeight: 700,
                                            bgcolor: isSelected ? '#5865f2' : 'rgba(54,57,63,0.85)',
                                            color: isSelected ? '#fff' : '#f5f6fa',
                                            border: isSelected ? '2px solid #5865f2' : '2px solid #444950',
                                            boxShadow: isSelected ? '0 0 0 2px #5865f2' : '0 1px 6px 0 rgba(0,0,0,0.18)',
                                            cursor: 'pointer',
                                            transition: 'box-shadow 0.2s, border 0.2s, background 0.2s, filter 0.2s',
                                            filter: isSelected ? 'none' : 'none',
                                            letterSpacing: 1,
                                            textShadow: isSelected ? '0 1px 2px #4752c4' : '0 1px 2px #23272a',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            userSelect: 'none',
                                        }}
                                    >
                                        {site.name ? site.name[0].toUpperCase() : '?'}
                                    </Avatar>
                                    <IconButton
                                        size="small"
                                        sx={{
                                            position: 'absolute',
                                            bottom: -6,
                                            right: -6,
                                            bgcolor: 'rgba(40,40,40,0.85)',
                                            color: '#b5bac1',
                                            zIndex: 2,
                                            '&:hover': { bgcolor: 'rgba(88,101,242,0.15)' },
                                            border: '2px solid #23272a',
                                            display: 'flex',
                                            p: 0.5,
                                        }}
                                        onClick={e => { e.stopPropagation(); handleMenuOpen(e, site); }}
                                    >
                                        <MoreVertIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Box>
                            {idx < websites.length - 1 && (
                                <Divider sx={{ width: 56, my: 2, borderColor: '#36393f', alignSelf: 'center', borderBottomWidth: 1 }} />
                            )}
                        </>
                    );
                })}
            </Box>
            <Box sx={{ mt: 'auto', mb: 1 }}>
                <Typography variant="caption" sx={{ color: '#5865f2', fontWeight: 700, textAlign: 'center', width: 72, mb: 0.5 }}>
                    Add Website
                </Typography>
                <Box
                    sx={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    onClick={() => setShowDialog(true)}
                >
                    <Avatar sx={{ width: 56, height: 56, bgcolor: '#5865f2', color: '#fff', fontSize: 32, fontWeight: 700, cursor: 'pointer', boxShadow: 2 }}>
                        +
                    </Avatar>
                </Box>
            </Box>
            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem
                    onClick={() => {
                        handleMenuClose();
                        if (menuWebsite) handleEditClick(menuWebsite);
                    }}
                >
                    <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        handleMenuClose();
                        if (menuWebsite) handleDeleteClick(menuWebsite);
                    }}
                >
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
                </MenuItem>
            </Menu>
            {showDialog && (
                <AddWebsiteDialog
                    onAdd={handleAdd}
                    onClose={() => setShowDialog(false)}
                />
            )}
            <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, website: null })}>
                <DialogTitle>Edit Website</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="ID"
                        type="text"
                        fullWidth
                        value={editId}
                        onChange={e => setEditId(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialog({ open: false, website: null })}>Cancel</Button>
                    <Button onClick={handleEditSave} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, website: null })}>
                <DialogTitle>Delete this website?</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog({ open: false, website: null })}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} variant="contained" color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default WebsiteList;
