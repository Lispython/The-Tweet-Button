
//Storage methods are here
var TBStorage =
{
	get : function(name)
	{
		return JSON.parse(localStorage[name]);
	},

	get_or_default : function(name, def)
	{
		if (localStorage[name] == undefined)
			return def;
		else
			return JSON.parse(localStorage[name]);
	},

	set : function(name, value)
	{
		localStorage[name] = JSON.stringify(value);
		return value;
	}
}
