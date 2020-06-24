export interface DomainInterface {
  id: string;
  name: string;
  mailboxes: MailboxInterface[];
}

export interface MailboxInterface {
  domain: Domain;
  id: string | undefined;
  label: string;
  aliases?: string[];
}

export class Domain {
  constructor(name: string, id?: string) {
    if (id) {
      this.id = id;
    }
    this.name = name;
    this.mailboxes = [];
  }
  private name: string;
  private id?: string;
  private mailboxes: Mailbox[];


  getId(): string | null {
    if (this.id) {
      return this.id;
    }
    return null;
  }

  getName() {
    return this.name;
  }

  getMailboxes() {
    return this.mailboxes;
  }

  addMailbox(mailbox: Mailbox): Domain {
    this.mailboxes.push(mailbox);
    return this;
  }
}

export class Mailbox {
  private domain: Domain;
  private id: string | undefined = undefined;
  private label: string;
  private aliases: string[];

  constructor(
    domain: Domain,
    label: string,
    id?: string | undefined,
    aliases?: string[] | undefined
  ) {
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
