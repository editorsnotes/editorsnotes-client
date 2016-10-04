const React = require('react')

const NonUserHomepage = () => (
  <div>
    <h1>Working Notes</h1>

    <h2>What is this?</h2>

    <p>
      Working Notes is a note-taking tool for people who do research using libraries, archives, or other kinds of special collections. Unlike many other note-taking tools, it is especially designed for people who would like to share their research notes with either a group of collaborators or the general public. Thus Working Notes provides tools not only for taking notes, but also for organizing those notes into a useful resource for others.
    </p>

    <p>
      Working Notes grew out of the <a href="http://ecai.org/mellon2010/"><i>Editorial Practices and the Web</i></a> project, which explored how editors of <a href="http://gde.upress.virginia.edu/01A-gde.html">documentary editions</a> might make their vast repositories of valuable research notes more easily accessible to and usable by others. One distinguishing feature of the research notes created by documentary editors, which characterizes library- and archive-based research notes more generally, is that they comprise a mix of loosely structured textual notes and more formal structures such as chronologies, family trees, organizational hierarchies, or maps. Working Notes aims to ease the task of working with both textual notes and more structured data in an integrated way.
    </p>

    <h2>Can I use it?</h2>
    <p>
      It depends on what you mean by “use.” The Working Notes source code is all <a href="https://github.com/editorsnotes/">publicly available and openly licensed</a>, and we encourage interested programmers to check it out (and maybe even contribute!). If you aren't a programmer and simply want to try out Working Notes, you can <a href="/auth/account/create">sign up for an account</a>, but we do not recommend actually using it for serious work at this time. Working Notes is still under heavy development, so there are likely to be undiscovered bugs, and you might lose data. In addition, one of the features we're most excited about—the ability to filter, sort, and visualize notes using arbitrary structured data associated with them—is not yet ready for prime time.
    </p>

    <p>
    So, if you're feeling adventurous or intrigued enough that the caveats above don't deter you, then by all means sign up, <a href="mailto:ryanshaw@unc.edu?subject=Working%20Notes">get in touch</a>, and help us figure out how we can help you. But if not, then please hang tight a bit longer while we work out the bugs.
    </p>

    <h2>Who are you?</h2>
    <p>
    The <i>Editorial Practices and the Web</i> project was led by <a href="http://people.ischool.berkeley.edu/~buckland/">Michael Buckland</a> (University of California, Berkeley) and was generously funded by two grants from the Andrew W. Mellon Foundation. <a href="https://ptgolden.org">Patrick Golden</a> and <a href="http://aeshin.org">Ryan Shaw</a> (University of North Carolina at Chapel Hill) were responsible for the software design and development. The documentary editing projects involved were <a href="http://www.lib.berkeley.edu/goldman/">The Emma Goldman Papers Project</a> (Berkeley), <a href="http://www.nyu.edu/projects/sanger/">The Margaret Sanger Papers</a> (New York University), <a href="http://ecssba.rutgers.edu">The Elizabeth Cady Stanton and Susan B. Anthony Papers Project</a> (Rutgers, The State University), and the <a href="http://www.sos.ca.gov/archives">California State Archives</a>. We also benefited from an early collaboration with <a href="http://www.lib.umich.edu/labadie-collection/">The Labadie Collection</a> (University of Michigan). For more information, please see our <a href="http://ecai.org/mellon2010/">project page</a> at the Electronic Cultural Atlas Initiative.
    </p>
  </div>
)

module.exports = NonUserHomepage;
