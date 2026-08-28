// Bio phrases — highlights array marks text that gets the .highlight class
export const BIO_PHRASES = [
  {
    segments: [
      { text: 'Rizky Mashudi', highlight: true },
      { text: ' is an iOS engineer based in Jakarta, Indonesia, with 5+ years of experience, including 4+ years shipping production iOS apps across fintech, banking, government, and telecom.' },
    ],
  },
  {
    segments: [
      { text: 'A graduate of the ' },
      { text: 'Apple Developer Academy', highlight: true },
      { text: ' and currently enrolled at the ' },
      { text: 'Essential Developer Academy', highlight: true },
      { text: ' (London), he continuously invests in clean architecture, TDD, and engineering excellence.' },
    ],
  },
  {
    segments: [
      { text: 'With ' },
      { text: '13+ client projects', highlight: true },
      { text: ' delivered end-to-end, he works as both individual contributor and ' },
      { text: 'team lead', highlight: true },
      { text: ', architecting an internal SDK adopted across multiple feature teams, leading 3–4 person mobile squads, and sharing what he learns on ' },
      { text: 'Medium @ikyrm', highlight: true },
      { text: '.' },
    ],
  },
];

export const LINK_CARDS = [
  { href: 'https://www.linkedin.com/in/rizky-mashudi', label: 'LinkedIn', color: 'cyan', external: true },
  { href: 'https://github.com/rizkymashudi', label: 'GitHub', color: 'lime', external: true },
  { href: 'https://medium.com/@ikyrm', label: 'Medium blog', color: 'yellow', external: true },
  { href: 'mailto:eremism1@gmail.com', label: 'Email', color: 'magenta', external: false },
];
