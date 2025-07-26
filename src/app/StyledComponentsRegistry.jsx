'use client';

import React from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

export default function StyledComponentsRegistry({ children }) {
  const [sheet] = React.useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = sheet.getStyleElement();
    sheet.instance.clearTag(); // bu oldingi style'larni tozalaydi
    return <>{styles}</>;
  });

  return <StyleSheetManager sheet={sheet.instance}>{children}</StyleSheetManager>;
}
