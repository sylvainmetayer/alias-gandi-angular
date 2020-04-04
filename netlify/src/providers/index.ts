const regex = /[a-z]*/i;
const fs = require('fs');
import { GandiProvider } from './gandi';

class Domain {
  constructor(name: string, id?: string) {
    if (id) {
      this.id = id;
    }
    this.name = name;
  }
  private name: string;
  private id?: string;

  getId(): string | null {
    if (this.id) {
      return this.id;
    }
    return null;
  }

  getName() {
    return this.name;
  }
}

class Mailbox {
  private domain: Domain;
  private id: string | undefined = undefined;
  private label: string;
  private aliases: string[];

  constructor(domain: Domain, label: string, id?: string | undefined, aliases?: string[] | undefined) {
    this.domain = domain;
    if (id) {
      this.id = id;
    }

    this.label = label;
    this.aliases = [];
    if (aliases) {
      this.aliases = aliases;
    }
  }

  getDomain() {
    return this.domain;
  }

  getLabel() {
    return this.label;
  }

  setLabel(label: string) {
    this.label = label;
    return this;
  }

  getId() {
    return this.id;
  }

  getAliases() {
    return this.aliases;
  }

  setAliases(aliases: string[] | undefined) {
    if (aliases) {
      this.aliases = aliases;
    }
    return this;
  }
}

interface ProviderInterface {
  /**
   * Return all domains available for given provider
   */
  getDomains(): Promise<Domain[]>;
  /**
   * Return all mailboxes associated for a given domain.
   * On Gandi, aliases can be empty
   * @param domain: wanted domain
   */
  getMailboxes(domain: Domain): Promise<Mailbox[]>;
  /**
   * Give details for a given mailbox
   * @param id : wanted mailbox
   */
  getMailbox(id: string, domain: Domain): Promise<Mailbox>;
  /**
   * Apply given aliases to a mailbox and update them.
   * @param mailbox a mailbox
   * @param aliases array of aliases to apply
   */
  updateAliases(mailbox: Mailbox): Promise<boolean>;
}

const exists = (provider: string | null): boolean => {
  if (provider === null) {
    return false;
  }
  if (!provider.match(regex)) {
    return false;
  }
  return fs.existsSync(`${__dirname}/${provider}/index.js`);
};

const load = (provider: string): ProviderInterface => {
  const className = provider.charAt(0).toUpperCase() + provider.slice(1) + 'Provider';
  // Todo refacto this in a generic way
  if (className === 'GandiProvider') {
    return new GandiProvider();
  }
  throw Error(`${className} Not defined`);
};

export { load, exists, ProviderInterface, Domain, Mailbox };
