/*!
 * author Tony Beltramelli
 * http://www.tonybeltramelli.com
 *
 */

TwoDimensionsDictionary = function()
{
	this.content = [];
	this.keys = [];
};

TwoDimensionsDictionary.prototype.constructor = TwoDimensionsDictionary;

TwoDimensionsDictionary.prototype.add = function(key, value)
{
	if(this.content[key] == undefined)
	{
		this.content[key] = [];
		this.keys.push(key);
	}
	
	if(this.content[key].indexOf(value) == -1)	
	{
		this.content[key].push(value);
	}
};

TwoDimensionsDictionary.prototype.get = function(key)
{
	return this.content[key];
};