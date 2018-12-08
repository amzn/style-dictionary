import React, { Component } from 'react';
import logo from './styled-components-logo.png';
import styled from 'styled-components';

import * as tokens from '../../style-dictionary-dist/variables.js';

const Box = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  margin: `${tokens.SpacingMedium} auto 0`,
  padding: tokens.SpacingLarge,
  backgroundColor: tokens.ColorBackground,
  borderRadius: '10px',
});

const Media = styled.img`
  flex: 0 0 auto;
  display: block;
  width: 100px;
  height: 100px;
`;

const Text = styled.div({
  marginLeft: tokens.SpacingLarge,
  fontFamily: tokens.FontFamilyBase,
  fontSize: tokens.SizeTextBase,
  textAlign: 'left',
  color: tokens.ColorText,
});

const Description = styled.h3({
  margin: `0 0 ${tokens.SpacingSmall} 0`,
  fontSize: tokens.SizeTextLarge,
});

const Reference = styled.p({
  margin: 0,
  fontFamily: tokens.FontFamilyCode,
});

const Link = styled.a({
  color: tokens.ColorBasePrimary,
});

class MyComponent extends Component {
  render() {
    return (
      <Box>
          <Media src={logo} alt="Styled Components logo" />
          <Text>
            <Description>
              This component is styled with Styled Components and Style Dictionary tokens
            </Description>
            <Reference>More information about Styled Components: <Link href="https://www.styled-components.com/" target="_blank" rel="noopener noreferrer">styled-components.com</Link></Reference>
          </Text>
      </Box>
    );
  }
}

export default MyComponent;
