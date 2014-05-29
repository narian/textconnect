# jQuery TextConnect plugin

A small plugin that provides visual connection between items of different lists.

## Usage

The plugin can be called with jQuery in different ways.

### Standard call with default settings:

$('#containter').textconnect();

Where #containter is the identifier of the block where lists are placed.

### Options
```
$('#containter').textconnect({
	firstcolumn: 'ul.first', 
	lastcolumn: 'ul.last',
	background: '#990000',
	step: 2,	 // (1) everyone, (2) through one
	begin: 0,	 // start from nth element
	even: 1  	// odd or even (0 or 1)
});
```

#### firstcolumn

Selector of the element that placed first

#### lastcolumn

Selector of the element that placed last

#### background

Background color of all generated poygons

#### begin 

Shift of the generated polygons. If you put value '2', plugin starts generate polygons from third item.

#### even

Parameter that tells plugin what elements need to be painted, odd or even. It's similar to CSS nth-child(odd) and nth-child(even). Needed only if parameter 'step' equals 1. Value '1' stands by default.

#### step

Step of list items. You can use any integer value, starting from 1 - it placed polygon on every item in the list. Value '2' stands by default. 

**Note!** Works if property 'even' equals 0.

## Usage examples

See index.html for different usage examples or look on it [online](http://files.narian.ru/textconnect).

## Browser support

Latest stable versions of Chrome, IE9+, Firefox and Opera are supported.

For IE8 you can use [Raphaël](http://raphaeljs.com/) as polyfill.

**Note!** Seems like [Firefox](https://bugzilla.mozilla.org/show_bug.cgi?id=378923) doesn't respond to css property 'overflow' and always acts like 'overflow:hidden'. Note it when you try to setup a margin for one of lists, use 'padding' property instead.

## Contributing

You’re always welcome to contibute. Fork project, make changes and send it as pull request. But it’s better to file an [issue](https://github.com/narian/textconnect/issues) with your idea first.

## Copyright

Copyright 2014 Nick Voyloshnikov, [http://narian.ru/](http://narian.ru/)

---
Licensed under [MIT License](http://en.wikipedia.org/wiki/MIT_License), see [license page](https://github.com/narian/textconnect/license.md) for details.