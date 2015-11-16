"use strict";

module.exports = () => (
  <div>
    <p>Notes are written using Markdown.
      <a href="https://help.github.com/articles/markdown-basics/">
      Learn about Markdown.</a>
    </p>
    <section>
      <h1>Headings</h1>
      <p>One or more (up to six) <code>#</code> symbols creates a heading:
        <pre><code>
# Level 1 Header
## Level 2 Header
### Level 3 Header
        </code></pre>
      </p>
    </section>
    <section>
      <h1>Emphasis</h1>
      <p><code>*italic*</code> or <code>_italic_</code></p>
      <p><code>**bold**</code> or <code>__bold__</code></p>
    </section>
    <section>
      <h1>Lists</h1>
      <p>Lists can be ordered or unordered, and they can be nested.</p>
      <p>Ordered lists:
        <pre><code>
1. Item 1

   2nd paragraph of Item 1

1. Item 2
        </code></pre>
      </p>
      <p>Unordered lists:
        <pre><code>
* Item
* Another item
        </code></pre>
      </p>
      <p>Nested lists:
        <pre><code>
1. Item 1
1. Item 2
  * Sub-item
  * Another sub-item
        </code></pre>
      </p>
    </section>
    <section>
      <h1>Links</h1>
      <p>Link to URLs with or without anchor text.</p>
      <p>Bare links (no anchor text):<br/>
        <code>&lt;http://example.org&gt;</code>
      </p>
      <p>Links with anchor text:<br/>
        <code>An [example](http://example.org).</code>
      </p>
      <p>Reference-style links:<br/>
        <pre><code>
An [example][id].

[id]: http://example.org
        </code></pre>
      </p>
    </section>
    <section>
      <h1>References</h1>
      <p>Link to other topics or notes by their IDs. Just typing
        <code>@@</code> and then <code>t</code> (for topic), <code>n</code>
        (for note), or <code>d</code> (for document) will allow you to select
        from existing items or to create a new one.
      </p>
      <p><code>@@t140 was elected president in 1912.</code></p>
      <p>Create a reference with anchor text:</p>
      <p><code>[He](@@t140) was elected president in 1912.</code></p>
    </section>
    <section>
      <h1>Citations</h1>
      <p><code>`[see @@d92, pp. 33--35]`</code></p>
    </section>
    <section>
      <h1>Blockquotes</h1>
      <p>
        <pre><code>
> Some quoted text.

>> Nested quotes.
        </code></pre>
      </p>
      <p>Blockquotes can be associated with a citation by using the citation
        syntax in the final line:
        <pre><code>
> Quotation from cited text.
>
> [@@d40, p.12]
        </code></pre>
      </p>
    </section>
        <section>
      <h1>Escaping</h1>
      <p>Use a <code>\</code> to prevent a character from being interpreted
        as Markdown. For example: <code>an asterisk: \*</code></p>
    </section>
  </div>
);
