import React, { useState } from "react";
import {
    styled,
    CardActions,
    CardContent,
    Collapse,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function Events({ match }) {
    const [expanded, setExpanded] = useState(false);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const ExpandMore = styled((props) => {

        const { expand, ...other } = props;
        return <IconButton {...other} size="large" />;
    })(({ theme, expand }) => ({
        transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
        marginLeft: "auto",
        transition: theme.transitions.create("transform", {
            duration: theme.transitions.duration.shortest,
        }),
    }));


    if (match.events && match.events.length > 0) {
        return (
            <>
                <CardActions disableSpacing sx={{ justifyContent: "center" }}>
                    <Typography
                        sx={{ fontSize: "16px", fontWeight: "400", textAlign: "center" }}
                    >
                        Events
                    </Typography>
                    <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        key={match.fixture.id}
                        aria-label="show events"
                        sx={{ marginLeft: "0" }}
                    >
                        <ExpandMoreIcon />
                    </ExpandMore>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent sx={{ overflow: "scroll", maxHeight: "200px" }}>
                        {match.events.map((event, index) => {
                            return (
                                <List key={index}>
                                    <ListItem
                                        sx={{
                                            img: {
                                                height: "24px",
                                                width: "24px",
                                            },
                                        }}
                                    >
                                        <ListItemText
                                            primary={`${event.time.elapsed}'`}
                                        ></ListItemText>
                                        <ListItemText primary={event.detail}></ListItemText>
                                        <img
                                            src={event.team.logo}
                                            alt={`${event.team.name} Logo`}
                                        ></img>
                                    </ListItem>
                                </List>
                            );
                        })}
                    </CardContent>
                </Collapse>
            </>
        );
    } else {
        return null;
    }
}