import { styled } from "@mui/material/styles";
import {
    Button,
    Dialog,
    DialogTitle,
    Box,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
} from "@mui/material";

export const EventsContainer = styled(Box)(({ theme }) => ({
    maxWidth: 800,
    margin: "2rem auto",
    padding: "2.5rem",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    position: "relative",
    overflow: "hidden",
    textAlign: "center",
    "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        right: 0,
        width: "120px",
        height: "120px",
        background: "radial-gradient(circle, rgba(106,17,203,0.1) 0%, rgba(106,17,203,0) 70%)",
        zIndex: 0,
    },
}));

export const EventPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "all 0.3s ease",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    "&:hover": {
        transform: "translateY(-3px)",
        boxShadow: "0 8px 20px rgba(106, 17, 203, 0.1)",
    },
}));

export const CreateEventButton = styled(Button)(({ theme }) => ({
    background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
    color: "white",
    padding: "12px 24px",
    fontWeight: 600,
    borderRadius: "50px",
    boxShadow: "0 4px 15px rgba(106, 17, 203, 0.3)",
    transition: "all 0.3s ease",
    position: 'sticky',
    top: theme.spacing(2),
    zIndex: 1,
    alignSelf: 'flex-start',
    margin: `${theme.spacing(2)} 0`,
    "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 8px 25px rgba(106, 17, 203, 0.4)",
        background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
    },
}));

export const StyledAccordion = styled(Accordion)(({ theme }) => ({
    marginTop: theme.spacing(2),
    borderRadius: "12px !important",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    "&:before": {
        display: "none",
    },
}));

export const StyledDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-paper": {
        background: "white",
        padding: theme.spacing(3),
        borderRadius: "16px",
        maxWidth: "450px",
        width: "90%",
        boxShadow: "0 15px 40px rgba(0, 0, 0, 0.15)",
    },
}));

export const DialogTitleStyled = styled(DialogTitle)(({ theme }) => ({
    color: "#2c3e50",
    textAlign: "center",
    fontSize: "1.5rem",
    fontWeight: 700,
}));

export const SubmitButton = styled(Button)(({ theme }) => ({
    background: "linear-gradient(135deg, #28a745 0%, #218838 100%)",
    color: "white",
    boxShadow: "0 4px 15px rgba(40, 167, 69, 0.3)",
    "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 8px 25px rgba(40, 167, 69, 0.4)",
        background: "linear-gradient(135deg, #28a745 0%, #218838 100%)",
    },
}));

export const CancelButton = styled(Button)(({ theme }) => ({
    background: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
    color: "white",
    boxShadow: "0 4px 15px rgba(220, 53, 69, 0.3)",
    "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 8px 25px rgba(220, 53, 69, 0.4)",
        background: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
    },
}));

export const CompleteButton = styled(Button)(({ theme }) => ({
    background: "linear-gradient(135deg, #17a2b8 0%, #138496 100%)",
    color: "white",
    marginLeft: theme.spacing(1),
    "&:hover": {
        background: "linear-gradient(135deg, #17a2b8 0%, #138496 100%)",
    },
}));