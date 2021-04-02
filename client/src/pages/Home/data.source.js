import React from 'react';
import LandingLogo from '../../assets/landing.svg';
import AboutImage from '../../assets/AboutImage.svg';
import Recruit from '../../assets/Recruit.svg';
import Onboard from '../../assets/Onboard.svg';
import Engage from '../../assets/Engage.svg';
import Retain from '../../assets/Retain.svg';
import Analyze from '../../assets/Analyze.svg';
import Automate from '../../assets/Automate.svg';
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
        children: 'Build and engage your community with our volunteer management platform.',
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
export const Feature10DataSource = {
  wrapper: { className: 'home-page-wrapper content1-wrapper' },
  OverPack: { className: 'home-page content1', playScale: 0.3 },
  imgWrapper: { className: 'content1-img', md: 12, xs: 24 },
  textWrapper: { className: 'content1-text', md: 10, xs: 24 },
  title: {
    className: 'content1-title',
    children: (
      <span>
        <span>
          <span>
            <span>
              <blockquote>About VolunteerSense</blockquote>
            </span>
          </span>
        </span>
      </span>
    ),
  },
  content: {
    className: 'content1-content',
    children: (
      <span>
        <p>VolunteerSense is designed to help nonprofits onboard, engage, and retain volunteers by serving as a 
          single source of truth for nonprofits to interface with their volunteers. This volunteer management 
          platform allows nonprofits to automate key volunteer interactions, enabling them to move away from 
          inefficient methods of volunteer management, scale up their volunteer community, and refocus on 
          what's really important: <i>advancing their mission.</i> </p>
      </span>
    ),
  },
  image: {
    className: 'banner5-image',
    children: AboutImage,
  },
};
export const Feature00DataSource = {
  wrapper: { className: 'home-page-wrapper content0-wrapper' },
  page: { className: 'home-page content0' },
  OverPack: { playScale: 0.3, className: '' },
  titleWrapper: {
    className: 'title-wrapper',
    children: [
      { name: 'title', children: 'Why Use VolunteerSense?' },
      { name: 'explain', children: 'Are you a nonprofit that finds itself spending hours entering data into Excel or filing paperwork ' + 
      'in order to manage your volunteers? Are these time consuming tasks preventing your nonprofit from scaling up your volunteer base (and ' +
      'your impact)? VolunteerSense will allow your nonprofit to manage volunteers in a fraction of the time, easily engage volunteers, and ' + 
      'expand your volunteer base. Still unsure if you should switch to VolunteerSense? Check out a few of our key features below.' }
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
              children: Recruit,
            },
            {
              name: 'title',
              className: 'content0-block-title',
              children: 'Recruit',
            },
            { name: 'content', children: 'Easily invite new volunteers and allow VolunteerSense to track volunteer event sign-ups for you automatically.' },
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
              children: Onboard,
            },
            {
              name: 'title',
              className: 'content0-block-title',
              children: 'Onboard',
            },
            { name: 'content', children: 'Say goodbye to filing volunteer permission slips and waivers. Manage these \'clearances\' with just a few button clicks instead.'  },
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
              children: Engage,
            },
            {
              name: 'title',
              className: 'content0-block-title',
              children: 'Engage',
            },
            {
              name: 'content',
              children: 'Alert your community about new opportunities to get involved with a single click.',
            },
          ],
        },
      },
      {
        name: 'block3',
        className: 'content0-block',
        md: 8,
        xs: 24,
        children: {
          className: 'content0-block-item',
          children: [
            {
              name: 'image',
              className: 'content0-block-icon',
              children: Retain,
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
      {
        name: 'block4',
        className: 'content0-block',
        md: 8,
        xs: 24,
        children: {
          className: 'content0-block-item',
          children: [
            {
              name: 'image',
              className: 'content0-block-icon',
              children: Analyze,
            },
            {
              name: 'title',
              className: 'content0-block-title',
              children: 'Analyze',
            },
            {
              name: 'content',
              children: 'Use VolunteerSense\'s extensive analytics page to understand volunteer behavior and how best to engage with your community.',
            },
          ],
        },
      },
      {
        name: 'block5',
        className: 'content0-block',
        md: 8,
        xs: 24,
        children: {
          className: 'content0-block-item',
          children: [
            {
              name: 'image',
              className: 'content0-block-icon',
              children: Automate,
            },
            {
              name: 'title',
              className: 'content0-block-title',
              children: 'Automate',
            },
            {
              name: 'content',
              children: 'Automatically track volunteers\' service hours and remind volunteers to attend events they\'ve signed up for.',
            },
          ],
        },
      },
    ],
  },
  image: {
    className: 'banner5-image',
    children: Recruit,
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
