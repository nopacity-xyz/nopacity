# Naming Conventions

* Identifiers of variables/functions should be camalCased.
* Identifiers of classes and components should be PascalCased.
* Abbreviations are to be followed according to [Microsoft's conventions](https://learn.microsoft.com/en-us/previous-versions/dotnet/netframework-1.1/141e06ef(v=vs.71)?redirectedfrom=MSDN)
  * `daoMaker` and `myUsdValue` are correct (acronyms are treated like words).
  * `playerID` and `myNetworkIO` are correct (two character rule).
* Config variables are UPPER_CASED (including ones defined for the entire scope of a file).

# Commits

* Loosely follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
* Not Necessary:
  * Commit "type" (e.g. "fix:", "feat:" etc) can be omitted.
* Required:
  * Commit messages length _should not exceed 72 characters_.
  * Commit messages _should be written in the (imperative mood](https://en.wikipedia.org/wiki/Imperative_mood)_
  * Commit message description lines _should wrap at 72 characters_

# The #1 Rule

**All the rules can be broken because this is a hackathon!**