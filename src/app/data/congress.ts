
export enum Gender {
  Female = 'F',
  Male = 'M',
  Other = 'O',
}

const Gendernyms = {
  F: 'woman',
  M: 'man',
  O: 'person',
};

export type DateString = string; // YYYY-MM-DD

export interface DatePeriod {
  start?: DateString | Date;
  end?: DateString | Date;
}

export enum PoliticalParty {
  Independent = 'Independent',
  Republican = 'Republican',
  Democrat = 'Democrat',
}

export enum LegislativeChamber {
  House = 'house',
  Senate = 'senate',
}

export enum LegislatorType {
  Representative = 'rep',
  Senator = 'sen',
}

export interface TypeToChamberMap {
  [key: string]: LegislativeChamber;
}
export const ChamberForType: TypeToChamberMap = {
  rep: LegislativeChamber.House,
  sen: LegislativeChamber.Senate,
};

export enum SenatorRank {
  Junior = 'junior',
  Senior = 'senior',
}

export type LegislativeDistrict = number;
export const AtLargeDistrict: LegislativeDistrict = 0;



export interface ILegislator {
  id: ILegislatorId;
  name: ILegislatorName;
  other_names?: ILegislatorAlternativeName[];
  bio: ILegislatorBio;
  terms: ILegislatorTerm[];
  leadership_roles?: ILegislatorLeadershipRole[];
}



export interface ILegislatorId {
  bioguide: string;
  thomas: string;
  lis: string;
  govtrack: number;
  opensecrets: string;
  votesmart: number;
  fec: string[];
  cspan: number;
  wikipedia: string;
  house_history: number;
  ballotpedia: string;
  maplight: number;
  icpsr: number;
  wikidata: string;
  google_entity_id: string;
  bioguide_previous?: string[];
}

export interface ILegislatorName {
  last?: string;
  first?: string;
  middle?: string;
  suffix?: string;
  nickname?: string;
  official_full?: string;
}

export interface ILegislatorAlternativeName extends ILegislatorName, DatePeriod {}

export interface ILegislatorBio {
  birthday: DateString;
  gender: Gender;
  religion: string;
}

export interface ILegislatorTerm extends DatePeriod {
  type: LegislatorType;
  state: string; // 2-letter abbreviation
  party: PoliticalParty;
  caucus?: PoliticalParty;
  party_affiliations?: IPartyAffiliation[];
  url?: string;
  address?: string;
  phone?: string;
  fax?: string;
  contact_form?: string;
  office?: string;
  rss_url?: string;
}

export interface IPartyAffiliation extends DatePeriod {
  party: PoliticalParty;
}

export interface IRepresentativeTerm extends ILegislatorTerm {
  district: LegislativeDistrict;
}

export interface ISenatorTerm extends ILegislatorTerm {
  class: number;
  state_rank?: SenatorRank;
}

export interface ILegislatorLeadershipRole extends DatePeriod {
  title: string;
  chamber: LegislativeChamber;
}


export class Legislator {
  readonly identifiers: ILegislatorId;
  readonly name: ILegislatorName;
  readonly otherNames?: ILegislatorAlternativeName[];
  readonly bio: ILegislatorBio;
  readonly terms: ILegislatorTerm[];
  readonly leadershipRoles?: ILegislatorLeadershipRole[];
  readonly socialMedia: ISocialMediaInfo;

  readonly committees: Committee[];
  readonly subcommittees: ThomasSubommitteeMap;

  static datify (periods?: DatePeriod[]): void {
    if (!periods) {
      return;
    }
    for (const period of periods) {
      const { start, end } = period;
      if (typeof start === 'string') {
        period.start = new Date(start);
      }
      if (typeof end === 'string') {
        period.end = new Date(end);
      }
    }
  }

  static create(source: ILegislator, committees: CommitteeBase[], socialMedia: ISocialMediaInfo) {
    const term = source.terms[source.terms.length - 1];
    const LegislatorClass = LegislatorClassMap[term.type] || Legislator;
    return new LegislatorClass(source, committees, socialMedia);
  }

  constructor(source: ILegislator, committees: CommitteeBase[], socialMedia: ISocialMediaInfo) {
    this.identifiers = source.id;
    this.name = source.name;
    this.otherNames = source.other_names;
    this.bio = source.bio;
    this.terms = source.terms;
    this.leadershipRoles = source.leadership_roles;
    this.socialMedia = socialMedia;

    if (committees) {
      this.committees = <Committee[]> committees.filter(c => !(c instanceof Subcommittee));
      this.subcommittees = {};
      for (const c of this.committees) {
        this.subcommittees[c.thomasId] = [];
      }
      const subcommittees = <Subcommittee[]> committees.filter(c => (c instanceof Subcommittee));
      for (const sub of subcommittees) {
        this.subcommittees[sub.parentCommittee.thomasId].push(sub);
      }
    } else {
      this.committees = null;
      this.subcommittees = null;
    }

    Legislator.datify(this.terms);
    Legislator.datify(this.leadershipRoles);
    Legislator.datify(this.otherNames);
    for (const term of this.terms) {
      Legislator.datify(term.party_affiliations);
    }
  }

  public getPresentTerm(): ILegislatorTerm {
    return this.terms[this.terms.length - 1];
  }

  public get presentTerm(): ILegislatorTerm {
    return this.getPresentTerm();
  }

  public get imageUrl(): string {
    const imageSize = '225x275';
    const filename = this.identifiers.bioguide;
    return `https://theunitedstates.io/images/congress/${imageSize}/${filename}.jpg`;
  }

  public get fullName(): string {
    const n = this.name;
    const mid = n.middle && (n.middle + ' ');
    return n.official_full || `${n.first} ${mid}${n.last}`;
  }

  public get title(): string {
    const gendernym = Gendernyms[this.bio.gender] || 'person';
    return `Congress${gendernym}`;
  }

  public get titleName(): string {
    return `${this.title} ${this.fullName}`;
  }

  public get party(): PoliticalParty {
    return this.presentTerm.party;
  }

  public get state(): string {
    return this.presentTerm.state;
  }

  public get mainUrl(): string {
    return this.presentTerm.url;
  }

  public get phone(): string {
    return this.presentTerm.phone;
  }

  public get office(): string {
    return this.presentTerm.office;
  }

  public get chamber(): LegislativeChamber {
    return ChamberForType[ this.presentTerm.type ];
  }

  public get district(): LegislativeDistrict | null {
    return null;
  }

  // used when sorting all legislators on the state detail view
  // so that senators will be placed at the beginning of the list
  public get sortingDistrict(): number {
    return this.isSenator() ? -1 : this.district;
  }

  public isSenator(): boolean {
    return false;
  }

  public isRepresentative(): boolean {
    return false;
  }

  public get partyStyleClass(): string {
    return `party-${this.party.toLowerCase()}`;
  }

  public get twitterUrl(): string {
    const twitter = this.socialMedia.twitter;
    return twitter ? `https://twitter.com/${twitter}` : null;
  }

  public get youtubeUserUrl(): string {
    const user = this.socialMedia.youtube;
    return user ? `https://youtube.com/user/${user}` : null;
  }

  public get youtubeChannelUrl(): string {
    const channel = this.socialMedia.youtube_id;
    return channel ? `https://youtube.com/channel/${channel}` : null;
  }

  public get instagramUrl(): string {
    const insta = this.socialMedia.instagram;
    return insta ? `https://instagram.com/${insta}` : null;
  }

  public get facebookUrl(): string {
    const fb = this.socialMedia.facebook;
    return fb ? `https://facebook.com/${fb}` : null;
  }

  public get bioguideUrl(): string {
    const { bioguide } = this.identifiers;
    return bioguide && `http://bioguide.congress.gov/scripts/biodisplay.pl?index=${bioguide}`;
  }

  public get govtrackUrl(): string {
    const { govtrack } = this.identifiers;
    return `https://www.govtrack.us/congress/members/${govtrack}`;
  }

  public get opensecretsUrl(): string {
    const { opensecrets } = this.identifiers;
    return `https://www.opensecrets.org/members-of-congress/summary/?cid=${opensecrets}`;
  }
}

export class Senator extends Legislator {
  public get presentTerm(): ISenatorTerm {
    return <ISenatorTerm> this.getPresentTerm();
  }

  public get title(): string {
    return 'Senator';
  }

  public get class(): number {
    return this.presentTerm.class;
  }

  public get rank(): SenatorRank | null {
    return this.presentTerm.state_rank || null;
  }

  public isSenator(): boolean {
    return true;
  }
}

export class Representative extends Legislator {
  public get title(): string {
    return 'Representative';
  }

  public get presentTerm(): IRepresentativeTerm {
    return <IRepresentativeTerm> this.getPresentTerm();
  }

  public get district(): LegislativeDistrict {
    return this.presentTerm.district;
  }

  public isRepresentative(): boolean {
    return true;
  }
}

const LegislatorClassMap = {
  rep: Representative,
  sen: Senator,
};




export enum CommitteeType {
  House = 'house',
  Senate = 'senate',
  Joint = 'joint',
}

export enum CommitteeParty {
  Majority = 'majority',
  Minority = 'minority',
}

export interface ISubcommittee {
  name: string;
  thomas_id: string;
  address: string;
  phone: string;
}

export interface ICommitteeUrls {
  url: string;
  minority_url: string;
  rss_url: string;
  minority_rss_url: string;
}

export interface ICommittee extends ISubcommittee, ICommitteeUrls {
  type: CommitteeType;
  senate_committee_id?: string;
  house_committee_id?: string;
  jurisdiction: string;
  jurisdiction_source: string;
  subcommittees?: ISubcommittee[];
}

export interface ICommitteeMember {
  name: string;
  bioguide: string;
  thomas: string;
  party: CommitteeParty;
  rank: number;
  title: string;
  chamber: LegislativeChamber;
}

export interface ThomasCommitteeMap {
  [committeeThomasId: string]: CommitteeBase;
}

export interface ThomasSubommitteeMap {
  [committeeThomasId: string]: Subcommittee[];
}

export interface BioguideCommitteesMap {
  [bioguideId: string]: CommitteeBase[];
}

export interface CommitteeMember {
  bioguide: string;
  // There are others, but we will only use the bioguideId for now.
}

export interface CommitteeMembershipMap {
  [committeeThomasId: string]: CommitteeMember[];
}

export class CommitteeBase {
  static thomasMap: ThomasCommitteeMap = {};

  name: string;
  thomasId: string;
  address: string;
  phone: string;

  constructor(source: ISubcommittee) {
    this.name = source.name;
    this.thomasId = source.thomas_id;
    this.address = source.address;
    this.phone = source.phone;
  }

  public get displayName(): string {
    return `(${this.thomasId}) ${this.name}`;
  }
}

export class Subcommittee extends CommitteeBase {
  parentCommittee: Committee;

  constructor (source: ISubcommittee, parent: Committee) {
    super(source);
    this.parentCommittee = parent;
    CommitteeBase.thomasMap[parent.thomasId + this.thomasId] = this;
  }

  public get displayName(): string {
    return `Subcommittee on ${this.name}`;
  }
}

export class Committee extends CommitteeBase {
  url: string;
  minorityUrl: string;
  rssUrl: string;
  minorityRssUrl: string;

  jurisdiction: string;
  jurisdictionSource: string;

  subcommittees: Subcommittee[];

  public static create(source: ICommittee) {
    const type = source.type;
    const CommitteeClass = CommitteeTypeClassMap[type] || Committee;
    return new CommitteeClass(source);
  }

  constructor(source: ICommittee) {
    super(source);
    CommitteeBase.thomasMap[this.thomasId] = this;
    // this.name = source.name;
    // this.thomasId = source.thomas_id;
    // this.address = source.address;
    // this.phone = source.phone;
    this.url = source.url;
    this.minorityUrl = source.minority_url;
    this.rssUrl = source.rss_url;
    this.minorityRssUrl = source.minority_rss_url;
    this.jurisdiction = source.jurisdiction;
    this.jurisdictionSource = source.jurisdiction_source;

    this.subcommittees = [];
    for (const sub of source.subcommittees || []) {
      this.subcommittees.push(new Subcommittee(sub, this));
    }
  }
}

export class HouseCommittee extends Committee {
  houseCommitteeId: string;

  constructor(source: ICommittee) {
    super(source);
    this.houseCommitteeId = source.house_committee_id;
  }
}

export class SenateCommittee extends Committee {
  senateCommitteeId: string;

  constructor(source: ICommittee) {
    super(source);
    this.senateCommitteeId = source.senate_committee_id;
  }
}

export class JointCommittee extends SenateCommittee {}

const CommitteeTypeClassMap = {
  house: HouseCommittee,
  senate: SenateCommittee,
  joint: JointCommittee,
};

export interface ISocialMediaInfo {
  twitter?: string;
  twitter_id?: number;
  youtube?: string;
  youtube_id?: string;
  instagram?: string;
  instagram_id?: number;
  facebook?: string;
}

export interface ISocialMediaLegislatorId {
  bioguide: string;
  thomas: string;
  govtrack: number;
}

export interface ILegislatorSocialMedia {
  id: ISocialMediaLegislatorId;
  social: ISocialMediaInfo;
}

export interface SocialMediaMap {
  [legislatorBioguideId: string]: ISocialMediaInfo;
}
