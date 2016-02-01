"use strict";

var React = require('react')
  , Help

const HEADER_TEXT = `# Level 1 Header
## Level 2 Header
### Level 3 Header
`

const LIST_TEXT = `1. Item 1

   2nd paragraph of Item 1

1. Item 2
`

const UNORDERED_LIST_TEXT = `* Item
* Another item
`

const NESTED_LIST_TEXT = `1. Item 1
1. Item 2
  * Sub-item
  * Another sub-item
`

const REFERENCE_LINK_TEXT = `An [example][id].

[id]: http://example.org
`

const BLOCKQUOTE_TEXT = `> Some quoted text.

>> Nested quotes.`

const BLOCKQUOTE_CITATION_TEXT = `> Quotation from cited text.
>
> [@@d40, p.12]
`

Help = () => (
  <div>
    <p>Notes are written using Markdown with some Working Notes-specific
      extensions for references to notes, topics and documents.
      <a target="_blank" href="https://help.github.com/articles/markdown-basics/">
      {' '}
      Learn about Markdown.</a>
    </p>

    <section>
      <h1>Headings</h1>
      <p>One or more (up to six) <code>#</code> symbols creates a heading:</p>
      <pre className="overflow-hidden px3 py1"><code>{HEADER_TEXT}</code></pre>
    </section>

    <section>
      <h1>Emphasis</h1>
      <p>One asterisk or underscore for <i>italics</i>:<br/>
        <code>*italic*</code> or <code>_italic_</code></p>
      <p>Two asterisks or underscores for <b>bold</b>:<br/>
        <code>**bold**</code> or <code>__bold__</code></p>
    </section>

    <section>
      <h1>Lists</h1>
      <p>Lists can be ordered or unordered, and they can be nested.</p>

      <p>Ordered lists:</p>
      <pre className="overflow-hidden px3 py1">
        <code>{LIST_TEXT}</code>
      </pre>

      <p>Unordered lists:</p>
      <pre className="overflow-hidden px3 py1">
        <code>{UNORDERED_LIST_TEXT}</code>
      </pre>

      <p>Nest lists by indenting two spaces:</p>
      <pre className="overflow-hidden px3 py1"><code>{NESTED_LIST_TEXT}</code></pre>
    </section>

    <section>
      <h1>Links</h1>
      <p>Link to URLs can be with or without anchor text.</p>
      <p>Bare links (no anchor text):<br/>
        <code>&lt;http://example.org&gt;</code>
      </p>
      <p>Links with anchor text:<br/>
        <code>An [example](http://example.org).</code>
      </p>
      <p>Reference-style links:</p>
      <pre className="overflow-hidden px3 py1"><code>{REFERENCE_LINK_TEXT}</code></pre>
    </section>

    <section>
      <h1>References</h1>
      <p>Link to other topics or notes by their numeric IDs. Just typing
        <code>@@</code> and then <code>t</code> (for topic), <code>n</code>
        (for note), or <code>d</code> (for document) will allow you to select
        from existing items or to create a new one.
      </p>
      <p><code>@@t140 was elected president in 1912.</code></p>
      <p>Assuming the topic with ID 140 has the label
        &#8220;Woodrow Wilson,&#8221; when the text above is displayed the
        <code>@@t140</code> will be replaced by that label. To override this,
        create a reference with anchor text:</p>
      <p><code>[Woody](@@t140) was elected president in 1912.</code></p>
    </section>

    <section>
      <h1>Citations</h1>
      <p>References to documents can additionally supply some text before or
        after the reference using square brackets:<br/>
        <code>[see @@d92, pp. 33--35]</code></p>
    </section>

    <section>
      <h1>Blockquotes</h1>
      <pre className="overflow-hidden px3 py1">
        <code>{BLOCKQUOTE_TEXT}</code>
      </pre>
      <p>Blockquotes can be associated with a citation by using the citation
        syntax in the final line:</p>
      <pre className="overflow-hidden px3 py1"><code>{BLOCKQUOTE_CITATION_TEXT}</code></pre>
    </section>
    <section>
      <h1>Escaping</h1>
      <p>Use a backslash (<code>\</code>) to prevent a character from being
        interpreted as Markdown. For example:<br/>
        <code>an asterisk: \*</code></p>
    </section>
  </div>
)

module.exports = Help;
