import React, { useRef } from 'react';
import { Grid, TextField, Button, Avatar } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import FolderIcon from '@mui/icons-material/Folder';
import { postData, getData } from '../../../Services/FetchNodeServices';
import { Editor } from '@tinymce/tinymce-react';
import Autocomplete from '@mui/material/Autocomplete';
import Swal from 'sweetalert2';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Dialog from '@mui/material/Dialog';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import RecentAssignedTasks from './RecentAssignedTasks';
import AppCalendar from './AppCalendar';

const useStyles = makeStyles((theme) => ({
    roundedTextField: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 12
        },
    },
}))

export default function CreateTask(props) {

    var user = JSON.parse(localStorage.getItem("User"))
    const classes = useStyles()
    const theme = useTheme();
    const matches_md = useMediaQuery(theme.breakpoints.down('md'));
    const matches_sm = useMediaQuery(theme.breakpoints.down('sm'));
    const [userId, setUserId] = useState(user[0]._id)
    const [taskName, setTaskName] = useState('')
    const [description, setDescription] = useState('')
    const [deadline, setDeadline] = useState('')
    const [category, setCategory] = useState('')
    const [tags, setTags] = useState('')
    const [chipData, setChipData] = useState([]);
    const [getErrors, setErrors] = useState('')
    const [databaseCategory, SetDatabaseCategory] = useState([])

    const fetchCategories = async () => {
        var body = { 'userid': userId }
        var response = await postData('category/display_all_category_by_user', body)
        SetDatabaseCategory(response.data)
    }

    useEffect(function () {
        fetchCategories()
    }, [])

    const handleError = (error, label) => {
        setErrors((prev) => ({ ...prev, [label]: error }))
    }

    const validation = () => {
        var error = false
        if (taskName.length === 0) {
            error = true
            handleError('Please enter Task Name', 'taskName')
        }
        if (deadline.length === 0) {
            error = true
            handleError('Please select Deadline', 'deadline')
        }
        return error
    }

    const handleDeadline = (deadline) => {
        setDeadline(deadline)
        handleError('', 'deadline')
    }

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    }

    const handleTagsInputChange = (event) => {
        setTags(event.target.value);
    }

    const ListItem = styled('li')(({ theme }) => ({
        margin: theme.spacing(0.5),
    }))

    const handleAddTags = () => {
        if (tags.trim() !== '') {
            const newTag = tags
            setChipData([...chipData, newTag])
            setTags('')
        }
    }

    var tagsString = chipData.join(',');

    const handleDelete = (chipToDelete) => () => {
        setChipData((chips) => chips.filter((chip) => chip !== chipToDelete));
    }

    const handleTagsInputKeyPress = (event) => {
        if (event.key === 'Enter' || event.key === ',') {
            setTags('');
            handleAddTags();
        }
    }

    const handleCreateTask = async () => {
        var error = validation()
        if (error === false) {
            var body = { 'userid': userId, 'taskname': taskName, 'description': description, 'category': category, 'tags': tagsString, 'deadline': deadline }
            var response = await postData('task/create-task', body)
            if (response.status === true) {
                Swal.fire({
                    icon: 'success',
                    toast: true,
                    title: 'Task added!'
                })
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Task not added!'
                })
            }
        }
    }

    const categoryItems = () => {
        return (
            databaseCategory.map((item) => {
                return (
                    <MenuItem value={item._id}>{item.categoryname}</MenuItem>
                )
            })
        )
    }

    return (
        <div style={{ padding: '2%' }}>
            <Grid container spacing={3} style={{ display: 'flex', alignItems: 'start' }}>
                <Grid item md={7} style={{ width: '100%', boxShadow: '0 5px 10px 5px #e9e9f3', background: 'white', borderRadius: matches_md ? 20 : 30, padding: matches_md ? '6%' : '3%', margin: 0 }}>
                    <Grid item md={12} style={{ paddingTop: 24 }}>
                        <h2 style={{ margin: 0, fontWeight: 600, fontSize: 23 }}>Create Task</h2><br />
                    </Grid>
                    <Grid item md={12}>
                        <TextField
                            onFocus={() => handleError('', 'taskName')}
                            error={getErrors.taskName}
                            helperText={getErrors.taskName}
                            onChange={(e) => setTaskName(e.target.value)} label="Task name" variant="outlined" fullWidth className={classes.roundedTextField} />
                    </Grid>
                    <Grid item md={12} style={{ marginTop: '3%' }}>
                        <TextField
                            onChange={(e) => setDescription(e.target.value)} label="Description" variant="outlined" fullWidth className={classes.roundedTextField} />
                    </Grid>
                    <Grid item md={12} style={{ marginTop: '3%' }}>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <FormControl fullWidth className={classes.roundedTextField}>
                                    <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                    <Select
                                        value={category}
                                        label="Category"
                                        onChange={handleCategoryChange}>
                                        {categoryItems()}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    className={classes.roundedTextField}
                                    fullWidth
                                    label='Tags'
                                    variant='outlined'
                                    value={tags}
                                    onChange={handleTagsInputChange}
                                    onKeyPress={handleTagsInputKeyPress}
                                />
                                <Paper
                                    sx={{
                                        background: 'transparent',
                                        display: 'flex',
                                        justifyContent: 'left',
                                        flexWrap: 'wrap',
                                        listStyle: 'none',
                                        boxShadow: 'none',
                                        p: 0.5,
                                        m: 0,
                                    }}
                                    component="ul"
                                >
                                    {chipData.map((item, i) => {
                                        let icon;

                                        if (item === 'React') {
                                            icon = <TagFacesIcon />;
                                        }

                                        return (
                                            <ListItem key={i}>
                                                <Chip
                                                    icon={icon}
                                                    label={item}
                                                    onDelete={item === 'React' ? undefined : handleDelete(item)}
                                                />
                                            </ListItem>
                                        );
                                    })}
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item md={6} style={{ marginTop: '2%' }}>
                        <Button onClick={handleCreateTask} variant='contained' style={{ width: 100, background: '#53569A', padding: '3% 9%', margin: '5% 2% 0', boxShadow: 'none' }}>
                            ADD
                        </Button>
                        <Button onClick={handleCreateTask} variant='outlined' style={{ width: 100, background: 'white', padding: '3% 9%', margin: '5% 2% 0', boxShadow: 'none', border: '1px solid #53569A', color: '#53569A' }}>
                            CANCEL
                        </Button>
                    </Grid>
                </Grid>
                <Grid item md={5} style={{ display: 'flex', justifyContent: 'center', alignItems: 'start', height: '100%', flexDirection: 'column' }}>
                    <AppCalendar deadline={deadline} setDeadline={setDeadline} />
                    <p style={{ color: '#FF0000', fontSize: '12.3px', marginLeft: '15px', marginTop: 0 }}>{getErrors.deadline}</p>
                </Grid>
            </Grid>
            <Grid container spacing={1} style={{ display: 'flex', alignItems: 'start', marginTop: '3%' }}>
                <Grid item md={6}>
                    <RecentAssignedTasks userid={userId} />
                </Grid>
            </Grid>
        </div >
    );
}
