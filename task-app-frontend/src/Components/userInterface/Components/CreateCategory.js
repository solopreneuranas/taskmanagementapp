import React, { useRef } from 'react';
import { Grid, TextField, Button, Avatar } from '@mui/material';
import { useState, useEffect } from 'react';
import { postData, getData } from '../../../Services/FetchNodeServices';
import Swal from 'sweetalert2';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Dialog from '@mui/material/Dialog';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const useStyles = makeStyles((theme) => ({
    roundedTextField: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 12
        },
    },
}))

export default function CreateCategory() {

    var user = JSON.parse(localStorage.getItem("User"))
    const theme = useTheme();
    const matches_md = useMediaQuery(theme.breakpoints.down('md'));
    const matches_sm = useMediaQuery(theme.breakpoints.down('sm'));
    const [userId, setUserId] = useState(user[0]._id)
    const classes = useStyles();
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [getErrors, setErrors] = useState('')

    const handleError = (error, label) => {
        setErrors((prev) => ({ ...prev, [label]: error }))
    }

    const validation = () => {
        var error = false
        if (category.length === 0) {
            error = true
            handleError('Please enter Categpry', 'category')
        }
        return error
    }

    const handleCreateCategory = async () => {
        var error = validation()
        if (error === false) {
            var body = { 'categoryname': category, 'description': description, 'userid': userId }
            var response = await postData('category/create-category', body)
            if (response.status === true) {
                Swal.fire({
                    icon: 'success',
                    toast: true,
                    title: 'Category Created!'
                })
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Category not Created!'
                })
            }
        }
    }

    const handleReset = () => {
        setCategory('')
        setDescription('')
    }

    return (
        <div style={{ padding: '2%'}}>
            <Grid container spacing={1} style={{ display: 'flex', alignItems: 'center' }}>
                <Grid item md={7} style={{ background: 'white', borderRadius: matches_md ? 20 : 30, width: '100%', padding: matches_md ? '6%' : '3%' }}>
                    <Grid item md={12}>
                        <h2 style={{ margin: 0, fontWeight: 600, fontSize: 23 }}>Create Category</h2><br />
                    </Grid>
                    <Grid item md={12}>
                        <TextField
                            onFocus={() => handleError('', 'category')}
                            error={getErrors.category}
                            helperText={getErrors.category}
                            onChange={(e) => setCategory(e.target.value)} label="Category name" variant="outlined" fullWidth className={classes.roundedTextField} />
                    </Grid>
                    <Grid item md={12} style={{ marginTop: '3%' }}>
                        <TextField
                            onChange={(e) => setDescription(e.target.value)} label="Description" variant="outlined" fullWidth className={classes.roundedTextField} />
                    </Grid>
                    <Grid item md={7} style={{ marginTop: '2%' }}>
                        <Button onClick={handleCreateCategory} variant='contained' style={{ width: 100, background: '#53569A', padding: '3% 9%', margin: '5% 2% 0', boxShadow: 'none' }}>
                            ADD
                        </Button>
                        <Button onClick={handleReset} variant='outlined' style={{ width: 100, background: 'white', padding: '3% 9%', margin: '5% 2% 0', boxShadow: 'none', border: '1px solid #53569A', color: '#53569A' }}>
                            CANCEL
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </div >
    );
}
