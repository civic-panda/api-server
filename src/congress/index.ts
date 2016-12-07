const congress: CongressPerson[] = require('../../data/legislators-current.json');

interface Term {
  type: 'rep' | 'sen';
  start: string;
  end: string;
  state: string;
  district?: number;
  class?: number;
  state_rank: string;
  party: string;
  caucus: string;
  party_affiliations: string;
  url: string;
  address: string;
  phone: string;
  fax: string;
  contact_form: string;
  office: string;
  rss_url: string;
}

interface CongressPerson {
  id: {
    bioguide: string;
    thomas: string;
    govtrack: number;
    opensecrets: string;
    votesmart: number;
    fec: string[];
    cspan: number;
    wikipedia: string;
    ballotpedia: string;
    maplight: number;
    house_history: number;
    icpsr: number;
  },
  name: {
    first: string;
    middle: string;
    last: string;
    nickname?: string;
    suffix?: string;
    official_full?: string;
  },
  bio: {
    birthday: string;
    gender: 'M' | 'F';
    religion?: string;
  },
  terms: Term[],
}

export const getRepresentatives = (state: string, district: number) =>
  congress.filter((congressPerson) => {
    const latestTerm = congressPerson.terms[congressPerson.terms.length - 1];
    return latestTerm.state === state && latestTerm.district === district;
  });

export const getSenators = (state: string) =>
  congress.filter((congressPerson) => {
    const latestTerm = congressPerson.terms[congressPerson.terms.length - 1];
    return latestTerm.state === state && latestTerm.type === 'sen';
  });
