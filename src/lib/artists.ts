export class Artist {
  private name: string;
  private imageUri: string | undefined = undefined;
  constructor(name: string, imageUri?: string) {
    this.name = name;
    this.imageUri = imageUri;
  }

  getName(): string {
    return this.name;
  }

  getImageUri(): string | undefined {
    return this.imageUri;
  }
}
