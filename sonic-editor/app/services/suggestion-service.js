import Ember from 'ember';

export default Ember.Service.extend({
    suggestionMap: {},

    unsuggestable: function(word) {
	return (word[0] === " " || word[0] === "<");
    },

    calculateSuggestions: function(word) {
	if(word[0] === " " || word[0] === "<")
	{
	    return Ember.A();
	}

	var suggestions = Ember.A();

	if(word === "will")
	{
	    suggestions.push("Will Turner");
	    suggestions.push("Will Truman");
	    suggestions.push("willie");
	    suggestions.push("will full");
	    return suggestions;
	}

	var days = ["Monday", "Tuesday", "Wednessday", "Thursday", "Friday"];
	days.forEach( function(day) {
	    var lday = day.toLowerCase();
	    var lword = word.toLowerCase();
	    if(lday.startsWith(lword))
	    {
		suggestions.push(day);
		return suggestions;
	    }
	});

	if(word.length < 4)
	{
	    return suggestions;
	}
	
	suggestions.push("een");
	suggestions.push("25-04-2017");
	suggestions.push("Richard Stallman");

	return suggestions;
    }
    
});
