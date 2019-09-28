import org.languagetool.Language;
import org.languagetool.Languages;
import java.io.*;
import java.util.regex.*;
import java.util.stream.*;
import java.util.ArrayList;
import java.util.List;

class App {
  public static String replaceTemplate(String text, String find, String replace) {
    return text.replaceAll(Pattern.quote("${" + find + "}"), replace);
  }

  public static List<Language> getLanguageVariants(Language language) {
    List<Language> languageVariants = new ArrayList<>();

    for (Language languageVariant : Languages.get()) {
      if (languageVariant.getShortCode().equals(language.getShortCode())) {
        languageVariants.add(languageVariant);
      }
    }

    return languageVariants;
  }

  public static String replaceLanguageTemplates(String text, Language language) {
    String allVariantsAsMarkdownList = "";

    for (Language languageVariant : getLanguageVariants(language)) {
      String shortCodeVariant = languageVariant.getShortCodeWithCountryAndVariant();
      if (!allVariantsAsMarkdownList.isEmpty()) allVariantsAsMarkdownList += "\n";
      allVariantsAsMarkdownList += "* `" + shortCodeVariant + "`";
    }

    text = replaceTemplate(text, "Language", language.getName());
    text = replaceTemplate(text, "short code", language.getShortCode());
    text = replaceTemplate(text, "all variants as Markdown list", allVariantsAsMarkdownList);

    return text;
  }

  public static void writeTemplate(Language language, String templateFileName, String destination)
      throws IOException {
    ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
    InputStream in = classLoader.getResourceAsStream(templateFileName);
    BufferedReader reader = new BufferedReader(new InputStreamReader(in));
    String text = reader.lines().collect(Collectors.joining("\n"));
    text = replaceLanguageTemplates(text, language);
    try (PrintWriter writer = new PrintWriter(destination)) { writer.print(text); };
  }

  public static Language getUniquelySupportedLanguage() {
    Language language = null;

    for (Language curLanguage : Languages.get()) {
      if (!curLanguage.isVariant()) {
        if (language == null) {
          language = curLanguage;
        } else {
          throw new IllegalStateException("Multiple installed languages found.");
        }
      }
    }

    if (language == null) {
      throw new IllegalStateException("No installed languages found.");
    }

    return language;
  }

  public static void main(String[] args) throws IOException {
    Language language = null;

    // Special case for de-DE-x-simple-language because I had not realized it extends German.
    // Redesign should be done to handle this better.
    for (Language curLanguage : Languages.get()) {
      if (curLanguage.getShortCodeWithCountryAndVariant().length() > 7) {
        language = curLanguage;
        break;
      }
    }

    if (language == null) {
      language = getUniquelySupportedLanguage();
    }

    writeTemplate(language, "README.md", "README.md");
    writeTemplate(language, "package.json", "package.json");
  }
}