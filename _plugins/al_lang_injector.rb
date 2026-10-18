# al_lang_injector.rb
#
# Local Jekyll plugin (site-level, user-site supported) that injects the
# i18n language-toggle runtime into every rendered HTML document, without
# overriding any gem-owned template.
#
# At post_render it appends, immediately before </body>:
#   1. a small window.AL_I18N_PAGE script carrying page-level translations
#      (only when the document's front matter defines title_zh / description_zh)
#   2. a <script src="{{ baseurl }}/assets/js/lang.js" defer> tag
#
# Idempotent: if lang.js is already referenced (Jekyll may re-run post_render
# during watch/incremental builds) the tag is not appended a second time.
#
# All visible behavior (button injection, DOM rewriting, language switching)
# lives in assets/js/lang.js so the gem's templates stay untouched.

module AlLangInjector
  MARKER = "assets/js/lang.js"

  def self.inject(doc)
    return unless doc.respond_to?(:output) && doc.respond_to?(:output=)
    return unless doc.output.is_a?(String)
    return unless doc.output.include?("</body>")
    # Idempotency: avoid double-injecting when post_render runs more than
    # once for the same document (watch / incremental rebuilds).
    return if doc.output.include?(MARKER)

    page_payload = {}
    title = doc.data["title"]
    title_zh = doc.data["title_zh"]
    if title_zh && !title_zh.to_s.empty?
      page_payload["en"] = { "title" => title.to_s, "description" => doc.data["description"] }
      page_payload["zh"] = { "title" => title_zh, "description" => doc.data["description_zh"] }
    end

    baseurl = doc.site.config["baseurl"].to_s.sub(%r{/$}, "")
    # Root-absolute so the tag works on every route, not just the homepage:
    # baseurl ""   -> /assets/js/lang.js
    # baseurl "/x" -> /x/assets/js/lang.js
    script_src = "#{baseurl}/assets/js/lang.js"

    injections = []
    if !page_payload.empty?
      json = page_payload.to_json
      injections << %(<script>window.AL_I18N_PAGE = #{json};</script>)
    end
    injections << %(<script src="#{script_src}" defer></script>)

    idx = doc.output.rindex("</body>")
    tag = injections.join("\n")
    doc.output = doc.output.insert(idx, "#{tag}\n")
  end
end

Jekyll::Hooks.register(
  [:pages, :posts, :documents],
  :post_render
) do |doc|
  AlLangInjector.inject(doc)
end
