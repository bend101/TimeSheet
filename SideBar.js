function SideBar(fnAddProject)
{
	this.fnAddProject=fnAddProject;
	this.add=document.body.querySelector(".addButton");
	this.selectBox=document.body.querySelector(".sidebar-select");
	this.inputBox=document.body.querySelector("#inputBox");
	this.addProjectButton=document.body.querySelector(".addProjectButton");
	this.addProjectButton.addEventListener("click",this.onAddProjectClick.bind(this));
	this.add.addEventListener("click",this.onAddClick.bind(this));
}

SideBar.prototype.onAddClick=function()
{
	var text=this.inputBox.value;
	var option=document.createElement("option");
	option.text=text;
	option.value=text;
	this.selectBox.add(option);
}

SideBar.prototype.onAddProjectClick=function()
{
	this.fnAddProject(this.selectBox.options[this.selectBox.selectedIndex].value);
}