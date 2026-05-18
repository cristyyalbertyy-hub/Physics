export type GroupId = 'M' | 'EM' | 'VW' | 'T' | 'N' | 'F';

export type Subchapter = {
  id: string;
  title: string;
  /** Short code used in filenames, e.g. M + K → M_K_V.mp4 */
  code: string;
  /** Two MP4 files: <stem>_V.mp4 and <stem>_Vs.mp4 (Radioactivity, Nuclear Forces). */
  dualVideo?: boolean;
  /** Only <stem>_Vs.mp4 exists (e.g. MRI and NMR). */
  videoVsOnly?: boolean;
  /** When filenames do not follow Group_Code_Type (exceptional paths only) */
  questionnairePath?: string;
  /** When infographic is not Group_Code_I.png (e.g. EM_M.png) */
  infographicPath?: string;
  /**
   * Fluids assets use only the group letter (F_P.m4a, F_I.png, F_V.mp4, F_Q.csv),
   * not F_FL_*.
   */
  groupOnlyAssetNames?: boolean;
};

export type Group = {
  id: GroupId;
  title: string;
  subchapters: Subchapter[];
};

/** Curricula as in the course map; UI is English. */
export const groups: Group[] = [
  {
    id: 'M',
    title: 'Mechanics',
    subchapters: [
      { id: 'm-mu', title: 'Measurement and Units', code: 'MU' },
      { id: 'm-k', title: 'Kinematics', code: 'K' },
      { id: 'm-nl', title: "Newton's Laws", code: 'NL' },
      { id: 'm-we', title: 'Work and Energy', code: 'WE' },
      { id: 'm-rm', title: 'Rotational Motion', code: 'RM' },
    ],
  },
  {
    id: 'EM',
    title: 'Electricity & Magnetism',
    subchapters: [
      { id: 'em-cf', title: 'Electric Charge and Field', code: 'ECF' },
      { id: 'em-ep', title: 'Electric Potential', code: 'EP' },
      {
        id: 'em-cc',
        title: 'Electric Currents and DC Circuits',
        code: 'ECDC',
        questionnairePath: '/EM_ECDC_Q_.csv',
      },
      { id: 'em-mg', title: 'Magnetism', code: 'M', infographicPath: '/EM_M.png' },
      { id: 'em-ei', title: 'Electromagnetic Induction', code: 'EI' },
    ],
  },
  {
    id: 'VW',
    title: 'Vibrations & Waves',
    subchapters: [
      { id: 'vw-ws', title: 'Wave Motion and Sound', code: 'WMS' },
      { id: 'vw-ew', title: 'Electromagnetic Waves', code: 'EW' },
      { id: 'vw-lo', title: 'Light and Optics', code: 'LO' },
      { id: 'vw-xr', title: 'X-Rays and CT Scans', code: 'XRC' },
    ],
  },
  {
    id: 'T',
    title: 'Thermodynamics',
    subchapters: [
      { id: 't-tk', title: 'Temperature and Kinetic Theory', code: 'TK' },
      { id: 't-hc', title: 'Heat and Calorimetry', code: 'HC' },
      { id: 't-tl', title: 'Thermodynamic Laws', code: 'TL' },
    ],
  },
  {
    id: 'N',
    title: 'Nuclear Physics',
    subchapters: [
      { id: 'n-r', title: 'Radioactivity', code: 'R', dualVideo: true },
      { id: 'n-nf', title: 'Nuclear Forces', code: 'NF', dualVideo: true },
      { id: 'n-mn', title: 'MRI and NMR', code: 'MN', videoVsOnly: true },
    ],
  },
  {
    id: 'F',
    title: 'Fluids',
    subchapters: [
      {
        id: 'f-core',
        title: 'Properties, pressure, and flow',
        code: 'FL',
        groupOnlyAssetNames: true,
      },
    ],
  },
];

export type MediaKind = 'I' | 'Q';

export function buildStem(groupId: GroupId, subCode: string): string {
  return `${groupId}_${subCode}`;
}

/** Main clip _V.mp4 or companion _Vs.mp4. Fluids (group-only names): F_V.mp4 / F_Vs.mp4. */
export function videoUrl(groupId: GroupId, sub: Subchapter, slot: 'V' | 'Vs'): string {
  if (sub.groupOnlyAssetNames && groupId === 'F') {
    return slot === 'Vs' ? '/F_Vs.mp4' : '/F_V.mp4';
  }
  const stem = buildStem(groupId, sub.code);
  return slot === 'Vs' ? `/${stem}_Vs.mp4` : `/${stem}_V.mp4`;
}

/** Podcast: N_R_P.m4a, etc. Fluids: F_P.m4a. */
export function podcastUrl(groupId: GroupId, sub: Subchapter): string {
  if (sub.groupOnlyAssetNames && groupId === 'F') return '/F_P.m4a';
  return `/${buildStem(groupId, sub.code)}_P.m4a`;
}

/** Infographic PNG. Fluids: F_I.png. */
export function infographicUrl(groupId: GroupId, sub: Subchapter): string {
  if (sub.infographicPath) return sub.infographicPath;
  if (sub.groupOnlyAssetNames && groupId === 'F') return '/F_I.png';
  return `/${buildStem(groupId, sub.code)}_I.png`;
}

export function mediaUrl(groupId: GroupId, subCode: string, kind: MediaKind): string {
  const stem = buildStem(groupId, subCode);
  if (kind === 'I') return `/${stem}_I.png`;
  return `/${stem}_Q.csv`;
}

export function questionnairePathFor(groupId: GroupId, sub: Subchapter): string {
  if (sub.questionnairePath) return sub.questionnairePath;
  if (sub.groupOnlyAssetNames && groupId === 'F') return '/F_Q.csv';
  return mediaUrl(groupId, sub.code, 'Q');
}
