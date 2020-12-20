import React from 'react';
import LandingLogo from '../../assets/landing.svg';
import logo from '../../assets/volunteersense.png';
export const Nav30DataSource = {
  wrapper: { className: 'header3 home-page-wrapper jzih1dpqqrg-editor_css' },
  page: { className: 'home-page' },
  logo: {
    className: 'header3-logo jzjgnya1gmn-editor_css',
    children: logo,
  },
  Menu: {
    className: 'header3-menu',
    children: [
      {
        name: 'item1',
        className: 'header3-item',
        children: {
          href: '/login',
          children: [{ children: <p>Log in</p>, name: 'text' }],
        },
      },
      {
        name: 'item2',
        className: 'header3-item',
        children: {
          href: '/register',
          children: [{ children: <p>Register</p>, name: 'text' }],
        },
      },
    ],
  },
  mobileMenu: { className: 'header3-mobile-menu' },
};
export const Banner50DataSource = {
  wrapper: { className: 'home-page-wrapper banner5' },
  page: { className: 'home-page banner5-page' },
  childWrapper: {
    className: 'banner5-title-wrapper',
    children: [
      { name: 'title', children: 'Connect with your volunteers', className: 'banner5-title' },
      {
        name: 'explain',
        className: 'banner5-explain',
        children: 'Build and engage your community with our volunteer management system.',
      },
      {
        name: 'button',
        className: 'banner5-button-wrapper',
        children: {
          href: '#Feature0_0',
          className: 'banner5-button',
          type: 'primary',
          children: 'Learn more',
        },
      },
    ],
  },
  image: {
    className: 'banner5-image',
    children: LandingLogo,
  },
};
export const Feature00DataSource = {
  wrapper: { className: 'home-page-wrapper content0-wrapper' },
  page: { className: 'home-page content0' },
  OverPack: { playScale: 0.3, className: '' },
  titleWrapper: {
    className: 'title-wrapper',
    children: [
      { name: 'title', children: 'About VolunteerSense' },
      { name: 'explain', children: 'Our secret recipe for wrangling your volunteers.' }
    ],
  },
  childWrapper: {
    className: 'content0-block-wrapper',
    children: [
      {
        name: 'block0',
        className: 'content0-block',
        md: 8,
        xs: 24,
        children: {
          className: 'content0-block-item',
          children: [
            {
              name: 'image',
              className: 'content0-block-icon',
              children:
                'https://zos.alipayobjects.com/rmsportal/WBnVOjtIlGWbzyQivuyq.png',
            },
            {
              name: 'title',
              className: 'content0-block-title',
              children: 'Recruit',
            },
            { name: 'content', children: 'Easily onboard new volunteers and track their progress in signing required clearances.' },
          ],
        },
      },
      {
        name: 'block1',
        className: 'content0-block',
        md: 8,
        xs: 24,
        children: {
          className: 'content0-block-item',
          children: [
            {
              name: 'image',
              className: 'content0-block-icon',
              children:
                'https://zos.alipayobjects.com/rmsportal/YPMsLQuCEXtuEkmXTTdk.png',
            },
            {
              name: 'title',
              className: 'content0-block-title',
              children: 'Engage',
            },
            {
              name: 'content',
              children: 'Alert your community about new opportunities to get involved.',
            },
          ],
        },
      },
      {
        name: 'block2',
        className: 'content0-block',
        md: 8,
        xs: 24,
        children: {
          className: 'content0-block-item',
          children: [
            {
              name: 'image',
              className: 'content0-block-icon',
              children:
                'https://zos.alipayobjects.com/rmsportal/EkXWVvAaFJKCzhMmQYiX.png',
            },
            {
              name: 'title',
              className: 'content0-block-title',
              children: 'Retain',
            },
            {
              name: 'content',
              children: 'Remind your volunteers about upcoming events and solicit their feedback.',
            },
          ],
        },
      },
    ],
  },
};
export const Footer20DataSource = {
  wrapper: { className: 'home-page-wrapper footer2-wrapper' },
  OverPack: { className: 'home-page footer2', playScale: 0.05 },
  copyright: {
    className: 'copyright',
    children: [
      {
        name: 'copyright',
        children: 'Copyright © VolunteerSense',
        className: 'copyright-text',
      },
    ],
  },
  links: {
    className: 'links',
    children: [],
  },
};
