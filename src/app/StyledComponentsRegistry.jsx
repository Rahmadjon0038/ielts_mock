"use client";

import React from "react";
import { StyleSheetManager } from "styled-components";

export default function StyledComponentsRegistry({ children }) {
  return <StyleSheetManager>{children}</StyleSheetManager>;
}