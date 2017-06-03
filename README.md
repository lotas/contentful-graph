# contentful-graph
Visual representation of contentful content models in form of graphs


# Installation

This script create a `*.dot` file for a contentful content models, which requires `graphviz` to be installed if you want to render Graph.

```
npm i
cp .env.example .env
```

Edit `.env` with your *space Id* and *token*


# Usage

Currently it is a multi-step process:

1. Import all model definitions:

`./import.js > models.json`

2. Create corresponding `.dot` file:

`./json-to-dot.js ./models.json > model.dot`

3. Render `.dot` file:

`dot -Tpng > model.png`

Or you can combine step 2 and 3:

`./json-to-dot.js ./models.json | dot -Tpng > model.png`

