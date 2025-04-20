import {Box, Typography} from "@mui/material";
import React from "react";

const EmptyState = ({message}) => (
    <Box sx={{textAlign: "center", mt: 3, width: '100%'}}>
        <Typography variant="body1">{message}</Typography>
    </Box>
);

export default EmptyState;