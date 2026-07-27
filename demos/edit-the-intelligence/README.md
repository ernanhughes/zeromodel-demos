# Edit the Intelligence

**Demo staircase:** 2 of 6  
**Runtime:** static HTML, CSS, JavaScript, JSON, and one visual policy image

This demo extends the browser-native mechanism introduced by **State Chooses the Pixel**.

The first demo establishes:

```text
state → address → image cell → action
```

This demo holds the state and reader constant, edits the selected image cell, and replays the same decision:

```text
same state + same reader + different pixel = different action
```

## What the visitor does

1. Choose a threat and energy state.
2. Observe the cell and original decoded action.
3. Choose another action from the colour palette.
4. Paint the cell selected by the state.
5. Compare the original and current decisions.
6. Reset the original policy image.

The policy edit exists only in the browser's working canvas. It is not written back to the repository or server.

## What this demonstrates

- the JavaScript reader does not contain the policy table;
- the state-to-address function remains unchanged;
- changing the visual artifact changes the decoded decision;
- no model retraining, prompt edit, API call, or backend deployment is required;
- an image can be inspected and modified as a policy artifact.

## What this does not demonstrate

The 4×4 explanatory policy is hand-authored. This demo does not claim that the current ZeroModel compiler generated the image, nor that arbitrary model behaviour can be safely edited by changing individual pixels.

## Run locally

From this directory:

```powershell
python -m http.server 8000
```

Open:

```text
http://localhost:8000
```

No Python package is required. Python is used only as a static-file server.

## Hugo deployment

Copy the complete directory to:

```text
zeromodel.org/static/demos/edit-the-intelligence/
```

Then embed it using an iframe:

```html
<iframe
  src="/demos/edit-the-intelligence/"
  title="Edit the Intelligence — ZeroModel Web demo"
  loading="lazy"
  style="width:100%;min-height:1500px;border:0"
></iframe>
```

## Next rung

The next demo should move from editing a static policy to observing whether a real visual state transition conforms to a declared contract.
