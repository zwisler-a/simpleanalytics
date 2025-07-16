import { useState } from "react";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export function AddWebsiteDialog({ onAdd, onClose }: { onAdd: (site: any) => void; onClose: () => void }) {
    const [name, setName] = useState("");
    const [id, setId] = useState("");

    const handleSubmit = () => {
        fetch("/api/website/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(id ? { name, id } : { name }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (!data.error) {
                    onAdd(data.data);
                    onClose();
                }
            });
    };

    return (
        <Dialog open onClose={onClose}>
            <DialogTitle>Add Website</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Website name"
                    type="text"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Website ID (optional)"
                    type="text"
                    fullWidth
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    helperText="Leave blank to auto-generate a UUID."
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">Add</Button>
            </DialogActions>
        </Dialog>
    );
}