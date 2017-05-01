import Ember from 'ember';

export default Ember.Service.extend({
    suggestions: Ember.inject.service("suggestion-service"),
    
    text: Ember.A(),

    getSuggestions: function(position)
    {
	var text = Ember.get(this, 'text');
	var word = Ember.get(this, 'getWordForPositionInText')(position, text);
	return Ember.get(this, 'suggestions.calculateSuggestions')(word);
    },

    getWordForPositionInText: function(position, text)
    {
	var wordFound = false;
	var word = "";
	
	text.reduce(function(count, tword){
	    if(isNaN(count))
	    {
		count = Ember.get(count, 'part').length;
	    }
	    count += Ember.get(tword, 'part').length;
	    if(count >= position && !wordFound)
	    {
		word = Ember.get(tword, 'part');
		wordFound = true;
	    }
	    return count;
	});

	return word;		
    },

    setSuggestionInText: function(position, replacement) {
	var text = Ember.get(this, 'text');
	
	var wordFound = false;
	
	text.reduce(function(count, tword){
	    if(isNaN(count))
	    {
		count = Ember.get(count, 'part').length;
	    }
	    count += Ember.get(tword, 'part').length;
	    if(count >= position && !wordFound)
	    {
		Ember.set(tword, 'part', replacement);
		wordFound = true;
	    }
	    return count;
	});

	return text.reduce(function(fullText, word) {
	    if(Ember.typeOf(fullText) === 'object')
	    {
		fullText = Ember.get(fullText, 'part');
	    }
	    return fullText + Ember.get(word, 'part');
	});
    },
						     
    loadText: function(original_text)
    {
	var text = Ember.A();

	var inSpace = false;
	var inHTMLTag = false;
	var startNewCharacter = false;

	original_text = original_text.replace("&nbsp;", " ");

	original_text.split("").forEach(function(character, location) {
	    if(inSpace)
	    {
		if(character === " ")
		{
		    var part = Ember.get(text[text.length - 1], "original_part");
		    part += character;
		    text[text.length - 1] = {
			original_part: part,
			part: part
		    };
		    return;
		}
	    }

	    if(character === " ")
	    {
		text.push({
		    original_part: character,
		    part: character
		});
		startNewCharacter = false;
		inSpace = true;
		inHTMLTag = false;
		return;
	    }

	    if(inHTMLTag)
	    {
		var part = Ember.get(text[text.length - 1], "original_part");
		part += character;
		text[text.length - 1] = {
		    original_part: part,
		    part: part
		};
		if(character === ">")
		{
		    inHTMLTag = false;
		    startNewCharacter = true;
		}
		return;
	    }

	    if(character === "<")
	    {
		text.push({
		    original_part: character,
		    part: character
		});
		inSpace = false;
		inHTMLTag = true;
		startNewCharacter = false;
		return;
	    }

	    if(inSpace)
	    {
		inSpace = false;
		startNewCharacter = false;

		text.push({
		    original_part: character,
		    part: character
		});
		
		return;
	    }

	    if(startNewCharacter)
	    {
		text.push({
		    original_part: character,
		    part: character
		});
		startNewCharacter = false;
	    }
	    else
	    {
		var part = Ember.get(text[text.length - 1], "original_part");
		part += character;
		text[text.length - 1] = {
		    original_part: part,
		    part: part
		};
	    }
	});

	this.set('text', text);
    },
	
    toFullText: function()
    {
	var fullText = "";
	this.get('text').forEach(function(item, index) {
	    fullText += "[" + Ember.get(item, 'part') + "]";
	});
	return fullText;
    }
});
