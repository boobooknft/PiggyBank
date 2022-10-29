import {
  createStyles,
  Header,
  Container,
  Group,
  Burger,
  Transition,
  Paper,
  Title,
  Text
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ConnectKitButton } from 'connectkit'
import Link from 'next/link'
import { useState } from 'react'


const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
  
  root: {
    position: 'relative',
    zIndex: 1,
  },

  dropdown: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: 'hidden',

    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },

  inner: {
    height: HEADER_HEIGHT,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
    [theme.fn.smallerThan('sm')]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  linkLabel: {
    marginRight: 5,
  },
}));


import React from 'react'
import { Links } from './Links'

const Nav = () => {
  const { classes, cx } = useStyles();
  const [opened, { toggle, close }] = useDisclosure(false);
  const [active, setActive] = useState(Links[0].link);


  const items = Links.map((link) => {     
    return (
      <Link
        key={link.label}
        href={link.link}
        passHref 
       >
        <a
        className={cx(classes.link, { [classes.linkActive]: active === link.link })} 
          onClick={(event) => {
          // event.preventDefault();
          setActive(link.link);
          close();
        }}
        >
          {link.label}
        </a>
        </Link>
      
    );
  });

  return (
    <Header height={HEADER_HEIGHT} className={classes.root} position='sticky'>
      <Container className={classes.header}>
        <Group style={{width: "1100px"}} mx="auto">
          <Title order={2}>
            <Text component="span" color="gray.1">Piggy</Text><Text component="span" color="brand.8">Bank</Text>
          </Title>
          <Group className={classes.links} mx="auto" position="center" spacing={30}>
            {items}
            <ConnectKitButton />
          </Group> 
            <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />
          <Transition transition="pop-top-left" duration={200} mounted={opened}>
            {(styles) => (
              <Paper className={classes.dropdown} withBorder style={styles}>
                {items}
                <ConnectKitButton />
              </Paper>
            )} 

          </Transition>     
        </Group> 
      </Container>
    </Header>
  );
}
export default Nav