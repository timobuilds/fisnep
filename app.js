// set up all the global variables
const toolboxWidth = document.querySelector('section.toolbox').offsetWidth
let canvas = null
let bgColor = '#fbf8f3'

let selectedTool = 'pen'
let brushSelector = null
let brushSize = 1

let paintColor = '#000000'
let ifRainbowColor = false
let opacity = 220

function setup() {
  setupToolbox()

  // set up the canvas
  canvas = createCanvas(windowWidth - toolboxWidth, windowHeight)
  canvas.parent(select('section.canvas'))
  background(bgColor)
}

function setupToolbox() {
  // set up paint style tools in the Styles category
  const paintStyles = select('section.toolbox div.styles-tools')
  setupBrushSelector(paintStyles)
  setupPaintColorPicker(paintStyles)
  setupRainbowColorButton(paintStyles)
  setupOpacitySlider(paintStyles)
  setupBrushSizeSlider(paintStyles)

  // set up canvas tools in the Canvas category
  const canvasTools = select('section.toolbox div.canvas-tools')
  setupSaveButton(canvasTools)
  setupResetButton(canvasTools)

  // set up background style tools Background category
  const backgroundStyles = select('section.toolbox div.background-tools')
  setupBgColorPicker(backgroundStyles)
}

function setupBrushSelector(parentTag) {
  // create the brush selector as a <select> tag
	brushSelector = createSelect()

  // make a label for the menu
  makeLabel(brushSelector, parentTag, 'Paintbrush style')

  // make an array of all the paintbrush function names
  const brushes = [
    'pen',
    'marker',
    'beads',
    'wiggle',
    'toothpick',
    'fountainPen',
    'splatter',
    'sprayPaint',
  ]

  // add in all of the paintbrush function names as menu options
  brushes.forEach(function (brush) {
      brushSelector.option(brush)
  })

  // set initial value of the currently selected paintbrush
  selectedTool = brushSelector.value()

  // update the selected paintbrush if the user picks a different menu option
  brushSelector.changed(function () {
    selectedTool = brushSelector.value()
  })
}

function makeLabel(tag, parentTag, text) {
  const label = createElement('label', text)
  label.parent(parentTag)
  tag.parent(label)
}

function setupButton(text, parentTag, onClick) {
  const button = createButton(text)
  button.parent(parentTag)
  button.mousePressed(onClick)
  return button
}

function saveFile() {
  saveCanvas('painting', 'png')
}

function setupSaveButton(parentTag) {
  setupButton('Save', parentTag, saveFile)
}

function resetCanvas() {
  // resize canvas to fill the painting area
  resizeCanvas(windowWidth - toolboxWidth, windowHeight)

  // fill canvas with background color
  background(bgColor)
}

function setupResetButton(parentTag) {
  setupButton('Reset', parentTag, resetCanvas)
}

function setupColorPicker(initialColor, parentTag, text, onChange) {
  const colorPicker = createColorPicker(initialColor)
  makeLabel(colorPicker, parentTag, text)
  colorPicker.changed(onChange)
  return colorPicker
}

function setupBgColorPicker(parentTag) {
  const bgColorPicker = setupColorPicker(bgColor, parentTag, 'Background color', function () {
    bgColor = bgColorPicker.color()
    resetCanvas()
  })
}

function setupPaintColorPicker(parentTag) {
  const paintColorPicker = setupColorPicker(paintColor, parentTag, 'Paint color', function () {
    paintColor = paintColorPicker.color()
    ifRainbowColor = false
  })
  paintColor = paintColorPicker.color()
}

function setPaintColor() {
  // set color to either rainbow or normal paint color 
	let newColor
  if (ifRainbowColor) {
    const hue = (frameCount * 2) % 360	
    newColor = color(`hsba(${hue}, 100%, 100%, 0.6)`)
  } else {
		newColor = paintColor
  }

  // set the color and opacity of the stroke and fill
  newColor.setAlpha(opacity)
  stroke(newColor)
  fill(newColor)
}

function setupRainbowColorButton(parentTag) {
  setupButton('Rainbow color 🌈', parentTag, function () {
    ifRainbowColor = !ifRainbowColor
  })
}

// helper function that sets up a slider
function setupSlider(min, max, initialValue, step, text, parentTag, onInput) {
  const slider = createSlider(min, max, initialValue, step)
  makeLabel(slider, parentTag, text)
  slider.input(onInput)
  return slider
}

function setupOpacitySlider(parentTag) {
  const opacitySlider = setupSlider(0, 255, opacity, 1, 'Opacity', parentTag, function () {
    opacity = opacitySlider.value()
  })
}

function setupBrushSizeSlider(parentTag) {
  const brushSizeSlider = setupSlider(1, 16, brushSize, 0.1, 'Brush size', parentTag, () => {
    brushSize = brushSizeSlider.value()
  })
}

function draw() {
	// check if mouse button is pressed and mouse is hovering over canvas section
  if (mouseIsPressed && mouseX <= windowWidth - toolboxWidth) {
    // set the paint color
    setPaintColor()

    // draw on the canvas with the selected painting tool function
    window[selectedTool]()
  }
}

function keyPressed() {
  if (keyCode === BACKSPACE) {
    resetCanvas()
  } else if (key === 's') {
    saveFile()
  } else if (key === 'r') {
    ifRainbowColor = !ifRainbowColor 
  } 
}