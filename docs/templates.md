# Templates

Templates are deprecated in favor of [Formats](formats.md) and will be removed in the future. If you want to create a custom template, create a [Format that uses templating](formats.md#using-a-template-templating-engine-to-create-a-format).

>*__Why are Templates being deprecated in favor of Formats?__*

>It is a simplification for users, no power is being removed. Templates were syntactic sugar; anything you could do in a Template you can do in a Format. Since they both did the same thing people became confused on which method they were supposed to use for output. Even worse, we actually required you to know if the output you wanted was created as a format or as a template, even for those formats and template included in Style Dictionary by default. This was a bad plan and caused problems. Additionally, Style Dictionary aims to provide power and flexibility without forcing you to use any particular system and only Lodash Templates were supported under the old system. Using formats, you can use any Templating engine you would like.
