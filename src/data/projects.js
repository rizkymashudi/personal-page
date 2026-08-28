import { CARD_FILLS } from '../lib/palette.js';

export const RAW_PROJECTS = [
  {
    id: 1,
    name: 'Banking',
    desc: 'Led a 3-person iOS team within a 25-person cross-functional squad at one of Indonesia\'s largest private banks. Shipped 10+ features and delivered 93% of committed scope, establishing reusable iOS foundation components.',
    tags: ['Swift', 'Clean Architecture', 'Team Lead', 'Modular', 'Banking'],
    rotate: -3,
  },
  {
    id: 2,
    name: 'Telecom',
    desc: 'Sole architect of an internal localization & asset SDK for Indonesia\'s largest mobile operator. Introduced delta-based sync, cutting first-launch memory ~57% and launch CPU from 22% to 3.8%. Adopted across multiple feature teams.',
    tags: ['Swift', 'SDK Development', 'Clean Architecture', 'System Design', 'Telecom'],
    rotate: 2,
  },
  {
    id: 3,
    name: 'Precious Metals Marketplace',
    desc: 'Built features for a digital precious metals marketplace, covering gold trading and investment flows with a reusable design token system.',
    tags: ['Swift', 'MVVM', 'Clean Architecture', 'Design Token System', 'Fintech', 'Marketplace'],
    rotate: -1.5,
  },
  {
    id: 4,
    name: 'Digital Investment',
    desc: 'Contributed feature development on a leading Indonesian investment app serving retail stock and mutual fund investors.',
    tags: ['Swift', 'Multi Design Pattern', 'Modular', 'Fintech', 'Investment'],
    rotate: 3,
  },
  {
    id: 5,
    name: 'Sharia Digital Finance',
    desc: 'Coordinated a cross-platform mobile team on a sharia-compliant digital financial service. Owned task breakdown, code reviews, and sprint delivery.',
    tags: ['Swift', 'MVVM', 'Team Coordinator', 'Fintech', 'Sharia'],
    rotate: -2,
  },
  {
    id: 6,
    name: 'Government Services: Hajj',
    desc: 'Contributed to a hajj pilgrimage monitoring app, helping Indonesian citizens track their journey status and documentation.',
    tags: ['Swift', 'UIKit', 'Government', 'Public Service'],
    rotate: 1.5,
  },
  {
    id: 7,
    name: 'Sports',
    desc: 'Coordinated iOS development for a football club app covering match updates, team info, and fan engagement features.',
    tags: ['Swift', 'MVVM', 'Team Coordinator', 'Sports'],
    rotate: -3.5,
  },
  {
    id: 8,
    name: 'Public Transit',
    desc: 'Led a 4-person mobile team (iOS + Android) on an official metropolitan MRT transit app for daily commuters. Owned task breakdown, code reviews, sprint execution, and production releases.',
    tags: ['Swift', 'Mobile Lead', 'Clean Architecture', 'Transit'],
    rotate: 2.5,
  },
  {
    id: 9,
    name: 'E-commerce',
    desc: 'Built features for a flagship e-commerce platform selling electronics and gadgets across Indonesia.',
    tags: ['Swift', 'UIKit', 'E-commerce', 'Retail'],
    rotate: -1,
  },
  {
    id: 10,
    name: 'Government Health Services',
    desc: 'Owned end-to-end feature implementation on a national-scale government health service app serving millions of workers managing social security and health claims.',
    tags: ['Swift', 'MVVM', 'Government', 'National Scale'],
    rotate: 3.5,
  },
  {
    id: 11,
    name: 'Streaming & Media',
    desc: 'Built features for major Indonesian streaming platforms, high-traffic consumer apps with large user bases.',
    tags: ['UIKit', 'Streaming', 'Media', 'High Traffic'],
    rotate: -2.5,
  },
  {
    id: 12,
    name: 'Crypto Exchange',
    desc: 'Contributed feature development on a cryptocurrency exchange platform, handling trading flows and digital asset management.',
    tags: ['Swift', 'Clean Architecture', 'Fintech', 'Crypto'],
    rotate: 1,
  },
  {
    id: 13,
    name: 'Edtech',
    desc: 'Contributed feature development on a high-traffic education platform serving millions of Indonesian students.',
    tags: ['UIKit', 'Clean Architecture', 'Edtech'],
    rotate: -3,
  },
  {
    id: 14,
    name: 'Sleeplance: watchOS companion',
    desc: 'Sleep tracking wearable app with a WatchOS companion. Evolved through challenge iterations from MVP to TestFlight release.',
    tags: ['WatchKit', 'HealthKit', 'SwiftUI', 'TestFlight'],
    rotate: 2.5,
    isLast: true,
  },
];

export const PROJECTS = RAW_PROJECTS.map((p, i) => ({
  ...p,
  fill: CARD_FILLS[i % CARD_FILLS.length],
}));

export const SUBTITLE_TEXT = '13+ client projects delivered end-to-end. From SDK architecture to banking and government apps at national scale.';
