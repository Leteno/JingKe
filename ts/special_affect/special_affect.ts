
export class SpecialAffect {
  name: string;
  description: string;
  protected constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }
}