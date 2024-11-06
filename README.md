# Syllogism

A plugin for Obsidian that transforms code blocks with logical Standard Form syntax into clean, styled renderings, enhancing readability of logical reconstructions with customizable formatting. 
Perfect for philosophy, logic, and formal notation.

## Demo

## Usage
Syllogism is parsing code blocks that are specified as "standardform" language.
````markdown
```standardform
P1: If someone is a programmer, then they prefer tools that support Markdown.
P2: If someone prefers tools that support Markdown, then they enjoy using Obsidian.
 -- CI (P1, P2) --
C1: If someone is a programmer, then they enjoy using Obsidian.
P3: Phil is a programmer.
-- MP (C1, P3) --
C2: Phil enjoys using Obsidian.
```
````
