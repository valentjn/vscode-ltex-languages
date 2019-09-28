import org.languagetool.Language;
import org.languagetool.Languages;
import java.io.*;
import java.nio.file.*;
import java.util.regex.*;
import java.util.stream.*;
import java.util.List;

class App {
  public static String replaceTemplate(String find, String replace, String text) {
    String regex = Pattern.quote("${" + find + "}");
    return text.replaceAll(regex, replace);
  }

  public static Stream<Language> getLanguageAndVariants(Language language) {
    return Languages.get().stream().filter(l -> l.getShortCode() == language.getShortCode());
  }

  public static String replaceLanguageTemplates(Language language, String text) {
    text = replaceTemplate("Language", language.getName(), text);
    text = replaceTemplate("short code", language.getShortCode(), text);
    text = replaceTemplate("all variants as markdown",
        Stream.concat(Stream.of(language.getShortCode()),
          getLanguageAndVariants(language).map(
            l -> l.getShortCodeWithCountryAndVariant())).distinct()
          .collect(Collectors.joining("\n* ")),
        text);
    return text;
  }

  public static void writeTemplate(Language language, String templateFileName, String destination)
      throws IOException {
    ClassLoader classloader = Thread.currentThread().getContextClassLoader();
    InputStream in = classloader.getResourceAsStream(templateFileName);
    BufferedReader reader = new BufferedReader(new InputStreamReader(in));
    Stream<String> lines = reader.lines().map(ln -> replaceLanguageTemplates(language, ln));
    Files.write(Paths.get(destination), lines.collect(Collectors.toList()));
  }

  public static Language getUniquelySupportedLanguage() {
    List<Language> installedLanguages = Languages.get().stream().filter(l -> !l.isVariant())
        .collect(Collectors.toList());

    if (installedLanguages.size() != 1) {
      throw new IllegalStateException(
          "Only one language should be installed, but found " + installedLanguages.size());
    }

    return installedLanguages.get(0);
  }

  public static void main(String[] args) throws IOException {
    // Special case for de-DE-x-simple-language because I had
    // not realized it extends German.  Redesign should be done
    // to handle this better.
    Language language;
    if (Languages.get().stream().anyMatch(
        x -> x.getShortCodeWithCountryAndVariant().length() > 7)) {
      language = Languages.get().stream().filter(
          x -> x.getShortCodeWithCountryAndVariant().length() > 7).collect(
            Collectors.toList()).get(0);
    } else {
      language = getUniquelySupportedLanguage();
    }

    writeTemplate(language, "README.md", "README.md");
    writeTemplate(language, "package.json", "package.json");
  }
}