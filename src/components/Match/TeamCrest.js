import React from "react";
import { styled, Box } from "@mui/material";
import LazyLoad from "react-lazyload";

export default function TeamCrest({ size, name, image }) {
    const TeamCrest = styled(Box)`
    max-width: ${size};
    max-height: ${size};
    img {
      max-width: ${size};
      max-height: ${size};
    }
    margin: 0.1rem;
  `;

    return (
        <TeamCrest size={size}>
            <img
                src={image}
                alt={`${name} Logo`}
            ></img>
        </TeamCrest>
    );
}