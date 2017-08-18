function id(ID){
	return document.getElementById(ID);
}
function tag(tagName,father){
	father=father||document;
	return father.getElementsByTagName(tagName);
}