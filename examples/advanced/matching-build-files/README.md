## Automatically generate separate build files that match your folder structure

This example shows how you can manage what tokens are generated and how they are organized. This is useful when you want to generate a 1:1 relationship between build files and token categories.

Common use cases include:

- Each token category as its own Sass partial (\_colors.scss)
- Separate component files (button.css, input.css, etc)
- Tree shaking (only import what you need)

#### Running the example

First of all, set up the required dependencies running the command `npm install` in your local CLI environment (if you prefer to use _yarn_, update the commands accordingly).

At this point, you can run `npm run build`. This command will generate the output file in the `build` folder.

#### How does it work

The "build" command processes the JSON files in the `tokens` folder. The `index.js` file adds each folder, allowing you to map through them in `config.js`. The script goes through each folder and generates a file for each folder and populates it with tokens that match the filter.

```sh
# tokens/color/base.json
{
   "color": {
       "red": {
            "value": "#FF0000"
        }
   }
}
```

```sh
# tokens/size/base.json
{
   "size": {
       "small": {
            "value": "2px"
        }
   }
}
```

Because the folder name matches the category, the output would automatically generate separate `color` and `size` files.

#### What to look at

Open the `config.js` file and see how the script first looks within the `tokens` directory to map through each folder. The destination then outputs a file that would match the name, and fill that file with the tokens that match the filter criteria.

```sh
 files: tokens.map(tokenCategory => ({
          destination: `${tokenCategory}.js`,
          format: "format/js",
          filter: {
            attributes: {
              category: tokenCategory
            }
          }
        }))
```

Now each new folder that gets added will automatically generate a corresponding file filled with tokens that match the category!
