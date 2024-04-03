---
title: Transform Groups
sidebar:
  label: Overview
---

Transform Groups are a way to easily use multiple transforms at once as a collection or group.
They are an array of transforms. You can define a custom transform group with the [`registerTransformGroup`](/reference/api#registertransformgroup).

You use transformGroups in your config file under `platforms` > `[platform]` > `transformGroup`

```json title="config.json"
{
  "source": ["tokens/**/*.json"],
  "platforms": {
    "android": {
      "transformGroup": "android"
    }
  }
}
```

## Combining with transforms

You can also combine transforms with transformGroup:

```json title="config.json"
{
  "source": ["tokens/**/*.json"],
  "platforms": {
    "android": {
      "transformGroup": "android",
      "transforms": ["name/snake"]
    }
  }
}
```

The transforms that are standalone will be added **after** the ones inside the transformGroup.
If it's important to determine the order of these yourself, you can always register a custom transformGroup to have more granular control.
