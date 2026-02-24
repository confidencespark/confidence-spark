/**
 * Situations Constants
 *
 * Centralized list of situations for the Home screen.
 * Easy to update content without touching screen components.
 */
const H_1 = require('@assets/images/h_1.webp');
const H_2 = require('@assets/images/h_2.webp');
const H_3 = require('@assets/images/h_3.webp');
const H_4 = require('@assets/images/h_4.webp');
const H_5 = require('@assets/images/h_5.webp');
const H_6 = require('@assets/images/h_6.webp');

export const SITUATIONS = [
  {
    key: 'daily',
    title: 'Just Give Me a Daily Boost',
    sub: "You\u2019re not here to impress. You\u2019re here to connect.",
    image: H_1,
    redirect: 'LookupScreen',
  },
  {
    key: 'interview',
    title: 'Interview',
    sub: "You\u2019re not here to impress. You\u2019re here to connect.",
    image: H_2,
    redirect: 'ConfirmSituationScreen',
  },
  {
    key: 'negotiation',
    title: 'Negotiation',
    sub: 'Hold the line. Speak your worth.',
    image: H_3,
    redirect: 'ConfirmSituationScreen',
  },
  {
    key: 'performance',
    title: 'Performance',
    sub: 'Let go. Lock in. Light it up.',
    image: H_4,
    redirect: 'ConfirmSituationScreen',
  },
  {
    key: 'presentation',
    title: 'Presentation',
    sub: 'Your voice matters, make it heard.',
    image: H_5,
    redirect: 'ConfirmSituationScreen',
  },
  {
    key: 'pitch',
    title: 'Pitch',
    sub: "You\u2019re not asking, you\u2019re offering.",
    image: H_6,
    redirect: 'ConfirmSituationScreen',
  },
];
