export {};

declare global {
  interface TranslatorInstance {
    translate(text: string): Promise<string>;
  }

  interface TranslatorFactory {
    availability(options: {
      sourceLanguage: string;
      targetLanguage: string;
    }): Promise<"unavailable" | "downloadable" | "downloading" | "available">;
    create(options: {
      sourceLanguage: string;
      targetLanguage: string;
    }): Promise<TranslatorInstance>;
  }

  interface Window {
    Translator?: TranslatorFactory;
  }

  var Translator: TranslatorFactory | undefined;
}
