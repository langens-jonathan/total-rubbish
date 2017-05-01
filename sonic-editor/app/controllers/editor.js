import Ember from 'ember';

export default Ember.Controller.extend({
    sonicText: Ember.inject.service(),

    oldText: "",

    currentInMemRepresentation: Ember.A(),

    currentWord: "",

    currentSuggestions: Ember.A(),

    findFirstElementThatDiffers: function(arr1, arr2)
    {
	var index = 0;
	for(; (index < arr1.length && index < arr2.length); ++index)
	{
	    if(arr1[index] !== arr2[index])
	    {
		return(index);
	    }
	}
	if(arr2.length > arr1.length)
	{
	    return(index);
	}
	return(-1);
    },
    
    actions: {
	valuechanged: function(event, src)
	{
	    var newText = src.getValue();
	    this.set('editor', src);
	    var oldText = this.get('oldText');
	    var position = src.selection._selection.anchorOffset;
	    var bposition = src.selection._selection.baseOffset;
	    var cposition = this.get('findFirstElementThatDiffers')(
		oldText.split(""),
		newText.split(""));
	    this.set('lastPosition', cposition);
	    console.log("[" + position + "|" + bposition + "|" + cposition + "](" + newText + ")");
	    this.get("sonicText").loadText(newText);
	    console.log(this.get("sonicText").toFullText());

	    var suggestions = this.get('sonicText').getSuggestions(cposition);
	    this.set('currentSuggestions', suggestions);

	    var textArray = this.get('sonicText.text');
	    this.set('currentInMemRepresentation', textArray);

	    var currentWord = this.get('sonicText').getWordForPositionInText(cposition, textArray);
	    this.set('currentWord', currentWord);

	    this.set('oldText', newText);
	},
	setSuggestion: function(suggestion)
	{
	    var currentPosition = this.get('lastPosition');
	    var improvedText = this.get('sonicText').setSuggestionInText(currentPosition, suggestion);
	    this.get('editor').setValue(improvedText);
	}
    }
});
