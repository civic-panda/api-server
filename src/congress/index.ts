import { convertKeysToCamelCase } from '../util';

const congress = convertKeysToCamelCase(require('../../data/legislators-current.json')) as CongressPerson[];

interface Term {
  start: string;
  end: string;
  state: string;
  party: string;
  caucus: string;
  partyAffiliations: string;
  url: string;
  address: string;
  phone: string;
  fax: string;
  contactForm: string;
  office: string;
  rssUrl: string;
}

interface RepTerm extends Term {
  type: 'rep';
  district: number;
}

interface SenTerm extends Term {
  type: 'sen';
  class: number;
  stateRank: 'junior' | 'senior';
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
    houseHistory: number;
    icpsr: number;
  };
  name: {
    first: string;
    middle: string;
    last: string;
    nickname?: string;
    suffix?: string;
    officialFull?: string;
  };
  bio: {
    birthday: string;
    gender: 'M' | 'F';
    religion?: string;
  };
  terms: (SenTerm | RepTerm)[];
}

export const getRepresentatives = (state: string, district: number) =>
  congress.filter((congressPerson) => {
    const latestTerm = congressPerson.terms[congressPerson.terms.length - 1];
    return latestTerm.type === 'rep' && latestTerm.state === state && latestTerm.district === district;
  });

export const getSenators = (state: string) =>
  congress.filter((congressPerson) => {
    const latestTerm = congressPerson.terms[congressPerson.terms.length - 1];
    return latestTerm.type === 'sen' && latestTerm.state === state;
  });
