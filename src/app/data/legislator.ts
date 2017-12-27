
export enum Gender {
  Female = 'F',
  Male = 'M',
  Other = 'O',
}

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
  // readonly presentTerm: ILegislatorTerm;

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

  static create(source: ILegislator) {
    const term = source.terms[source.terms.length - 1];
    const lType = term.type;
    if (lType === LegislatorType.Representative) {
      return new Representative(source);
    } else if (lType === LegislatorType.Senator) {
      return new Senator(source);
    } else {
      return new Legislator(source);
    }
  }

  constructor(source: ILegislator) {
    this.identifiers = source.id;
    this.name = source.name;
    this.otherNames = source.other_names;
    this.bio = source.bio;
    this.terms = source.terms;
    this.leadershipRoles = source.leadership_roles;

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

  public get party(): PoliticalParty {
    return this.presentTerm.party;
  }

  public get state(): string {
    return this.presentTerm.state;
  }

  public get mainUrl(): string {
    return this.presentTerm.url;
  }

  public get chamber(): LegislativeChamber {
    return ChamberForType[ this.presentTerm.type ];
  }

  public get district(): LegislativeDistrict | null {
    return null;
  }

  public isSenator(): boolean {
    return false;
  }

  public isRepresentative(): boolean {
    return false;
  }

  public get partyStyleClass(): string {
    return `rep-party-${this.party.toLowerCase()}`;
  }
}

export class Senator extends Legislator {
  public get presentTerm(): ISenatorTerm {
    return <ISenatorTerm> this.getPresentTerm();
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
