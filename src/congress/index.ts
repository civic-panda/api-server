export const congress = require('../../data/legislators-current.json') as CongressPerson[];
export const committees = require('../../data/committees-current.json') as Committee[];
export const committeeMembership = require('../../data/committee-membership-current.json') as CommitteeMembership;

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

export interface CongressPerson {
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

interface Committee {
  type: 'house' | 'senate' | 'joint';
  name: string;
  thomasId: string;
  senateCommitteeId?: string;
  houseCommitteeId?: string;
  jurisdiction: string;
  jurisdictionSource: string;
  url: string;
  address: string;
  phone: string;
  rssUrl: string;
  minorityRssUrl: string;

  subcommittees: Subcommittee[];
}

interface Subcommittee {
  name: string;
  thomasId: string;
  address: string;
  phone: string;
  wikipedia?: string;
}

interface Membership {
  name: string;
  party: string;
  rank: number;
  title: string;
  bioguide: string;
  thomas: string;
}

interface CommitteeMembership {
  [id: string]: Membership[];
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

export const getCommitteeMembers = (committeeId: string, subcommitteeId: string = '') => {
  let committee;
  let subcommittee;

  committee = committees.find(committee => committee.thomasId === committeeId);

  if (!committee) {
    throw 'committee not found';
  }

  if (subcommitteeId.length) {
    subcommittee = committee.subcommittees.find(subcommittee => subcommittee.thomasId === subcommitteeId);
  }

  const membership = committeeMembership[`${committeeId}${subcommitteeId}`] || [];
  const members = membership.map(member => ({
    rank: member.rank,
    ...congress.find(congressPerson => congressPerson.id.bioguide === member.bioguide),
  }));

  return {
    members,
    committee,
    subcommittee,
  }
}

