import React from "react";
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineOppositeContent,
    TimelineDot
} from "@mui/lab";
import { Box, Typography } from "@mui/material";
import TeamCrest from "./TeamCrest";

export default function EventsTimeline({ events }) {
    console.log(events)

    return (
        <Box sx={{ display: "flex", justifyContent: "center", width: "fit-content" }}>
            <Timeline>
                {events ? events.map((event, index) => {
                    return (
                        <TimelineItem key={index}>
                            <TimelineOppositeContent color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
                                <Typography>{event.team.name}</Typography>
                                <TeamCrest size="48px" name={event.team.name} image={event.team.logo} />
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineDot />
                                {index + 1 !== events.length ? <TimelineConnector /> : null}
                            </TimelineSeparator>
                            <TimelineContent>
                                <Typography>{event.type}</Typography>
                            </TimelineContent>
                        </TimelineItem>
                    );
                }) : null}
            </Timeline>
        </Box>
    );
}