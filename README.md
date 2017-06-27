# postcss-sorting-flex-issue
Example of incorrect sorting in postcss-sorting.

Sorting of properties incorrectly reorders related vendor prefixes.
Sorting of property values (for no apparent reason) results in broken CSS.

## Installation

```
> npm install
```

## Run Tests

```
> node index.js
```

Output will be placed in `./output` folder.


## The Failure Example

### Input CSS

Found in `test.css`

```css
.header {
    padding-bottom: 20px;
    justify-content: space-between;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}
```

### Output Natural Order

Found in `./output/naturalOrder.css`.

```css
.header {
    padding-bottom: 20px;
    -webkit-box-pack: justify;
        -ms-flex-pack: justify;
            justify-content: space-between;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    -ms-flex-wrap: wrap;
        flex-wrap: wrap;
}
```

### Output 'Alphabetical' Order

Found in `./output/alphabeticalOrder.css`.

```css
.header {
            align-items: center;
    -webkit-box-align: center;
    -webkit-box-pack: justify;
    display: flex;
    display: -webkit-box;
    display: -ms-flexbox;
        -ms-flex-align: center;
        -ms-flex-pack: justify;
        flex-wrap: wrap;
    -ms-flex-wrap: wrap;
            justify-content: space-between;
    padding-bottom: 20px;
}
```

## Conclusions

Something is seriously wrong with the 'alphabetical' sorting algorithm. The sorting is incorrect in a way that can break the styling of a page. Furthermore, the sorting appears to be non-stable, as non-significant changes to the input result in significant changes to the output order.

### Incorrect Sorting

Though there are many things incorrect with the output, there are three significant problems:

1. The `align-items` property should be sorted below both the `-webkit-box-align` and `-ms-flex-align` properties.
2. The `flex-wrap` property should be sorted below the `-ms-flex-wrap` property.
3. The entry for `display: flex;` should be below both `display: -webkit-box;` and `display: -ms-flexbox;`.

The third issue actually breaks my website, since `display: -webkit-box;` will override the `display: flex`, and prevent `flex-wrap: wrap;` from working correctly.

### Non-Stable Sorting

More curiously, if one moves the `padding-bottom: 20px;` entry from the top of the definition, to the bottom, like so:

```css
.header {
    justify-content: space-between;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding-bottom: 20px;
}
```

And rerun the test, the resulting 'alphabetical' output is:

```css
.header {
            align-items: center;
    -webkit-box-align: center;
    -webkit-box-pack: justify;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
        -ms-flex-align: center;
        -ms-flex-pack: justify;
    -ms-flex-wrap: wrap;
        flex-wrap: wrap;
            justify-content: space-between;
    padding-bottom: 20px;
}
```

This fixes problems #2 and #3 above, but does nothing with #1. More importantly, such a change should have had no effect on the output sorted order. Instead, it had a significant impact.
